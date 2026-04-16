import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditResourcePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'Available',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/resources/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.capacity <= 0) {
      setError('Capacity must be greater than 0');
      return;
    }
    
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/resources/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/resources');
    } catch (err) {
      console.error(err);
      setError('Failed to update resource. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !formData.name) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Edit Resource</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type *</label>
          <input 
            type="text" 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Capacity *</label>
          <input 
            type="number" 
            name="capacity" 
            value={formData.capacity} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button" 
            onClick={() => navigate('/resources')}
            style={{ padding: '10px', flex: 1, backgroundColor: '#f4f4f4', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            style={{ padding: '10px', flex: 1, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResourcePage;