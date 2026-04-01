import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

function DonorRequests() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('sent'); // 'sent' or 'received'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // Track in-flight request ID

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = activeTab === 'sent' ? 'requests/my-requests' : 'requests/received';
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.data || []);
      } else {
        throw new Error(data.message || 'Could not load requests.');
      }
    } catch (err) {
      setError(err.message || 'Could not load requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests(prev => 
          prev.map(req => req._id === requestId ? { ...req, status: newStatus } : req)
        );
      } else {
        const errorData = await response.json();
        console.error('Status update failed:', errorData.message);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="requests-container">
      <header className="page-header">
        <h2 className="page-title">Donor Dashboard</h2>
        <p className="page-subtitle">Manage your blood requests and incoming donation offers.</p>
      </header>

      {/* Tabs Selection Bar */}
      <div className="tabs-bar">
        <button 
          className={`tab-item ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Requested by Me
        </button>
        <button 
          className={`tab-item ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Requests Received
        </button>
      </div>

      <main className="page-main">
        {error && (
          <div className="auth-error-box" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No requests found in this category.</p>
            <p className="empty-hint">
              {activeTab === 'sent' 
                ? "Your life-saving requests will appear here after you reach out to donors."
                : "Incoming requests from recipients will appear here when they need your help."}
            </p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map(req => (
              <div key={req._id} className={`request-card status-${req.status}`}>
                <div className="req-header">
                  <span className={`status-pill ${req.status}`}>{req.status.toUpperCase()}</span>
                  <span className="req-blood">{req.bloodGroup}</span>
                </div>
                
                <div className="req-body">
                  <h3 className="requester-name">
                    {activeTab === 'sent' 
                      ? (req.donorId?.name || 'Assigned Donor') 
                      : req.requesterName}
                  </h3>
                  <p className="req-meta">
                    🏙️ {req.area} &bull; {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                  {activeTab === 'sent' && req.bloodGroup && (
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                      Requested Blood Group: <strong>{req.bloodGroup}</strong>
                    </p>
                  )}
                </div>

                <footer className="req-footer">
                  {activeTab === 'received' && req.status === 'pending' ? (
                    <div className="action-buttons-group">
                      <button 
                        className="btn-accept" 
                        onClick={() => handleStatusUpdate(req._id, 'accepted')}
                        disabled={processingId === req._id}
                        style={{ opacity: processingId === req._id ? 0.6 : 1 }}
                      >
                        {processingId === req._id ? '...' : 'Accept'}
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                        disabled={processingId === req._id}
                        style={{ opacity: processingId === req._id ? 0.6 : 1 }}
                      >
                        {processingId === req._id ? '...' : 'Reject'}
                      </button>
                    </div>
                  ) : (
                    <span className="status-note">
                      {req.status === 'accepted' 
                        ? (activeTab === 'sent' 
                            ? 'The donor has accepted! You can now contact them.' 
                            : 'Handshake established. Please contact the recipient.') 
                        : req.status === 'rejected' 
                          ? (activeTab === 'sent' 
                              ? 'The donor declined this request.' 
                              : 'Request declined.')
                          : 'Waiting for response...'}
                    </span>
                  )}
                </footer>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DonorRequests;
