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
  category: string;
  quantity: number;
  supplierId: Supplier;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockId: Stock;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockId: "",
    category: "",
    quantity: "",
    supplierName: "",
    company: "",
    contact: "",
  });

  const API_URL = baseURL;

  // ✅ Retrieve token
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${baseURL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setLoading(false);
    }
  };

  // ✅ Fetch all stocks (for dropdown)
  const fetchStocks = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${baseURL}/api/stocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setStocks(data);
    } catch (err) {
      console.error("❌ Error fetching stocks:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStocks();
  }, []);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-fill supplier info based on selected stock
    if (name === "stockId") {
      const selectedStock = stocks.find((s) => s._id === value);
      if (selectedStock) {
        setFormData((prev) => ({
          ...prev,
          category: selectedStock.category,
          quantity: selectedStock.quantity.toString(),
          supplierName: selectedStock.supplierId?.name || "",
          company: selectedStock.supplierId?.company || "",
          contact: selectedStock.supplierId?.phone || "",
        }));
      }
    }
  };

  // ✅ Submit handler (Add / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;
    console.log("🛰️ Submitting to:", url);

    const body = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stockId: formData.stockId,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({
          name: "",
          description: "",
          price: "",
          stockId: "",
          category: "",
          quantity: "",
          supplierName: "",
          company: "",
          contact: "",
        });
        setEditingProduct(null);
        fetchProducts();
      } else {
        console.error("❌ Error submitting:", await res.json());
      }
    } catch (err) {
      console.error("❌ Error submitting:", err);
    }
  };

  // ✅ Edit Product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockId: product.stockId?._id || "",
      category: product.stockId?.category || "",
      quantity: product.stockId?.quantity?.toString() || "",
      supplierName: product.stockId?.supplierId?.name || "",
      company: product.stockId?.supplierId?.company || "",
      contact: product.stockId?.supplierId?.phone || "",
    });
  };

  // ✅ Delete Product
  const handleDelete = async (id: string) => {
    const token = getToken();
    if (!confirm("Are you sure to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Product Management</h1>

      {/* ✅ Add / Edit Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="stockId"
          value={formData.stockId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Stock</option>
          {stocks.map((stock) => (
            <option key={stock._id} value={stock._id}>
              {stock.category} (Qty: {stock.quantity}) -{" "}
              {stock.supplierId?.name}
            </option>
          ))}
        </select>

        {/* Auto-filled fields */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          className="border p-2 rounded bg-gray-50"
          readOnly
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          className="border p-2 rounded bg-gray-50"
          readOnly
        />
        <input
          type="text"
          name="supplierName"
          placeholder="Supplier Name"
          value={formData.supplierName}
          className="border p-2 rounded bg-gray-50"
          readOnly
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          className="border p-2 rounded bg-gray-50"
          readOnly
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          className="border p-2 rounded bg-gray-50"
          readOnly
        />

        <button
          type="submit"
          className="col-span-3 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <FaPlusCircle /> {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ✅ Product Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.description}</td>
              <td className="p-2 border">₹{product.price}</td>
              <td className="p-2 border">
                {product.stockId?.category || "N/A"}
              </td>
              <td className="p-2 border">{product.stockId?.quantity || 0}</td>
              <td className="p-2 border">
                {product.stockId?.supplierId?.name || "N/A"}
              </td>
              <td className="p-2 border">
                {product.stockId?.supplierId?.company || "N/A"}
              </td>
              <td className="p-2 border">
                {product.stockId?.supplierId?.phone || "N/A"}
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
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




