import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Registrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch event details
    API.post('/events/getevent')
      .then(res => {
        const found = res.data.find(ev => ev._id === eventId);
        setEvent(found);
      })
      .catch(() => {});

    // Fetch registrations for this event
    API.get(`/events/registrations/${eventId}`)
      .then(res => setRegistrations(res.data))
      .catch(() => {});
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 py-8">
      <div className="p-8 max-w-2xl mx-auto bg-slate-800 rounded-xl shadow-lg">
      <button className="mb-4 text-blue-400 hover:text-blue-300 underline" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold mb-2 text-white">Registrations for {event?.title || 'Event'}</h1>
      <p className="mb-4 text-slate-300">{event?.description}</p>
      {registrations.length === 0 ? (
        <p className="text-slate-400">No registrations yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className='p-2 border'>Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg._id}>
                <td className="p-2 border">{reg.name}</td>
                <td className="p-2 border">{reg.email}</td>
                <td className="p-2 border">{reg.phone}</td>
                <td className="p-2 border">{reg.paymentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

export default Registrations;