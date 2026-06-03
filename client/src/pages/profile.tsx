import { getCurrentUser } from '../utils/auth';

const Profile = () => {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-200">
          <h2 className="text-2xl font-bold mb-4">Not logged in</h2>
          <p>Please log in to view your profile and event registrations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-white">
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
            <p className="text-slate-400">{user.role?.toUpperCase() || 'User'}</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-3 text-sm text-slate-300">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Contact</h2>
            <p className="text-slate-300"><span className="font-medium">Email:</span> {user.email}</p>
            <p className="text-slate-300 mt-2"><span className="font-medium">Username:</span> {user.username}</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Profile Summary</h2>
            <p className="text-slate-300">Role: <span className="font-medium text-white">{user.role || 'Member'}</span></p>
            <p className="text-slate-300 mt-2">Use your profile to review event details, registrations, and preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
