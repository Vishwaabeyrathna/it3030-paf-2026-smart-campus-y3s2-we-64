import { useAuth } from '../context/AuthContext'

export default function UserDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user?.picture && (
              <img src={user.picture} alt="avatar" className="w-12 h-12 rounded-full" />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                USER
              </span>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Dashboard</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500 mt-1">My Requests</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Resolved</p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
