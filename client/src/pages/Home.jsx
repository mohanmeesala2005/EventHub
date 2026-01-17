import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  let user = null;
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    localStorage.removeItem("user");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {user ? (
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                  Welcome back,{" "}
                  <span className="text-blue-400">
                    {user.username || user.name}
                  </span>
                </h1>
                <p className="text-xl text-slate-300">
                  Ready to discover your next event?
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                  Welcome to <span className="text-blue-400">EventHub</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Your gateway to discovering amazing events, connecting with
                  communities, and creating unforgettable experiences.
                </p>
              </div>
            )}

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mt-8">
              <Link
                to="/events"
                className="inline-block w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Explore Events
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="inline-block w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Everything you need to discover, organize, and attend events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Discover Events
              </h3>
              <p className="text-slate-300">
                Find events that match your interests and location
              </p>
            </div>

            <div className="text-center p-6 bg-slate-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect</h3>
              <p className="text-slate-300">
                Join a vibrant community of event enthusiasts
              </p>
            </div>

            <div className="text-center p-6 bg-slate-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Organize
              </h3>
              <p className="text-slate-300">
                Create and manage your own events effortlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="text-xl font-semibold text-white mb-2">Browse</h4>
              <p className="text-slate-300">
                Explore a wide range of events tailored to your interests.
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Register
              </h4>
              <p className="text-slate-300">
                Sign up for events with a single click and get instant
                confirmation.
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
              <div className="text-4xl mb-4">🎉</div>
              <h4 className="text-xl font-semibold text-white mb-2">Enjoy</h4>
              <p className="text-slate-300">
                Attend, connect, and make memories at your chosen events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to create your own event?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join EventHub and start organizing events that inspire and connect
            people.
          </p>
          <Link
            to={user ? "/create-event" : "/signup"}
            className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-lg shadow-lg text-lg hover:bg-blue-50 transition"
          >
            {user ? "Create Event" : "Get Started"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
