import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white px-4 py-10">
      <div className="max-w-2xl text-center rounded-3xl border border-slate-700 bg-slate-950/95 p-10 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">404 error</p>
        <h1 className="mt-4 text-5xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-300 leading-relaxed">
          The page you are looking for does not exist or has been moved. Use the button below to return to the dashboard.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
