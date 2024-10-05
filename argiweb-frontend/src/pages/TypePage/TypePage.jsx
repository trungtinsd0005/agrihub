import React, {useState, useEffect} from 'react'
import ProductCategory from '../../components/ProductCategory/ProductCategory'
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent'
import {Row, Col, List} from 'antd'
import { getAllProduct, getAllType } from '../../services/ProductService'
import { useQuery } from "@tanstack/react-query";
import CardComponent from '../../components/CardComponent/CardComponent'
import { useParams } from 'react-router-dom'

const TypePage = () => {
    const {type} = useParams();
    const [originalType, setOriginalType] = useState('');
    const [formattedTypes, setFormattedTypes] = useState([]);

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
        if (types?.data) {
          const formatted = types.data.map((type) => ({
            original: type,
            formatted: type
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase(),
          }));
          setFormattedTypes(formatted);
        }
      }, [types]);
    
      useEffect(() => {
        if (type && formattedTypes.length > 0) {
          const matchedType = formattedTypes.find((t) => t.formatted === type);
          if (matchedType) {
            setOriginalType(matchedType.original);
          }
        }
      }, [type, formattedTypes]);

    const fetchProductsType = async() => {
        const res = await getAllProduct()
        const filteredProducts = res.data.filter((value) => value.type === originalType);
        return filteredProducts;
    }
    
    const { isLoading, data: filteredProducts } = useQuery({
        queryKey: ['productsType', originalType],
        queryFn: fetchProductsType,
        retry: 3,
        retryDelay: 1000,
        enabled: !!originalType,
    });

    return (
        <WrapperBgColorComponent>
            <Row>
                <Col span={6}>
                    <ProductCategory types={types?.data} onSelectType={(originalType) => setOriginalType(originalType)} selectedType={originalType}/>
                </Col>
                <Col span={18}>
                    <div className='div-title'>
                        <h2>{originalType.toUpperCase() || ''}</h2>
                    </div>
                    <List
                        grid={{ gutter: 10, column: 5 }}
                        dataSource={filteredProducts}
                        loading={isLoading}
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
                </Col>
            </Row>
        </WrapperBgColorComponent>
    )
}

export default TypePage