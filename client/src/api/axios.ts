import axios, { type AxiosRequestHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getTokenFromStorage } from '../utils/auth';

export const API_BASE_URL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

let cachedEvents: any = null;
let eventsRequest: Promise<AxiosResponse<any>> | null = null;

export const fetchEvents = (): Promise<AxiosResponse<any>> => {
  if (cachedEvents) {
    return Promise.resolve({ data: cachedEvents } as AxiosResponse<any>);
  }

  if (eventsRequest) {
    return eventsRequest;
  }

  eventsRequest = API.post('/events/getevent')
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

export const invalidateEventsCache = (): void => {
  cachedEvents = null;
  eventsRequest = null;
};

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getTokenFromStorage();

  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
