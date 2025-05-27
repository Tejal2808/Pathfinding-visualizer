import React, { useState, useRef } from 'react';
import './Node.css';

export default function Node({
  col,
  row,
  isFinish,
  isStart,
  isWall,
  isVisited,
  weight,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onWeightChange,
  onClick, 
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
    setInputValue(weight > 2 ? String(weight) : '');
  };  

  const handleWeightInput = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 99)) {
      setInputValue(value);  // Only allow numeric input between 2-99
    }
  };

  const handleInputBlur = () => {
    if (inputValue) {
      const newWeight = parseInt(inputValue);
      if (newWeight >= 1 && newWeight <= 99) {
        onWeightChange(row, col, newWeight);
      }
    }
    setIsEditing(false);
    setInputValue('');
  };

  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName} ${isVisited ? 'node-visited' : ''}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onClick={handleClick} 
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          min="1"
          max="99"
          value={inputValue}
          onChange={handleWeightInput}
          onBlur={handleInputBlur}  // Trigger when input loses focus
          className="weight-input"
          autoFocus
        />
      ) : (
        weight => 1 && <div className="weight-value">{weight}</div>
      )}
    </div>
  );
}

