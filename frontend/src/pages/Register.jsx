import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (file) {
        formData.append('profile_image', file);
      }

      await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowVerificationModal(true);
      toast.success('Registration successful! Check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationModal) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-md animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)] glass-panel p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Check Your Email</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            We've sent an email verification link to your registered email address. 
            Before you can login and access the dashboard, you will need to click the link inside that email.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn-primary"
          >
            I understand, Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)] glass-panel p-8">
        <h2 className="text-center text-2xl font-semibold text-slate-100 mb-6 relative">
          Create an Account
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-purple-500 rounded-full"></span>
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-24 h-24 rounded-full border-2 border-dashed border-slate-500 hover:border-purple-400 flex items-center justify-center overflow-hidden cursor-pointer bg-white/5 transition-all mb-2 group relative"
              onClick={() => document.getElementById('profileImage').click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-2xl text-slate-400 group-hover:text-purple-400 transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white uppercase tracking-wider font-semibold">Upload</span>
              </div>
              <input 
                type="file" 
                id="profileImage" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
            <p className="text-xs text-slate-400">Profile Picture (Optional)</p>
          </div>

          <div className="mb-5">
            <label className="form-label">Full Name</label>
            <input 
              className="input-field" 
              placeholder="e.g. John Doe" 
              {...register('name', { required: 'Name is required' })} 
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="mb-5">
            <label className="form-label">Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="name@example.com" 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })} 
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="mb-6">
            <label className="form-label">Password</label>
            <input 
              className="input-field" 
              type="password" 
              placeholder="Min. 6 characters" 
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' }
              })} 
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-400 mt-6 pt-6 border-t border-slate-700/50">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors ml-1">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
