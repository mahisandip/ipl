import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/public/leaderboard');
        setLeaders(response.data);
      } catch (err) {
        setError('Failed to fetch leaderboard.' + err.message);
      }
    };

    fetchLeaderboard();
  }, []);
  
  const handleHomeClick = () => {
    navigate(`/dashboard`);
  };

  if (error) return <div className="leaderboard-error">{error}</div>;
  if (!leaders.length) return <div className="leaderboard-loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container">
      <div className="top-buttons">
        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
      </div>
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-list">
        {leaders.map((leader) => (
          <div key={leader.id} className="leaderboard-entry">
            <span className="leader-name">{leader.voter}</span>
            <span className="leader-points">{leader.point ?? 0} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
