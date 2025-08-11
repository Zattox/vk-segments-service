import React, { useState, useEffect } from 'react';
import { segmentsAPI } from '../services/api';

const SegmentManager = ({ onError, onSuccess }) => {
  const [segments, setSegments] = useState([]);
  const [distributionData, setDistributionData] = useState({
    segment_name: '',
    percentage: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await segmentsAPI.getAll();
      setSegments(response.data);
    } catch (error) {
      onError('Failed to fetch segments');
    }
  };

  const handleDelete = async (segmentId) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      try {
        await segmentsAPI.delete(segmentId);
        onSuccess('Segment deleted successfully!');
        fetchSegments();
      } catch (error) {
        onError(error.response?.data?.detail || 'Failed to delete segment');
      }
    }
  };

  const handleDistribute = async (e) => {
    e.preventDefault();
    if (!distributionData.segment_name || !distributionData.percentage) {
      onError('Please select a segment and enter percentage');
      return;
    }

    setIsLoading(true);
    try {
      const response = await segmentsAPI.distribute(distributionData);
      const result = response.data;
      onSuccess(
        `Distribution completed! Assigned ${result.assigned_users} users (${result.percentage_achieved.toFixed(2)}%) to ${result.segment_name}`
      );
      setDistributionData({ segment_name: '', percentage: '' });
    } catch (error) {
      onError(error.response?.data?.detail || 'Failed to distribute segment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributionChange = (e) => {
    setDistributionData({
      ...distributionData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="segments-list">
        <h3>Current Segments</h3>
        {segments.length === 0 ? (
          <p>No segments found.</p>
        ) : (
          segments.map(segment => (
            <div key={segment.id} className="segment-item">
              <h4>{segment.name}</h4>
              <p>{segment.description || 'No description'}</p>
              <p><small>Status: {segment.is_active ? 'Active' : 'Inactive'}</small></p>
              <div className="segment-actions">
                <button
                  onClick={() => handleDelete(segment.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="distribution-form">
        <h3>Distribute Segment</h3>
        <form onSubmit={handleDistribute}>
          <div className="form-group">
            <label htmlFor="segment_name">Select Segment:</label>
            <select
              id="segment_name"
              name="segment_name"
              value={distributionData.segment_name}
              onChange={handleDistributionChange}
              required
            >
              <option value="">-- Select a segment --</option>
              {segments.filter(s => s.is_active).map(segment => (
                <option key={segment.id} value={segment.name}>
                  {segment.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="percentage">Percentage of Users (%):</label>
            <input
              type="number"
              id="percentage"
              name="percentage"
              value={distributionData.percentage}
              onChange={handleDistributionChange}
              min="0"
              max="100"
              step="0.1"
              required
              placeholder="e.g., 30"
            />
          </div>
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Distributing...' : 'Distribute Segment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SegmentManager;