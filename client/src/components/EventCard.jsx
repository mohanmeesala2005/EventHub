import React from "react";
import { API_BASE_URL } from "../api/axios";
import Button from "./Button";

const EventCard = ({ event, user, navigate, onDelete }) => {
  const imageUrl = event.image
    ? `${API_BASE_URL}/${event.image.replace(/\\/g, "/")}`
    : null;

  return (
    <div className="border p-5 rounded-2xl shadow-xl bg-white flex flex-col transition-transform hover:scale-105 hover:shadow-2xl duration-300">
      <div className="mb-4 h-44 w-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Event"
            className="object-cover h-full w-full"
          />
        ) : (
          <span className="text-gray-400">Event Image</span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-700 mb-1 truncate">{event.title}</h3>
      <p className="text-sm text-gray-500 mb-2">
        By <span className="font-semibold">{event.createdByName || "Unknown"}</span>
      </p>
      <p className="text-gray-600 flex-1 mb-2 line-clamp-3">{event.description}</p>
      {event.cost > 0 ? (
        <p className="text-gray-600 flex-1 mb-2 line-clamp-3">
          Registration Fee: ₹{event.cost}
        </p>
      ) : null}
      <p className="text-xs text-gray-400 mb-3">{new Date(event.date).toLocaleString()}</p>

      <div className="flex gap-2">
        {event.createdByName !== user?.username && user ? (
          <Button
            variant="purple"
            size="md"
            className="flex-1"
            onClick={() => navigate(`/register/${event.ID}`)}
          >
            Register
          </Button>
        ) : (
          <span className="text-xs text-green-600 font-semibold mt-2">
            {user ? "Your Event" : ""}
          </span>
        )}

        {user?.role === "admin" && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(event.ID, event.title)}
            title="Delete Event (Admin)"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
