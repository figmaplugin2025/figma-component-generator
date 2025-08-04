import React from 'react';

type BackSectionProps = {
  onBack: () => void;
};

const BackSection: React.FC<BackSectionProps> = ({ onBack }) => (
  <div className="back">
    <div className="back__container">
      <div className="back__icon--box" onClick={onBack}>
        {/* arrow-down-01 SVG (updated) */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.74997 3.5L5.25 7.00002L8.75 10.5" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="back__label">Navigation</span>
    </div>
  </div>
);

export default BackSection; 