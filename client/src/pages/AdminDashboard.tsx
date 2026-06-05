import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/axios';
import Preloader from '../components/Preloader';
import Dialog from '../components/Dialog';
import useAdminDashboard from '../hooks/useAdminDashboard';
import { getCurrentUser } from '../utils/auth';

const getEventId = (event: any) => event?._id || event?.ID;
const apiBaseUrl = API_BASE_URL;

const AdminDashboard = () => {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    filteredEvents,
    dialogConfig,
    handleDialogConfirm,
    handleDialogCancel,
    handleDeleteEvent,
    formatDate,
    totalEvents,
    totalRegistrations,
    upcomingEvents,
  } = useAdminDashboard();
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">Admin Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold">Welcome back, {user?.name || user?.username || 'admin'}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Manage the events you created, review signups, and keep your schedule moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-100">
              Browse Events
            </Link>
            <Link to="/create-event" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500">
              Create Event
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Created Events</p>
            <p className="mt-3 text-4xl font-bold">{totalEvents}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Upcoming Events</p>
            <p className="mt-3 text-4xl font-bold">{upcomingEvents}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Registrations</p>
            <p className="mt-3 text-4xl font-bold">{totalRegistrations}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-400">Visible Events</p>
            <p className="mt-3 text-4xl font-bold">{filteredEvents.length}</p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Created Events</h2>
              <p className="text-sm text-slate-400">Only the events created by your admin account are shown here.</p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <input
                type="text"
                placeholder="Search your events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pl-10 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-8 text-slate-300">
              <h3 className="text-2xl font-bold text-white">{searchQuery ? 'No matching events' : 'No created events yet'}</h3>
              <p className="mt-2">
                {searchQuery ? 'Try another search term.' : 'Create an event to start tracking registrations here.'}
              </p>
              {!searchQuery && (
                <Link to="/create-event" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500">
                  Create Event
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const eventId = getEventId(event);
                const imageUrl = event.image ? `${apiBaseUrl}/${String(event.image).replace(/\\/g, '/')}` : '';

                return (
                  <article key={eventId} className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800 text-xs font-medium text-slate-500">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={event.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            'Event'
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{event.description || 'No description added.'}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-sm">
                            <span className="rounded-full bg-blue-500/15 px-3 py-1 font-semibold text-blue-200">
                              {event.date ? formatDate(event.date) : 'Date TBA'}
                            </span>
                            <span className="rounded-full bg-green-500/15 px-3 py-1 font-semibold text-green-200">
                              {Number(event.cost) > 0 ? `Rs ${event.cost}` : 'Free'}
                            </span>
                            <span className="rounded-full bg-slate-700 px-3 py-1 font-semibold text-slate-200">
                              {event.registrationCount || 0} registered
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/registrations/${eventId}`)}
                          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          Registrations
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(eventId, event.title)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
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

export default AdminDashboard;
