
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { baseURL } from "@/config/apiConfig";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("🔹 API Response:", data);

      if (res.ok && data.token) {
        // ✅ Save token & role
        localStorage.setItem("token", data.token);
        if (data.user?.role) {
          localStorage.setItem("role", data.user.role);
        }

        setMessage("✅ Login successful!");

        // ✅ Redirect based on role
        setTimeout(() => {
          if (data.user?.role === "admin") {
            router.push("/dashboard");
          } else if (data.user?.role === "customer") {
            router.push("/customer");
          } else {
            router.push("/dashboard");
          }
        }, 800);
      } else {
        setMessage(`❌ ${data.message || "Invalid email or password"}`);
      }
    } catch (error) {
      console.error("⚠️ API Error:", error);
      setMessage("⚠️ Failed to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-900 text-white hidden md:flex items-center justify-center p-10">
        <h1 className="text-5xl font-bold text-center">
          Inventory Management System
        </h1>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
            Login
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-700 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
