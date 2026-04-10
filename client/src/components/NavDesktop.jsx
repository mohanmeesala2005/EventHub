import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const linkClass =
  "text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/dashboard", label: "Dashboard" },
];

const NavDesktop = ({ user, profileOpen, setProfileOpen, handleLogout }) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <Link key={link.to} to={link.to} className={linkClass}>
          {link.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
        </Link>
      ))}

      {user?.role === "admin" && (
        <Link
          to="/admin/dashboard"
          className={linkClass}
        >
          Admin Dashboard
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full"></span>
        </Link>
      )}

      {user ? (
        <>
          {user?.role === "admin" && (
            <Link
              to="/create-event"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Event
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {user.username?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-medium text-slate-200">{user.username || user.name}</span>
                {user.role === "admin" && (
                  <span className="text-xs text-purple-400 font-semibold">Admin</span>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <UserDropdown
              user={user}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
              handleLogout={handleLogout}
            />
          </div>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 font-medium transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default NavDesktop;
