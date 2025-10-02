import React from 'react';

const DetectionStatus = ({ isFirstDetection, characterName }) => (
  <div style={{
    position: 'fixed',
    textAlign: 'center',
    width: '100vw',
    zIndex: 20,
    top: '30vh',
    lineHeight: '2em',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    opacity: (isFirstDetection) ? 1 : 0,
    transition: 'opacity 1s',
    color: 'white',
    fontSize: '18px'
  }}>
    Наведите камеру на {characterName}<br/>
    для начала AR-взаимодействия
  </div>
);

export default DetectionStatus;
