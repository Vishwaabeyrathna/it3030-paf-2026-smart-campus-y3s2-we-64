import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResourceListPage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/resources', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(response.data.content ?? response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError('Failed to fetch resources');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Resources List</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={() => navigate('/resources/new')}
            style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            + Add Resource
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Capacity</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <tr key={resource.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{resource.name}</td>
                <td style={{ padding: '12px' }}>{resource.type}</td>
                <td style={{ padding: '12px' }}>{resource.capacity}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: resource.status === 'Available' ? '#d4edda' : '#f8d7da',
                    color: resource.status === 'Available' ? '#155724' : '#721c24'
                  }}>
                    {resource.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => navigate(`/resources/${resource.id}`)}
                    style={{ marginRight: '8px', padding: '6px 12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate(`/resources/edit/${resource.id}`)}
                    style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                No resources found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceListPage;
