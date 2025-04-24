// src/pages/VendorRejected.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const VendorRejected = () => {
  const location = useLocation();
  const reason = location.state?.rejectionReason || 'Your account has been deactivated.';

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-3xl font-bold text-red-600">🚫 Account Deactivated</h1>
      <p className="text-lg mt-4 text-gray-800">Your vendor account was rejected.</p>
      <p className="text-md mt-2 text-gray-600 italic">Reason: {reason}</p>
    </div>
  );
};

export default VendorRejected;
