import React, {useState, useEffect, useCallback} from 'react';
import {usersAPI, segmentsAPI} from '../services/api';

const UserSegments = ({onError, onSuccess, segmentsVersion}) => {
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

  // re-fetch segment list whenever segmentsVersion changes
  useEffect(() => {
    fetchAllSegments();
    // if a user is selected, re-fetch that user's segments too
    if (selectedUsername) {
      fetchUserSegments(selectedUsername);
    }
  }, [segmentsVersion]);

  // initial load of users and segments
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
        <label className="form-label">User</label>
        <select
          className="form-select"
          value={selectedUsername}
          onChange={handleUserSelect}
        >
          <option value="">Select…</option>
          {users.map(u => (
            <option key={u.username} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="loading">Loading…</div>
      ) : (
        <>
          <div className="user-segments">
            <h3>Assigned Segments</h3>
            <ul className="segment-list">
              {userSegments.map(s => (
                <li key={s.name} className="segment-item">
                  <span className="segment-info">
                    <h4>{s.name}</h4>
                    <p>{s.description}</p>
                  </span>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleRemove(s.name)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {userSegments.length === 0 && (
                <div className="empty-state">No segments assigned</div>
              )}
            </ul>
          </div>
          <div className="available-segments">
            <h3>Available Segments</h3>
            <ul className="segment-list">
              {availableSegments().map(s => (
                <li key={s.name} className="segment-item">
                  <span className="segment-info">
                    <h4>{s.name}</h4>
                    <p>{s.description}</p>
                  </span>
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => handleAdd(s.name)}
                  >
                    Add
                  </button>
                </li>
              ))}
              {availableSegments().length === 0 && (
                <div className="empty-state">No available segments</div>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default UserSegments;
