import React, { useEffect, useState } from 'react';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/vendors/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async () => {
    try {
      const res = await api.put(
        '/vendors/status',
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setVendor(res.data.vendor);
    } catch (err) {
      console.error('Status toggle failed', err);
    }
  };

  if (!vendor) {
    return <div className="text-center mt-24 text-lg font-medium text-gray-700">Loading profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">Vendor Profile</h2>
          <button
            onClick={() => navigate('/vendors/update-profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
          >
            Update Profile
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <img
            src={vendor.profilePhoto}
            alt="Vendor Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-300 shadow-md object-cover"
          />
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800">{vendor.name}</h3>
            <p className="text-gray-600">{vendor.email}</p>
            <p className="text-gray-600">+91 {vendor.phone}</p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Personal Info */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Personal Info</h4>
            <p><span className="font-medium text-gray-600">Email:</span> {vendor.email}</p>
            <p>
              <span className="font-medium text-gray-600">Status:</span>{' '}
              <span className={vendor.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {vendor.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
            <button
              onClick={toggleStatus}
              className={`mt-3 w-full py-2 rounded-md font-semibold ${
                vendor.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white transition duration-200`}
            >
              {vendor.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* Business Info */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Business Info</h4>
            <p><span className="font-medium text-gray-600">Name:</span> {vendor.businessName}</p>
            <p><span className="font-medium text-gray-600">Address:</span> {vendor.businessAddress}</p>
            <p><span className="font-medium text-gray-600">GST Number:</span> {vendor.gstNumber}</p>
          </div>

          {/* Bank Info */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Bank Info</h4>
            <p><span className="font-medium text-gray-600">Holder:</span> {vendor.bankDetails.accountHolderName}</p>
            <p><span className="font-medium text-gray-600">Bank:</span> {vendor.bankDetails.bankName}</p>
            <p><span className="font-medium text-gray-600">Account No.:</span> {vendor.bankDetails.accountNumber}</p>
            <p><span className="font-medium text-gray-600">IFSC:</span> {vendor.bankDetails.ifscCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
