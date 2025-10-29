
import Link from "next/link";
import {
  FaTachometerAlt,
  FaTruck,
  FaBoxes,
  FaBoxOpen,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 hidden md:flex">
        <h1 className="text-2xl font-bold mb-8">IMS Dashboard</h1>

        <nav className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg flex items-center gap-3"
          >
            <FaTachometerAlt /> Dashboard
          </Link>

          <Link
            href="/dashboard/suppliers"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg flex items-center gap-3"
          >
            <FaTruck /> Suppliers
          </Link>

          <Link
            href="/dashboard/stock"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg flex items-center gap-3"
          >
            <FaBoxes /> Stock
          </Link>

          <Link
            href="/dashboard/products"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg flex items-center gap-3"
          >
            <FaBoxOpen /> Products
          </Link>

          <Link
            href="/dashboard/orders"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg flex items-center gap-3"
          >
            <FaShoppingCart /> Orders
          </Link>

          <Link
            href="/dashboard/profile"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg flex items-center gap-3"
          >
            <FaUserCircle /> Profile
          </Link>

          <Link
            href="/login"
            className="hover:bg-red-700 px-3 py-2 rounded-lg mt-4 flex items-center gap-3"
          >
            <FaSignOutAlt /> Logout
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
