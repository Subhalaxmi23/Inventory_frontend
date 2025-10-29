"use client";

import { useState } from "react";
import Link from "next/link";
import { baseURL } from "../../config/apiConfig";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("🔹 Sending registration data:", formData);

    try {
      const res = await fetch(`${baseURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("🔹 API Response Status:", res.status);

      const data = await res.json();
      console.log("🔹 API Response Data:", data);

      if (res.ok) {
        setMessage("✅ Registration successful! You can now log in.");
        setFormData({ name: "", email: "", password: "" });
      } else {
        setMessage(`❌ ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("⚠️ API Error:", error);
      setMessage("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center text-white p-10 hidden md:flex">
        <h1 className="text-5xl font-bold mb-4 text-center">
          Inventory Management System
        </h1>
        <p className="text-lg text-center">
          Create your account and start managing your inventory efficiently.
        </p>
      
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
            Register
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Response Message */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-700 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
