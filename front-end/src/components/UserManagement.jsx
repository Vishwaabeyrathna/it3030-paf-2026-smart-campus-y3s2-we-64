import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']
const BACKEND_URL = 'http://localhost:8080'

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

function avatarSrc(picture) {
  if (!picture) return null
  if (picture.startsWith('http')) return picture
  return `${BACKEND_URL}${picture}`
}

function EditUserModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [address, setAddress] = useState(user.address || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(avatarSrc(user.picture) || null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const currentAvatar = removePhoto ? null : previewUrl

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

    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', phone)
    formData.append('address', address)
    formData.append('removePhoto', removePhoto)
    if (photoFile) formData.append('photo', photoFile)

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/admin/users/${user.id}/profile`,
        formData,
        { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }
      )
      onSaved(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-sm tracking-tight">Edit User</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Admin — User Profile</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Photo */}
          <div className="flex items-center gap-5">
            <div className="shrink-0">
              {currentAvatar
                ? <img src={currentAvatar} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                : <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center text-white font-black text-xl shadow-sm">
                    {user.name?.[0]}
                  </div>
              }
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Upload Photo
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {(currentAvatar || user.picture) && !removePhoto && (
                <button type="button" onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none transition-all text-sm font-medium text-slate-800"
            />
          </div>

          {/* Email — read only */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email <span className="text-slate-300 normal-case font-bold tracking-normal">(cannot be changed)</span>
            </label>
            <div className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-100/60 text-sm font-medium text-slate-400 cursor-not-allowed select-none">
              {user.email}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="e.g. +94 77 123 4567"
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none transition-all text-sm font-medium text-slate-800"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
            <textarea
              value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Home or office address" rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold">{error}</div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-[0.98]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserManagement() {
  const { user: currentUser, refreshUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/admin/users`, { headers: authHeaders() })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = (id, role) => {
    axios.patch(
      `${BACKEND_URL}/api/admin/users/${id}/role`,
      { role },
      { headers: authHeaders() }
    ).then(res => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: res.data.role } : u))
      if (currentUser?.id === id) refreshUser()
    }).catch(err => {
      alert(err.response?.data?.error ?? 'Failed to update role.')
    })
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this user?')) return
    axios.delete(`${BACKEND_URL}/api/admin/users/${id}`, { headers: authHeaders() })
      .then(() => setUsers(prev => prev.filter(u => u.id !== id)))
      .catch(() => alert('Failed to delete user.'))
  }

  const handleSaved = (updated) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
    if (currentUser?.id === updated.id) refreshUser()
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading users…</p>
  if (error) return <p className="text-red-500 text-sm">{error}</p>

  return (
    <>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">User Management</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {avatarSrc(u.picture)
                        ? <img src={avatarSrc(u.picture)} alt="" className="w-7 h-7 rounded-full object-cover" />
                        : <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">{u.name?.[0]}</div>
                      }
                      <span className="font-medium text-gray-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.id === currentUser?.id ? (
                      <span className="text-xs text-gray-400 px-2 py-1">{u.role}</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Edit
                      </button>
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-6">No users found.</p>
          )}
        </div>
      </div>
    </>
  )
}
