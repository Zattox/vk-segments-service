import React, {useState} from 'react';
import UserForm from './components/UserForm';
import SegmentForm from './components/SegmentForm';
import UserSegments from './components/UserSegments';
import SegmentManager from './components/SegmentManager';
import './index.css';

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
    <div className="app-container">
      <h1>VK User Segments Manager</h1>
      <p>Manage user segments for experiments and feature testing</p>

      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="dashboard">
        <div className="section">
          <h2>Create New User</h2>
          <UserForm onSuccess={handleSuccess} onError={handleError}/>
        </div>
        <div className="section">
          <h2>Create New Segment</h2>
          <SegmentForm onSuccess={handleSuccess} onError={handleError}/>
        </div>
      </div>

      <div className="dashboard">
        <div className="section full-width">
          <h2>View User Segments</h2>
          <UserSegments onSuccess={handleSuccess} onError={handleError}/>
        </div>
        <div className="section full-width">
          <h2>Manage Segments</h2>
          <SegmentManager onSuccess={handleSuccess} onError={handleError}/>
        </div>
      </div>
    </div>
  );
}

export default App;
