import React from 'react';
import './PromoCircle.css';
import TicketIcon from '../assets/ticket.svg';

const PromoCircle = ({ onClick }) => {
  const text = "";
  const textPathId = "text-path";

  return (
    <div className="promo-circle-container" onClick={onClick}>
      <div className="promo-circle">
        <div className="promo-circle-inner">
          <img src={TicketIcon} alt="ticket" className="promo-ticket-icon" />
          <span className="promo-discount">-10%</span>
        </div>
        <div className="promo-text">
          <svg className="promo-text-svg" viewBox="0 0 100 100">
            <defs>
              <path id={textPathId} d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text>
              <textPath href={`#${textPathId}`} startOffset="50%" textAnchor="middle">
                {text}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PromoCircle;
