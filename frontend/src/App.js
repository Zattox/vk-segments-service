import React, { useState } from 'react';
import './App.css';
import SegmentForm from './components/SegmentForm';
import SegmentManager from './components/SegmentManager';
import UserSegments from './components/UserSegments';

function App() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleSuccess = (text) => showMessage(text, 'success');
  const handleError = (text) => showMessage(text, 'error');

  return (
    <div className="App">
      <header className="App-header">
        <h1>VK User Segments Manager</h1>
        <p>Manage user segments for experiments and feature testing</p>
      </header>

      {message && (
        <div className={`${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}

      <div className="dashboard">
        <div className="section">
          <h2>Create New Segment</h2>
          <SegmentForm
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        <div className="section">
          <h2>View User Segments</h2>
          <UserSegments
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        <div className="section" style={{ gridColumn: '1 / -1' }}>
          <h2>Manage Segments</h2>
          <SegmentManager
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
