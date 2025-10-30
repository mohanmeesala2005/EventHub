import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        name: parsed?.name || localStorage.getItem('name') || '',
        email: parsed?.email || localStorage.getItem('email') || '',
      };
    }
  } catch {}
  return {
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
  };
};

const Register = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const storedUser = getStoredUser();
  const [form, setForm] = useState({
    name: storedUser.name,
    email: storedUser.email,
    phone: '',
    paymentId: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/events/getevent')
      .then(res => {
        const found = res.data.find(ev => ev._id === eventId);
        setEvent(found);
      })
      .catch(() => setMessage('Failed to load event details'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events/register', {
        eventId,
        ...form,
      });
      setMessage('Registered successfully!');
      navigate('/events');
      setTimeout(() => {
        setLoading(true);
      }, 2000);
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  if (!event) return <div className="p-6 text-center text-gray-500">Loading event details...</div>;
  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-extrabold mb-2 text-blue-700 text-center">Register for {event.title}</h1>
        <p className="mb-6 text-gray-600 text-center">{event.description}</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder={storedUser.name || 'Your Name'}
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            readOnly
          />
          <input
            name="email"
            type="email"
            placeholder={storedUser.email || 'Your Email'}
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            readOnly
          />
          <input
            name="phone"
            type="text"
            placeholder="Your Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {event.cost > 0 ? (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Registration Fee: <span className="text-blue-700 font-bold">₹{event.cost}</span>
              </label>
              <input
                name="paymentId"
                type="text"
                placeholder="Payment Transaction ID"
                value={form.paymentId || ''}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ) : null}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-3 rounded-lg shadow"
          >
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default Register;