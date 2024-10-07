import React, { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from 'react-router-dom';
import { List, Row, Col, Spin } from 'antd';
import { getSearchProduct, getAllType } from '../../services/ProductService';
import CardComponent from '../../components/CardComponent/CardComponent';
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent';
import ProductCategory from '../../components/ProductCategory/ProductCategory';
import './SearchPage.scss'

const SearchPage = () => {
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTypeProduct = async() => {
    const res = await getAllType()
    return res;
  }

  const { data: types } = useQuery({
    queryKey: ['types'],
    queryFn: fetchAllTypeProduct,
    retry: 3,
    retryDelay: 1000
});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword_search = queryParams.get('keyword_search');
    setKeyword(keyword_search || '');
  }, [location]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (keyword) {
        setIsLoading(true);
        try {
          const response = await getSearchProduct(keyword);
          const filteredProducts = response.data.filter(item =>
            item.name.toLowerCase().includes(keyword.toLowerCase())
          );
          setProducts(filteredProducts);
        } catch (error) {
          console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProducts([]);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  return (
        <WrapperBgColorComponent>
            <Row>
                <Col span={6}>
                    <ProductCategory types={types?.data}/>
                </Col>
                <Col span={18}>
                    <div className='div-title'>
                        <h2>Kết quả tìm kiếm: {keyword}</h2>
                    </div>
                    {isLoading ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Spin size="medium" />
                      </div>
                    ) : (
                      <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={products}
                        className='container-list-product'
                        renderItem={item => (
                            <List.Item>
                            <CardComponent
                                image={item.image}
                                name={item.name}
                                rating={item.rating}
                                selled={item.selled}
                                price={item.price}
                                id={item._id}
                            />
                            </List.Item>
                        )}
                      />
                      )}
                </Col>
            </Row>
        </WrapperBgColorComponent>
  );
};

export default SearchPage;