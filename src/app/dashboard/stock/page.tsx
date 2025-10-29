"use client";
import { baseURL } from "@/config/apiConfig";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";



interface Supplier {
  _id: string;
  name: string;
  company: string;
  phone: string;
}

interface Stock {
  _id: string;
  productName: string;
  category: string;
  quantity: number;
  supplierId: Supplier;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    quantity: "",
    supplierId: "",
  });
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const API_URL = baseURL;

  // ✅ Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // ✅ Fetch all stocks
  const fetchStocks = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${baseURL}/api/stocks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setStocks(data);
      } else if (Array.isArray(data.stocks)) {
        setStocks(data.stocks);
      } else {
        setStocks([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching stocks:", err);
      setLoading(false);
    }
  };

  // ✅ Fetch suppliers (for dropdown)
  const fetchSuppliers = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${baseURL}/api/suppliers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : data.suppliers || []);
    } catch (err) {
      console.error("❌ Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchSuppliers();
  }, []);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Stock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();

    const method = editingStock ? "PUT" : "POST";
    const url = editingStock ? `${baseURL}/${editingStock._id}` : baseURL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          productName: "",
          category: "",
          quantity: "",
          supplierId: "",
        });
        setEditingStock(null);
        fetchStocks();
      } else {
        console.error("❌ Error submitting form:", await res.json());
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    }
  };

  // ✅ Edit Stock
  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setFormData({
      productName: stock.productName,
      category: stock.category,
      quantity: stock.quantity.toString(),
      supplierId: stock.supplierId?._id || "",
    });
  };

  // ✅ Delete Stock
  const handleDelete = async (id: string) => {
    const token = getToken();
    if (!confirm("Are you sure you want to delete this stock?")) return;

    try {
      const res = await fetch(`${baseURL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchStocks();
    } catch (err) {
      console.error("❌ Error deleting stock:", err);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Stock Management</h1>

      {/* Add / Edit Stock Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg mb-6"
      >
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name} - {supplier.company}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="col-span-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <FaPlusCircle /> {editingStock ? "Update Stock" : "Add Stock"}
        </button>
      </form>

      {/* Stock Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{stock.productName}</td>
              <td className="p-2 border">{stock.category}</td>
              <td className="p-2 border">{stock.quantity}</td>
              <td className="p-2 border">{stock.supplierId?.name || "N/A"}</td>
              <td className="p-2 border">
                {stock.supplierId?.company || "N/A"}
              </td>
              <td className="p-2 border">{stock.supplierId?.phone || "N/A"}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleEdit(stock)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(stock._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
