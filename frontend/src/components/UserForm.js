import React, { useState } from 'react';
import { usersAPI } from '../services/api';

const UserForm = ({ onUserCreated, onError, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
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
      const response = await usersAPI.create(formData);
      onSuccess('User created successfully!');
      setFormData({ username: '', email: '' });
      if (onUserCreated) onUserCreated(response.data);
    } catch (error) {
      onError(error.response?.data?.detail || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="e.g., user1"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email (optional):</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
        />
      </div>
      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export default UserForm;
