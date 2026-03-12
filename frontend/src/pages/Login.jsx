import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', data);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/google', { credential: credentialResponse.credential });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = () => {
    toast.error('Google Sign In failed');
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)] glass-panel p-8">
        <h2 className="text-center text-2xl font-semibold text-slate-100 mb-2 relative inline-block left-1/2 -translate-x-1/2 pb-2">
          Welcome Back
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-purple-500 rounded-full"></span>
        </h2>
        <p className="text-center text-slate-400 text-sm mb-6 mt-2">Enter your credentials to access your account</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="form-label">Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="name@example.com" 
              {...register('email', { required: 'Email is required' })} 
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="form-label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">Forgot Password?</Link>
            </div>
            <input 
              className="input-field" 
              type="password" 
              placeholder="••••••••" 
              {...register('password', { required: 'Password is required' })} 
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-primary mb-6" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Secure Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="px-4 text-xs font-semibold text-slate-500 tracking-wider">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <div className="flex justify-center w-full">
           <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="continue_with"
           />
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-6 pt-6 border-t border-slate-700/50">
          Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
