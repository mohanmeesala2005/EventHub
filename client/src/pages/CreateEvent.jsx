import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
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

    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('cost', formData.cost || 0);
    data.append('createdBy', user.id || user._id);
    data.append('createdByName', user.username);
    data.append('createdByEmail', user.email);
    if (image) {
      data.append('image', image);
    }

    try {
      
      if (!token) {
        setMessage('Invalid token. Please login again.');
        return;
      }
      if(formData.date < new Date().toISOString().split('T')[0]){
        setMessage('Event date cannot be in the past.');
        return;
      }
      const response = await API.post('/events/create', data ,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type'
          : 'multipart/form-data',
        }
      });
      if (response.status === 201) {
        alert('Event created successfully!');
        setFormData({ title: '', description: '', date: '', cost: '' });
        setImage(null);
        setMessage('');
        navigate('/myEvents');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200">
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
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-800 transition text-lg"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;