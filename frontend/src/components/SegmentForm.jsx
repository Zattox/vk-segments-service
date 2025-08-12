import React, {useState} from 'react';
import {segmentsAPI} from '../services/api';

const SegmentForm = ({onError, onSuccess, onSegmentCreated}) => {
  const [formData, setFormData] = useState({name: '', description: ''});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await segmentsAPI.create(formData);
      onSuccess('Segment created successfully!');
      onSegmentCreated();           // уведомляем App о новом сегменте
      setFormData({name: '', description: ''});
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to create segment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="segment-name" className="form-label">
          Segment Name
        </label>
        <input
          id="segment-name"
          name="name"
          className="form-control"
          placeholder="e.g., MAIL_VOICE_MESSAGE"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="segment-desc" className="form-label">
          Description
        </label>
        <textarea
          id="segment-desc"
          name="description"
          className="form-control"
          placeholder="Brief description of the segment…"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? 'Creating…' : 'Create Segment'}
      </button>
    </form>
  );
};

export default SegmentForm;
