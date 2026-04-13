import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { getCurrentUser, isAuthenticated } from '../utils/auth';
import useDebounce from '../hooks/useDebounce';

const useAdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filteredEvents, setFilteredEvents] = useState([]);
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

  const closeDialog = useCallback(() => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleDialogConfirm = useCallback(() => {
    dialogConfig.onConfirm?.();
    closeDialog();
  }, [dialogConfig, closeDialog]);

  const handleDialogCancel = useCallback(() => {
    dialogConfig.onCancel?.();
    closeDialog();
  }, [dialogConfig, closeDialog]);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);

      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setFilteredEvents((prev) => prev.filter((e) => e._id !== eventId));
      setDialogConfig({
        isOpen: true,
        title: 'Deleted',
        message: 'Event deleted successfully!',
        showCancel: false,
        confirmText: 'Ok',
      });
    } catch (err) {
      console.error('Failed to delete event:', err);
      setDialogConfig({
        isOpen: true,
        title: 'Delete Failed',
        message: 'Failed to delete event. Please try again.',
        showCancel: false,
        confirmText: 'Ok',
      });
    }
  }, []);

  const handleDeleteEvent = useCallback(
    (eventId, eventTitle) => {
      setDialogConfig({
        isOpen: true,
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${eventTitle}"?`,
        showCancel: true,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => deleteEvent(eventId),
      });
    },
    [deleteEvent]
  );

  useEffect(() => {
    const user = getCurrentUser();

    if (!isAuthenticated() || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    Promise.all([
      API.get('/events/admin/events-with-stats'),
      API.get('/events/admin/all-registrations'),
    ])
      .then(([eventsRes, regsRes]) => {
        setEvents(eventsRes.data);
        setFilteredEvents(eventsRes.data);
        setRegistrations(regsRes.data);
      })
      .catch((err) => {
        console.error('Failed to fetch admin data:', err);
        if (err.response?.status === 403) {
          setDialogConfig({
            isOpen: true,
            title: 'Access Denied',
            message: 'Admin privileges required.',
            showCancel: false,
            confirmText: 'Ok',
            onConfirm: () => navigate('/'),
          });
        }
      })
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [navigate]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          event.createdByName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          event.createdByEmail?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [debouncedSearchQuery, events]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return {
    events,
    registrations,
    loading,
    searchQuery,
    setSearchQuery,
    filteredEvents,
    dialogConfig,
    handleDialogConfirm,
    handleDialogCancel,
    handleDeleteEvent,
    formatDate,
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    upcomingEvents: events.filter((e) => new Date(e.date) > new Date()).length,
  };
};

export default useAdminDashboard;
