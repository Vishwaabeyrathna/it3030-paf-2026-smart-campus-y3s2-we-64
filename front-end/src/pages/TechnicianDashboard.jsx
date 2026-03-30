import { useAuth } from '../context/AuthContext'

export default function TechnicianDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {user?.picture && (
                <img src={user.picture} alt="avatar" className="w-12 h-12 rounded-full" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  TECHNICIAN
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
            >
              Sign out
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Work Queue</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Assigned Tasks</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500 mt-1">In Progress</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
