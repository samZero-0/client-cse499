'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';
import useAxios from '@/hooks/useAxios';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, login } = useContext(AuthContext); // We use login to update context state if needed
  const axios = useAxios();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Load user data into form when page loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match! ⚠️");
      return;
    }

    try {
      const updateData = {
          name: formData.name,
          email: formData.email
      };
      if (formData.password) updateData.password = formData.password;

      const { data } = await axios.put('/users/profile', updateData);
      
      toast.success('Profile updated successfully! ✅');
      setIsEditing(false);
      
      // Update local storage and context manually if needed, or just reload
      // A quick hack to refresh context is reloading, or exposing a setUser method in AuthContext
      window.location.reload(); 

    } catch (error) {
      console.error(error);
      toast.error('Update failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Background */}
          <div className="h-32 bg-green-600 relative"></div>
          
          {/* Avatar & Info */}
          <div className="px-8 pb-8">
            <div className="relative -top-12 mb-4 flex justify-between items-end">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-500">
                        <FaUser />
                    </div>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm">
                        <FaEdit /> Edit Profile
                    </Button>
                )}
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
            </div>

            {/* FORM SECTION */}
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FaUser className="text-gray-400"/> Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            disabled={!isEditing}
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-green-300 bg-white text-gray-900' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FaEnvelope className="text-gray-400"/> Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-green-300 bg-white text-gray-900' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                        />
                    </div>

                    {/* Password Section (Only show when editing) */}
                    {isEditing && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 animate-fade-in">
                            <h3 className="text-sm font-bold text-yellow-800 mb-3">Change Password (Optional)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 pt-4 border-t">
                            <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                                <FaSave /> Save Changes
                            </Button>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}