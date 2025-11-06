"use client";
import { FaBox, FaShoppingCart, FaTruck, FaDollarSign, FaExclamationTriangle, FaCheckCircle, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { baseURL } from "@/config/apiConfig";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  stockId?: {
    quantity: number;
  };
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  userId?: {
    name: string;
    email: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
  }>;
}

interface Supplier {
  _id: string;
  name: string;
  company: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    suppliers: 0,
    revenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [productsRes, ordersRes, suppliersRes] = await Promise.all([
        fetch(`${baseURL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseURL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseURL}/api/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const products: Product[] = productsRes.ok ? await productsRes.json() : [];
      const orders: Order[] = ordersRes.ok ? await ordersRes.json() : [];
      const suppliers: Supplier[] = suppliersRes.ok ? await suppliersRes.json() : [];

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const shippedOrders = orders.filter((o) => o.status === "shipped").length;
      const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
      const lowStock = products.filter((p) => (p.stockId?.quantity || 0) < 10);

      // Get recent orders (last 5)
      const recent = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        products: products.length,
        orders: orders.length,
        suppliers: suppliers.length,
        revenue: totalRevenue,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        lowStockProducts: lowStock.length,
      });

      setRecentOrders(recent);
      setLowStockItems(lowStock);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: <FaBox size={30} />,
      bg: "from-blue-500 to-blue-700",
      link: "/dashboard/products",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <FaShoppingCart size={30} />,
      bg: "from-green-500 to-green-700",
      link: "/dashboard/orders",
      subtitle: `${stats.pendingOrders} pending`,
    },
    {
      title: "Suppliers",
      value: stats.suppliers,
      icon: <FaTruck size={30} />,
      bg: "from-yellow-400 to-yellow-600",
      link: "/dashboard/suppliers",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <FaDollarSign size={30} />,
      bg: "from-purple-500 to-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((item, index) => (
          <Link
            key={index}
            href={item.link || "#"}
            className={`flex items-center justify-between p-6 rounded-2xl shadow-lg bg-gradient-to-r ${item.bg} text-white transform transition-transform hover:scale-105 cursor-pointer`}
          >
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
              {item.subtitle && (
                <p className="text-sm mt-1 opacity-90">{item.subtitle}</p>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-full">{item.icon}</div>
          </Link>
        ))}
      </div>

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Low Stock Alert */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <FaExclamationTriangle className="text-orange-500" />
              Low Stock Alert
            </h3>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
              {stats.lowStockProducts} items
            </span>
          </div>
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Only {product.stockId?.quantity || 0} units left
                    </p>
                  </div>
                  <span className="text-orange-600 font-bold">
                    ₹{product.price}
                  </span>
                </div>
              ))}
              {lowStockItems.length > 5 && (
                <Link
                  href="/dashboard/products"
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  View all {lowStockItems.length} low stock items →
                </Link>
              )}
            </div>
          ) : (
            <p className="text-gray-500">All products are well stocked! ✅</p>
          )}
        </div>

        {/* Order Status Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaShoppingCart className="text-green-500" />
            Order Status Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaTruck className="text-blue-600 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {stats.shippedOrders}
              </p>
              <p className="text-sm text-gray-600 mt-1">Shipped</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {stats.deliveredOrders}
              </p>
              <p className="text-sm text-gray-600 mt-1">Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
            <FaShoppingCart className="text-blue-500" />
            Recent Orders
          </h3>
          <Link
            href="/dashboard/orders"
            className="text-blue-600 hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {typeof order.userId === "object" ? order.userId?.name : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.items[0]?.productName || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        )}
      </div>
    </div>
  );
}
