import { useEffect, useState } from 'react'
import ticketService from '../services/ticketService'

const STATUS_COLORS = {
  'PENDING': 'bg-amber-100 text-amber-700',
  'IN_PROGRESS': 'bg-blue-100 text-blue-700',
  'RESOLVED': 'bg-emerald-100 text-emerald-700',
  'CLOSED': 'bg-slate-100 text-slate-700'
}

const PRIORITY_COLORS = {
  'LOW': 'bg-slate-100 text-slate-600',
  'MEDIUM': 'bg-amber-50 text-amber-600',
  'HIGH': 'bg-red-50 text-red-600',
  'CRITICAL': 'bg-red-100 text-red-700'
}

export default function TicketManagement({ limit }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ticketService.getAllTickets()
      .then(data => setTickets(data))
      .catch(() => setError('Failed to load tickets.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-400 text-xs font-bold uppercase tracking-widest p-8">Calibrating Data Flow...</p>
  if (error) return <p className="text-red-500 text-sm font-bold p-8">{error}</p>

  const displayedTickets = limit ? tickets.slice(0, limit) : tickets

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Nexus Point</th>
              <th className="px-6 py-4">Classification</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4 text-center">Protocol Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedTickets.map(ticket => (
              <tr key={ticket.id} className="group bg-white hover:bg-slate-50/80 transition-all duration-300">
                <td className="px-6 py-5 first:rounded-l-2xl border-y border-l border-slate-50 group-hover:border-slate-100 italic font-mono text-[10px] text-slate-400">
                  #{ticket.id}
                </td>
                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-slate-100">
                  <span className="text-xs font-bold text-slate-900 leading-none">{ticket.creatorName}</span>
                </td>
                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500">{ticket.resourceLocation}</span>
                </td>
                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{ticket.category}</span>
                </td>
                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-slate-100">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${PRIORITY_COLORS[ticket.priority] || 'bg-slate-100'}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-5 last:rounded-r-2xl border-y border-r border-slate-50 group-hover:border-slate-100 text-center">
                  <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-bold ${STATUS_COLORS[ticket.status] || 'bg-slate-100'}`}>
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && (
          <div className="text-center py-20 bg-slate-50/20 rounded-3xl border border-dashed border-slate-100">
            <div className="text-3xl mb-4 grayscale opacity-20">📋</div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No active protocols found</p>
          </div>
        )}
      </div>
    </div>
  )
}
