import React, {useState, useEffect, useCallback} from 'react';
import {usersAPI, segmentsAPI} from '../services/api';

const UserSegments = ({onError, onSuccess}) => {
  const [users, setUsers] = useState([]);
  const [segments, setSegments] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [userSegments, setUserSegments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data);
    } catch {
      onError('Failed to fetch users');
    }
  }, [onError]);

  const fetchAllSegments = useCallback(async () => {
    try {
      const res = await segmentsAPI.getAll();
      setSegments(res.data);
    } catch {
      onError('Failed to fetch segments');
    }
  }, [onError]);

  useEffect(() => {
    fetchUsers();
    fetchAllSegments();
  }, [fetchUsers, fetchAllSegments]);

  const fetchUserSegments = async username => {
    if (!username) {
      setUserSegments([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await usersAPI.getUserSegments(username);
      setUserSegments(res.data);
    } catch {
      onError('Failed to fetch user segments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = e => {
    const u = e.target.value;
    setSelectedUsername(u);
    fetchUserSegments(u);
  };

  const availableSegments = () => {
    const assigned = userSegments.map(s => s.name);
    return segments.filter(s => !assigned.includes(s.name));
  };

  const handleAdd = async name => {
    try {
      await usersAPI.addToSegment(selectedUsername, name);
      onSuccess(`Segment "${name}" added`);
      fetchUserSegments(selectedUsername);
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to add segment');
    }
  };

  const handleRemove = async name => {
    try {
      await usersAPI.removeFromSegment(selectedUsername, name);
      onSuccess(`Segment "${name}" removed`);
      fetchUserSegments(selectedUsername);
    } catch {
      onError('Failed to remove segment');
    }
  };

  return (
    <>
      <div className="form-group">
        <label className="form-label" htmlFor="select-user">
          Select User
        </label>
        <select
          id="select-user"
          className="form-select"
          value={selectedUsername}
          onChange={handleUserSelect}
        >
          <option value="">-- Select a user --</option>
          {users.map(u => (
            <option key={u.username} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <div className="loading">Loading segments…</div>}

      {!isLoading && selectedUsername && (
        <ul className="segment-list user-segments">
          {userSegments.length === 0 ? (
            <li className="empty-state">This user has no segments.</li>
          ) : (
            userSegments.map(s => (
              <li key={s.name} className="segment-item">
                <div className="d-flex align-items-center segment-info">
                  <span className="segment-tag">{s.name}</span>
                  <span className={`status-badge ${s.is_active ? 'status-active' : 'status-inactive'}`}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleRemove(s.name)}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {!isLoading && selectedUsername && segments.length > 0 && (
        <div className="available-segments">
          <h3>Available Segments</h3>
          <ul className="segment-list">
            {availableSegments().length === 0 ? (
              <li className="empty-state">All segments assigned.</li>
            ) : (
              availableSegments().map(s => (
                <li key={s.name} className="segment-item inactive">
                  <div className="d-flex align-items-center segment-info">
                    <span className="segment-tag">{s.name}</span>
                    <span className="status-badge status-inactive">Not Assigned</span>
                  </div>
                  <button
                    className="btn btn-small btn-success"
                    onClick={() => handleAdd(s.name)}
                  >
                    Add
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default UserSegments;
