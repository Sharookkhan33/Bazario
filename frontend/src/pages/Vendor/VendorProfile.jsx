import React, { useEffect, useState } from 'react';
import api from "../../api/axios"
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
        '/vendors/status', // ✅ Corrected endpoint
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setVendor(res.data.vendor); // set updated vendor data
    } catch (err) {
      console.error('Status toggle failed', err);
    }
  };
  
  

  if (!vendor) return <div className="text-center mt-10 text-lg">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Vendor Profile</h2>
        <button
          onClick={() => navigate('/vendors/update-profile')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>

      <div className="flex items-center mb-8">
        <img
          src={`http://localhost:5000/${vendor.profilePhoto}`}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-lg"
        />

        <div className="ml-6">
          <h3 className="text-xl font-semibold">{vendor.name}</h3>
          <p className="text-gray-600">{vendor.email}</p>
          <p className="text-gray-600">+91 {vendor.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-semibold mb-2 border-b pb-1 text-gray-700">Personal Info</h4>
          <p>
            <span className="font-medium text-gray-600">Email:</span> {vendor.email}
          </p>
          <p>
            <span className="font-medium text-gray-600">Status:</span>{' '}
            <span className={vendor.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {vendor.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
          <button
            onClick={toggleStatus}
            className={`mt-2 px-4 py-2 rounded-md ${
              vendor.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {vendor.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2 border-b pb-1 text-gray-700">Business Info</h4>
          <p>
            <span className="font-medium text-gray-600">Name:</span> {vendor.businessName}
          </p>
          <p>
            <span className="font-medium text-gray-600">Address:</span> {vendor.businessAddress}
          </p>
          <p>
            <span className="font-medium text-gray-600">GST Number:</span> {vendor.gstNumber}
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2 border-b pb-1 text-gray-700">Bank Info</h4>
          <p>
            <span className="font-medium text-gray-600">Holder:</span>{' '}
            {vendor.bankDetails.accountHolderName}
          </p>
          <p>
            <span className="font-medium text-gray-600">Bank:</span> {vendor.bankDetails.bankName}
          </p>
          <p>
            <span className="font-medium text-gray-600">Account No.:</span>{' '}
            {vendor.bankDetails.accountNumber}
          </p>
          <p>
            <span className="font-medium text-gray-600">IFSC:</span> {vendor.bankDetails.ifscCode}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
