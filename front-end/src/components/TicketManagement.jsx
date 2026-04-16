<<<<<<< HEAD
import { useEffect, useState } from 'react'
import axios from 'axios'
import ticketService from '../services/ticketService'

const STATUS_COLORS = {
  'OPEN': 'bg-amber-100 text-amber-700',
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

function TicketDetailsModal({ ticket, onClose, onStatusUpdate }) {
  const [previewImage, setPreviewImage] = useState(null)
  if (!ticket) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Incident Protocol Request</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                Ticket #{ticket.id}
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${PRIORITY_COLORS[ticket.priority] || 'bg-slate-100'}`}>
                  {ticket.priority}
                </span>
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Nexus Point</p>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{ticket.resourceLocation}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Reporter Identity</p>
                <p className="text-sm font-bold text-slate-900">{ticket.creatorName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Category</p>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{ticket.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Submission Date</p>
                <p className="text-sm font-bold text-slate-900">{new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Description</p>
              <div className="bg-white border border-slate-100 p-6 rounded-3xl text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>

            {/* Images */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Evidence</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {ticket.images.map((imgData, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setPreviewImage(imgData)}
                      className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 group hover:ring-4 hover:ring-purple-500/20 transition-all cursor-zoom-in shadow-xs"
                    >
                      <img 
                        src={imgData} 
                        alt={`Evidence ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400">Current Status:</span>
              <span className={`inline-flex px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest ${STATUS_COLORS[ticket.status] || 'bg-slate-100'}`}>
                {ticket.status}
              </span>
            </div>
            <div className="flex gap-3">
              {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <>
                  {ticket.status !== 'IN_PROGRESS' && (
                    <button 
                      onClick={() => onStatusUpdate(ticket.id, 'IN_PROGRESS')}
                      className="px-6 py-3 rounded-[1.25rem] bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
                    >
                      Start Progress
                    </button>
                  )}
                  <button 
                    onClick={() => onStatusUpdate(ticket.id, 'RESOLVED')}
                    className="px-6 py-3 rounded-[1.25rem] bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95"
                  >
                    Mark Resolved
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in zoom-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={previewImage} alt="Full Preview" className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" />
        </div>
      )}
    </>
  )
}

export default function TicketManagement({ limit }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    ticketService.getAllTickets()
      .then(data => setTickets(data))
      .catch(() => setError('Failed to load tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`http://localhost:8080/api/tickets/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Refresh tickets list
      const data = await ticketService.getAllTickets()
      setTickets(data)
      // Update selected ticket to reflect change in modal
      const updated = data.find(t => t.id === id)
      setSelectedTicket(updated)
    } catch (err) {
      alert('Failed to update status')
    }
  }

  if (loading) return <div className="p-12"><p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Initializing Data Stream...</p></div>
  if (error) return <div className="p-12"><p className="text-red-500 text-sm font-bold">{error}</p></div>

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
              <tr 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="group bg-white hover:bg-slate-50/80 transition-all duration-300 cursor-pointer"
              >
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

      {/* Details Popup */}
      {selectedTicket && (
        <TicketDetailsModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}
=======
import { useEffect, useState } from 'react'
import axios from 'axios'
import ticketService from '../services/ticketService'

const STATUS_COLORS = {
  'OPEN': 'bg-amber-100 text-amber-700',
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

function TicketDetailsModal({ ticket, onClose, onStatusUpdate }) {
  const [previewImage, setPreviewImage] = useState(null)
  if (!ticket) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Incident Protocol Request</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                Ticket #{ticket.id}
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${PRIORITY_COLORS[ticket.priority] || 'bg-slate-100'}`}>
                  {ticket.priority}
                </span>
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Nexus Point</p>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{ticket.resourceLocation}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Reporter Identity</p>
                <p className="text-sm font-bold text-slate-900">{ticket.creatorName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Category</p>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{ticket.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Submission Date</p>
                <p className="text-sm font-bold text-slate-900">{new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Description</p>
              <div className="bg-white border border-slate-100 p-6 rounded-3xl text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>

            {/* Images */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Evidence</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {ticket.images.map((imgData, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setPreviewImage(imgData)}
                      className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 group hover:ring-4 hover:ring-purple-500/20 transition-all cursor-zoom-in shadow-xs"
                    >
                      <img 
                        src={imgData} 
                        alt={`Evidence ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400">Current Status:</span>
              <span className={`inline-flex px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest ${STATUS_COLORS[ticket.status] || 'bg-slate-100'}`}>
                {ticket.status}
              </span>
            </div>
            <div className="flex gap-3">
              {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <>
                  {ticket.status !== 'IN_PROGRESS' && (
                    <button 
                      onClick={() => onStatusUpdate(ticket.id, 'IN_PROGRESS')}
                      className="px-6 py-3 rounded-[1.25rem] bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
                    >
                      Start Progress
                    </button>
                  )}
                  <button 
                    onClick={() => onStatusUpdate(ticket.id, 'RESOLVED')}
                    className="px-6 py-3 rounded-[1.25rem] bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95"
                  >
                    Mark Resolved
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in zoom-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={previewImage} alt="Full Preview" className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" />
        </div>
      )}
    </>
  )
}

export default function TicketManagement({ limit }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    ticketService.getAllTickets()
      .then(data => setTickets(data))
      .catch(() => setError('Failed to load tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`http://localhost:8080/api/tickets/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Refresh tickets list
      const data = await ticketService.getAllTickets()
      setTickets(data)
      // Update selected ticket to reflect change in modal
      const updated = data.find(t => t.id === id)
      setSelectedTicket(updated)
    } catch (err) {
      alert('Failed to update status')
    }
  }

  if (loading) return <div className="p-12"><p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Initializing Data Stream...</p></div>
  if (error) return <div className="p-12"><p className="text-red-500 text-sm font-bold">{error}</p></div>

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
              <tr 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="group bg-white hover:bg-slate-50/80 transition-all duration-300 cursor-pointer"
              >
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

      {/* Details Popup */}
      {selectedTicket && (
        <TicketDetailsModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}
>>>>>>> e924cb6fbde3f185ba9ea58ceca60b7f1fae6f4e
