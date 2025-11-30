import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  name,
  className = '',
  error,
  ...props
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;

