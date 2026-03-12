import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)] glass-panel p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-2xl">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
        </div>
        
        <h2 className="text-center text-2xl font-semibold text-slate-100 mb-2">Reset Password</h2>
        <p className="text-center text-slate-400 text-sm mb-6 mt-2 pb-6 border-b border-slate-700/50">Enter your email address and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="form-label">Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="name@example.com" 
              {...register('email', { required: 'Email is required' })} 
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-slate-700/50">
          <span className="text-sm text-slate-400">Remember your password?</span>
          <br/>
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors mt-2 inline-block">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
