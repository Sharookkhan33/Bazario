// src/hooks/useCheckSuspended.js
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const useCheckSuspended = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSuspended = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.suspended) {
          localStorage.removeItem('token');
          alert("Your account is suspended.");
          logout();
          navigate('/login');
        }
      } catch (err) {
        console.error("Suspension check error:", err);
      }
    };

    checkSuspended();
  }, [logout, navigate]);
};

export default useCheckSuspended;
