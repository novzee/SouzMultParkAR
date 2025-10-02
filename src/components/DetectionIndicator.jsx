import React from 'react';

const DetectionIndicator = ({ isDetecting, characterName }) => (
  <>
    {isDetecting && (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 30,
        background: 'rgba(0,255,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {characterName} ОБНАРУЖЕН
      </div>
    )}
  </>
);

export default DetectionIndicator;
