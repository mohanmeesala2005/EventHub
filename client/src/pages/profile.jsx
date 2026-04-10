import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import FormInput from "../components/FormInput";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });
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
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData(parsedUser);
      }
    } catch (error) {
      localStorage.removeItem("user");
    }
  }, []);

  if (!user) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-16">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">
          Profile Not Found
        </h1>
        <p className="text-red-600 text-center">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.post("/auth/update", {
        name: formData.name,
        username: formData.username,
      });

      if (response.status === 200) {
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setDialogConfig({
          isOpen: true,
          title: 'Profile Saved',
          message: 'Profile updated successfully!',
          showCancel: false,
          confirmText: 'Ok',
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setDialogConfig({
        isOpen: true,
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update profile',
        showCancel: false,
        confirmText: 'Ok',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="bg-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold mb-4 shadow-lg border-4 border-white">
          {user.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>

        {isEditing ? (
          <div className="w-full space-y-4">
            <FormInput
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
            <FormInput
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <FormInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <div className="flex gap-2">
              <Button
                variant="success"
                size="md"
                className="flex-1"
                onClick={handleSaveProfile}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
              {user.username}
            </h1>
            <p className="mb-1 text-lg text-gray-700">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="mb-4 text-lg text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <div className="space-y-2">
              <Button
                fullWidth
                variant="success"
                size="md"
                onClick={() => setIsEditing(true)}
              >
                Edit Your Profile
              </Button>
              <Button
                fullWidth
                variant="danger"
                size="md"
                onClick={handleLogout}
              >
                LogOut
              </Button>
            </div>
          </>
        )}
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
    </div>
  );
};

export default Profile;
