import Link from "next/link";

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
            href="/customer"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/products"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg"
          >
            Products
          </Link>
          <Link
            href="/dashboard/orders"
            className="hover:bg-blue-800 px-3 py-2 rounded-lg"
          >
            Orders
          </Link>

          <Link
            href="/login"
            className="hover:bg-red-700 px-3 py-2 rounded-lg mt-4"
          >
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
