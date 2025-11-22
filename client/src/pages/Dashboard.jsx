import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Preloader from "../components/Preloader";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    API.get("/events/registrations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setRegs(res.data))
      .catch((err) => {
        console.error("Failed to fetch registrations:", err);
        setRegs([]);
      })
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [navigate]);

  if (loading) return <Preloader />;

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Registered Events</h1>
          <p className="text-gray-600">View all the events you've registered for</p>
        </div>
        
        {regs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Registrations Yet</h3>
            <p className="text-gray-500">You haven't registered for any events. Browse events to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regs.map((r) => (
              <div key={r._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {r.eventId?.image && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={`http://localhost:5000/${r.eventId.image}`} 
                      alt={r.eventId.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {r.eventId?.title || "Event Removed"}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {r.eventId?.description || "This event has been removed."}
                  </p>
                  
                  {r.eventId && (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(r.eventId.date)}</span>
                        </div>
                        
                        {r.eventId.cost !== undefined && (
                          <div className="flex items-center text-sm text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">
                              {r.eventId.cost === 0 ? 'Free' : `₹${r.eventId.cost}`}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-xs text-gray-500 mb-1">Registered on</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {new Date(r.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
