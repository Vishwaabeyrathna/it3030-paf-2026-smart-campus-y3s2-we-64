import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ticketService from '../services/ticketService'
import NotificationBell from '../components/NotificationBell'

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
    slate:  { bg: 'bg-slate-50',  text: 'text-slate-600',  icon: 'bg-slate-100' },
  }
  const c = colors[color] ?? colors.blue

  return (
    <div className={`${c.bg} rounded-2xl p-5 flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
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

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({ total: 0, inProgress: 0, resolved: 0 })

  useEffect(() => {
    ticketService.getMyTickets().then(data => {
      setTickets(data)
      setStats({
        total: data.length,
        inProgress: data.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: data.filter(t => t.status === 'RESOLVED').length
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
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

        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Main</p>
          <Link to="/dashboard/user" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 font-medium text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            My Dashboard
          </Link>
          <Link to="/dashboard/user/report-incident" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Request
          </Link>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors cursor-default">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            My Requests
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium text-sm transition-colors cursor-default">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            Notifications
          </a>
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.picture
              ? <img src={user.picture} alt="" className="w-8 h-8 rounded-full ring-2 ring-blue-500/40" />
              : <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{user?.name?.[0]}</div>
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
            <h1 className="text-xl font-bold text-slate-800">My Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell accentColor="blue" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              User
            </span>
          </div>
        </header>

        <div className="px-8 py-7 space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="My Requests"    value={stats.total} icon="📋" color="blue" />
            <StatCard label="In Progress"    value={stats.inProgress} icon="⏳" color="amber" />
            <StatCard label="Resolved"       value={stats.resolved} icon="✅" color="emerald" />
            <StatCard label="Notifications"  value="0" icon="🔔" color="slate" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">My Maintenance Tickets</h2>
                <p className="text-slate-400 text-sm mt-0.5">Your submitted incident reports</p>
              </div>
              <Link 
                to="/dashboard/user/report-incident"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                + New Ticket
              </Link>
            </div>
            
            {tickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Images</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-700">{ticket.category}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{ticket.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{ticket.resourceLocation}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            ticket.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                            ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                             ticket.status === 'RESOLVED' ? 'text-emerald-600' : 
                             ticket.status === 'IN_PROGRESS' ? 'text-amber-600' : 'text-slate-400'
                           }`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${
                               ticket.status === 'RESOLVED' ? 'bg-emerald-500' : 
                               ticket.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-300'
                             }`}></span>
                             {ticket.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                             {ticket.images?.map((img, i) => (
                               <img key={i} src={img} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                             ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">No requests yet</p>
                <p className="text-slate-400 text-sm mt-1">Submit a request to get started</p>
                <button 
                  onClick={() => navigate('/dashboard/user/report-incident')}
                  className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  New Request
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
