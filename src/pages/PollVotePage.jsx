import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PollVotePage.css';
import axios from 'axios';

const PollVotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [voterName, setVoterName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [comment, setComment] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/public/poll/${id}`);
        setPoll(response.data);
      } catch (err) {
        alert('Failed to load poll');
      }
    };
    fetchPoll();
  }, [id]);
  
  const handleHomeClick = () => {
    navigate(`/poll/${id}`);
  };

  const handleVote = async () => {
    if (!voterName || !selectedOption) {
      alert('Please enter your name and select an option.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/public/poll/${id}/vote`, {
        voter: voterName,
        selectedOption: selectedOption,
        comment,
      });
  
      setHasSubmitted(true);
      setErrorMessage(''); // Clear any previous error
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrorMessage(err.response.data.message || 'Poll is closed.');
      } else {
        setErrorMessage('Failed to submit vote.');
      }
    }
  };

  if (!poll) return <p>Loading...</p>;

  return (
    <div className="poll-vote-container">
      <div className="top-buttons">
        <button className="home-button" onClick={handleHomeClick}>
          Back to Poll
        </button>
      </div>
	  
      <h2>{poll.question}</h2>
      <p><strong>Closes at:</strong> {poll.cutoffTimestamp.replace('T', ' ').replace('Z', '')}</p>

      {!hasSubmitted ? (
        <>
          <input
            className="input-field"
            type="text"
            placeholder="Enter your name"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
          />
          <div className="options-list">
            {poll.options.map((opt, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name="poll-option"
                  value={opt.option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                {opt.option}
              </label>
            ))}
          </div>
          <textarea
            className="comment-box"
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="vote-button" onClick={handleVote}>
            Submit Vote
          </button>
		  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
      ) : (
        <p className="success-message">Thanks for voting!</p>
      )}
    </div>
  );
};

export default PollVotePage;
