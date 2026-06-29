import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../lib/api';
import { 
  X, User, Lock, Trash2, KeyRound, CheckCircle2, AlertTriangle, 
  Globe, MapPin, Mail, FileText, Link2, Check, ExternalLink, ShieldCheck, 
  Sparkles, Shield, ChevronRight, Laptop
} from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'edit' | 'settings' | 'platforms';
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'edit'
}) => {
  const { user, logout, updateUserStats } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'platforms' | 'danger'>(
    initialTab === 'settings' ? 'security' : initialTab === 'platforms' ? 'platforms' : 'profile'
  );

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab === 'settings' ? 'security' : initialTab === 'platforms' ? 'platforms' : 'profile');
    }
  }, [isOpen, initialTab]);

  // Edit Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(() => localStorage.getItem('cf_bio') || 'Consistency is the forge. Discipline is the fuel.');
  const [location, setLocation] = useState(() => localStorage.getItem('cf_location') || 'India');
  const [website, setWebsite] = useState(() => localStorage.getItem('cf_website') || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Change Password State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Platform Links State inside Settings
  const [platformInput, setPlatformInput] = useState<{ [key: string]: string }>({
    LEETCODE: '',
    CODEFORCES: '',
    GEEKSFORGEEKS: '',
    HACKERRANK: '',
    CODECHEF: '',
    GITHUB: ''
  });
  const [platformLoading, setPlatformLoading] = useState<string | null>(null);
  const [platformMsg, setPlatformMsg] = useState<string | null>(null);

  // Pre-fetch existing platform handles when modal opens
  useEffect(() => {
    if (isOpen) {
      api.get<any[]>('/profile/platforms').then(res => {
        const inputState: { [key: string]: string } = {};
        res.data.forEach(p => {
          if (p.username) {
            inputState[p.platform] = p.username;
          }
        });
        setPlatformInput(prev => ({ ...prev, ...inputState }));
      }).catch(() => {});
    }
  }, [isOpen]);

  // Delete Account State
  const [confirmText, setConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!isOpen) return null;

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);
    try {
      await api.put('/auth/update-profile', { name, email });
      await updateUserStats();
      localStorage.setItem('cf_bio', bio);
      localStorage.setItem('cf_location', location);
      localStorage.setItem('cf_website', website);
      window.dispatchEvent(new Event('cf_profile_updated'));
      setProfileMsg({ type: 'success', text: 'Profile preferences updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile details.' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Send OTP for password change
  const handleSendPasswordOtp = async () => {
    setPasswordMsg(null);
    setPasswordLoading(true);
    try {
      await api.post('/auth/send-otp', { email: user?.email });
      setOtpSent(true);
      setPasswordMsg({ type: 'success', text: 'Verification code dispatched to your physical email inbox.' });
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP code.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Change Password Submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    setPasswordMsg(null);
    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', {
        email: user?.email,
        otp,
        newPassword
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully! Next login requires new credentials.' });
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpSent(false);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Invalid or expired verification code.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Platform Link Submit
  const handleLinkPlatformSubmit = async (platform: string) => {
    const handle = platformInput[platform];
    if (!handle || !handle.trim()) return;
    setPlatformLoading(platform);
    setPlatformMsg(null);
    try {
      await api.post('/profile/platforms/link', {
        platform,
        username: handle.trim()
      });
      setPlatformMsg(`Successfully connected ${platform} handle!`);
      window.dispatchEvent(new Event('cf_profile_updated'));
    } catch (err: any) {
      setPlatformMsg(err.response?.data?.message || err.response?.data?.detail || `Failed to connect ${platform}.`);
    } finally {
      setPlatformLoading(null);
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
      setDeleteError(err.response?.data?.message || 'Failed to complete account deletion.');
      setDeleteLoading(false);
    }
  };

  const navItems = [
    { id: 'profile', label: 'Public Profile', desc: 'Avatar, name, bio & location', icon: User, color: 'sky' },
    { id: 'security', label: 'Account & Security', desc: 'Password reset & verification', icon: Shield, color: 'indigo' },
    { id: 'platforms', label: 'Linked Accounts', desc: 'LeetCode, Codeforces & GitHub', icon: Link2, color: 'purple' },
    { id: 'danger', label: 'Danger Zone', desc: 'Permanent account deletion', icon: Trash2, color: 'rose' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      {/* Main Container */}
      <div className={`w-full max-w-4xl ${dark ? 'bg-[#0B0F19] text-white border-slate-800/80' : 'bg-white text-slate-900 border-slate-200'} border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[92vh] max-h-[680px] transition-all`}>
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className={`w-full md:w-72 border-b md:border-b-0 md:border-r ${dark ? 'border-slate-800/80 bg-[#080B14]' : 'border-slate-100 bg-slate-50/70'} flex flex-col flex-shrink-0`}>
          
          {/* Header User Summary */}
          <div className={`p-5 border-b ${dark ? 'border-slate-800/80' : 'border-slate-200/60'} flex items-center gap-3.5`}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg flex-shrink-0">
              <div className={`w-full h-full rounded-[14px] ${dark ? 'bg-[#0B0F19]' : 'bg-white'} flex items-center justify-center overflow-hidden`}>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-indigo-400 text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'C'}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black truncate">{user?.name || 'Developer'}</h3>
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate font-medium">{user?.email || 'user@codeforge.dev'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              Settings & Preferences
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              let activeStyles = '';
              if (isActive) {
                if (item.color === 'sky') activeStyles = dark ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 'bg-sky-50 text-sky-600 border-sky-200';
                if (item.color === 'indigo') activeStyles = dark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border-indigo-200';
                if (item.color === 'purple') activeStyles = dark ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200';
                if (item.color === 'rose') activeStyles = dark ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200';
              } else {
                activeStyles = dark ? 'text-slate-400 hover:text-white hover:bg-white/[0.04] border-transparent' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${activeStyles}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl transition ${isActive ? (dark ? 'bg-white/10' : 'bg-white shadow-sm') : (dark ? 'bg-slate-900' : 'bg-slate-200/50')}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className={`p-4 border-t ${dark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200/60 bg-slate-100/40'} text-[11px] text-slate-500 flex items-center justify-between`}>
            <span>CodeForge v2.4</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live System</span>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Top Header */}
          <div className={`px-6 py-4 border-b ${dark ? 'border-slate-800/80 bg-[#0B0F19]' : 'border-slate-100 bg-white'} flex items-center justify-between flex-shrink-0`}>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-slate-400">
                Manage your developer credentials, platform handles, and account preferences.
              </p>
            </div>
            <button 
              onClick={onClose} 
              className={`p-2 rounded-xl ${dark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'} transition cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto dash-scroll">
            
            {/* TAB 1: PUBLIC PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl animate-fadeIn">
                {profileMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${profileMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                {/* Avatar Preview Card */}
                <div className={`p-4 rounded-2xl border ${dark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-slate-50'} flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg flex-shrink-0">
                    <div className={`w-full h-full rounded-[14px] ${dark ? 'bg-[#0B0F19]' : 'bg-white'} flex items-center justify-center overflow-hidden`}>
                      <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-indigo-400 text-2xl">
                        {name?.charAt(0).toUpperCase() || 'C'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Profile Avatar</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Avatar initials are generated automatically from your registered full name.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-600'} border text-xs font-semibold focus:outline-none transition shadow-sm`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-600'} border text-xs font-semibold focus:outline-none transition shadow-sm`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400" /> Bio Statement
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your software engineering journey..."
                    className={`w-full p-4 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-600'} border text-xs font-medium focus:outline-none transition shadow-sm resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" /> Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className={`w-full px-4 py-3 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-600'} border text-xs font-semibold focus:outline-none transition shadow-sm`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-sky-400" /> Website / Portfolio
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://yourportfolio.dev"
                      className={`w-full px-4 py-3 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-600'} border text-xs font-semibold focus:outline-none transition shadow-sm`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{profileLoading ? 'Saving Preferences...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl animate-fadeIn">
                {passwordMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className={`p-4 rounded-2xl border ${dark ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300' : 'border-indigo-200 bg-indigo-50 text-indigo-900'} text-xs leading-relaxed flex items-start gap-3`}>
                  <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs mb-1">Email Verification Safeguard Active</h4>
                    <p className="opacity-90">For enhanced account security, modifying your password requires a physical verification code (OTP) sent directly to <span className="font-bold text-sky-400">{user?.email}</span>.</p>
                  </div>
                </div>

                {!otpSent ? (
                  <div className={`p-8 text-center space-y-4 rounded-3xl border ${dark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                      <KeyRound className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-sm font-black mb-1">Request Password Reset Code</h3>
                      <p className="text-xs text-slate-400">Click below to dispatch a 6-digit one-time passcode to your email address.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendPasswordOtp}
                      disabled={passwordLoading}
                      className="py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{passwordLoading ? 'Dispatching OTP Code...' : 'Send Verification OTP to Email'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Verification Code (OTP)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className={`w-full tracking-[0.5em] text-center text-xl font-black py-3.5 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'} border focus:outline-none transition shadow-sm`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'} border text-xs font-semibold focus:outline-none transition shadow-sm`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl ${dark ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'} border text-xs font-semibold focus:outline-none transition shadow-sm`}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Resend Code / Back
                      </button>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{passwordLoading ? 'Verifying & Updating...' : 'Verify Code & Update Password'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* TAB 3: PLATFORMS / LINKED ACCOUNTS */}
            {activeTab === 'platforms' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                {platformMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${platformMsg.includes('Successfully') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{platformMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {[
                    { key: 'LEETCODE', name: 'LeetCode', color: '#FFA116', desc: 'Sync solved problem counts, ranking & contest ratings.' },
                    { key: 'CODEFORCES', name: 'Codeforces', color: '#1F8ACB', desc: 'Sync current rating, rank tier & submission history.' },
                    { key: 'GEEKSFORGEEKS', name: 'GeeksForGeeks', color: '#2F9E44', desc: 'Sync GFG score, coding streak & problem metrics.' },
                    { key: 'HACKERRANK', name: 'HackerRank', color: '#2EC4B6', desc: 'Sync problem-solving stars & skill certificates.' },
                    { key: 'CODECHEF', name: 'CodeChef', color: '#D97706', desc: 'Sync CodeChef stars, division & contest ranking.' },
                    { key: 'GITHUB', name: 'GitHub', color: '#8B5CF6', desc: 'Sync commit activity, public repos & contribution heatmap.' }
                  ].map((plat) => (
                    <div 
                      key={plat.key} 
                      className={`p-4 rounded-2xl border ${dark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md"
                          style={{ backgroundColor: plat.color }}
                        >
                          {plat.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black">{plat.name}</h4>
                          <p className="text-[11px] text-slate-400">{plat.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder={`${plat.name} Username`}
                          value={platformInput[plat.key] || ''}
                          onChange={e => setPlatformInput({ ...platformInput, [plat.key]: e.target.value })}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold ${dark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none w-full sm:w-40`}
                        />
                        <button
                          type="button"
                          onClick={() => handleLinkPlatformSubmit(plat.key)}
                          disabled={platformLoading === plat.key}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          {platformLoading === plat.key ? 'Saving...' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: DANGER ZONE */}
            {activeTab === 'danger' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-black text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>Permanent Account Deletion Safeguard</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    Deleting your CodeForge account is completely irreversible. Once confirmed, your user credentials, heatmaps, submission records, notes, and solved progress will be wiped permanently from the Neon cloud PostgreSQL database.
                  </p>
                </div>

                {deleteError && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div className={`p-6 rounded-3xl border ${dark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-slate-50'} space-y-4`}>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      To confirm deletion, type <span className="text-rose-400 font-mono font-black select-all px-2 py-0.5 bg-rose-500/10 rounded border border-rose-500/20">DELETE MY ACCOUNT</span> below:
                    </label>
                    <input
                      type="text"
                      placeholder="DELETE MY ACCOUNT"
                      value={confirmText}
                      onChange={e => setConfirmText(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl font-mono font-extrabold text-xs ${dark ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-white border-slate-200 text-slate-900 focus:border-rose-600'} border focus:outline-none transition shadow-sm`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== 'DELETE MY ACCOUNT' || deleteLoading}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{deleteLoading ? 'Wiping Cloud Data...' : 'Permanently Delete My Account'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
