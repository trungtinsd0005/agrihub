import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";
import BreadcrumbComponent from "../../components/BreadcrumbComponent/BreadcrumbComponent";
import ChatBot from "../../components/ChatBot/ChatBot";


const ProductsPage = () => {
    const breadcrumbs = [
        { label: 'Trang chủ', path: '/' },
        { label: 'Sản phẩm chi tiết' }
    ];

    return (
        <WrapperBgColorComponent>
            <BreadcrumbComponent breadcrumbs={breadcrumbs} />
            <ProductDetailComponent/>
            <ChatBot />
        </WrapperBgColorComponent>

    )
}

export default ProductsPage