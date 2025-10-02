import React from 'react';
import './PromoModal.css';
import Checkmark from '../assets/checkmark.svg';
import Lock from '../assets/lock.svg';
import { usePromo } from '../context/PromoContext';
import { useNavigate } from 'react-router-dom';

const PromoModal = ({ onClose }) => {
  const { photoTaken, gamePlayed } = usePromo();
  const navigate = useNavigate();

  const canGetPromo = photoTaken && gamePlayed;

  return (
    <div className="promo-modal-overlay">
      <div className="promo-modal-content">
        <button className="promo-modal-close" onClick={onClose}>&times;</button>
        <h2>Условия для получения промокода</h2>
        <p>Чтобы получить скидку 10%, выполните два простых шага:</p>
        
        <div className="promo-conditions">
          <div className={`promo-condition ${photoTaken ? 'completed' : ''}`}>
            <div className="promo-condition-icon">
              <img src={photoTaken ? Checkmark : Lock} alt="status" />
            </div>
            <div className="promo-condition-text">
              <h3>Сделайте фото</h3>
              <p>Сфотографируйтесь с одним из персонажей в AR.</p>
            </div>
          </div>
          
          <div className={`promo-condition ${gamePlayed ? 'completed' : ''}`}>
            <div className="promo-condition-icon">
              <img src={gamePlayed ? Checkmark : Lock} alt="status" />
            </div>
            <div className="promo-condition-text">
              <h3>Сыграйте в игру</h3>
              <p>Пройдите мини-игру "Поймай крысу".</p>
            </div>
          </div>
        </div>

        <button 
          className={`promo-get-button ${canGetPromo ? 'active' : ''}`} 
          disabled={!canGetPromo}
          onClick={() => navigate('/ticket')}
        >
          {canGetPromo ? 'Забрать промокод!' : 'Забрать'}
        </button>
      </div>
    </div>
  );
};

export default PromoModal;
