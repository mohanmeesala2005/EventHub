import { Link } from "react-router-dom";

const NavMobile = ({ user, onClose, handleLogout }) => {
  return (
    <div className="md:hidden bg-slate-800 border-t border-slate-700">
      <div className="flex flex-col py-3 px-4 space-y-1">
        <Link
          to="/"
          className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          to="/events"
          className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
          onClick={onClose}
        >
          Events
        </Link>
        <Link
          to="/dashboard"
          className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
          onClick={onClose}
        >
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/admin/dashboard"
            className="block px-3 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
            onClick={onClose}
          >
            Admin Dashboard
          </Link>
        )}

        {user ? (
          <>
            {user.role === "admin" && (
              <Link
                to="/create-event"
                className="block px-3 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all my-2"
                onClick={onClose}
              >
                Create Event
              </Link>
            )}
            <Link
              to="/profile"
              className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
              onClick={onClose}
            >
              Profile
            </Link>
            {user.role === "admin" && (
              <Link
                to="/myEvents"
                className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
                onClick={onClose}
              >
                My Events
              </Link>
            )}
            <button
              onClick={() => {
                onClose();
                handleLogout();
              }}
              className="w-full text-left px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block px-3 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium transition-all my-2"
              onClick={onClose}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all"
              onClick={onClose}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavMobile;
