import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { getCurrentUser, isAuthenticated } from '../utils/auth';
import Button from '../components/Button';
import Dialog from '../components/Dialog';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    cost: '',
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    showCancel: false,
    confirmText: 'Ok',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  });

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDialogConfirm = () => {
    dialogConfig.onConfirm?.();
    closeDialog();
  };

  const handleDialogCancel = () => {
    dialogConfig.onCancel?.();
    closeDialog();
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !isAuthenticated()) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating event...');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('cost', formData.cost || 0);
    if (image) {
      data.append('image', image);
    }

    try {
      if (formData.date < new Date().toISOString().split('T')[0]){
        setMessage('Event date cannot be in the past.');
        return;
      }
      const response = await API.post('/events/create', data);
      if (response.status === 201) {
        setDialogConfig({
          isOpen: true,
          title: 'Success',
          message: 'Event created successfully!',
          confirmText: 'Continue',
          showCancel: false,
          onConfirm: () => {
            setFormData({ title: '', description: '', date: '', cost: '' });
            setImage(null);
            setMessage('');
            navigate('/myEvents');
          },
        });
      } else {
        setMessage('Failed to create event.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Error: ${error.response.data.message}`);
        console.log(error);
      } else {
        setMessage('Network or server error. Try again.');
        console.error('Error creating event:', error);
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white shadow-2xl rounded-2xl p-15 w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6 text-center drop-shadow">
          Create Event
        </h1>
        {message && (
          <div className="mb-4 px-4 py-2 bg-red-100 border border-red-300 text-red-700 rounded text-center">
            {message}
          </div>
        )}
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Event Name
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition" placeholder="Enter event name" required/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition resize-none"
              rows={4}
              placeholder="Describe your event"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Amount for regestration₹(Optional)
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Event Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition bg-white"
            />
            {image && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-12 w-12 object-cover rounded shadow"
                />
                <span className="text-xs text-gray-500">{image.name}</span>
              </div>
            )}
          </div>
          <Button type="submit" variant="purple" fullWidth size="lg">
            Create Event
          </Button>
        </form>
      </div>
      <Dialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        showCancel={dialogConfig.showCancel}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
}

export default CreateEvent;