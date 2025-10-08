import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    let user = null;
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            user = JSON.parse(userData);
        }
    } catch (error) {
        localStorage.removeItem('user');
    }
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
        window.location.href = '/'; // Redirect to home page
    }
    const navigate = useNavigate();
    return (
        <div className="max-w-md mx-auto mt-16 bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center">
                <div className="bg-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold mb-4 shadow-lg border-4 border-white">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <h1 className="text-3xl font-extrabold mb-2 text-gray-800">{user.username}</h1>
                <p className="mb-1 text-lg text-gray-700"><strong>Name:</strong> {user.name}</p>
                <p className="mb-4 text-lg text-gray-700"><strong>Email:</strong> {user.email}</p>
                <div>
                    <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        onClick={() => window.location.href='/myEvents'}
                    >
                        View Your Events
                    </button>
                </div>
                <div>
                    <button className="text-white bg-purple-700 px-4 py-2 rounded-lg my-2" onClick={() => navigate('/create-event')}>
                        Add Events
                    </button>
                </div>
                <div className="flex gap-4 mt-4">
                    <div>
                    
                    <button
                        className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-900 transition" 
                    >
                        Edit Your Profile
                    </button>
                    </div>
                    <div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;