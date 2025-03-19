import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    {
      name: "User Management",
      path: "/admin/users",
      icon: "👤",
      subItems: [
        { name: "All Users", path: "/admin/users" },
        { name: "Add User", path: "/admin/users/add" },
        { name: "User Reports", path: "/admin/users/reports" },
      ],
    },
    {
      name: "Company Management",
      path: "/admin/companies",
      icon: "🏢",
      subItems: [
        { name: "All Companies", path: "/admin/companies" },
        {
          name: "Company Verifications",
          path: "/admin/companies/verifications",
        },
      ],
    },
    {
      name: "Job Management",
      path: "/admin/jobs",
      icon: "💼",
      subItems: [
        { name: "All Jobs", path: "/admin/jobs" },
        { name: "Reported Jobs", path: "/admin/jobs/reported" },
        { name: "Job Categories", path: "/admin/jobs/categories" },
      ],
    },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6 text-indigo-300">
          Administration
        </h2>

        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-indigo-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>

              {/* Render subitems if they exist */}
              {item.subItems && (
                <ul className="ml-8 mt-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.path}>
                      <Link
                        to={subItem.path}
                        className={`block px-4 py-2 rounded-lg text-sm ${
                          location.pathname === subItem.path
                            ? "bg-indigo-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
