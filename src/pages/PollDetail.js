// src/components/PollDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PollDetail.css';

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://192.168.10.102:8080/api/public/poll/${id}`);
        setPoll(response.data);
      } catch (err) {
        setError('Failed to fetch poll details.' + err);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVoteClick = () => {
    navigate(`/submit/${id}`);
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleCopyLinkClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  if (error) return <div className="poll-error">{error}</div>;
  if (!poll) return <div className="poll-loading">Loading...</div>;

  return (
    <div className="poll-detail">
      <div className="top-buttons">
        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
        <button className="copy-link-button" onClick={handleCopyLinkClick}>
          Copy Link
        </button>
        {copySuccess && <span className="copy-feedback">{copySuccess}</span>}
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

      <button className="vote-button" onClick={handleVoteClick}>
        Vote
      </button>
    </div>
  );
};

export default PollDetail;
