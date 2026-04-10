import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Signup from './pages/signup';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/profile';
import MyEvents from './pages/myEvents';
import Register from './pages/Register';
import Registrations  from './pages/Registrations';
import NotFound from './pages/NotFound';
import Chatbot from './components/Chatbot';
import Dashboard  from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
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
      </ErrorBoundary>
      <Chatbot />
    </Router>
  );
}

export default App;
