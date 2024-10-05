import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Popconfirm, Select } from 'antd';
import { PlusOutlined, UploadOutlined, SearchOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { getAllProduct, updateProduct, createProduct, deleteProduct } from '../../services/ProductService';
import { useMutation} from '@tanstack/react-query';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [additionalFileList, setAdditionalFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [isNewTypeInputVisible, setIsNewTypeInputVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const newTypeInputRef = useRef(null);



  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProduct();
      setProducts(Array.isArray(res.data) ? res.data : []);
      setTotal(res.totalProduct || 0);
    } catch (error) {
      message.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const uniqueTypes = Array.from(new Set(products.map((product) => product.type)))
      .filter((type) => type);
    setProductTypes(uniqueTypes);
  }, [products]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (value === 'New Type') {
      setIsNewTypeInputVisible(true);
      setTimeout(() => {
        newTypeInputRef.current?.focus();
      }, 0);
    } else {
      setIsNewTypeInputVisible(false);
      form.setFieldValue('type', value);
    }
  };

  const exportToExcel = () => {
    const data = products.map(product => ({
      'Product Name': product.name,
      'Type': product.type,
      'Price': product.price,
      'Count In Stock': product.countInStock,
      'Rating': product.rating,
      'Description': product.description,
    }));
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
  
    XLSX.writeFile(wb, 'products.xlsx');
  };

  const handlePageChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const { mutate: addProduct } = useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: (data) => {
        message.success('Product created successfully');
        setProducts((prevProducts) => [...prevProducts, data.data]);
        handleCancel();
    },
    onError: (error) => {
      message.error('Failed to create product');
      console.error(error);
    }
  });

  const { mutate: editProduct } = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (response) => {
        const updatedProduct = response.data;
        message.success('Product updated successfully');
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === updatedProduct._id ? { ...product, ...updatedProduct} : product
            )
        );
        handleCancel();
    },
    onError: (error) => {
      message.error('Failed to update Product');
      console.error(error);
    }
  });



  const { mutate: removeProduct } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: async(id) => {
        message.success('Product deleted successfully');
        await fetchProducts();
    },
    onError: (error) => {
        message.error('Failed to delete product');
        console.error(error);
    }
  });

  const showModal = (product) => {
    setCurrentProduct(product);
    if (product && product.image) {
      setFileList([{ url: product.image }]);
      console.log('url image: ', product.image);
    } else {
      setFileList([]);
    }

    if (product && product.additionalImages) {
      setAdditionalFileList(product.additionalImages.map((url) => ({ url })));
    } else {
      setAdditionalFileList([]);
    }

    if (product) {
        form.setFieldsValue({ ...product });
    } else {
        form.resetFields();
    }
    setIsModalVisible(true);
  };

  

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsNewTypeInputVisible(false);
    setSelectedType('');
    setCurrentProduct(null);
    setFileList([]);
    form.resetFields();
  };

  
  const handleFormSubmit = (values) => {
    const image = fileList.length > 0 ? fileList[0].url || fileList[0].thumbUrl : '';
    const additionalImages = additionalFileList.map(file => file.url || file.thumbUrl);

    const newProduct = {
        name: values.name,
        type: values.newType || values.type,
        price: values.price,
        countInStock: values.countInStock,
        description: values.description,
        image: image || '',
        additionalImages: additionalImages,
    };

    if (currentProduct) {
        editProduct({ id: currentProduct._id, data: newProduct });
    } else {
        addProduct(newProduct);
    }
    setSelectedType('');
    setIsNewTypeInputVisible(false);
    handleCancel();
  };

  const handleDeleteMany = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the selected products?');
    if (confirmDelete) {
      try {
        await Promise.allSettled(selectedRowKeys.map(id => removeProduct(id)));

        await fetchProducts();
        setSelectedRowKeys([]);
      } catch (error) {
        message.error('An unexpected error occurred while deleting products');
        console.error(error);
      }
    }
  };

  const handleDelete = (id) => {
    try {
      console.log("Deleting product with id:", id);
      removeProduct(id);
    }catch (error) {
      console.error("Error deleting product:", error);
      message.error('Đã xảy ra lỗi khi xóa sản phẩm');
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          id="searchInput"
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#0A923C' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.select();
        }, 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a,b) => a.name.length - b.name.length,
        ...getColumnSearchProps('name'),
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        filters: Array.from(new Set(products.map((product) => product.type)))
          .filter((type) => type)
          .map((type) => ({ text: type, value: type})),
        onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: (a,b) => a.price - b.price
    },
    {
        title: 'Count In Stock',
        dataIndex: 'countInStock',
        key: 'countInStock',
        sorter: (a,b) => a.countInStock - b.countInStock
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (text) => (text ? <img src={text} alt="product" style={{ width: '80px' }} /> : 'No Image'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger style={{ marginLeft: 8 }}>
              Delete
            </Button>    
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleAdditionalFileChange = ({ fileList: newFileList }) => {
    setAdditionalFileList(newFileList);
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
        Add Product
      </Button>
      <Button
        type="danger"
        onClick={handleDeleteMany}
        icon={<DeleteOutlined />}
        disabled={selectedRowKeys.length < 2}
        className='button-delete-many'
        style={{
          marginBottom: 16,
          backgroundColor: selectedRowKeys.length < 2 ? '#FFCCCC' : '#FF4D4F',
          color: selectedRowKeys.length < 2 ? '#fff' : '#fff',
          cursor: selectedRowKeys.length < 2 ? 'not-allowed' : 'pointer',
          opacity: selectedRowKeys.length < 2 ? 0.6 : 1,
          marginLeft: '10px'
        }}
      >
        Delete Selected Products
      </Button>

      <Button
        type="default"
        onClick={exportToExcel}
        icon={<ExportOutlined />}
        style={{ marginBottom: 16, marginLeft: '10px' }}
      >
        Export Products
      </Button>

      <Table 
        dataSource={products} 
        columns={columns} 
        rowKey="_id" 
        style={{ marginTop: 16 }}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
        }}
      />

      <Modal
        title={<div style={{ textAlign: 'center' }}>{currentProduct ? 'Edit Product' : 'Add Product'}</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          labelCol={{ span: 6 }}
          style={{margin: '0 10px', padding: '10px' }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select or create a product type!' }]}>
            <Select value={selectedType} onChange={handleTypeChange} style={{ width: '100%' }}>
              {productTypes.map((type) => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
              <Select.Option value="New Type">New Type</Select.Option>
            </Select>
            {isNewTypeInputVisible && (
              <Form.Item name="newType" label="New Type Name" rules={[{ required: true, message: 'Please enter a new type name!' }]}>
                <Input ref={newTypeInputRef} />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="countInStock" label="Count In Stock" rules={[{ required: true, message: 'Please input the number of Products in Stock!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description' }]}>
            <Input />
          </Form.Item>
          {currentProduct ? 
          <Form.Item 
            label="Upload Image"
            name="upload"
            // valuePropName="fileList"
            // getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: false, message: 'Please upload image' }]}
          >  
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item> 
          : 
          <Form.Item 
            label="Upload Image"
            name="upload"
            // valuePropName="fileList"
            // getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: 'Please upload image' }]}
          >  
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>}

          <Form.Item label="Additional Images">
            <Upload
              listType="picture"
              fileList={additionalFileList}
              onChange={handleAdditionalFileChange}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Upload Additional Images</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{display: 'flex', margin: '0 auto'}}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProductPage;
