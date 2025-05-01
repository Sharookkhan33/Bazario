

// src/pages/Vendor/VendorUpdateProfile.jsx
import React, { useEffect, useState } from 'react';
import api from "../../api/axios";

const VendorUpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', profilePhoto: '',
    businessName: '', businessAddress: '', gstNumber: '',
    accountHolderName: '', bankName: '', accountNumber: '', ifscCode: ''
  });
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/vendors/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const v = res.data;
        setFormData({
          name: v.name, phone: v.phone,
          businessName: v.businessName, businessAddress: v.businessAddress, gstNumber: v.gstNumber,
          accountHolderName: v.bankDetails?.accountHolderName || '',
          bankName: v.bankDetails?.bankName || '',
          accountNumber: v.bankDetails?.accountNumber || '',
          ifscCode: v.bankDetails?.ifscCode || '',
        });
        setEmail(v.email);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 start loading
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (file) data.append('profilePhoto', file);

    try {
      await api.put(`/vendors/update`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold mb-4">Update Vendor Profile</h2>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input" disabled={loading} />
        <input type="email" name="email" value={email} disabled className="input bg-gray-100" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input" disabled={loading} />

        <h3 className="font-semibold mt-4">Business Details</h3>
        <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" className="input" disabled={loading} />
        <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} placeholder="Business Address" className="input" disabled={loading} />
        <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" className="input" disabled={loading} />

        <h3 className="font-semibold mt-4">Bank Details</h3>
        <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="Account Holder Name" className="input" disabled={loading} />
        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" className="input" disabled={loading} />
        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account Number" className="input" disabled={loading} />
        <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="input" disabled={loading} />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="input" disabled={loading} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default VendorUpdateProfile;
