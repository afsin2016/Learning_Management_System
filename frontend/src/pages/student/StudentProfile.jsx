import React, { useState } from 'react';
import { User, Lock, Mail, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      setSavingProfile(true);
      const res = await api.put('/auth/profile', {
        name,
        avatar,
        headline,
        bio,
      });
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your public profile information, avatar, and account security.
        </p>
      </div>

      {/* Profile Info Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" /> Public Profile
        </h2>

        {profileMsg.text && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              profileMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {profileMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 pb-2">
            <img
              src={
                avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
              }
              alt="Avatar preview"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Aspiring Full Stack Engineer"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your background and goals..."
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" /> Security & Password
        </h2>

        {passwordMsg.text && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {savingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
