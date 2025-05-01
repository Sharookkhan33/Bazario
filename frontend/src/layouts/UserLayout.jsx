import React from 'react';
import { Outlet } from 'react-router-dom';
import useCheckSuspended from '../hooks/useCheckSuspended';
import Navbar from '../components/Navbar'; // create if not exist
import Footer from '../components/Footer'

const UserLayout = () => {
    useCheckSuspended();
  return (
    <div>
      <Navbar />
      <main className="p-4 min-h-screen bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
