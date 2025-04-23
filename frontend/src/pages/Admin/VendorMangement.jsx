import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/admin/all-vendors',{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveReject = async (id, status) => {
    const rejectionMessage = status === 'rejected' ? prompt('Enter rejection message') : '';
    try {
      await api.put(`/admin/approve/${id}`, { status, rejectionMessage },{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      fetchVendors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/toggle-status/${id}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      fetchVendors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Vendor Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 transition hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{vendor.businessName}</h3>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {vendor.email}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> {vendor.status}</p>
            <p className="text-sm text-gray-600"><strong>Active:</strong> {vendor.isActive ? 'Yes' : 'No'}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleApproveReject(vendor._id, 'approved')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveReject(vendor._id, 'rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Reject
              </button>
              <button
                onClick={() => handleToggleStatus(vendor._id)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                {vendor.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorManagement;
