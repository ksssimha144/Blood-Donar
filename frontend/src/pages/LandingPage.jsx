import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBloodDonors from '../hooks/useBloodDonors';
import DonorCard from '../components/DonorCard';
import { AREAS, BLOOD_GROUPS } from '../constants';

function LandingPage() {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({ area: 'Hyderabad', bloodGroup: 'All' });
  const { donors, loading, hasSearched, searchDonors } = useBloodDonors();

  // Initial load to show donors on landing page
  useEffect(() => {
    searchDonors({
      area: 'Hyderabad',
      bloodGroup: 'All',
      subArea: 'All'
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchDonors({
      area: searchCriteria.area,
      bloodGroup: searchCriteria.bloodGroup,
      subArea: 'All'
    });
  };

  const handleActionIntercept = () => {
    // Both Contact and Request require login
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* PREMIUM HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">Emergency Blood Connect</span>
          <h1 className="hero-title">
            VITAL <span>BLOOD</span>
          </h1>
          <p className="hero-subtitle">
            Connecting life-savers with those in need. Every drop counts, 
            every second matters. Join India's most trusted blood donation network.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button className="primary" onClick={() => document.getElementById('search-start').scrollIntoView({ behavior: 'smooth' })}>
              Find Donors
            </button>
            <button className="btn-reject" onClick={() => navigate('/register')} style={{ padding: '0 2rem' }}>
              Register Now
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img 
            src="/assets/hero-blood.png" 
            alt="Vital Blood Illustration" 
            className="hero-image"
          />
        </div>
      </section>

      <main className="page-main" id="search-start">
        {/* UPDATED SEARCH SECTION */}
        <section className="search-section-wrap" style={{ marginBottom: '4rem' }}>
          <form className="search-section" onSubmit={handleSearch} style={{ border: '2px solid var(--color-primary)', background: 'white' }}>
            <div className="form-group">
              <label>AREA</label>
              <select
                value={searchCriteria.area}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, area: e.target.value }))}
              >
                {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>BLOOD GROUP</label>
              <select
                value={searchCriteria.bloodGroup}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, bloodGroup: e.target.value }))}
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search Donors'}
            </button>
          </form>
        </section>

        {/* DONOR RESULTS SECTION */}
        <section className="results-wrap">
          <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="page-title" style={{ fontSize: '24px' }}>Available Donors</h2>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Showing top results in {searchCriteria.area}</span>
          </div>

          {donors.length > 0 ? (
            <div className="donor-grid">
              {/* Show top donors */}
              {donors.slice(0, 6).map(donor => (
                <DonorCard
                  key={donor._id}
                  donor={donor}
                  onAction={handleActionIntercept}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-message">No donors found for this criteria.</p>
              <p className="empty-hint">Try searching in a broader area or different blood group.</p>
            </div>
          )}
        </section>

        <section className="cta-container-minimal" style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '4rem' }}>
          <div className="hero-content" style={{ textAlign: 'center', margin: '0 auto', alignItems: 'center' }}>
            <h3 className="hero-title" style={{ fontSize: '32px', marginBottom: '1rem' }}>Ready to make a difference?</h3>
            <p className="hero-subtitle" style={{ margin: '0 auto 2rem auto' }}>Log in to post a request or become a verified donor in our community.</p>
            <div className="hero-actions" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button className="primary" onClick={() => navigate('/login')}>
                Login to Portal
              </button>
              <button className="btn-reject" onClick={() => navigate('/register')} style={{ padding: '0 2rem', height: '48px', minWidth: '180px' }}>
                Create Account
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
