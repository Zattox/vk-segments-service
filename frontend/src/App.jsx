import React, {useState, useCallback} from 'react';
import UserForm from './components/UserForm';
import SegmentForm from './components/SegmentForm';
import UserSegments from './components/UserSegments';
import SegmentManager from './components/SegmentManager';
import './index.css';

function App() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [segmentsVersion, setSegmentsVersion] = useState(0);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleSuccess = text => showMessage(text, 'success');
  const handleError = text => showMessage(text, 'error');

  // increment to signal segments list changed
  const bumpSegmentsVersion = useCallback(() => {
    setSegmentsVersion(v => v + 1);
  }, []);

  return (
    <div className="app-container">
      <h1>Manage user segments for experiments and feature testing</h1>
      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}
      <div className="dashboard">
        <div className="section">
          <h2>Create User</h2>
          <UserForm
            onUserCreated={() => {
            }}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
        <div className="section">
          <h2>Create Segment</h2>
          <SegmentForm
            onSuccess={handleSuccess}
            onError={handleError}
            onSegmentCreated={bumpSegmentsVersion}
          />
        </div>
      </div>
      <div className="dashboard">
        <div className="section">
          <h2>Assign / Remove User Segments</h2>
          <UserSegments
            onSuccess={handleSuccess}
            onError={handleError}
            segmentsVersion={segmentsVersion}
          />
        </div>
        <div className="section">
          <h2>Manage Segments</h2>
          <SegmentManager
            onSuccess={handleSuccess}
            onError={handleError}
            onSegmentDeleted={bumpSegmentsVersion}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
