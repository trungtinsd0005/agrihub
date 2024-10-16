import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import AdminDashBoardPage from "../pages/AdminDashBoardPage/AdminDashBoardPage";
import AdminUserPage from "../pages/AdminUserPage/AdminUserPage"; 
import AdminProductPage from "../pages/AdminProductPage/AdminProductPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import TypePage from "../pages/TypePage/TypePage";
import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ThankYouPage from "../pages/ThankYouPage/ThankYouPage";


export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
        isProtected: true
    },
    {
        path: '/checkout',
        page: CheckoutPage,
        isShowHeader: true,
    },
    {
        path: '/product/:id',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/system',
        page: AdminPage,
        isPrivate: true,
        isAdmin: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
        isProtected: true
    },
    {
        path: '/system/user',
        page: AdminUserPage,
    },
    {
        path: '/system/product',
        page: AdminProductPage,
    },
    {
        path: '/system/dashboard',
        page: AdminDashBoardPage,
    },
    {
        path: '/search',
        page: SearchPage,
        isShowHeader: true
    },
    {
        path: '/type/:type',
        page: TypePage,
        isShowHeader: true
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true
    },
    {
        path: '/thankyou',
        page: ThankYouPage,
    },
    {
        path: '*',
        page: NotFoundPage
    }
]