import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <Link to="/dashboard" className="text-xl font-bold tracking-tight text-white flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
          <FontAwesomeIcon icon={faCube} className="text-white text-sm" />
        </div>
        MyApp
      </Link>
      <div className="flex gap-4 md:gap-6 items-center">
        <Link 
          to="/dashboard" 
          className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Directory
        </Link>
        <Link 
          to="/profile" 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${location.pathname === '/profile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <img src={user.profile_image ? `http://localhost:5000${user.profile_image}` : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} className="w-6 h-6 rounded-full border border-slate-600" />
          <span className="text-sm font-medium hidden md:block">{user.name || 'Profile'}</span>
        </Link>
        <div className="w-px h-6 bg-slate-700 mx-2"></div>
        <button 
          onClick={handleLogout} 
          className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
          title="Logout"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
