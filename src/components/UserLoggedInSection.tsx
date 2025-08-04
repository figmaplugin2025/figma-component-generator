import React from 'react';

type UserLoggedInSectionProps = {
  onLogout: () => void;
};

const UserLoggedInSection: React.FC<UserLoggedInSectionProps> = ({ onLogout }) => {
  return (
    <div className="user-logged-in__section">
      <div className="user-logged-in__section--left">
        <div className="user-logged-in__section--left-container">
          <div className="user-logged-in__input-container">
            <div className="user-logged-in__icon-box">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.16667 10.5001C10.744 10.5001 12.8333 8.41076 12.8333 5.83341C12.8333 3.25609 10.744 1.16675 8.16667 1.16675C5.58934 1.16675 3.5 3.25609 3.5 5.83341C3.5 8.41076 5.58934 10.5001 8.16667 10.5001Z" stroke="white" strokeLinejoin="round"/>
                <path d="M7.68065 12.2319C7.03671 12.614 6.28491 12.8334 5.48183 12.8334C3.09861 12.8334 1.16663 10.9014 1.16663 8.51815C1.16663 7.71508 1.386 6.96328 1.76808 6.31934" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Your volts:</span>
            <div className="user-logged-in__icon-token-box">
              143/500
            </div>
          </div>
          <button className="user-logged-in__input-button">Button</button>
        </div>
      </div>
      <div className="user-logged-in__section--right">
        <div className="user-logged-in__right-container">
          <button className="user-logged-in__input-logout-button" onClick={onLogout}>
            <div className="user-logged-in__input-logout-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.16667 10.7917L7.95783 11.4182C7.75192 12.036 7.08021 12.3655 6.46561 12.1505L2.92189 10.9101C2.21999 10.6645 1.75 10.0021 1.75 9.25843V4.74158C1.75 3.99793 2.21999 3.3355 2.92189 3.08983L6.46561 1.84953C7.08021 1.63442 7.75192 1.96403 7.95783 2.58177L8.16667 3.20833" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.7916 5.54175L12.2499 7.00008L10.7916 8.45841M5.83325 7.00008H11.8948" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="user-logged-in__input-logout-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLoggedInSection; 