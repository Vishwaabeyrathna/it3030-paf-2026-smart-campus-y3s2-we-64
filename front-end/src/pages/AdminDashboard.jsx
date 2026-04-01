import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import UserManagement from '../components/UserManagement'
import TicketManagement from '../components/TicketManagement'
import ticketService from '../services/ticketService'

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
  }
  const c = colors[color] ?? colors.blue

  return (
    <div className={`${c.bg} shadow-xs border border-transparent rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300`}>
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
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    users: 0,
    tickets: 0,
    technicians: 0,
    resolvedToday: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        
        // Fetch users
        const usersRes = await axios.get('http://localhost:8080/api/admin/users', { headers })
        const users = usersRes.data
        
        // Fetch tickets
        const tickets = await ticketService.getAllTickets()
        
        setStats({
          users: users.length,
          tickets: tickets.length,
          technicians: users.filter(u => u.role === 'TECHNICIAN').length,
          resolvedToday: tickets.filter(t => t.status === 'RESOLVED').length
        })
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err)
      }
    }
    fetchData()
  }, [])

  const navItems = [
    { id: 'overview', label: 'Overview', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: 'users', label: 'Users', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { id: 'tickets', label: 'Tickets', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { id: 'requests', label: 'Requests', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )}
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-purple-100 selection:text-purple-600">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 overflow-y-auto h-screen sticky top-0">
        <div className="px-6 py-8 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-purple-500 to-purple-800 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight leading-tight">Smart Campus</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Admin Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-8 space-y-2">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-4">Navigation</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-300 transform ${
                activeTab === item.id
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20 translate-x-1'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 translate-x-0'
              }`}
            >
              <span className={`transition-colors duration-300 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.picture
              ? <img src={user.picture} alt="" className="w-9 h-9 rounded-full ring-2 ring-purple-500/30" />
              : <div className="w-9 h-9 rounded-full bg-linear-to-tr from-purple-600 to-purple-400 flex items-center justify-center text-white font-black text-xs shadow-inner uppercase">{user?.name?.[0]}</div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate leading-none">{user?.name}</p>
              <p className="text-slate-500 text-[10px] truncate mt-1 font-medium">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/20 text-[11px] font-bold transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out System
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50 lg:p-4">
        <div className="min-h-full bg-white lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col">
          <header className="px-10 py-8 flex items-center justify-between border-b border-slate-50 sticky top-0 z-20 backdrop-blur-xl bg-white/70">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 capitalize">
                {activeTab}
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              </h1>
              <p className="text-slate-400 text-xs font-bold mt-1 tracking-wide">Administrator Portal &bull; Real-time Operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">System Status</span>
                <span className="text-[11px] font-bold text-emerald-500 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Operational
                </span>
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-slate-900/10">
                Admin
              </span>
            </div>
          </header>

          <div className="px-10 py-10 space-y-12">
            {activeTab === 'overview' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Users"     value={stats.users}         icon="👥" color="blue" />
                  <StatCard label="Active Tickets"  value={stats.tickets}       icon="📋" color="amber" />
                  <StatCard label="Technical Staff" value={stats.technicians}   icon="🔧" color="purple" />
                  <StatCard label="Resolved"        value={stats.resolvedToday} icon="✅" color="emerald" />
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Maintenance Flow</h2>
                      <p className="text-slate-400 text-[11px] mt-1 font-bold">Latest infrastructure incident reports</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('tickets')} 
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-black text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                    >
                      Audit All Tickets
                    </button>
                  </div>
                  <div className="p-4 sm:p-8">
                    <TicketManagement />
                  </div>
                </div>
              </>
            ) : activeTab === 'users' ? (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-10 py-8 bg-slate-50/30 border-b border-slate-50">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">User Access Directory</h2>
                  <p className="text-slate-400 text-[11px] mt-1 font-bold">Comprehensive control over campus identities</p>
                </div>
                <div className="p-4 sm:p-8">
                  <UserManagement />
                </div>
              </div>
            ) : activeTab === 'tickets' ? (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-10 py-8 bg-slate-50/30 border-b border-slate-50">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Incident Response Command</h2>
                  <p className="text-slate-400 text-[11px] mt-1 font-bold">Advanced maintenance orchestration</p>
                </div>
                <div className="p-4 sm:p-8">
                  <TicketManagement />
                </div>
              </div>
            ) : (
               <div className="text-center py-32 bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-200">
                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mx-auto mb-6">✨</div>
                 <h3 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-2">Module Optimized</h3>
                 <p className="text-slate-400 text-[11px] font-bold max-w-xs mx-auto uppercase tracking-wide leading-relaxed">This workspace is currently being calibrated for advanced performance.</p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
