import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', username: '' });

    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFormData(parsedUser);
            }
        } catch (error) {
            localStorage.removeItem('user');
        }
    }, []);

    if (!user) {
        return (
            <div className="p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-16">
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">Profile Not Found</h1>
                <p className="text-red-600 text-center">You need to be logged in to view this page.</p>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        localStorage.setItem('user', JSON.stringify(formData));
        setUser(formData);
        setIsEditing(false);
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center">
                <div className="bg-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold mb-4 shadow-lg border-4 border-white">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>

                {isEditing ? (
                    <div className="w-full space-y-4">
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="w-full px-3 py-2 border rounded-lg" />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full px-3 py-2 border rounded-lg" />
                        <div className="flex gap-2">
                            <button onClick={handleSaveProfile} className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1">Save</button>
                            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-extrabold mb-2 text-gray-800">{user.username}</h1>
                        <p className="mb-1 text-lg text-gray-700"><strong>Name:</strong> {user.name}</p>
                        <p className="mb-4 text-lg text-gray-700"><strong>Email:</strong> {user.email}</p>
                        <div className="space-y-2">
                            <button onClick={() => navigate('/myEvents')} className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">View Your Events</button>
                            <button onClick={() => navigate('/create-event')} className="w-full text-white bg-purple-700 px-4 py-2 rounded-lg hover:bg-purple-800 transition">Add Events</button>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(true)} className="flex-1 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition">Edit Profile</button>
                                <button onClick={handleLogout} className="flex-1 bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition">Logout</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;