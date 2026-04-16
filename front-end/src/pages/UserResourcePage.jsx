import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  ArrowRight, 
  Layout, 
  BookOpen, 
  Home, 
  User as UserIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserResourcePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
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
        type: filterType !== 'All' ? filterType : undefined
      };
      
      const response = await axios.get('http://localhost:8080/api/user/resources', { 
        params,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true 
      });
      setResources(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleTypeChange = (type) => {
    setFilterType(type);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">SmartCampus</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </a>
              <a href="/resources" className="text-blue-600 border-b-2 border-blue-600 font-semibold flex items-center gap-1 h-16">
                <BookOpen className="w-4 h-4" /> Resources
              </a>
              <a href="/bookings" className="text-slate-600 hover:text-blue-600 font-medium">My Bookings</a>
              <a href="/profile" className="text-slate-600 hover:text-blue-600 font-medium">Profile</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-800">{user?.name || 'Student'}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{user?.role?.name || 'STUDENT'}</span>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <UserIcon className="w-5 h-5 text-slate-600" />
              </div>
              <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Available Resources</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Find and book campus facilities, rooms, and equipment tailored to your academic needs.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources by name or location..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto py-1">
              <Filter className="text-slate-400 w-5 h-5 mr-2 hidden sm:block" />
              {['All', 'Room', 'Lab', 'Equipment'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    filterType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading resources...</p>
          </div>
        ) : resources.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  <div className="p-1">
                    <div className="h-40 bg-slate-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                      {/* Placeholder Image Graphic */}
                      <div className="opacity-20 transform group-hover:scale-110 transition-transform duration-300">
                        {resource.type === 'Room' && <Layout className="w-20 h-20 text-blue-600" />}
                        {resource.type === 'Lab' && <BookOpen className="w-20 h-20 text-indigo-600" />}
                        {resource.type === 'Equipment' && <Info className="w-20 h-20 text-emerald-600" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 uppercase tracking-wide
                          ${resource.type === 'Room' ? 'bg-blue-50 text-blue-700' : 
                            resource.type === 'Lab' ? 'bg-purple-50 text-purple-700' : 
                            'bg-emerald-50 text-emerald-700'}`}>
                          {resource.type}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800">{resource.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        {resource.capacity}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {resource.location}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => navigate(`/resources/${resource.id}`)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Details
                      </button>
                      <button 
                        className="w-full px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-100 flex items-center justify-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Book Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(prev => prev - 1)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-white"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No resources available</h3>
            <p className="text-slate-500 mt-1 max-w-xs">
              We couldn't find any active resources matching your search or filters at this time.
            </p>
            <button 
              onClick={() => { setSearch(''); setFilterType('All'); }}
              className="mt-6 text-blue-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 Smart Campus Management System</p>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserResourcePage;
