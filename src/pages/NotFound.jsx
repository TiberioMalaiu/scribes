import React from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#f8f9fa',
  padding: '20px',
};

const codeStyle = {
  fontSize: '72px',
  fontWeight: 800,
  color: '#d1d5db',
  margin: 0,
  lineHeight: 1,
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 600,
  color: '#111827',
  margin: '16px 0 8px',
};

const descStyle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 24px',
};

const buttonStyle = {
  padding: '10px 20px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <p style={codeStyle}>404</p>
      <h1 style={titleStyle}>Page not found</h1>
      <p style={descStyle}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <button style={buttonStyle} onClick={() => navigate('/')}>
        Back to Dashboard
      </button>
    </div>
  );
}
