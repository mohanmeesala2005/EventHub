import { Link } from "react-router-dom";

const UserDropdown = ({ user, profileOpen, setProfileOpen, handleLogout }) => {
  if (!profileOpen) {
    return null;
  }

  return (
    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
      <Link
        to="/profile"
        className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        onClick={() => setProfileOpen(false)}
      >
        Profile
      </Link>
      {user.role === "admin" && (
        <Link
          to="/myEvents"
          className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          onClick={() => setProfileOpen(false)}
        >
          My Events
        </Link>
      )}
      <div className="border-t border-slate-700">
        <button
          onClick={() => {
            setProfileOpen(false);
            handleLogout();
          }}
          className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
