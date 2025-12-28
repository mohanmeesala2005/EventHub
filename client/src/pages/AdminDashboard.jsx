import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Check if user is admin
    if (!token || user.role !== "admin") {
      navigate("/login");
      return;
    }

    // Fetch events with stats and all registrations
    Promise.all([
      API.get("/events/admin/events-with-stats", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      API.get("/events/admin/all-registrations", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([eventsRes, regsRes]) => {
        setEvents(eventsRes.data);
        setFilteredEvents(eventsRes.data);
        setRegistrations(regsRes.data);
      })
      .catch((err) => {
        console.error("Failed to fetch admin data:", err);
        if (err.response?.status === 403) {
          alert("Access denied. Admin privileges required.");
          navigate("/");
        }
      })
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [navigate]);

  // Filter events based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.createdByName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.createdByEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await API.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from state
      setEvents(events.filter((e) => e._id !== eventId));
      setFilteredEvents(filteredEvents.filter((e) => e._id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) return <Preloader />;

  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) > new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-purple-200">Manage and monitor all events</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Events</p>
                <p className="text-4xl font-bold text-white mt-2">{totalEvents}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Registrations</p>
                <p className="text-4xl font-bold text-white mt-2">{totalRegistrations}</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Upcoming Events</p>
                <p className="text-4xl font-bold text-white mt-2">{upcomingEvents}</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events by title, creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white bg-opacity-10 backdrop-blur-md border border-purple-300 border-opacity-30 text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-purple-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-purple-300 border-opacity-30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900 bg-opacity-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-300 divide-opacity-20">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-black">
                      {searchQuery ? "No events match your search." : "No events found."}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-purple-300 hover:bg-opacity-10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {event.image && (
                            <img
                              src={`http://localhost:5000/${event.image}`}
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div>
                            <p className="text-black font-semibold">{event.title}</p>
                            <p className="text-black-200 text-sm line-clamp-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black text-sm">{event.createdByName}</p>
                        <p className="text-black-200 text-xs">{event.createdByEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black text-sm">{formatDate(event.date)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 bg-opacity-20 text-green-200">
                          {event.cost === 0 ? "Free" : `₹${event.cost}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 bg-opacity-20 text-blue-200">
                          {event.registrationCount || 0} registered
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-black rounded-lg font-medium transition-colors shadow-lg"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
