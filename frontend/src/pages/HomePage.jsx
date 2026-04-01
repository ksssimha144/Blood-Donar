import { useState, useEffect, useCallback } from 'react';
import SearchForm from '../components/SearchForm';
import DonorList from '../components/DonorList';
import DonorRegistration from '../components/DonorRegistration';
import useBloodDonors from '../hooks/useBloodDonors';
import { AREAS, BLOOD_GROUPS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bloodGroup, setBloodGroup] = useState('All');
  const [area, setArea] = useState('Hyderabad');
  const [subArea, setSubArea] = useState('All');

  const { donors, loading: apiLoading, apiError, searchDonors, hasSearched } = useBloodDonors();

  const handleSearch = useCallback(() => {
    searchDonors({
      lat: null,
      lng: null,
      bloodGroup,
      area,
      subArea,
    });
  }, [bloodGroup, area, subArea, searchDonors]);

  // Initial load
  useEffect(() => {
    handleSearch();
  }, []); // Only on mount

  const loading = apiLoading;

  return (
    <div className="home-container">
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
          <div className="hero-actions">
            <button className="primary" onClick={() => document.getElementById('search-start').scrollIntoView({ behavior: 'smooth' })}>
              Find Donors Now
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
        <section className="search-section-wrap">
          <SearchForm
            area={area}
            setArea={setArea}
            areas={AREAS}
            subArea={subArea}
            setSubArea={setSubArea}
            bloodGroup={bloodGroup}
            setBloodGroup={setBloodGroup}
            bloodGroups={BLOOD_GROUPS}
            handleFindDonors={handleSearch}
            loading={loading}
          />
        </section>

        {apiError && (
          <div className="alert-box alert-error" role="alert">
            <p>{apiError}</p>
          </div>
        )}

        <section className="results-wrap">
          <DonorList
            donors={donors}
            loading={apiLoading}
            area={area}
            hasSearched={hasSearched}
          />
        </section>

        <section className="registration-wrap">
          {user?.isDonor ? (
            <div className="donor-invite-box" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid #dbeafe' }}>
              <h3 style={{ color: '#1e40af' }}>You are a Life-Saver</h3>
              <p>
                Your profile is active in the VITAL BLOOD network. 
                Manage your incoming requests and update your availability in your dashboard.
              </p>
              <button className="primary" onClick={() => navigate('/requests')} style={{ background: '#2563eb' }}>
                Go to Donor Dashboard
              </button>
            </div>
          ) : (
            <DonorRegistration />
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
