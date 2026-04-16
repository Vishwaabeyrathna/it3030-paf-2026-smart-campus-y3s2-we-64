import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import profileService from '../services/profileService'

const BACKEND_URL = 'http://localhost:8080'

function getAvatarSrc(picture) {
  if (!picture) return null
  if (picture.startsWith('http')) return picture
  return `${BACKEND_URL}${picture}`
}

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(getAvatarSrc(user?.picture) || null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const fileInputRef = useRef(null)

  const roleLabel = {
    USER: 'Student',
    ADMIN: 'Administrator',
    TECHNICIAN: 'Technician',
  }[user?.role] || 'User'

  const dashboardPath = {
    USER: '/dashboard/user',
    ADMIN: '/dashboard/admin',
    TECHNICIAN: '/dashboard/technician',
  }[user?.role] || '/'

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setRemovePhoto(false)
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPreviewUrl(null)
    setRemovePhoto(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', phone)
    formData.append('address', address)
    formData.append('removePhoto', removePhoto)
    if (photoFile) {
      formData.append('photo', photoFile)
    }

    try {
      await profileService.updateProfile(formData)
      await refreshUser()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const currentAvatar = removePhoto ? null : previewUrl

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="px-8 py-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-black text-xs tracking-tight">Smart Campus</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">{roleLabel} Profile</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <button
            onClick={() => navigate(dashboardPath)}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
          >
            <span className="text-sm opacity-80">←</span>
            Back to Dashboard
          </button>
          <div className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <span className="text-sm opacity-80">👤</span>
            Edit Profile
          </div>
        </nav>

        {/* Profile bottom */}
        <div className="p-4 shrink-0 bg-slate-900 border-t border-slate-800/50">
          <div className="bg-slate-800/40 rounded-[2rem] p-4 border border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                {currentAvatar
                  ? <img src={currentAvatar} alt="" className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" />
                  : <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-xs">{user?.name?.[0]}</div>
                }
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-black truncate leading-tight">{user?.name?.split(' ')[0]}</p>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Profile</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1.5">
              Manage your personal information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Profile Photo</h2>
              <div className="flex items-center gap-6">
                {/* Avatar preview */}
                <div className="shrink-0">
                  {currentAvatar
                    ? <img src={currentAvatar} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                    : <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-2xl shadow-sm">
                        {user?.name?.[0]}
                      </div>
                  }
                </div>

                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Photo
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {(currentAvatar || user?.picture) && !removePhoto && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Photo
                    </button>
                  )}
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">JPG, PNG, GIF — max 5MB</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Information</h2>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium text-slate-800"
                />
              </div>

              {/* Email — read only */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email <span className="text-slate-300 normal-case font-bold tracking-normal">(cannot be changed)</span>
                </label>
                <div className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-100/60 text-sm font-medium text-slate-400 select-none cursor-not-allowed">
                  {user?.email}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium text-slate-800"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Your home or office address"
                  rows={3}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
                />
              </div>
            </div>

            {/* Feedback */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold">
                Profile saved successfully!
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(dashboardPath)}
                className="px-8 py-4 rounded-2xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
