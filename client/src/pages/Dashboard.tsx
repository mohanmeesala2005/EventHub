import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import API from '../api/axios';
import Preloader from '../components/Preloader';
import { getCurrentUser } from '../utils/auth';

type EventItem = {
  _id?: string;
  ID?: number;
  title: string;
  description?: string;
  date?: string;
  cost?: number;
  createdByName?: string;
  createdByEmail?: string;
};

type RegistrationItem = {
  ID?: number;
  id?: number;
  eventId?: number;
  EventID?: number;
  name?: string;
  email?: string;
  createdAt?: string;
  CreatedAt?: string;
  event?: EventItem;
  Event?: EventItem;
};

const Dashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    API.get('/events/registrations')
      .then((res) => setRegistrations(res.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const registeredEvents = useMemo(
    () =>
      registrations.map((registration) => ({
        registration,
        event: registration.event || registration.Event,
      })),
    [registrations],
  );

  const upcomingRegistrations = useMemo(
    () =>
      registeredEvents.filter(({ event }) => {
        if (!event?.date) return false;
        return new Date(event.date) >= new Date();
      }),
    [registeredEvents],
  );

  const nextEvents = upcomingRegistrations.slice(0, 3);
  const recentRegistrations = registrations.slice(0, 4);

  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold">Welcome back, {user?.name || user?.username || 'there'}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Keep track of the events you registered for and what is coming up next.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-100">
              Browse Events
            </Link>
            <Link to="/myEvents" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500">
              My Events
            </Link>
          </div>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-100">{error}</div>}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Registered Events</p>
            <p className="mt-3 text-4xl font-bold">{registrations.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Upcoming</p>
            <p className="mt-3 text-4xl font-bold">{upcomingRegistrations.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-3 text-4xl font-bold">{Math.max(registrations.length - upcomingRegistrations.length, 0)}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Next Event</p>
            <p className="mt-3 text-2xl font-bold">{nextEvents[0]?.event?.date ? new Date(nextEvents[0].event.date).toLocaleDateString() : 'None'}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Next Up</h2>
                <p className="text-sm text-slate-400">Upcoming events you are registered for.</p>
              </div>
              <Link to="/myEvents" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {nextEvents.length === 0 ? (
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-slate-300">
                  Register for an event to see your schedule here.
                </div>
              ) : (
                nextEvents.map(({ registration, event }) => (
                  <div key={registration.ID || registration.id || event?.ID || event?._id} className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{event?.title || 'Registered Event'}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{event?.description || 'Registration confirmed.'}</p>
                      </div>
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-200">
                        {event?.date ? new Date(event.date).toLocaleDateString() : 'Date TBA'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Recent Registrations</h2>
                <p className="text-sm text-slate-400">Your latest event signups.</p>
              </div>
              <Link to="/events" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                Browse
              </Link>
            </div>

            <div className="space-y-3">
              {recentRegistrations.length === 0 ? (
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-slate-300">
                  Your registrations will appear here after you sign up.
                </div>
              ) : (
                recentRegistrations.map((registration) => {
                  const event = registration.event || registration.Event;
                  const createdAt = registration.createdAt || registration.CreatedAt;
                  return (
                    <div key={registration.ID || registration.id} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                      <p className="font-semibold">{event?.title || 'Registered Event'}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {createdAt ? `Registered ${new Date(createdAt).toLocaleDateString()}` : registration.email || user?.email}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
