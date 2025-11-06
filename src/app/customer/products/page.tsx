"use client";
import { useEffect, useState } from "react";
import { baseURL } from "@/config/apiConfig";

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
  const [loading, setLoading] = useState(true);

  const API_URL = `${baseURL}/api/products`;

  // ✅ Retrieve token
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch available products (only products with stock > 0)
  const fetchProducts = async () => {
    try {
      const token = getToken();
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter products that have stock available
        const availableProducts = data.filter(
          (p: Product) => p.stockId?.quantity > 0
        );
        setProducts(availableProducts);
      }
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Available Products</h1>
      <p className="text-gray-600 mb-6">
        Browse available products you can order
      </p>

      {/* ✅ Product Table - Read Only */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Available Quantity</th>
              <th className="p-2 border">Supplier</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Contact</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border font-semibold">{product.name}</td>
                  <td className="p-2 border">{product.description}</td>
                  <td className="p-2 border font-semibold text-green-600">
                    ₹{product.price}
                  </td>
                  <td className="p-2 border">{product.stockId?.category || "N/A"}</td>
                  <td className="p-2 border">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      {product.stockId?.quantity || 0}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {product.stockId?.supplierId?.name || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {product.stockId?.supplierId?.company || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {product.stockId?.supplierId?.phone || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-4 text-gray-500"
                >
                  No products available at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          💡 <strong>Note:</strong> To place an order, go to the{" "}
          <a href="/customer/orders" className="text-blue-600 hover:underline">
            Orders page
          </a>
          .
        </p>
      </div>
    </div>
  );
}




