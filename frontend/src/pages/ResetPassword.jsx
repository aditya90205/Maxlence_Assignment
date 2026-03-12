import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faLock } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: data.password
      });
      toast.success(response.data.message + ". Redirecting...");
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-md glass-panel p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 mx-auto flex items-center justify-center text-3xl mb-4">
            !
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-2">Invalid Link</h2>
          <p className="text-slate-400 mt-2">No reset token provided in the URL or the link has expired.</p>
          <Link to="/forgot-password" className="btn-primary mt-6 inline-flex w-auto mt-6">Request New Link</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)] glass-panel p-8">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-2xl">
            <FontAwesomeIcon icon={faLock} />
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold text-slate-100 mb-6">Set New Password</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="form-label">New Password</label>
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
             {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Secure My Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
