import { useState } from 'react';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

function DonorCard({ donor, onAction }) {
  const { token } = useAuth();
  const [isRequested, setIsRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstLetter = donor.name.charAt(0).toUpperCase();

  const handleActionIntercept = (e, type) => {
    if (onAction) {
      e.preventDefault();
      onAction(type);
      return true;
    }
    return false;
  };

  const handleRequest = async (e) => {
    // If onAction returns true, it means login is required or another action intercepted
    if (handleActionIntercept(e, 'request')) return;
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          donorId: donor._id,
          // requesterName is now handled by backend via req.user.name
          bloodGroup: donor.bloodGroup,
          area: donor.area,
        }),
      });

      if (response.ok) {
        setIsRequested(true);
      } else {
        const errorData = await response.json();
        console.error('Request failed:', errorData.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="minimal-donor-card" role="article">
      <header className="card-header-minimal">
        <div className="avatar-wrapper">
          <div className="avatar-circle">{firstLetter}</div>
          <span className={`availability-dot ${donor.isAvailable ? 'online' : 'offline'}`} 
                title={donor.isAvailable ? 'Available' : 'Busy'}></span>
        </div>
        <div className="blood-badge-minimal">
          {donor.bloodGroup}
        </div>
      </header>

      <div className="card-content-minimal">
        <h3 className="donor-name-minimal">{donor.name}</h3>
        <p className="donor-location-minimal">
          <span className="icon-city">🏙️</span> {donor.area} &bull; <span className="sub-area-text">{donor.subArea}</span>
        </p>
        <p className="donor-phone-minimal">
          <span className="icon-phone">📞</span> {donor.phone}
        </p>
        
        <div className="status-row-minimal">
          <span className="available-tag">AVAILABLE</span>
          <span className="separator-dot">&bull;</span>
          <span className="last-donated-text">Last donated: 4 months ago</span>
        </div>
      </div>

      <footer className="card-footer-minimal">
        <div className="action-buttons-group">
          <a 
            href={`tel:${donor.phone}`} 
            className="btn-contact-minimal"
            onClick={(e) => handleActionIntercept(e, 'contact')}
          >
            Contact
          </a>
          <button 
            className={`btn-request-minimal ${isRequested ? 'requested' : ''}`}
            onClick={handleRequest}
            disabled={loading || isRequested}
          >
            {loading ? '...' : isRequested ? 'Requested ✓' : 'Request Blood'}
          </button>
        </div>
        <button className="btn-share-minimal" aria-label="Share">
          🔗
        </button>
      </footer>
    </article>
  );
}

export default DonorCard;
