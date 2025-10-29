import { FaBox, FaShoppingCart, FaTruck, FaDollarSign } from "react-icons/fa";

export default function DashboardPage() {
  const stats = [
    {
      title: "Products",
      value: 120,
      icon: <FaBox size={30} />,
      bg: "from-blue-500 to-blue-700",
    },
    {
      title: "Orders",
      value: 45,
      icon: <FaShoppingCart size={30} />,
      bg: "from-green-500 to-green-700",
    },
    {
      title: "Suppliers",
      value: 15,
      icon: <FaTruck size={30} />,
      bg: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Revenue",
      value: "$12,500",
      icon: <FaDollarSign size={30} />,
      bg: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-6 rounded-2xl shadow-lg bg-gradient-to-r ${item.bg} text-white transform transition-transform hover:scale-105`}
          >
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-700">
          Recent Activity
        </h3>
        <div className="bg-white shadow rounded-2xl p-6">
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b pb-2">
              <span>New order placed: ORD-003</span>
              <span className="text-green-600 font-semibold">Completed</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <span>Product stock updated: Product A</span>
              <span className="text-yellow-500 font-semibold">Pending</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <span>New supplier added: XYZ Traders</span>
              <span className="text-blue-500 font-semibold">Info</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
