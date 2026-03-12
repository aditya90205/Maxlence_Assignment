import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrashAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'Admin';

  const fetchUsers = async (currentPage, searchQuery) => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${currentPage}&limit=2&search=${searchQuery}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(page, search);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade_0.4s_ease-out]">
      
      {isAdmin && (
        <div className="mb-6 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
             <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <div>
            <h3 className="text-white font-medium">Administrator Access</h3>
            <p className="text-sm text-purple-200/70">You have enhanced permissions. You can permanently delete user accounts.</p>
          </div>
        </div>
      )}

      <div className="glass-panel p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Organization Members</h2>
            <p className="text-slate-400 text-sm mt-1">Manage and view all registered users across the platform.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              className="input-field pl-11 !rounded-full !py-2.5" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
             <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
             Loading directory...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-slate-700/30 border-dashed">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-slate-300 font-medium font-lg">No members found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user, idx) => (
              <div key={user.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-purple-500/30 rounded-xl transition-all duration-300" style={{ animationDelay: `${idx * 50}ms`, animation: `slideUp 0.4s ease-out forwards` }}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={user.profile_image ? `http://localhost:5000${user.profile_image}` : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-purple-500/50 transition-colors" 
                      onError={(e)=>{e.target.src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}}
                    />
                    {user.role === 'Admin' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border border-purple-500/30">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-[10px] text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold text-[15px] flex items-center gap-2">
                       {user.name} 
                       {user.id === currentUser.id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 uppercase tracking-widest font-bold">You</span>}
                    </h3>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 pl-16 sm:pl-0">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold tracking-wide ${
                    user.role === 'Admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                  
                  {/* Action Area */}
                  <div className="w-8 flex justify-end">
                    {isAdmin && user.id !== currentUser.id && (
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 border-t border-slate-700/50 pt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
