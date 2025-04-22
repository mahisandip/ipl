import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check for session expiration query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setSessionExpired(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://192.168.10.102:8080/api/admin/login', { 
        username, 
        password 
      });
  
      const token = response.data.token;
      if (!token) throw new Error('No token received');
  
      localStorage.setItem('adminToken', token);
      console.log('🟢 Auth status:', !!localStorage.getItem('adminToken'));
  
      // Force app to recognize auth change
      window.dispatchEvent(new Event('storage'));
      
      navigate('/dashboard', { replace: true }); // replace: true prevents going back
    } catch (err) {
      console.error('🔴 Full error:', err);
      setError(err.response?.data?.error || err.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Admin Login</h2>

      {/* Session expired message */}
      {sessionExpired && (
        <p style={{ color: 'red', backgroundColor: '#ffeaea', padding: '10px', borderRadius: '4px' }}>
          Session expired. Please login again.
        </p>
      )}

      {/* Other login error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
