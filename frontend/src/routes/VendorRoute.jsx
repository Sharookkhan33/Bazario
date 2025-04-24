import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const VendorRoute = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const [status, setStatus] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const checkVendorStatus = async () => {
      try {
        await api.get('/vendors/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus('active');
      } catch (err) {
        if (err.response?.status === 403) {
          setStatus('rejected');
          setReason(err.response.data.rejectionReason);
        } else {
          setStatus('unauthorized');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && userType === 'vendor') {
      checkVendorStatus();
    } else {
      setStatus('unauthorized');
      setLoading(false);
    }
  }, [token, userType]);

  if (loading) return <div>Loading...</div>;
  if (status === 'unauthorized') return <Navigate to="/vendor-login" replace />;
  if (status === 'rejected') return <Navigate to="/vendor-rejected" state={{ rejectionReason: reason }} replace />;

  return <Outlet />;
};

export default VendorRoute;
