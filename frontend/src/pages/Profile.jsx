import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faSpinner, faUserCog } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
    }
  });

  const [imagePreview, setImagePreview] = useState(currentUser.profile_image ? `http://localhost:5000${currentUser.profile_image}` : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      if (file) {
        formData.append('profile_image', file);
      }

      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully!');
      
      if (response.data.profile_image) {
          setImagePreview(`http://localhost:5000${response.data.profile_image}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 mt-8 animate-[fade_0.4s_ease-out]">
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(138,43,226,0.1)]">
              <FontAwesomeIcon icon={faUserCog} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Account Settings</h2>
             <p className="text-slate-400 text-sm mt-0.5">Manage your profile information and preferences</p>
           </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-8 mb-10 pb-8 border-b border-white/10">
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 rounded-full border-2 border-dashed border-slate-500 hover:border-purple-400 flex items-center justify-center overflow-hidden cursor-pointer bg-white/5 transition-all group relative shadow-xl"
                onClick={() => document.getElementById('profileImage').click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}} />
                ) : (
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-slate-400 group-hover:text-purple-400 transition-colors" />
                )}
                
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="text-xl text-white mb-1" />
                  <span className="text-[10px] text-white uppercase tracking-wider font-semibold">Update Photo</span>
                </div>
                
                <input 
                  type="hidden" 
                  id="profileImage" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-4">Avatar</p>
            </div>
            
            <div className="flex-1 w-full space-y-5">
              <div>
                 <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Account Privileges</label>
                 <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${
                      currentUser.role === 'Admin' 
                        ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(138,43,226,0.15)]' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {currentUser.role.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 italic">Role is locked by administrators.</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="form-label">Full Name</label>
              <input 
                className="input-field" 
                {...register('name', { required: 'Name is required' })} 
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input 
                className="input-field" 
                type="email" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })} 
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button type="submit" className="btn-primary w-full sm:w-auto px-8" disabled={loading}>
              {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : null}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
