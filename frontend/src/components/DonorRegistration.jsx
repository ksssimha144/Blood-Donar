import { useState } from 'react';
import { AREAS, SUB_AREAS, API_BASE_URL, BLOOD_GROUPS } from '../constants';
import { useAuth } from '../context/AuthContext';

/**
 * RegistrationForm: Extracted to prevent re-mounting on every DonorRegistration render.
 */
const RegistrationForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  setIsFormVisible, 
  loading, 
  success, 
  error 
}) => {
  return (
    <div className="reg-modal-overlay">
      <div className="reg-modal-content">
        <header className="reg-header">
          <h3 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Register as a Donor</h3>
          <button className="close-btn" onClick={() => setIsFormVisible(false)} aria-label="Close">×</button>
        </header>

        {success ? (
          <div className="reg-success">
            <span className="success-icon">✅</span>
            <h4 style={{ fontSize: '20px', fontWeight: '600' }}>Registration Successful!</h4>
            <p style={{ color: '#64748b', marginTop: '10px' }}>Thank you for joining the VITAL BLOOD network. You're a hero!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reg-form">
            <div className="reg-form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="reg-row">
              <div className="reg-form-group">
                <label>BLOOD GROUP</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  {BLOOD_GROUPS.filter(g => g !== 'All').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="reg-form-group">
                <label>PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  required
                />
              </div>
            </div>

            <div className="reg-row">
              <div className="reg-form-group">
                <label>CITY</label>
                <select name="area" value={formData.area} onChange={handleChange}>
                  {AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="reg-form-group">
                <label>SUB-AREA</label>
                <select name="subArea" value={formData.subArea} onChange={handleChange}>
                  {SUB_AREAS[formData.area].map(sa => (
                    <option key={sa} value={sa}>{sa}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable-check"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="isAvailable-check" className="checkbox-label-text" style={{ fontSize: '14.5px', fontWeight: '500', color: '#1f2937', cursor: 'pointer' }}>
                Available to donate now
              </label>
            </div>

            {error && <p className="reg-error" style={{ color: '#e63946', fontSize: '13px', marginTop: '12px', fontWeight: '500' }}>{error}</p>}

            <button type="submit" className="contribute-btn primary" disabled={loading} style={{ width: '100%', height: '56px', marginTop: '1.5rem', borderRadius: '12px', fontWeight: '600' }}>
              {loading ? 'Registering...' : 'Register as Donor'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const DonorRegistration = () => {
  const { token } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: 'A+',
    area: 'Hyderabad',
    subArea: 'All',
    phone: '',
    isAvailable: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'area') {
      setFormData(prev => ({ ...prev, subArea: 'All' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('You must be logged in to register as a donor.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/donors`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed. Please check your data.');
      }

      setIsDonor(true);
      setSuccess(true);
      setTimeout(() => {
        setIsFormVisible(false);
        setSuccess(false);
        setFormData({ name: '', bloodGroup: 'A+', area: 'Hyderabad', subArea: 'All', phone: '', isAvailable: true });
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="donor-invite-box">
        <h3>Become a Lifesaver Today</h3>
        <p>
          Your contribution can save lives. Join the VITAL BLOOD network today
          and become the hero someone is waiting for in their critical time.
        </p>
        {/* Fixed: One-way toggle to ensure form remains open */}
        <button 
          className="contribute-btn primary" 
          onClick={() => setIsFormVisible(true)} 
          style={{ borderRadius: '10px', fontWeight: '600' }}
        >
          Want to Contribute
        </button>
      </section>

      {isFormVisible && (
        <RegistrationForm 
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setIsFormVisible={setIsFormVisible}
          loading={loading}
          success={success}
          error={error}
        />
      )}
    </>
  );
};

export default DonorRegistration;
