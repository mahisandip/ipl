import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PollForm.css';
import api from '../api';

const PollForm = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [cutoffDate, setCutoffDate] = useState('');
  const [cutoffHour, setCutoffHour] = useState('12');
  const [cutoffMinute, setCutoffMinute] = useState('00');
  const [cutoffAmPm, setCutoffAmPm] = useState('AM');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
    }
  };
  
  const handleRemoveOption = (indexToRemove) => {
    setOptions((prevOptions) => prevOptions.filter((_, idx) => idx !== indexToRemove));
  };


  const formatCutoffTimestamp = () => {
    if (!cutoffDate) return null;

    let hour = parseInt(cutoffHour, 10);
    if (cutoffAmPm === 'PM' && hour !== 12) hour += 12;
    if (cutoffAmPm === 'AM' && hour === 12) hour = 0;

    return `${cutoffDate} ${hour.toString().padStart(2, '0')}:${cutoffMinute.padStart(2, '0')}:00Z`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const cutoffTimestamp = formatCutoffTimestamp();

      const payload = {
        question,
        cutoffTimestamp,
        options: options.map(opt => ({ option: opt })),
      };

      const response = await api.post(
        '/admin/poll/create',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdPollId = response.data;

      if (createdPollId) {
        setMessage('Poll created successfully!');
        setQuestion('');
        setOptions(['']);
        setCutoffDate('');
        setCutoffHour('12');
        setCutoffMinute('00');
        setCutoffAmPm('AM');
      } else {
		  setMessage('Poll created, but no ID returned.');
	  }
	  try {
        navigate(`/poll/${createdPollId}`);
      } catch (error) {
          alert('Unable to load poll details');
      }

    } catch (error) {
      setMessage('Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="poll-form-container">
      <div className="navigation-buttons top-buttons">
        <button className="nav-button" onClick={() => navigate('/mypolls')}>View My Polls</button>
        <button className="nav-button" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
      </div>

      <form className="poll-form" onSubmit={handleSubmit}>
        <h2>Create a Poll</h2>

        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="w-[600px] px-3 py-2 border rounded text-base mb-4"
        />

        <label>Options:</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              required={idx === 0}
              className="flex-1 px-3 py-2 border rounded text-base"
            />
            {idx > 0 && (
              <button type="button" onClick={() => handleRemoveOption(idx)} className="btn-remove">❌</button>
            )}
          </div>
        ))}
        <button type="button" className="add-option" onClick={addOption}>
          + Add Option
        </button>

        <label>Cutoff Date:</label>
        <input
          type="date"
          value={cutoffDate}
          onChange={(e) => setCutoffDate(e.target.value)}
        />

        <div className="cutoff-time-section">
          <label>Cutoff Time:</label>
          <div className="time-select">
            <select value={cutoffHour} onChange={(e) => setCutoffHour(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => {
                const val = (i + 1).toString().padStart(2, '0');
                return <option key={val} value={val}>{val}</option>;
              })}
            </select>
            :
            <select
              value={cutoffMinute}
              onChange={(e) => setCutoffMinute(e.target.value)}
              className="px-2 py-1 border rounded">
              {[...Array(12)].map((_, i) => {
                const minute = (i * 5).toString().padStart(2, '0');
                return <option key={minute} value={minute}>{minute}</option>;
              })}
            </select>
            <select value={cutoffAmPm} onChange={(e) => setCutoffAmPm(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Creating Poll...' : 'Create Poll'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default PollForm;
