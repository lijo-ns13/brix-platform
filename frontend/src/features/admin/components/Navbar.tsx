import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

const Navbar = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    alert("Admin logged out successfully");
  };

  return (
    <nav className="bg-indigo-800 text-white shadow-lg">
      <div className="w-full px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Admin Logo */}
          <div>
            <Link to="/admin/dashboard" className="flex items-center">
              <span className="font-bold text-xl text-white">Admin Portal</span>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-indigo-700 font-medium text-white rounded hover:bg-indigo-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
