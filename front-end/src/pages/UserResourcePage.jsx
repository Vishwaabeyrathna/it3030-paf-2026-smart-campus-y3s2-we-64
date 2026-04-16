import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, Filter, MapPin, Users, Box, Monitor, LayoutDashboard, 
  Sparkles, Zap, ArrowRight, ShieldCheck, Clock, Calendar, 
  ChevronRight, Info, Star, Bookmark, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const cn = (...inputs) => inputs.filter(Boolean).join(' ');

const UserResourcePage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: 'Active' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page,
        size: 9,
        search: search || undefined,
        type: filters.type || undefined,
        status: 'Active',
      };
      
      const response = await axios.get('http://localhost:8080/api/resources', { 
        params,
        headers: { 'Authorization': `Bearer ${token}` },
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
  }, [fetchResources]);

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Room', icon: LayoutDashboard },
    { name: 'Lab', icon: Box },
    { name: 'Equipment', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative h-[450px] bg-slate-900 overflow-hidden flex items-center px-12 lg:px-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/10 mb-8">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Campus Infrastructure Alpha</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight mb-8">
            The New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Campus</span> <br/>
            Ecosystem
          </h1>
          <p className="text-slate-400 text-lg lg:text-xl max-w-2xl font-medium leading-relaxed mb-10">
            Discover and reserve premium academic assets. From cutting-edge labs to collaborative spaces, access everything you need to excel.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-3 active:scale-95">
              Explore Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 -mt-16 relative z-30">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 lg:p-10 border border-slate-100 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-6 h-6" />
            <input
              type="text"
              placeholder="Search assets by name or dynamic location..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setFilters(f => ({ ...f, type: cat.name === 'All' ? '' : cat.name })); setPage(0); }}
                className={cn(
                  "px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shrink-0",
                  (filters.type === cat.name || (cat.name === 'All' && !filters.type))
                    ? "bg-slate-900 text-white shadow-xl -translate-y-1"
                    : "bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-50"
                )}
              >
                <cat.icon className="w-5 h-5" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[3rem] h-[500px] animate-pulse p-8 border border-slate-100">
                <div className="h-[250px] bg-slate-50 rounded-[2rem] mb-6" />
                <div className="space-y-4">
                  <div className="h-8 bg-slate-50 rounded-xl w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {resources.map((resource) => (
              <div key={resource.id} className="group bg-white rounded-[3rem] p-8 border border-white hover:border-blue-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                <div className="relative mb-8 rounded-[2rem] overflow-hidden aspect-[4/3] bg-slate-50">
                   {resource.imageUrl ? (
                     <img src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
                        <Box className="w-20 h-20 text-blue-100" />
                     </div>
                   )}
                   <div className="absolute top-6 left-6 px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {resource.type}
                   </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                        {resource.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{resource.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                    {resource.description || "Premium campus infrastructure optimized for student success."}
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Available</span>
                  </div>
                  <button className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-200 flex items-center gap-3">
                    Reserve <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40">
            <Search className="w-12 h-12 text-slate-300 mb-10" />
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No assets detected</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserResourcePage;
