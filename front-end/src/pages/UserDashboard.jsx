import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ticketService from '../services/ticketService'
import TicketDetailModal from '../components/TicketDetailModal'
import NotificationBell from '../components/NotificationBell'

const STATUS_STYLES = {
  OPEN:        'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED:    'bg-emerald-100 text-emerald-700',
  CLOSED:      'bg-slate-100 text-slate-500',
  REJECTED:    'bg-red-100 text-red-700',
}
const PRIORITY_STYLES = {
  LOW:      'bg-slate-100 text-slate-600',
  MEDIUM:   'bg-amber-50 text-amber-600',
  HIGH:     'bg-orange-100 text-orange-600',
  URGENT:   'bg-red-100 text-red-700',
  CRITICAL: 'bg-red-200 text-red-800',
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
    slate:  { bg: 'bg-slate-50',  text: 'text-slate-600',  icon: 'bg-slate-100' },
  }
  const c = colors[color] ?? colors.blue
  return (
    <div className={`${c.bg} rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform`}>
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
  const [tickets, setTickets]             = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    ticketService.getMyTickets().then(setTickets).catch(console.error)
  }, [])

  const handleTicketUpdated = (updated) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedTicket(updated)
  }

  const stats = {
    total:      tickets.length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved:   tickets.filter(t => t.status === 'RESOLVED').length,
    open:       tickets.filter(t => t.status === 'OPEN').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="px-6 py-8 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Smart Campus</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Operations</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-8 space-y-1">
          <Link to="/dashboard/user" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600/20 text-blue-300 font-bold text-xs transition-colors">
            🏠 My Dashboard
          </Link>
          <Link to="/dashboard/user/report-incident" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-bold text-xs transition-colors">
            ➕ New Request
          </Link>
        </nav>

        <div className="px-4 py-6 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            {user?.picture
              ? <img src={user.picture} alt="" className="w-9 h-9 rounded-full ring-2 ring-blue-500/30" />
              : <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">{user?.name?.[0]}</div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.name}</p>
              <p className="text-slate-500 text-[10px] truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/20 text-[11px] font-bold transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-slate-50 lg:p-4">
        <div className="min-h-full bg-white lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col">
          <header className="px-10 py-8 flex items-center justify-between border-b border-slate-50 sticky top-0 z-20 backdrop-blur-xl bg-white/70">
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Dashboard</h1>
              <p className="text-slate-400 text-xs font-bold mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell accentColor="blue" />
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20">
                User
              </span>
            </div>
          </header>

          <div className="px-10 py-10 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="My Tickets"  value={stats.total}      icon="📋" color="blue" />
              <StatCard label="Open"        value={stats.open}       icon="📂" color="slate" />
              <StatCard label="In Progress" value={stats.inProgress} icon="⏳" color="amber" />
              <StatCard label="Resolved"    value={stats.resolved}   icon="✅" color="emerald" />
            </div>

            {/* Ticket table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">My Maintenance Tickets</h2>
                  <p className="text-slate-400 text-[11px] mt-1">Click a row to view status, details, and leave comments</p>
                </div>
                <Link
                  to="/dashboard/user/report-incident"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                  + New Ticket
                </Link>
              </div>

              {tickets.length > 0 ? (
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-left border-separate border-spacing-y-1.5">
                    <thead>
                      <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Location</th>
                        <th className="px-5 py-3">Priority</th>
                        <th className="px-5 py-3">Assigned To</th>
                        <th className="px-5 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className="group bg-slate-50/50 hover:bg-blue-50/50 transition-all cursor-pointer"
                        >
                          <td className="px-5 py-4 first:rounded-l-xl border-y border-l border-slate-100 group-hover:border-blue-100 text-[10px] font-mono text-slate-400 italic">#{ticket.id}</td>
                          <td className="px-5 py-4 border-y border-slate-100 group-hover:border-blue-100 text-xs font-bold text-slate-800">{ticket.category}</td>
                          <td className="px-5 py-4 border-y border-slate-100 group-hover:border-blue-100 text-[11px] text-slate-500">{ticket.resourceLocation}</td>
                          <td className="px-5 py-4 border-y border-slate-100 group-hover:border-blue-100">
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${PRIORITY_STYLES[ticket.priority] || 'bg-slate-100 text-slate-500'}`}>{ticket.priority}</span>
                          </td>
                          <td className="px-5 py-4 border-y border-slate-100 group-hover:border-blue-100 text-[11px] text-slate-600">
                            {ticket.assignedTechnicianName || <span className="text-slate-300 italic">Pending</span>}
                          </td>
                          <td className="px-5 py-4 last:rounded-r-xl border-y border-r border-slate-100 group-hover:border-blue-100 text-center">
                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[ticket.status] || 'bg-slate-100'}`}>{ticket.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-5">📋</div>
                  <p className="text-slate-700 font-bold">No tickets yet</p>
                  <p className="text-slate-400 text-sm mt-1">Submit a request to get started</p>
                  <button
                    onClick={() => navigate('/dashboard/user/report-incident')}
                    className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                  >
                    New Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          currentUser={user}
          viewerRole="user"
          onClose={() => setSelectedTicket(null)}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  )
}
