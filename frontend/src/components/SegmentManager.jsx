import React, {useState, useEffect} from 'react';
import {segmentsAPI} from '../services/api';

const SegmentManager = ({onError, onSuccess}) => {
  const [segments, setSegments] = useState([]);
  const [distribution, setDistribution] = useState({segment_name: '', percentage: ''});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await segmentsAPI.getAll();
      setSegments(res.data);
    } catch {
      onError('Failed to fetch segments');
    }
  };

  const handleDelete = async name => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await segmentsAPI.delete(name);
      onSuccess('Segment deleted successfully!');
      fetchAll();
    } catch {
      onError('Failed to delete segment');
    }
  };

  const handleDistChange = e => {
    setDistribution({...distribution, [e.target.name]: e.target.value});
  };

  const handleDistribute = async e => {
    e.preventDefault();
    if (!distribution.segment_name || !distribution.percentage) {
      onError('Please select segment and percentage');
      return;
    }
    setIsLoading(true);
    try {
      const res = await segmentsAPI.distribute(
        distribution.segment_name,
        parseFloat(distribution.percentage)
      );
      onSuccess(`Assigned ${res.data.assigned_users} users to ${res.data.segment_name}`);
      setDistribution({segment_name: '', percentage: ''});
    } catch {
      onError('Failed to distribute');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3>Current Segments</h3>

      <ul className="segment-list">
        {segments.length === 0 ? (
          <li className="empty-state">No segments found.</li>
        ) : (
          segments.map(s => (
            <li key={s.name} className={`segment-item ${s.is_active ? '' : 'inactive'}`}>
              <div className="segment-info">
                <h4>{s.name}</h4>
                <p>{s.description || 'No description'}</p>
                <span className={`status-badge ${s.is_active ? 'status-active' : 'status-inactive'}`}>
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(s.name)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      <form className="section" onSubmit={handleDistribute}>
        <h3>Distribute Segment</h3>
        <div className="form-group">
          <label htmlFor="dist-segment" className="form-label">
            Select Segment
          </label>
          <select
            id="dist-segment"
            name="segment_name"
            className="form-select"
            value={distribution.segment_name}
            onChange={handleDistChange}
          >
            <option value="">-- Select a segment --</option>
            {segments.map(s => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dist-percent" className="form-label">
            Percentage of Users (%)
          </label>
          <input
            id="dist-percent"
            name="percentage"
            type="number"
            className="form-control"
            placeholder="e.g., 30"
            value={distribution.percentage}
            onChange={handleDistChange}
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={isLoading}>
          {isLoading ? 'Distributing…' : 'Distribute'}
        </button>
      </form>
    </>
  );
};

export default SegmentManager;
