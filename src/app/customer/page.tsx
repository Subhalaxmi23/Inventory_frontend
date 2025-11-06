import Link from "next/link";

export default function CustomerDashboard() {
  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          🛍️ Customer Dashboard
        </h1>
        <p className="mt-4 text-gray-700 text-lg mb-8">
          Browse products and place your orders here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/customer/products"
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-200 hover:border-blue-400"
          >
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              View Products
            </h2>
            <p className="text-gray-600">
              Browse available products with current stock and pricing
            </p>
          </Link>

          <Link
            href="/customer/orders"
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200 hover:border-green-400"
          >
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              My Orders
            </h2>
            <p className="text-gray-600">
              Place new orders and track your existing orders
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
