import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { invalidateEventsCache } from '../api/axios';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { getCurrentUser } from '../utils/auth';

type EventForm = {
  title: string;
  description: string;
  date: string;
  cost: string;
  image: File | null;
};

const initialForm: EventForm = {
  title: '',
  description: '',
  date: '',
  cost: '0',
  image: null,
};

const CreateEvent: React.FC = () => {
  const [form, setForm] = useState<EventForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  const imagePreview = useMemo(() => {
    if (!form.image) return '';
    return URL.createObjectURL(form.image);
  }, [form.image]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, image: event.target.files?.[0] || null }));
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.description.trim() || !form.date) {
      setError('Please fill in the title, description, and date before publishing.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('date', new Date(form.date).toISOString());
    formData.append('cost', form.cost || '0');
    if (form.image) formData.append('image', form.image);

    setLoading(true);
    try {
      await API.post('/events/create', formData);
      invalidateEventsCache();
      setSuccess('Event published successfully.');
      setForm(initialForm);
      window.setTimeout(() => navigate('/events'), 900);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">Organizer Workspace</p>
            <h1 className="mt-2 text-4xl font-bold">Create Event</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Publish a clear event listing with the details attendees need before they register.
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/events')}>
            View Events
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <form onSubmit={handleCreate} className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Event Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Tech meetup, workshop, concert..."
                required
                wrapperClassName="sm:col-span-2"
                className="bg-white text-slate-900"
              />

              <FormInput
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                required
                className="bg-white text-slate-900"
              />

              <FormInput
                label="Registration Fee"
                name="cost"
                type="number"
                value={form.cost}
                onChange={handleChange}
                placeholder="0"
                inputProps={{ min: 0, step: '0.01' }}
                className="bg-white text-slate-900"
              />

              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-200">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  required
                  placeholder="Share the agenda, audience, venue, and anything attendees should prepare."
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="image" className="mb-1 block text-sm font-medium text-slate-200">
                  Event Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-500"
                />
              </div>
            </div>

            {error && <div className="mt-5 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-100">{error}</div>}
            {success && <div className="mt-5 rounded-xl border border-green-500 bg-green-500/10 p-4 text-green-100">{success}</div>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Publishing as {user?.username || user?.name || 'your account'}
              </p>
              <Button type="submit" disabled={loading} className="sm:min-w-40">
                {loading ? 'Publishing...' : 'Publish Event'}
              </Button>
            </div>
          </form>

          <aside className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Preview</p>
            <div className="mt-4 overflow-hidden rounded-xl bg-white text-slate-900">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Event preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-slate-500">Event Image</span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-2xl font-bold">{form.title || 'Your event title'}</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {form.date ? new Date(form.date).toLocaleString() : 'Choose a date and time'}
                </p>
                <p className="mt-4 line-clamp-5 text-slate-600">
                  {form.description || 'Write a helpful event description so attendees know what to expect.'}
                </p>
                <div className="mt-5 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {Number(form.cost) > 0 ? `Registration Fee: Rs ${form.cost}` : 'Free Registration'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
