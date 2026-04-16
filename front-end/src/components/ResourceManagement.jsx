import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit2, Trash2, 
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Loader2,
  LayoutDashboard, School, Calendar, Ticket, LogOut, Menu, X,
  Building2, Activity, AlertTriangle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SummaryCard = ({ title, value, icon: Icon, colorClass, loading }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", colorClass)}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      {loading ? (
        <div className="h-7 w-16 bg-gray-100 animate-pulse rounded-lg" />
      ) : (
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      )}
    </div>
  </div>
);

const ResourceManagement = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [summary, setSummary] = useState({ totalResources: 0, activeResources: 0, outOfServiceResources: 0 });
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/resources/summary', { 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true 
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page,
        size: 10,
        search: search || undefined,
        type: filters.type || undefined,
        status: filters.status || undefined,
      };
      
      const response = await axios.get('http://localhost:8080/api/resources', { 
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true 
      });
      setResources(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => {
    fetchResources();
    fetchSummary();
  }, [fetchResources]);

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/resources/${resourceToDelete.id}`, { 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true 
      });
      await Promise.all([fetchResources(), fetchSummary()]);
      setIsDeleteModalOpen(false);
      setResourceToDelete(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: School, label: 'Resources', id: 'resources', active: true },
    { icon: Calendar, label: 'Bookings', id: 'bookings' },
    { icon: Ticket, label: 'Tickets', id: 'tickets' },
  ];

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <School className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-gray-900 truncate">Smart Campus</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                item.active 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          </div>
          <button 
            onClick={() => navigate('/admin/resources/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm font-bold"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8 space-y-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SummaryCard 
              title="Total Resources" 
              value={summary.totalResources} 
              icon={Building2} 
              colorClass="bg-blue-50 text-blue-600" 
              loading={summaryLoading}
            />
            <SummaryCard 
              title="Active Resources" 
              value={summary.activeResources} 
              icon={Activity} 
              colorClass="bg-emerald-50 text-emerald-600" 
              loading={summaryLoading}
            />
            <SummaryCard 
              title="Out of Service" 
              value={summary.outOfServiceResources} 
              icon={AlertTriangle} 
              colorClass="bg-red-50 text-red-600" 
              loading={summaryLoading}
            />
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col xl:flex-row gap-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by resource name, location..." 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm appearance-none min-w-[160px]"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">All Types</option>
                  <option value="Room">Room</option>
                  <option value="Lab">Lab</option>
                  <option value="Equipment">Equipment</option>
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm appearance-none min-w-[160px]"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
                <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Resource Name</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Capacity</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                          <span className="text-sm font-medium text-gray-500 italic">Accessing central database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : resources.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <XCircle className="w-12 h-12 text-gray-300" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xl font-bold text-gray-900">No resources found</p>
                            <p className="text-sm text-gray-500">Try adjusting your filters or adding a new resource.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    resources.map((resource) => (
                      <tr 
                        key={resource.id} 
                        className="group hover:bg-gray-50/70 transition-all border-b border-gray-100 last:border-0"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{resource.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono mt-1 uppercase">ID: SC-{resource.id.toString().padStart(4, '0')}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-bold text-gray-600 uppercase tracking-wider">{resource.type}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-gray-600 font-mono">{resource.capacity || 'N/A'}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm text-gray-600 font-medium">{resource.location}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            resource.status === 'Active' 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-red-50 text-red-700 border-red-100"
                          )}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              resource.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                            )} />
                            {resource.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button 
                              onClick={() => navigate(`/admin/resources/edit/${resource.id}`)}
                              className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-2xl transition-all hover:scale-110 active:scale-95"
                              title="Edit Resource"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setResourceToDelete(resource);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2.5 hover:bg-red-50 text-red-600 rounded-2xl transition-all hover:scale-110 active:scale-95"
                              title="Delete Resource"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                Showing Page {page + 1} of {totalPages || 1}
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0 || loading}
                  className="p-3 bg-white border border-gray-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:border-blue-200 active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1 || loading}
                  className="p-3 bg-white border border-gray-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:border-blue-200 active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] p-12 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[32px] flex items-center justify-center mb-10 mx-auto shadow-inner">
              <Trash2 className="w-10 h-10" />
            </div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Are you sure?</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                You are about to permanently delete <span className="text-gray-900 font-bold underline decoration-red-200 underline-offset-4">"{resourceToDelete?.name}"</span>. 
                This action is irreversible.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full py-5 bg-red-600 text-white rounded-3xl text-sm font-black shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : 'Delete Destructively'}
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full py-5 bg-gray-50 text-gray-500 rounded-3xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95"
              >
                Keep Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
