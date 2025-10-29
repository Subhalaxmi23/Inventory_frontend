"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { baseURL } from "@/config/apiConfig";


interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export default function SuppliersPage() {
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  // ✅ Fetch Suppliers
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("⛔ No token found — redirecting to login...");
      router.push("/login");
      return;
    }

    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`${baseURL}/api/suppliers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setSuppliers(data);
        } else {
          console.error("❌ Error fetching suppliers:", data.message);
        }
      } catch (error) {
        console.error("⚠️ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []); // ✅ No token dependency here

  // ✅ Add Supplier API
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // if (!token) return alert("Please login first!");

    try {
      console.log("🟢 Adding supplier:", newSupplier);
      const res = await fetch(`${baseURL}/api/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      const data = await res.json();
      console.log("🧾 Add response:", data);

      if (res.ok) {
        setMessage("✅ Supplier added successfully!");
        setSuppliers((prev) => [...prev, data.supplier || data]);
        setShowAddModal(false);
        setNewSupplier({
          name: "",
          email: "",
          phone: "",
          company: "",
          address: "",
        });
      } else {
        setMessage(`❌ Failed to add supplier: ${data.message}`);
      }
    } catch (error) {
      console.error("⚠️ Add supplier error:", error);
    }
  };

  // ✅ Delete Supplier API
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    try {
      const res = await fetch(`${baseURL}/api/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("🧾 Delete response:", data);

      if (res.ok) {
        setSuppliers((prev) => prev.filter((s) => s._id !== id));
        setMessage("✅ Supplier deleted successfully!");
      } else {
        setMessage(`❌ Failed to delete supplier: ${data.message}`);
      }
    } catch (error) {
      console.error("⚠️ Delete error:", error);
    }
  };

  // ✅ Edit Supplier Modal
  const handleEdit = (supplier: Supplier) => {
    setEditMode(true);
    setEditSupplier(supplier);
  };

  // ✅ Update Supplier API
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSupplier) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    try {
      console.log("✏️ Updating supplier:", editSupplier);
      const res = await fetch(
        `${baseURL}/api/suppliers/${editSupplier._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editSupplier),
        }
      );

      const data = await res.json();
      console.log("🧾 Update response:", data);

      if (res.ok) {
        setSuppliers((prev) =>
          prev.map((s) =>
            s._id === editSupplier._id ? { ...s, ...editSupplier } : s
          )
        );
        setMessage("✅ Supplier updated successfully!");
        setEditMode(false);
        setEditSupplier(null);
      } else {
        setMessage(`❌ Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error("⚠️ Update error:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-900">Supplier List</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-800 transition"
        >
          <FaPlusCircle /> Add Supplier
        </button>
      </div>

      {/* Supplier Table */}
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-blue-900 text-white text-left">
            <tr>
              <th className="py-3 px-5">Id</th>
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Phone</th>
              <th className="py-3 px-5">Company</th>
              <th className="py-3 px-5">Address</th>
              <th className="py-3 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {suppliers.length > 0 ? (
              suppliers.map((s, i) => (
                <tr
                  key={s._id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="py-3 px-5">{i + 1}</td>
                  <td className="py-3 px-5">{s.name}</td>
                  <td className="py-3 px-5">{s.email}</td>
                  <td className="py-3 px-5">{s.phone}</td>
                  <td className="py-3 px-5">{s.company}</td>
                  <td className="py-3 px-5">{s.address}</td>
                  <td className="py-3 px-5 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Success Message */}
      {message && (
        <p className="text-center text-green-700 font-semibold mb-4">
          {message}
        </p>
      )}

      {/* ➕ Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-blue-900">
              Add New Supplier
            </h3>

            <form onSubmit={handleAddSupplier} className="space-y-3">
              {["name", "email", "phone", "company", "address"].map((item) => (
                <input
                  key={item}
                  type="text"
                  value={(newSupplier as any)[item]}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, [item]: e.target.value })
                  }
                  placeholder={item.charAt(0).toUpperCase() + item.slice(1)}
                  className="border p-2 w-full rounded-lg"
                  required
                />
              ))}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Add Supplier
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {editMode && editSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <button
              onClick={() => {
                setEditMode(false);
                setEditSupplier(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-blue-900">
              Edit Supplier
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              {["name", "email", "phone", "company", "address"].map((field) => (
                <input
                  key={field}
                  type="text"
                  value={(editSupplier as any)[field]}
                  onChange={(e) =>
                    setEditSupplier({
                      ...editSupplier,
                      [field]: e.target.value,
                    })
                  }
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border p-2 w-full rounded-lg"
                />
              ))}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




















