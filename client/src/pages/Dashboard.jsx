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
    API.get("/events/my-registrations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setRegs(res.data))
      .catch(() => setRegs([]))
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [navigate]);

  if (loading) return <Preloader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
      {regs.length === 0 ? (
        <div>No registrations found.</div>
      ) : (
        regs.map((r) => (
          <div key={r._id} className="p-4 mb-3 bg-white rounded shadow">
            <h2 className="font-semibold">
              {r.eventId?.title || "Event removed"}
            </h2>
            <p className="text-sm text-gray-600">{r.eventId?.description}</p>
            <div className="text-sm text-gray-500">
              Registered on: {new Date(r.createdAt).toLocaleString()}
            </div>
            <div className="mt-2 text-sm">
              Contact: {r.name} • {r.email} {r.phone && `• ${r.phone}`}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
