import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/signup'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const Profile = lazy(() => import('./pages/profile'));
const MyEvents = lazy(() => import('./pages/myEvents'));
const Register = lazy(() => import('./pages/Register'));
const Registrations = lazy(() => import('./pages/Registrations'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading page…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/myEvents" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/register/:eventId" element={<Register />} />
            <Route path="/registrations/:eventId" element={<Registrations />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Chatbot />
    </Router>
  );
}

export default App;
