import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { X, User, Lock, Trash2, KeyRound, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'edit' | 'settings';
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'edit'
}) => {
  const { user, logout, updateUserStats } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>(
    initialTab === 'settings' ? 'password' : 'profile'
  );

  // Edit Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Change Password State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delete Account State
  const [confirmText, setConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!isOpen) return null;

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileLoading(true);
    try {
      await api.put('/auth/update-profile', { name, email });
      await updateUserStats();
      setProfileMsg('Profile updated successfully!');
    } catch (err: any) {
      setProfileMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Send OTP for password change
  const handleSendPasswordOtp = async () => {
    setPasswordError('');
    setPasswordMsg('');
    setPasswordLoading(true);
    try {
      await api.post('/auth/send-otp', { email: user?.email });
      setOtpSent(true);
      setPasswordMsg('Verification OTP dispatched to your email inbox.');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Change Password Submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    setPasswordError('');
    setPasswordMsg('');
    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', {
        email: user?.email,
        otp,
        newPassword
      });
      setPasswordMsg('Password changed successfully!');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpSent(false);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password. Please check OTP code.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete Account Submit
  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') return;
    setDeleteError('');
    setDeleteLoading(true);
    try {
      await api.delete('/auth/delete-account');
      onClose();
      logout();
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#090D1A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-black tracking-tight text-white">Account Settings & Preferences</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800 flex gap-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'profile' ? 'bg-[#090D1A] text-sky-400 border-t border-x border-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'password' ? 'bg-[#090D1A] text-indigo-400 border-t border-x border-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'danger' ? 'bg-[#090D1A] text-rose-400 border-t border-x border-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-white">
          
          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-black mb-1">Personal Details</h3>
                <p className="text-xs text-slate-400">Update your account name and registered email address.</p>
              </div>

              {profileMsg && (
                <div className={`p-3.5 rounded-xl text-xs font-bold text-center ${profileMsg.includes('success') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                  {profileMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-sky-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-sky-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-3.5 px-6 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <span>{profileLoading ? 'Saving Profile...' : 'Save Profile Details'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD (OTP VERIFIED) */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-black mb-1">Security & Password</h3>
                <p className="text-xs text-slate-400">Verification OTP will be sent to <span className="text-sky-400 font-bold">{user?.email}</span> to confirm ownership.</p>
              </div>

              {passwordMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                  {passwordMsg}
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
                  {passwordError}
                </div>
              )}

              {!otpSent ? (
                <div className="pt-2 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-300">Click below to request a security verification code sent directly to your email inbox.</p>
                  <button
                    type="button"
                    onClick={handleSendPasswordOtp}
                    disabled={passwordLoading}
                    className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <span>{passwordLoading ? 'Sending Verification Code...' : 'Send Verification OTP to Email'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Verification Code (OTP)</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full tracking-[0.4em] text-center text-lg font-black py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{passwordLoading ? 'Updating Password...' : 'Verify OTP & Update Password'}</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: DANGER ZONE (DELETE ACCOUNT) */}
          {activeTab === 'danger' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-rose-400 mb-1">Permanent Account Deletion</h4>
                  <p className="text-xs text-rose-300/80 leading-relaxed">
                    This action is permanent and cannot be undone. All your submissions, streak history, solution notes, and benchmarks will be erased permanently.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
                  {deleteError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Type <span className="text-rose-400 font-mono font-black select-all px-1.5 py-0.5 bg-rose-500/10 rounded">DELETE MY ACCOUNT</span> below to confirm:
                  </label>
                  <input
                    type="text"
                    placeholder="DELETE MY ACCOUNT"
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-white focus:outline-none focus:border-rose-500 transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== 'DELETE MY ACCOUNT' || deleteLoading}
                  className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleteLoading ? 'Deleting Account...' : 'Permanently Delete My Account'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
