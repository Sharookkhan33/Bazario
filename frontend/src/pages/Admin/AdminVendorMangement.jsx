import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/all-vendors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setVendors(res.data);
    } catch (err) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (id, status) => {
    const rejectionMessage =
      status === 'rejected' ? prompt('Enter rejection message') : '';
    try {
      await api.put(
        `/admin/approve/${id}`,
        { status, rejectionMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success(`Vendor ${status}`);
      fetchVendors();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(
        `/admin/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Status toggled');
      fetchVendors();
    } catch (err) {
      toast.error('Toggle failed');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Vendor Management</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading vendors...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {vendor.businessName}
              </h3>
              <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {vendor.email}</p>

              <p className="text-sm mb-1">
                <strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : vendor.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {vendor.status}
                </span>
              </p>

              <p className="text-sm mb-3">
                <strong>Active:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {vendor.isActive ? 'Yes' : 'No'}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleApproveReject(vendor._id, 'approved')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(vendor._id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleToggleStatus(vendor._id)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                >
                  {vendor.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
