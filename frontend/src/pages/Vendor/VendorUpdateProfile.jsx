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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-blue-700">Update Vendor Profile</h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="Full Name" className="form-input border-gray-300 rounded-md" disabled={loading} />
          <input type="email" value={email} disabled
            className="form-input bg-gray-100 border-gray-300 rounded-md" />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="Phone" className="form-input border-gray-300 rounded-md" disabled={loading} />
        </div>

        {/* Business Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="businessName" value={formData.businessName}
              onChange={handleChange} placeholder="Business Name" className="form-input border-gray-300 rounded-md" disabled={loading} />
            <input type="text" name="businessAddress" value={formData.businessAddress}
              onChange={handleChange} placeholder="Business Address" className="form-input border-gray-300 rounded-md" disabled={loading} />
            <input type="text" name="gstNumber" value={formData.gstNumber}
              onChange={handleChange} placeholder="GST Number" className="form-input border-gray-300 rounded-md" disabled={loading} />
          </div>
        </div>

        {/* Bank Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="accountHolderName" value={formData.accountHolderName}
              onChange={handleChange} placeholder="Account Holder Name" className="form-input border-gray-300 rounded-md" disabled={loading} />
            <input type="text" name="bankName" value={formData.bankName}
              onChange={handleChange} placeholder="Bank Name" className="form-input border-gray-300 rounded-md" disabled={loading} />
            <input type="text" name="accountNumber" value={formData.accountNumber}
              onChange={handleChange} placeholder="Account Number" className="form-input border-gray-300 rounded-md" disabled={loading} />
            <input type="text" name="ifscCode" value={formData.ifscCode}
              onChange={handleChange} placeholder="IFSC Code" className="form-input border-gray-300 rounded-md" disabled={loading} />
          </div>
        </div>

        {/* Upload */}
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Profile Photo</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])}
            className="form-input border-gray-300 rounded-md w-full" disabled={loading} />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
            disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorUpdateProfile;

