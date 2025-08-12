import React, {useState} from 'react';
import {usersAPI} from '../services/api';

const UserForm = ({onUserCreated, onError, onSuccess}) => {
  const [formData, setFormData] = useState({username: '', email: ''});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await usersAPI.create(formData);
      onSuccess('User created successfully!');
      setFormData({username: '', email: ''});
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
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="form-control"
          placeholder="e.g., user1"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          placeholder="user@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? 'Creating…' : 'Create User'}
      </button>
    </form>
  );
};

export default UserForm;
