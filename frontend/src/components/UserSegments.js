import React, { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';

const UserSegments = ({ onError, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSegments, setUserSegments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      onError('Failed to fetch users');
    }
  }, [onError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserSegments = async (userId) => {
    if (!userId) {
      setUserSegments([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await usersAPI.getUserSegments(userId);
      setUserSegments(response.data);
    } catch (error) {
      onError('Failed to fetch user segments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    fetchUserSegments(userId);
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="userSelect">Select User:</label>
        <select
          id="userSelect"
          value={selectedUserId}
          onChange={handleUserSelect}
        >
          <option value="">-- Select a user --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <div>
          <h3>User Segments</h3>
          {isLoading ? (
            <div className="loading">Loading segments...</div>
          ) : (
            <div>
              {userSegments.length === 0 ? (
                <p>This user is not assigned to any segments.</p>
              ) : (
                <div className="user-segments">
                  {userSegments.map(segment => (
                    <span key={segment.id} className="segment-tag">
                      {segment.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSegments;
