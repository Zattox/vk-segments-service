import React, { useState } from 'react';
import { segmentsAPI } from '../services/api';

const SegmentForm = ({ onSegmentCreated, onError, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await segmentsAPI.create(formData);
      onSuccess('Segment created successfully!');
      setFormData({ name: '', description: '' });
      if (onSegmentCreated) {
        onSegmentCreated(response.data);
      }
    } catch (error) {
      onError(error.response?.data?.detail || 'Failed to create segment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Segment Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., MAIL_VOICE_MESSAGES"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the segment..."
        />
      </div>
      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Segment'}
      </button>
    </form>
  );
};

export default SegmentForm;
