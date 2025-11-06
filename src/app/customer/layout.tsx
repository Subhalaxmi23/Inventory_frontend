"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Show sidebar only on products and orders pages
  const showSidebar =
    pathname === "/customer/products" || pathname === "/customer/orders";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - only show on products and orders pages */}
      {showSidebar && (
        <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 hidden md:flex">
          <h1 className="text-2xl font-bold mb-8">Customer Dashboard</h1>
          <nav className="flex flex-col gap-4">
            <Link
              href="/customer"
              className="hover:bg-blue-800 px-3 py-2 rounded-lg"
            >
              ← Back to Dashboard
            </Link>
            <Link
              href="/customer/products"
              className={`hover:bg-blue-800 px-3 py-2 rounded-lg ${
                pathname === "/customer/products" ? "bg-blue-800" : ""
              }`}
            >
              Products
            </Link>
            <Link
              href="/customer/orders"
              className={`hover:bg-blue-800 px-3 py-2 rounded-lg ${
                pathname === "/customer/orders" ? "bg-blue-800" : ""
              }`}
            >
              Orders
            </Link>

            <Link
              href="/login"
              className="hover:bg-red-700 px-3 py-2 rounded-lg mt-4"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
              }}
            >
              Logout
            </Link>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main className={showSidebar ? "flex-1 p-6" : "w-full p-6"}>{children}</main>
    </div>
  );
}
