import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  let user = null;
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-slate-900 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <nav className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/eventhub.png"
              alt="EventHub Logo"
              className="w-8 h-8 rounded-lg"
            />
            {/* <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              EventHub
            </span> */}
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            to="/events"
            className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
          >
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
          >
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          {user ? (
            <>
              <Link
                to="/create-event"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Event
              </Link>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.username?.charAt(0).toUpperCase() ||
                      user.name?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <span className="font-medium text-slate-200">
                    {user.username || user.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/myEvents"
                      className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Events
                    </Link>
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
                )}
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

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="flex flex-col py-3 px-4 space-y-1">
            <Link
              to="/"
              className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Events
            </Link>
            {user ? (
              <>
                <Link
                  to="/create-event"
                  className="block px-3 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all my-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Event
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/myEvents"
                  className="block px-3 py-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  My Events
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
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
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
