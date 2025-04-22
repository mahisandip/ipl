// src/components/PollPointsUpdate.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import './PollPointsUpdate.css';

const PollPointsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [voters, setVoters] = useState([]);
  const [points, setPoints] = useState({});
  const [showPointsSection, setShowPointsSection] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/public/poll/${id}`);
        setPoll(response.data);
      } catch (err) {
        setError('Failed to fetch poll details. ' + err);
      }
    };

    fetchPoll();
  }, [id]);
  
  const handleHomeClick = () => {
    navigate(`/poll/${id}`);
  };

  const handleUpdatePointsClick = async () => {
    try {
      const response = await api.get(
        `/admin/leader/get/votersAndPoints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVoters(response.data);
      const defaultPoints = {};
      response.data.forEach(voter => {
        defaultPoints[voter.id] = 0;
      });
      setPoints(defaultPoints);
      setShowPointsSection(true);
    } catch (err) {
      setError('Failed to fetch voter list. ' + err);
    }
  };

  const handlePointChange = (id, value) => {
    if (!isNaN(value)) {
      setPoints(prev => ({ ...prev, [id]: parseInt(value || 0, 10) }));
    }
  };

  const handleSubmit = async () => {
    const payload = voters.map(voter => ({
      id: voter.id,
      voter: voter.voter,
      point: points[voter.id] || 0,
    }));

    try {
      await api.post(
        '/admin/leader/update/points',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Points updated successfully!');
      setShowPointsSection(false);
    } catch (err) {
      setError('Failed to submit points. ' + err);
    }
  };

  if (error) return <div className="poll-error">{error}</div>;
  if (!poll) return <div className="poll-loading">Loading...</div>;

  return (
    <div className="poll-detail">
      <div className="top-buttons">
        <button className="home-button" onClick={handleHomeClick}>
          Back to Poll
        </button>
      </div>
      <h2 className="poll-question">{poll.question}</h2>
      <p className="poll-cutoff">
        <strong>Closes at:</strong> {poll.cutoffTimestamp.replace('T', ' ').replace('Z', '')}
      </p>

      <div className="poll-options">
        {poll.options.map((opt, index) => (
          <div key={index} className="poll-option">
            <strong>{opt.option}</strong>
            {opt.votes && opt.votes.length > 0 ? (
              <ul className="vote-list">
                {opt.votes.map((vote, i) => (
                  <li key={i}>
                    {vote.voter}: {vote.comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-votes">No votes yet</p>
            )}
          </div>
        ))}
      </div>

      <button className="update-button" onClick={handleUpdatePointsClick}>
        Update Points
      </button>

      {showPointsSection && (
        <div className="points-section">
          <h3>Enter Points for Voters</h3>
          {voters.map(voter => (
            <div key={voter.id} className="points-row">
              <label>{voter.voter}</label>
              <input
                type="number"
                value={points[voter.id] || 0}
                onChange={e => handlePointChange(voter.id, e.target.value)}
              />
            </div>
          ))}
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default PollPointsUpdate;
