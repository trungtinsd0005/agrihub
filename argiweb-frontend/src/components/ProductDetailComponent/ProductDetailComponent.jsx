import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Row, Col, Image} from 'antd';
import styles from './ProductDetailComponent.module.scss'
import QuantityInput from '../QuantityInput/QuantityInput';
import NavButtonComponent from '../NavButtonComponent/NavButtonComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { getDetailProduct } from '../../services/ProductService';
import StarRating from '../StarRatingComponent/StarRating';

const ProductDetailComponent = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getDetailProduct(id)
        setProduct(res.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Đang tải...</div>;
  }

  const handleNext = () => {
    if (currentIndex < product.additionalImages.length - 4) {
        setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
      if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
      }
  };

  return (
    <Row className={styles.mainContainer}>
            <Col span={8}>
                <Image src={product.image} width={400} height={400} alt={`${product.name} Image Large`} preview={false} />
                <div className={styles.imageContainer}>
                  <NavButtonComponent direction="prev" onClick={handlePrev}/>
                  {product.additionalImages
                    .slice(currentIndex, currentIndex + 4)
                    .map((img, index) => (
                      <Image className={styles.addImages} src={img} alt={`Image small ${index + 1}`} preview={false} key={index} />
                  ))}
                  <NavButtonComponent direction="next" onClick={handleNext}/>
                </div>
            </Col>
            <Col span={10} className={styles.paddingSides}>
                <div className={styles.infoDetail}>
                  <h1 className={styles.titleProduct}>
                    {product.name}
                  </h1>
                  <div className={styles.divInline}>
                    <StarRating rating={product.rating}/>
                    <div className={styles.ratingReview}> 0 đánh giá</div>
                    <div className={styles.countSold}>{product.selled} đã bán</div>
                  </div>
                  <div className={styles.priceProducts}>
                    <strong>{product.price.toLocaleString('vi-VN')} ₫</strong>
                  </div>
                  <div className={styles.tierPrice}></div>
                  <Row>
                    <Col span={8}>
                      <div className={styles.title}>Vận chuyển đến:</div>
                      <div className={styles.title}>Phí vận chuyển:</div>
                    </Col>
                    <Col span={16}>
                      <div className={styles.item}>
                        <div className={styles.deliveryContent}>
                          <a href='https://www.google.com.vn/?hl=vi' className={styles.deliverySelect}>Thành phố Sa Đéc - Đồng Tháp</a>
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.deliveryPrice}>
                          <span>40.000 ₫</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className={styles.quantityContainer}>
                    <div className={styles.title}>Số lượng:</div>
                    <span>Chỉ còn {product.countInStock} sản phẩm;</span>
                    <QuantityInput countInStock={product.countInStock} />
                  </div>
                  <div className={styles.buttonSection}>
                    <ButtonComponent label={"THÊM VÀO GIỎ HÀNG"} className={styles.buttonAddToCart} />
                    <ButtonComponent label={"MUA NGAY"} className={styles.buttonBuyNow} />
                  </div>
                </div>
            </Col>
            <Col span={6}>
                <div className={styles.rightInfo}>
                  <p className={styles.moreInfoTag}>
                    Thông tin thêm:
                  </p>
                  <div className={styles.tierPrice}></div>
                  <div>
                    <p className={styles.contactUsTitle}>Mua sỉ vui lòng liên hệ chúng tôi:</p>
                    <div className={styles.contactWrapper}>
                      <a className={styles.contactUsBtn} href='tel:+84833577005'>0833 577 005</a>
                      <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className={styles.contactByMess}>Gửi tin nhắn</a>
                    </div>
                  </div>
                </div>
            </Col>
    </Row>
  )
}

export default ProductDetailComponent