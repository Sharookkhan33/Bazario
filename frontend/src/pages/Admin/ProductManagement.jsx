import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl shadow-inner p-4 bg-gray-100 space-y-2">
    <div className="h-40 bg-gray-300 rounded-md" />
    <div className="h-4 bg-gray-300 rounded w-3/4" />
    <div className="h-3 bg-gray-300 rounded w-1/2" />
    <div className="h-3 bg-gray-300 rounded w-1/3" />
  </div>
);

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    isActive: "all",
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        status: filters.status === "all" ? "" : filters.status,
        isActive: filters.isActive === "all" ? "" : filters.isActive,
      }).toString();

      const { data } = await api.get(
        `/products/admin-products?page=${page}&${query}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Normalize response
      let items = [];
      let pages = 1;
      if (Array.isArray(data)) {
        items = data;
      } else if (Array.isArray(data.items)) {
        items = data.items;
        pages = data.totalPages ?? 1;
      }

      setProducts(items);
      setTotalPages(pages);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const handleStatusUpdate = async (id, newStatus, message = "") => {
    try {
      await api.put(
        `/products/status/${id}`,
        { status: newStatus, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Product ${newStatus}`);
      fetchProducts();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.put(
        `/products/toggle-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success("Status toggled");
      fetchProducts();
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/products/admin-delete/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-indigo-700 text-center">
        Admin Product Management
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Input
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs border-gray-300 focus:ring-indigo-500"
        />

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-48 border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isActive}
          onValueChange={(value) => setFilters({ ...filters, isActive: value })}
        >
          <SelectTrigger className="w-48 border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between hover:-translate-y-1 transform"
            >
              <img
                src={prod.image}
                alt={prod.name}
                className="h-40 w-full object-contain rounded-lg mb-2"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate hover:text-indigo-600 transition-colors duration-200">{prod.name}</h3>
                <p className="text-sm text-gray-500 truncate">{prod.category}</p>
                <p className="text-sm mt-1">Stock: {prod.stock}</p>
                <p className="text-sm">Status: {prod.status}</p>
                <p className="text-sm">Active: {prod.isActive ? "Yes" : "No"}</p>
                {prod.status === "rejected" && prod.rejectionMessage && (
                  <p className="text-xs text-red-500 mt-1">Reason: {prod.rejectionMessage}</p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                  onClick={() => handleStatusUpdate(prod._id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                  onClick={() => {
                    const msg = prompt("Reason for rejection?") || "";
                    handleStatusUpdate(prod._id, "rejected", msg);
                  }}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
                  onClick={() => handleToggleActive(prod._id)}
                >
                  {prod.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                  onClick={() => handleDelete(prod._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-6">
        <Button
          size="sm"
          disabled={page <= 1}
          className="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <Button
          size="sm"
          disabled={page >= totalPages}
          className="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdminProductManagement;
