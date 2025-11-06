"use client";
import { baseURL } from "@/config/apiConfig";
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

interface Product {
  _id: string;
  productName: string;
  price: number;
  description: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id?: string;
  userId?: string | { name?: string; email?: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt?: string;
  customerName?: string;
}


// For local testing - change to production before deploying
const API_ORDERS = "http://localhost:4001/api/orders";
// const API_ORDERS = `${baseURL}/api/orders`;
const API_PRODUCTS = `${baseURL}/api/products`;

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"admin" | "customer">("admin");
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Get user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin" || role === "customer") {
      setUserRole(role);
    }
  }, []);

  // Fetch products (admin doesn't need this for orders page, but keeping for consistency)
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // Fetch all orders (admin only)
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    
    try {
      const res = await fetch(API_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // Sort orders by most recent first (newest at top)
        const sortedOrders = Array.isArray(data) 
          ? data.sort((a, b) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return dateB - dateA; // Descending order (newest first)
            })
          : [];
        setOrders(sortedOrders);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && userRole === "admin") {
      fetchOrders();
      
      // Auto-refresh orders every 5 seconds to show new customer orders
      const interval = setInterval(() => {
        fetchOrders();
      }, 5000); // Refresh every 5 seconds
      
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [userRole, token, fetchOrders]);


  // Admin updates order status
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_ORDERS}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        Swal.fire("Updated!", "Order status updated successfully.", "success");
        fetchOrders();
      } else {
        Swal.fire("Error", "Failed to update order.", "error");
      }
    } catch (err) {
      console.error("❌ Error updating order status:", err);
    }
  };

  // Admin deletes order
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This order will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_ORDERS}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Swal.fire("Deleted!", "Order deleted successfully.", "success");
            fetchOrders();
          } else {
            const errData = await res.json().catch(() => ({ message: "Failed to delete order" }));
            Swal.fire("Error", errData.message || "Failed to delete order.", "error");
          }
        } catch (err) {
          console.error("❌ Error deleting order:", err);
          Swal.fire("Error", "Failed to delete order. Please try again.", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🧾 Admin Order Management</h1>
        <button
          onClick={() => {
            setLoading(true);
            fetchOrders();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          <span>🔄</span>
          {loading ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {/* ORDERS TABLE */}
      {loading ? (
        <p className="text-center py-4">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const customerName =
                  typeof order.userId === "object" && order.userId?.name
                    ? order.userId.name
                    : typeof order.userId === "string"
                    ? order.userId
                    : order.customerName || "N/A";
                const customerEmail =
                  typeof order.userId === "object" && order.userId?.email
                    ? order.userId.email
                    : "N/A";

                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border p-2">{idx + 1}</td>
                    <td className="border p-2">{customerName}</td>
                    <td className="border p-2">{customerEmail}</td>
                    <td className="border p-2">
                      {order.items[0]?.productName || "—"}
                    </td>
                    <td className="border p-2">{order.items[0]?.quantity}</td>
                    <td className="border p-2">₹{order.items[0]?.price}</td>
                    <td className="border p-2">₹{order.totalAmount}</td>
                    <td className="border p-2 capitalize">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="border p-2">
                      <div className="flex gap-2 justify-center items-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id!, e.target.value)
                          }
                          className="border rounded p-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>

                        <button
                          onClick={() => handleDelete(order._id!)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center p-4 text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
