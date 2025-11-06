"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { baseURL } from "@/config/apiConfig";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stockId?: {
    quantity: number;
  };
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

const API_ORDERS = `${baseURL}/api/orders`;
const API_PRODUCTS = `${baseURL}/api/products`;

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch products for customers (only available products with stock > 0)
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter products that have stock available (stockId.quantity > 0)
        const availableProducts = data.filter(
          (p: any) => p.stockId?.quantity > 0
        );
        setProducts(availableProducts);
      }
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // Fetch orders (customer only sees their orders)
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_ORDERS}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchOrders();
    }
  }, []);

  // Customer places new order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find((p) => p._id === formData.productId);
    if (!product)
      return Swal.fire("Error", "Please select a product.", "error");

    // Check if stock is available
    if (!product.stockId || product.stockId.quantity < formData.quantity) {
      return Swal.fire(
        "Error",
        `Only ${product.stockId?.quantity || 0} items available in stock.`,
        "error"
      );
    }

    // Backend expects items array with productId and quantity
    const body = {
      items: [
        {
          productId: product._id,
          quantity: Number(formData.quantity),
        },
      ],
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
        fetchProducts(); // Refresh products to update stock
      } else {
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Failed to place order", "error");
      }
    } catch (err) {
      console.error("❌ Error placing order:", err);
      Swal.fire("Error", "Failed to place order. Please try again.", "error");
    }
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛍️ My Orders</h1>
      </div>

      {/* CUSTOMER ORDER FORM */}
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
              {p.name} - ₹{p.price} (Stock: {p.stockId?.quantity || 0})
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

      {/* ORDERS TABLE */}
      {loading ? (
        <p className="text-center py-4">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border p-2">{idx + 1}</td>
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
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-4 text-gray-500"
                  >
                    No orders found. Place your first order above!
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
