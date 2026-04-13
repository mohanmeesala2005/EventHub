import axios from "axios";
import { getTokenFromStorage } from "../utils/auth";

export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : "http://localhost:5000";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

let cachedEvents = null;
let eventsRequest = null;

export const fetchEvents = () => {
  if (cachedEvents) {
    return Promise.resolve({ data: cachedEvents });
  }

  if (eventsRequest) {
    return eventsRequest;
  }

  eventsRequest = API.post("/events/getevent")
    .then((res) => {
      cachedEvents = res.data;
      eventsRequest = null;
      return res;
    })
    .catch((err) => {
      eventsRequest = null;
      throw err;
    });

  return eventsRequest;
};

export const invalidateEventsCache = () => {
  cachedEvents = null;
  eventsRequest = null;
};

API.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
