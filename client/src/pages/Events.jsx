import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import EventCard from "../components/EventCard";
import Dialog from "../components/Dialog";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    showCancel: false,
    confirmText: 'Ok',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  });

  const closeDialog = () => setDialogConfig((prev) => ({ ...prev, isOpen: false }));

  const handleDialogConfirm = () => {
    dialogConfig.onConfirm?.();
    closeDialog();
  };

  const handleDialogCancel = () => {
    dialogConfig.onCancel?.();
    closeDialog();
  };

  const deleteEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e.ID !== eventId));
      setFilteredEvents((prev) => prev.filter((e) => e.ID !== eventId));
      setDialogConfig({
        isOpen: true,
        title: 'Deleted',
        message: 'Event deleted successfully!',
        showCancel: false,
        confirmText: 'Ok',
      });
    } catch (err) {
      console.error("Failed to delete event:", err);
      setDialogConfig({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete event. Please try again.',
        showCancel: false,
        confirmText: 'Ok',
      });
    }
  };

  const handleDeleteEvent = (eventId, eventTitle) => {
    setDialogConfig({
      isOpen: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${eventTitle}"?`,
      showCancel: true,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => deleteEvent(eventId),
    });
  };

  useEffect(() => {
    API.post("/events/getevent")
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setDialogConfig({
          isOpen: true,
          title: 'Load Error',
          message: 'Failed to load events. Please refresh the page.',
          showCancel: false,
          confirmText: 'Ok',
        });
      });
  }, [navigate]);

  // Filter events based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.createdByName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <Preloader />;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Title and Search Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Upcoming Events
          </h1>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-white"
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
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 text-center text-gray-600">
            {filteredEvents.length > 0
              ? `Found ${filteredEvents.length} event${
                  filteredEvents.length !== 1 ? "s" : ""
                } matching "${searchQuery}"`
              : `No events found matching "${searchQuery}"`}
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 text-lg">
            {searchQuery ? "No events match your search." : "No events found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.ID}
                event={event}
                user={user}
                navigate={navigate}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
      <Dialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        showCancel={dialogConfig.showCancel}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default Events;
