import { useAuth } from '../context/AuthContext'
import NotificationBell from '../components/NotificationBell'

function StatCard({ label, value, icon, color }) {
  const colors = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100' },
    red:    { bg: 'bg-red-50',    text: 'text-red-600',    icon: 'bg-red-100' },
  }
  const c = colors[color] ?? colors.orange

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

function TaskRow({ title, location, priority, status }) {
  const priorityStyles = {
    High:   'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low:    'bg-slate-100 text-slate-600',
  }
  const statusStyles = {
    'Assigned':    'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    'Completed':   'bg-emerald-100 text-emerald-700',
  }

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{location}</p>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityStyles[priority]}`}>
          {priority}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button className="text-xs font-medium text-orange-600 hover:text-orange-800 transition-colors">
          Update →
        </button>
      </td>
    </tr>
  )
}

export default function TechnicianDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-600/20 text-orange-300 font-medium text-sm cursor-default">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Overview
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors cursor-default">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            My Tasks
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors cursor-default">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Schedule
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors cursor-default">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Reports
          </a>
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.picture
              ? <img src={user.picture} alt="" className="w-8 h-8 rounded-full ring-2 ring-orange-500/40" />
              : <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">{user?.name?.[0]}</div>
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
            <h1 className="text-xl font-bold text-slate-800">Technician Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell accentColor="orange" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Technician
            </span>
          </div>
        </header>

        <div className="px-8 py-7 space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Assigned Tasks" value="—" icon="📌" color="orange" />
            <StatCard label="In Progress"    value="—" icon="⚙️" color="blue" />
            <StatCard label="Completed"      value="—" icon="✅" color="emerald" />
            <StatCard label="Overdue"        value="—" icon="⚠️" color="red" />
          </div>

          {/* Work queue */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Work Queue</h2>
              <p className="text-slate-400 text-sm mt-0.5">Tasks assigned to you</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <TaskRow title="Fix AC Unit — Room 204"    location="Building A, Floor 2" priority="High"   status="Assigned" />
                  <TaskRow title="Replace light fittings"    location="Library, Section B"  priority="Medium" status="In Progress" />
                  <TaskRow title="Plumbing inspection"       location="Building C, Floor 1" priority="Low"    status="Assigned" />
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">Sample data — connect your API to load real tasks</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
