// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import VendorNavbar from './components/VendorNavbar';
import HomePage from './pages/HomePage';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import VendorLogin from './pages/Vendor/VendorLogin';
import VendorRegister from './pages/Vendor/VendorRegister';
import VendorSuccess from './pages/Vendor/VendorSuccess';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import VendorProfile from './pages/Vendor/VendorProfile';
import VendorUpdateProfile from './pages/Vendor/VendorUpdateProfile';
import VendorLayout from './layouts/VendorLayout';
import VendorRoute from './routes/VendorRoute';

const App = () => {
  return (
    <>

      <Routes>

        <Route path="/" element={<><Navbar /><HomePage /></>}/>
        <Route path="/login" element={<><Navbar /><UserLogin /></>}/>
        <Route path="/register"element={<><Navbar /><UserRegister /></>}/>
        <Route path="/vendor-login" element={<><Navbar /><VendorLogin/> </>} />
        <Route path="/vendor-register" element={<><Navbar /><VendorRegister/> </>} />
        <Route path="/vendor/success" element={<><Navbar /><VendorSuccess/> </>} />

        {/* Protected Vendor Panel routes */}
        <Route element={<VendorRoute />}>
          <Route element={<VendorLayout />}>
            <Route path="/vendors/dashboard" element={<VendorDashboard />} />
            <Route path="/vendors/profile" element={<VendorProfile />} />
            <Route path="/vendors/update-profile" element={<VendorUpdateProfile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
