import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import API from '../api/axios';
import { saveAuthInStorage } from '../utils/auth';
import Preloader from '../components/Preloader';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Dialog from '../components/Dialog';
import { useNavigate } from 'react-router-dom';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[0-9]/, 'Password must contain at least one number').regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const signupSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: passwordSchema,
});

const getPasswordStrength = (password = '') => {
  const checks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
    { label: 'Special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((item) => item.valid).length;
  const status = score >= 4 ? 'Strong' : score >= 2 ? 'Medium' : 'Weak';

  return { checks, score, status };
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<any>({ isOpen: false, title: '', message: '', showCancel: false, confirmText: 'Ok', cancelText: 'Cancel', onConfirm: null, onCancel: null });

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ resolver: zodResolver(signupSchema), defaultValues: { username: '', name: '', email: '', password: '' }, mode: 'onChange', reValidateMode: 'onChange' });

  const passwordValue = watch('password');
  const passwordStrength = getPasswordStrength(passwordValue);

  const closeDialog = () => setDialogConfig((prev: any) => ({ ...prev, isOpen: false }));

  const handleDialogConfirm = () => { dialogConfig.onConfirm?.(); closeDialog(); };
  const handleDialogCancel = () => { dialogConfig.onCancel?.(); closeDialog(); };
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', data);
      saveAuthInStorage({ token: res.data.token, user: res.data.user });
      navigate('/');
    } catch (err: any) {
      setDialogConfig({ isOpen: true, title: 'Registration Failed', message: err.response?.data?.message || 'Registration failed', showCancel: false, confirmText: 'Ok' });
    } finally {
      setTimeout(() => { setLoading(false); }, 500);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-700 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput label="Username" name="username" placeholder="Username" inputProps={{ ...register('username') }} error={errors.username} required />
          <FormInput label="Name" name="name" placeholder="Name" inputProps={{ ...register('name') }} error={errors.name} required />
          <FormInput label="Email" name="email" type="email" placeholder="Email" inputProps={{ ...register('email') }} error={errors.email} required />
          <FormInput label="Password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" inputProps={{ ...register('password') }} error={errors.password} className="pr-10" required>
            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none text-sm font-medium">{showPassword ? 'Hide' : 'Show'}</button>
          </FormInput>
          {passwordValue && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="mb-2 font-medium">Password strength: <span className={passwordStrength.status === 'Strong' ? 'text-green-600' : passwordStrength.status === 'Medium' ? 'text-amber-600' : 'text-red-600'}>{passwordStrength.status}</span></div>
              <ul className="space-y-1">{passwordStrength.checks.map((item) => (<li key={item.label} className={item.valid ? 'text-green-600' : 'text-red-600'}>{item.valid ? '✓' : '✕'} {item.label}</li>))}</ul>
            </div>
          )}
          <Button type="submit" variant="primary" fullWidth disabled={!isValid || loading}>Register</Button>
        </form>
        <p className="mt-4 text-center text-gray-600">Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></p>
      </div>
      <Dialog isOpen={dialogConfig.isOpen} title={dialogConfig.title} message={dialogConfig.message} confirmText={dialogConfig.confirmText} cancelText={dialogConfig.cancelText} showCancel={dialogConfig.showCancel} onConfirm={handleDialogConfirm} onCancel={handleDialogCancel} />
    </div>
  );
};

export default SignUp;
