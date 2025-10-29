"use client";
import { useEffect, useState } from "react";
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
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt?: string;
  customerName?: string;
}

const API_ORDERS = "http://localhost:4001/api/orders";
const API_PRODUCTS = "http://localhost:4001/api/products";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"admin" | "customer">("customer"); // toggle to test
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch products for customers
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // Fetch orders (different for admin & customer)
  const fetchOrders = async () => {
    try {
      const url = userRole === "admin" ? API_ORDERS : `${API_ORDERS}/my-orders`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [userRole]);

  // Customer places new order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find((p) => p._id === formData.productId);
    if (!product)
      return Swal.fire("Error", "Please select a product.", "error");

    const body = {
      items: [
        {
          productId: product._id,
          productName: product.productName,
          quantity: Number(formData.quantity),
          price: product.price,
        },
      ],
      totalAmount: product.price * Number(formData.quantity),
    };

    try {
      const res = await fetch(API_ORDERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Order placed successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        setFormData({ productId: "", quantity: 1 });
        fetchOrders();
      } else {
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Failed to place order", "error");
      }
    } catch (err) {
      console.error("❌ Error placing order:", err);
    }
  };

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
            Swal.fire("Error", "Failed to delete order.", "error");
          }
        } catch (err) {
          console.error("❌ Error deleting order:", err);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {userRole === "admin" ? "🧾 Admin Order Management" : "🛍️ My Orders"}
        </h1>
       
      </div>

      {/* CUSTOMER ORDER FORM */}
      {userRole === "customer" && (
        <form
          onSubmit={handlePlaceOrder}
          className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 grid grid-cols-3 gap-4"
        >
          <select
            name="productId"
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.productName} - ₹{p.price}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: Number(e.target.value) })
            }
            placeholder="Quantity"
            min={1}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 col-span-1"
          >
            Place Order
          </button>
        </form>
      )}

      {/* ORDERS TABLE */}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              {userRole === "admin" && <th className="border p-2">Customer</th>}
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              {userRole === "admin" && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td className="border p-2">{idx + 1}</td>
                {userRole === "admin" && (
                  <td className="border p-2">
                    {order.customerName || order.userId || "N/A"}
                  </td>
                )}
                <td className="border p-2">
                  {order.items[0]?.productName || "—"}
                </td>
                <td className="border p-2">{order.items[0]?.quantity}</td>
                <td className="border p-2">₹{order.items[0]?.price}</td>
                <td className="border p-2">₹{order.totalAmount}</td>
                <td className="border p-2 capitalize">{order.status}</td>

                {userRole === "admin" && (
                  <td className="border p-2 flex gap-2 justify-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id!, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    <button
                      onClick={() => handleDelete(order._id!)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={userRole === "admin" ? 8 : 7}
                  className="text-center p-4 text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
