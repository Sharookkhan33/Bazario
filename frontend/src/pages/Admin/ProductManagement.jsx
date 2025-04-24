import { useEffect, useState } from "react";
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
  <div className="animate-pulse rounded-2xl shadow-md p-4 bg-gray-100 space-y-2">
    <div className="h-36 bg-gray-300 rounded-md" />
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
    try {
      setLoading(true);
      const query = new URLSearchParams({
        ...filters,
        status: filters.status === "all" ? "" : filters.status,
        isActive: filters.isActive === "all" ? "" : filters.isActive,
      }).toString();

      const { data } = await api.get(`/products/admin-products?page=${page}&${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setProducts(Array.isArray(data) ? data : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const handleStatusUpdate = async (id, status, message = "") => {
    try {
      await api.put(`/products/status/${id}`, { status, message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(`Product ${status}`);
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success("Status toggled");
      fetchProducts();
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/admin-delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Product Management</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px] border border-gray-300 shadow-sm hover:shadow-md transition rounded-md">
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
          <SelectTrigger className="w-[180px] border border-gray-300 shadow-sm hover:shadow-md transition rounded-md">
            <SelectValue placeholder="Active Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-xl shadow-md p-2 bg-white space-y-1"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-36 w-full object-contain rounded-md"
              />
              <div className="font-semibold text-md truncate">{product.name}</div>
              <div className="text-xs text-gray-500">{product.category}</div>
              <div className="text-xs">Stock: {product.stock}</div>
              <div className="text-xs">Status: {product.status}</div>
              <div className="text-xs">
                Active: {product.isActive ? "Yes" : "No"}
              </div>
              {product.status === "rejected" && product.rejectionMessage && (
                <div className="text-red-500 text-xs">
                  Reason: {product.rejectionMessage}
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleStatusUpdate(product._id, "approved")}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleStatusUpdate(
                      product._id,
                      "rejected",
                      prompt("Reason for rejection?") || ""
                    )
                  }
                >
                  Reject
                </Button>
                <Button onClick={() => handleToggleActive(product._id)}>
                  {product.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-4 justify-center">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <span className="px-2 pt-1">Page {page} of {totalPages}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default AdminProductManagement;
