import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the URL.');
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Your email has been successfully verified! You can now login.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)] glass-panel p-8 text-center relative overflow-hidden">
        
        {status === 'loading' && (
           <div className="py-8">
             <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-purple-400 mb-6" />
             <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Verifying...</h2>
             <p className="text-slate-400 text-sm">{message}</p>
           </div>
        )}

        {status === 'success' && (
           <div className="py-4">
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center text-5xl mb-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
               <FontAwesomeIcon icon={faCheckCircle} />
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Email Verified!</h2>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">{message}</p>
             <Link to="/login" className="btn-primary">
               Proceed to Login
             </Link>
           </div>
        )}

        {status === 'error' && (
           <div className="py-4">
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center text-5xl mb-6 shadow-[0_0_20px_rgba(248,113,113,0.2)]">
               <FontAwesomeIcon icon={faTimesCircle} />
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Verification Failed</h2>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">{message}</p>
             <Link to="/register" className="btn-secondary">
               Back to Registration
             </Link>
           </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
