import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

export default function UserManagement() {
  const { user: currentUser, refreshUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/users', { headers: authHeaders() })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = (id, role) => {
    axios.patch(
      `http://localhost:8080/api/admin/users/${id}/role`,
      { role },
      { headers: authHeaders() }
    ).then(res => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: res.data.role } : u))
      // If the changed user is the currently logged-in user, refresh their session role
      if (currentUser?.id === id) refreshUser()
    }).catch(err => {
      alert(err.response?.data?.error ?? 'Failed to update role.')
    })
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this user?')) return
    axios.delete(`http://localhost:8080/api/admin/users/${id}`, { headers: authHeaders() })
      .then(() => setUsers(prev => prev.filter(u => u.id !== id)))
      .catch(() => alert('Failed to delete user.'))
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading users…</p>
  if (error) return <p className="text-red-500 text-sm">{error}</p>

  return (
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
                <td className="px-4 py-3 flex items-center gap-2">
                  {u.picture
                    ? <img src={u.picture} alt="" className="w-7 h-7 rounded-full" />
                    : <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">{u.name?.[0]}</div>
                  }
                  <span className="font-medium text-gray-700">{u.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
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
  )
}
