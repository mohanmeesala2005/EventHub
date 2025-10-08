import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';

const Login = () => {
  const [form, setForm] = useState({username:'', email: '', password: '' });
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  if(loading) return <Preloader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-700 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-3 rounded-lg shadow">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <a href='/signup' className='text-blue-600 hover:underline'>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;