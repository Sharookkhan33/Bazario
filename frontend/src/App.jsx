// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UserRoute from './routes/UserRoute';
import UserLayout from './layouts/UserLayout';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import VendorLogin from './pages/Vendor/VendorLogin';
import VendorRegister from './pages/Vendor/VendorRegister';
import VendorSuccess from './pages/Vendor/VendorSuccess';
import VendorRejected from './pages/Vendor/VendorRejected';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import VendorProfile from './pages/Vendor/VendorProfile';
import VendorUpdateProfile from './pages/Vendor/VendorUpdateProfile';
import VendorLayout from './layouts/VendorLayout';
import VendorRoute from './routes/VendorRoute';
import AddProduct from './pages/Vendor/AddProduct';
import EditProduct from './pages/Vendor/EditProduct';
import VendorProductManagement from './pages/Vendor/VendorProductManagement';
import VendorOrders from './pages/Vendor/VendorOrders';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './routes/AdminRoute';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminVerify from "./pages/Admin/AdminVerify";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminVendorManagement from './pages/Admin/AdminVendorMangement';
import AdminUserManagement from './pages/Admin/AdminUserManagement';
import PublicRoute from './routes/PublicRoute';
import AdminProductManagement from './pages/Admin/ProductManagement';
import AdminOrderManagement from './pages/Admin/AdminOrders';
import AdminBannerManagement from './pages/Admin/AdminBannerManagement';
import AdminCategoryManagement from './pages/Admin/AdminCategoryManagement';
import MyAccount from './pages/User/MyAccount';
import CartPage from './pages/User/CartPage';
import WishlistPage from './pages/User/WishlistPage';
import ProductsByCategoryPage from './pages/ProductsByCategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductPage from './pages/User/HandleBuyNowPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import LandingPage from './pages/LandingPage';
import VendorLandingPage from './pages/VendorLandingPage';
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

const App = () => {
  return (
    <>

      <Routes>

        <Route path="/home" element={<><Navbar /><HomePage /></>}/>
        <Route path="/products" element={<><Navbar/><HomePage/></>} />
        <Route path="/login" element={<><Navbar /><UserLogin /></>}/>
        <Route path="/register"element={<><Navbar /><UserRegister /></>}/>
        <Route path="/vendor-login" element={<><Navbar /><PublicRoute/><VendorLogin/> </>} />
        <Route path="/vendor-register" element={<><Navbar /><PublicRoute/><VendorRegister/> </>} />
        <Route path="/vendor/success" element={<><Navbar /><PublicRoute/><VendorSuccess/> </>} />
        <Route path="/admin-register" element={<><Navbar/><AdminRegister /></>} />
        <Route path="/admin-verify" element={<><Navbar/><AdminVerify /></>} />
        <Route path="/admin-login" element={<><Navbar/><PublicRoute/><AdminLogin /></>} />
        <Route path="/vendor-rejected" element={<VendorRejected />} />
        <Route path="/product" element={<><Navbar /><ProductsByCategoryPage/></>} />
        <Route path="/product/:id" element={<><Navbar /><ProductDetailsPage/> </>} />
        <Route path="/" element={<><LandingPage /></>} />
        <Route path="/vendor-home" element={<><PublicRoute/><VendorLandingPage/></>}/>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />



        {/* Protected Vendor Panel routes */}
        <Route element={<VendorRoute />}>
          <Route element={<VendorLayout />}>
            <Route path="/vendors/dashboard" element={<VendorDashboard />} />
            <Route path="/vendors/product-manage" element={<VendorProductManagement />} />
            <Route path="/vendors/add-product" element={<AddProduct />} />
            <Route path="/vendors/edit-product/:id" element={<EditProduct />} />
            <Route path="/vendors/orders" element={<VendorOrders />} />
            <Route path="/vendors/profile" element={<VendorProfile />} />
            <Route path="/vendors/update-profile" element={<VendorUpdateProfile />} />
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-vendors" element={<AdminVendorManagement/>}/>
            <Route path="/admin-users" element={<AdminUserManagement/>}/>
            <Route path="/admin-products" element={<AdminProductManagement/>}/>
            <Route path="/admin-orders" element={<AdminOrderManagement/>}/>
            <Route path="/admin-banners" element={<AdminBannerManagement />} />
            <Route path="/admin-categories" element={<AdminCategoryManagement />} />

          </Route>
        </Route>
        
        <Route element={<UserRoute />}>
        <Route element={<UserLayout />}>
            <Route path="/my-account" element={<MyAccount/>} />
            <Route path="/my-cart" element={<CartPage/>} />
            <Route path="/my-wishlist" element={<WishlistPage/>} />
            <Route path="/checkout" element={<ProductPage/>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>
      </Route>
      </Routes>
    </>
  );
};

export default App;
