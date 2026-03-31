import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddResourcePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'Available' // Default value
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type.trim()) newErrors.type = 'Type is required';
    
    // Capacity should be required and > 0
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (parseInt(formData.capacity, 10) <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }

    if (!formData.status.trim()) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/resources', 
        {
          name: formData.name,
          type: formData.type,
          capacity: parseInt(formData.capacity, 10),
          status: formData.status
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Navigate back to the resource list upon success
      navigate('/resources');
    } catch (err) {
      console.error("Error creating resource:", err);
      setSubmitError('Failed to create resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Add New Resource</h2>
        <button 
          onClick={() => navigate('/resources')}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Back to List
        </button>
      </div>

      {submitError && <div style={{ color: 'red', marginBottom: '15px' }}>{submitError}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. Projector Room A"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type *</label>
          <input 
            type="text" 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            placeholder="e.g. Room, Equipment"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {errors.type && <span style={{ color: 'red', fontSize: '12px' }}>{errors.type}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Capacity *</label>
          <input 
            type="number" 
            name="capacity" 
            value={formData.capacity} 
            onChange={handleChange} 
            placeholder="e.g. 30"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {errors.capacity && <span style={{ color: 'red', fontSize: '12px' }}>{errors.capacity}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status *</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          {errors.status && <span style={{ color: 'red', fontSize: '12px' }}>{errors.status}</span>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '10px', 
            padding: '12px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            backgroundColor: loading ? '#a0c4ff' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Saving...' : 'Create Resource'}
        </button>
      </form>
    </div>
  );
};

export default AddResourcePage;