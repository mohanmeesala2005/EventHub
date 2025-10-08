import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
  });
  const navigate = useNavigate();

  let user = null;
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    localStorage.removeItem("user");
  }

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    API.post("/events/getevent")
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data); // Initialize filtered events
      })
      .catch(() => alert("Failed to load events"));
  }, [navigate]);

  // Filter events based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteEvent = async (eventid) => {
    const confirmDelete = window.confirm(
      "Are you sure! you want to delete this event?"
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete events.");
        return;
      }
      await API.delete(`/events/${eventid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event._id !== eventid));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete event");
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event._id);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.slice(0, 10) : "",
      image: null,
      cost: event.cost,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEditForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (eventid) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to edit events.");
        return;
      }
      const data = new FormData();
      data.append("title", editForm.title);
      data.append("description", editForm.description);
      data.append("date", editForm.date);
      data.append("cost", editForm.cost);
      if (editForm.image) {
        data.append("image", editForm.image);
      }
      await API.put(`/events/${eventid}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      API.post("/events/getevent")
        .then((res) => {
          setEvents(res.data);
          setFilteredEvents(res.data);
        })
        .catch(() => alert("Failed to load events"));
      setEditingEvent(null);
    } catch {
      alert("Failed to update event");
    }
  };

  // Filter user's events from filtered events
  const userEvents = filteredEvents.filter(
    (event) => event.createdByName === user?.username
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      {/* Header with Title and Search Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-800">My Events</h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
        </div>
        <div className="flex justify-center mb-6">
          <button
            className="text-white bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold shadow-lg transition-colors"
            onClick={() => navigate("/create-event")}
          >
            Create New Event
          </button>
        </div>
      </div>
      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 text-center text-gray-600">
          {userEvents.length > 0
            ? `Found ${userEvents.length} event${
                userEvents.length !== 1 ? "s" : ""
              } matching "${searchQuery}"`
            : `No events found matching "${searchQuery}"`}
        </div>
      )}

      {/* Events Grid */}
      {userEvents.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg">
          {searchQuery
            ? "No events match your search."
            : "You haven't created any events yet."}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {userEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              {editingEvent === event._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit(event._id);
                  }}
                  className="flex flex-col gap-3 p-4"
                  encType="multipart/form-data"
                >
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="p-2 border rounded"
                    placeholder="Event Title"
                    required
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="p-2 border rounded"
                    placeholder="Event Description"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    name="cost"
                    value={editForm.cost}
                    onChange={handleEditChange}
                    className="p-2 border rounded"
                    placeholder="Registration Cost"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleEditChange}
                    className="p-2 border rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => setEditingEvent(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {event.image ? (
                      <img
                        src={`http://localhost:5000/${event.image.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt="Event"
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <h3 className="text-xl font-bold text-blue-700 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-700 mb-2 line-clamp-2">
                      {event.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(event.date).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Cost: ₹{event.cost || 0}
                    </p>
                    <button
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition mb-2"
                      onClick={() => navigate(`/registrations/${event._id}`)}
                    >
                      View Registrations
                    </button>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                        onClick={() => startEdit(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
