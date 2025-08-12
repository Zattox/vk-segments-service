import React, {useState, useEffect} from 'react';
import {segmentsAPI} from '../services/api';

const SegmentManager = ({onError, onSuccess, onSegmentDeleted}) => {
  const [segments, setSegments] = useState([]);
  const [distribution, setDistribution] = useState({
    segment_name: '',
    percentage: '',
  });
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
      onSegmentDeleted();
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
      onSuccess(
        `Assigned ${res.data.assigned_users} users to ${res.data.segment_name}`
      );
      setDistribution({segment_name: '', percentage: ''});
    } catch {
      onError('Failed to distribute');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ul className="segment-list">
        {segments.map(s => (
          <li
            key={s.name}
            className={`segment-item ${s.is_active ? '' : 'inactive'}`}
          >
            <div className="segment-info">
              <h4>{s.name}</h4>
              <p>{s.description || 'No description'}</p>
            </div>
            <button
              className="btn btn-danger btn-small"
              onClick={() => handleDelete(s.name)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleDistribute} className="mt-3">
        <div className="form-group">
          <label className="form-label">Segment</label>
          <select
            name="segment_name"
            className="form-select"
            value={distribution.segment_name}
            onChange={handleDistChange}
          >
            <option value="">Select…</option>
            {segments.map(s => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Percentage %</label>
          <input
            type="number"
            name="percentage"
            className="form-control"
            value={distribution.percentage}
            onChange={handleDistChange}
          />
        </div>
        <button className="btn btn-success" disabled={isLoading}>
          Distribute
        </button>
      </form>
    </>
  );
};

export default SegmentManager;
