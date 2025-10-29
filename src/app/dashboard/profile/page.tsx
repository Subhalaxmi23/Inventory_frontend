"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile Updated:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={profile.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
            disabled
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
