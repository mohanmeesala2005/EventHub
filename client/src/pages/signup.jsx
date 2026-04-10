import React, { useState } from "react";
import API from "../api/axios";
import Preloader from "../components/Preloader";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setDialogConfig({
        isOpen: true,
        title: 'Registration Failed',
        message: err.response?.data?.message || 'Registration failed',
        showCancel: false,
        confirmText: 'Ok',
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-700 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <FormInput
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormInput
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormInput
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="pr-10"
          >
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none text-sm font-medium"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </FormInput>
          <Button type="submit" variant="primary" fullWidth>
            Register
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
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
};

export default SignUp;
