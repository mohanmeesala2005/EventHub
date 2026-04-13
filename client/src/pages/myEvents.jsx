import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { API_BASE_URL, fetchEvents, invalidateEventsCache } from "../api/axios";
import { getCurrentUser, isAuthenticated } from "../utils/auth";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import useDebounce from "../hooks/useDebounce";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
  });
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
  const navigate = useNavigate();

  const closeDialog = () => setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  const handleDialogConfirm = () => {
    dialogConfig.onConfirm?.();
    closeDialog();
  };
  const handleDialogCancel = () => {
    dialogConfig.onCancel?.();
    closeDialog();
  };

  const deleteEvent = async (eventid) => {
    try {
      if (!isAuthenticated()) {
        setDialogConfig({
          isOpen: true,
          title: 'Not Logged In',
          message: 'You must be logged in to delete events.',
          showCancel: false,
          confirmText: 'Ok',
        });
        return;
      }
      await API.delete(`/events/${eventid}`);
      invalidateEventsCache();
      setEvents((prev) => prev.filter((event) => event.ID !== eventid));
      setDialogConfig({
        isOpen: true,
        title: 'Deleted',
        message: 'Event deleted successfully.',
        showCancel: false,
        confirmText: 'Ok',
      });
    } catch (error) {
      setDialogConfig({
        isOpen: true,
        title: 'Delete Failed',
        message: error.response?.data?.message || 'Failed to delete event',
        showCancel: false,
        confirmText: 'Ok',
      });
    }
  };

  const handleDeleteEvent = (eventid) => {
    setDialogConfig({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this event?',
      showCancel: true,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => deleteEvent(eventid),
    });
  };

  const user = getCurrentUser();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchEvents()
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data); // Initialize filtered events
      })
      .catch(() => {
        setDialogConfig({
          isOpen: true,
          title: 'Load Failed',
          message: 'Failed to load events.',
          showCancel: false,
          confirmText: 'Ok',
        });
      });
  }, [navigate]);

  // Filter events based on search query
  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [debouncedSearchQuery, events]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const startEdit = (event) => {
    setEditingEvent(event.ID);
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
      if (!isAuthenticated()) {
        setDialogConfig({
          isOpen: true,
          title: 'Not Logged In',
          message: 'You must be logged in to edit events.',
          showCancel: false,
          confirmText: 'Ok',
        });
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
        },
      });
      fetchEvents()
        .then((res) => {
          setEvents(res.data);
          setFilteredEvents(res.data);
        })
        .catch(() => {
        setDialogConfig({
          isOpen: true,
          title: 'Load Failed',
          message: 'Failed to load events.',
          showCancel: false,
          confirmText: 'Ok',
        });
      });
      setEditingEvent(null);
    } catch {
      setDialogConfig({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update event',
        showCancel: false,
        confirmText: 'Ok',
      });
    }
  };

  // Filter user's events from filtered events
  const userEvents = filteredEvents.filter(
    (event) => event.createdByName === user?.username
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-10 px-4">
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
              key={event.ID}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              {editingEvent === event.ID ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit(event.ID);
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
                    <Button type="submit" variant="success" className="flex-1">
                      Save
                    </Button>
                    <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditingEvent(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {event.image ? (
                      <img
                        src={`${API_BASE_URL}/${event.image.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt="Event"
                        loading="lazy"
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
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => navigate(`/registrations/${event.ID}`)}
                      className="mb-2"
                    >
                      View Registrations
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => startEdit(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteEvent(event.ID)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
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

export default MyEvents;
