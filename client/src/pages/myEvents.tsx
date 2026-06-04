import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { API_BASE_URL, fetchEvents, invalidateEventsCache } from '../api/axios';
import Button from '../components/Button';
import Preloader from '../components/Preloader';
import { getCurrentUser } from '../utils/auth';

type EventItem = {
  _id?: string;
  ID?: number;
  title: string;
  description?: string;
  date?: string;
  cost?: number;
  image?: string;
  createdByName?: string;
  createdByEmail?: string;
  registrationCount?: number;
};

type RegistrationItem = {
  ID?: number;
  id?: number;
  EventID?: number;
  eventId?: number;
  createdAt?: string;
  CreatedAt?: string;
  event?: EventItem;
  Event?: EventItem;
};

const getEventId = (event: EventItem) => event._id || event.ID;

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'created' | 'registered'>('created');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetchEvents(),
      API.get('/events/registrations').catch(() => ({ data: [] })),
    ])
      .then(([eventsRes, registrationsRes]) => {
        setEvents(eventsRes.data || []);
        setRegistrations(registrationsRes.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load your events.'))
      .finally(() => setLoading(false));
  }, []);

  const createdEvents = useMemo(
    () =>
      events.filter((event) => {
        const creatorName = String(event.createdByName || '').toLowerCase();
        const creatorEmail = String(event.createdByEmail || '').toLowerCase();
        return creatorName === String(user?.username || '').toLowerCase() || creatorEmail === String(user?.email || '').toLowerCase();
      }),
    [events, user],
  );

  const registeredEvents = useMemo(
    () =>
      registrations.map((registration) => ({
        registration,
        event:
          registration.event ||
          registration.Event ||
          events.find((event) => Number(event.ID) === Number(registration.EventID || registration.eventId)),
      })),
    [registrations, events],
  );

  const handleDelete = async (eventId: string | number | undefined) => {
    if (!eventId) return;
    setDeletingId(eventId);
    setError('');

    try {
      await API.delete(`/events/${eventId}`);
      invalidateEventsCache();
      setEvents((current) => current.filter((event) => getEventId(event) !== eventId));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">My Events</p>
            <h1 className="mt-2 text-4xl font-bold">Event Activity</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Review the events you are organizing and the events you have registered to attend.
            </p>
          </div>
          <Button onClick={() => navigate('/create-event')}>Create Event</Button>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-100">{error}</div>}

        <div className="mb-6 flex w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('created')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'created' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            Created ({createdEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('registered')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'registered' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            Registered ({registrations.length})
          </button>
        </div>

        {activeTab === 'created' ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {createdEvents.length === 0 ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8 text-slate-300 lg:col-span-3">
                <h2 className="text-2xl font-bold text-white">No created events yet</h2>
                <p className="mt-2">Start by publishing your first event for the community.</p>
                <Link to="/create-event" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500">
                  Create Event
                </Link>
              </div>
            ) : (
              createdEvents.map((event) => {
                const eventId = getEventId(event);
                const imageUrl = event.image ? `${API_BASE_URL}/${event.image.replace(/\\/g, '/')}` : '';

                return (
                  <article key={eventId} className="overflow-hidden rounded-2xl border border-slate-700 bg-white text-slate-900 shadow-xl">
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      {imageUrl ? (
                        <img src={imageUrl} alt={event.title} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-slate-500">Event Image</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold">{event.title}</h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {event.date ? new Date(event.date).toLocaleString() : 'Date TBA'}
                          </p>
                        </div>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                          {Number(event.cost) > 0 ? `Rs ${event.cost}` : 'Free'}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-slate-600">{event.description || 'No description added.'}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => navigate(`/registrations/${eventId}`)}>
                          Registrations
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={deletingId === eventId}
                          onClick={() => handleDelete(eventId)}
                        >
                          {deletingId === eventId ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
            {registeredEvents.length === 0 ? (
              <div className="p-8 text-slate-300">
                <h2 className="text-2xl font-bold text-white">No registrations yet</h2>
                <p className="mt-2">Browse events and register for the ones you want to attend.</p>
                <Link to="/events" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {registeredEvents.map(({ registration, event }) => {
                  const eventId = event ? getEventId(event) : registration.EventID || registration.eventId;
                  const registeredAt = registration.createdAt || registration.CreatedAt;

                  return (
                    <div key={registration.ID || registration.id || eventId} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{event?.title || 'Registered Event'}</h2>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{event?.description || 'Registration confirmed.'}</p>
                        <p className="mt-2 text-sm text-slate-500">
                          {registeredAt ? `Registered on ${new Date(registeredAt).toLocaleDateString()}` : 'Registration saved'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {eventId && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/registrations/${eventId}`)}>
                            Details
                          </Button>
                        )}
                        <Link to="/events" className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                          More Events
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
