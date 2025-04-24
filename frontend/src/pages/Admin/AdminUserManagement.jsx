// src/pages/AdminUserManagement.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get('/admin/all-users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/delete-user/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchUsers();
  };

  const handleSuspend = async (id) => {
    await api.put(`/admin/suspend-user/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Suspended</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.suspended ? 'Yes' : 'No'}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button onClick={() => handleSuspend(user._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  {user.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
                <button onClick={() => handleDelete(user._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;
