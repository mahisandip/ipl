import { useState, useEffect } from 'react'; // Add this import
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyPolls from './pages/MyPolls';
import PollPointsUpdate from './pages/PollPointsUpdate';
import PollDetail from './pages/PollDetail';
import PollVotePage from './pages/PollVotePage';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );
  
  // Listen for storage changes
  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('adminToken'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/ipl/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
		<Route path="/poll/:id" element={<PollDetail />} /> 
		<Route path="/submit/:id" element={<PollVotePage />} />
		<Route 
		  path="/mypolls" 
		  element={isAuthenticated ? <MyPolls /> : <Navigate to="/login" />}
		/>
		<Route 
		  path="/points/:id" 
		  element={isAuthenticated ? <PollPointsUpdate /> : <Navigate to="/login" />}
		/>
		<Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;