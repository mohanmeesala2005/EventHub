import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Preloader from '../components/Preloader';
import API, { fetchEvents } from '../api/axios';
import { getCurrentUser } from '../utils/auth';

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    fetchEvents()
      .then((res) => setEvents(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (eventId: string) => {
    try {
      await API.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      setError('Unable to delete event.');
      console.error(err);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Events</h1>
            <p className="text-slate-300 mt-2">Browse upcoming events and register with a single click.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/create-event')}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
          >
            Create Event
          </button>
        </div>

        {error && <div className="mb-6 rounded-xl bg-red-600 bg-opacity-20 border border-red-500 p-4 text-red-100">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-10 text-center text-slate-300">
              No events available yet. Please check back soon.
            </div>
          ) : (
            events.map((event) => (
              <EventCard key={event._id || event.ID} event={event} user={user} navigate={navigate} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
