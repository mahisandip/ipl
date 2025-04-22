// src/components/MyPolls.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './MyPolls.css';

const MyPolls = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You must be logged in to view your polls.');
        return;
      }

      try {
        const response = await api.get('/admin/poll/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPolls(response.data);
      } catch (err) {
        setError('Failed to fetch polls. Please try again.');
      }
    };

    fetchPolls();
  }, []);
  
  const handleHomeClick = () => {
    navigate(`/dashboard`);
  };

  const handlePollClick = (pollId) => {
    navigate(`/points/${pollId}`);
  };

  return (
    <div className="my-polls-container">
      <div className="top-buttons">
        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
      </div>
	  
      <h2>My Polls</h2>
      {error && <p className="poll-error">{error}</p>}

      <ul className="poll-list">
        {polls.map((poll) => (
          <li
            key={poll.pollId}
            className="poll-item"
            onClick={() => handlePollClick(poll.pollId)}
          >
            <div className="poll-question">{poll.question}</div>
            <div className="poll-date">
              <strong>Created:</strong>{' '}
              {poll.createdDate.replace('T', ' ').replace('Z', '')}
            </div>
            <div className="poll-cutoff">
              <strong>Cutoff:</strong>{' '}
              {poll.cutoffTimestamp.replace('T', ' ').replace('Z', '')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPolls;
