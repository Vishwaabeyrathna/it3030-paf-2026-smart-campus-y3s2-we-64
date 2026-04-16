import { useAuth } from '../context/AuthContext'
import UserManagement from '../components/UserManagement'

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
  }
  const c = colors[color] ?? colors.blue

  return (
    <div className={`${c.bg} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`${c.icon} rounded-xl p-3 shrink-0`}>
        <span className={`${c.text} text-xl`}>{icon}</span>
      </div>
      <div>
        <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Smart Campus</p>
              <p className="text-slate-400 text-xs">Operations</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Main</p>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-600/20 text-purple-300 font-medium text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Overview
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Users
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Requests
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </a>
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.picture
              ? <img src={user.picture} alt="" className="w-8 h-8 rounded-full ring-2 ring-purple-500/40" />
              : <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">{user?.name?.[0]}</div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Admin
          </span>
        </header>

        <div className="px-8 py-7 space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users"     value="—" icon="👥" color="blue" />
            <StatCard label="Open Requests"   value="—" icon="📋" color="amber" />
            <StatCard label="Technicians"     value="—" icon="🔧" color="purple" />
            <StatCard label="Resolved Today"  value="—" icon="✅" color="emerald" />
          </div>

          {/* User management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">User Management</h2>
                <p className="text-slate-400 text-sm mt-0.5">Manage roles and access for all users</p>
              </div>
            </div>
            <div className="p-6">
              <UserManagement />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
