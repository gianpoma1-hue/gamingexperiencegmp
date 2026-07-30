import {
  FaUsers,
  FaTrophy,
  FaClipboardList,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function AdminStats() {
  const stats = [
    {
      title: "Usuarios",
      value: "128",
      icon: <FaUsers />,
      color: "text-blue-400",
    },
    {
      title: "Torneos",
      value: "6",
      icon: <FaTrophy />,
      color: "text-yellow-400",
    },
    {
      title: "Inscripciones",
      value: "42",
      icon: <FaClipboardList />,
      color: "text-green-400",
    },
    {
      title: "Premios Entregados",
      value: "$120.000",
      icon: <FaMoneyBillWave />,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

      {stats.map((stat) => (

        <div
          key={stat.title}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-600 transition"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-400">
                {stat.title}
              </p>

              <h2 className="text-4xl font-black mt-3">
                {stat.value}
              </h2>

            </div>

            <div className={`text-5xl ${stat.color}`}>
              {stat.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}