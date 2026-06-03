import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import Preloader from '../components/Preloader';
import Button from '../components/Button';

const Register: React.FC = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await API.post(`/events/${eventId}/register`);
      // handle success
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">Register for Event</h2>
        <Button onClick={handleRegister}>Register</Button>
      </div>
    </div>
  );
};

export default Register;
