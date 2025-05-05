import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/all-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleSuspend = async (id, suspended) => {
    try {
      await api.put(
        `/admin/suspend-user/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(suspended ? 'User unsuspended' : 'User suspended');
      fetchUsers();
    } catch {
      toast.error('Action failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center">
        User Management
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-center">Suspended</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone || '-'}</td>
                  <td className="px-4 py-2 text-center">
                    {user.suspended ? (
                      <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                  <button
  onClick={() => handleSuspend(user._id, user.suspended)}
  className={`px-3 py-1 rounded-lg text-sm font-medium transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    user.suspended
      ? 'bg-green-600 text-white border border-green-600 hover:bg-green-700 focus:ring-green-300'
      : 'bg-yellow-600 text-white border border-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300'
  }`}
>
  {user.suspended ? 'Unsuspend' : 'Suspend'}
</button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-medium transition transform hover:scale-105 hover:bg-red-700 focus:outline-none"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
