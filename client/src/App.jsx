import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Signup from './pages/signup';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/profile';
import MyEvents from './pages/myEvents';
import Register from './pages/Register';
import Registrations  from './pages/Registrations';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myEvents" element={<MyEvents />} />
        <Route path="/register/:eventId" element={<Register />} />
        <Route path="/registrations/:eventId" element={<Registrations />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
