import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(name, email, password);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Registration failed. Please check your information.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the VITAL BLOOD community</p>
        </header>

        {error && <div className="auth-error-box">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>FULL NAME</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required 
            />
          </div>

          <button type="submit" className="primary auth-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register as Donor'}
          </button>
        </form>

        <footer className="auth-footer">
          <p>Already have an account? <Link to="/login">Login Here</Link></p>
        </footer>
      </div>
    </div>
  );
}

export default RegisterPage;
