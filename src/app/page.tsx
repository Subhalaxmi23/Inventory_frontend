import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Hero */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col justify-center items-center text-white p-10">
        <h1 className="text-5xl font-bold mb-6 text-center">
          Inventory Management System
        </h1>
        <p className="text-lg text-center max-w-md mb-8">
          Manage your stock, products, and suppliers efficiently with our modern
          and easy-to-use system.
        </p>
       
      </div>

      {/* Right Section - Action Buttons */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-10">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Welcome!</h2>
          <p className="text-gray-600 mb-8">
            Please login or register to continue managing your inventory.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




