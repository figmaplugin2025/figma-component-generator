import React from 'react';

type NavigationProps = {
  onUserClick: () => void;
  onSearchClick: () => void;
  children?: React.ReactNode;
};

const Navigation: React.FC<NavigationProps> = ({ onUserClick, onSearchClick, children }) => {
  return (
    <div className="navigation">
      <div className="navigation__section">
        <div className="content-box">
          <div className="navigation__section--left">
            {/* Home icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.75 5.82657V11.375C1.75 12.0194 2.27233 12.5417 2.91667 12.5417H11.0833C11.7277 12.5417 12.25 12.0194 12.25 11.375V5.82657C12.25 5.46319 12.0807 5.12056 11.792 4.89982L7.52337 1.63555C7.3731 1.52063 7.18917 1.45837 7 1.45837C6.81082 1.45837 6.6269 1.52063 6.47663 1.63555L2.20797 4.89982C1.91932 5.12056 1.75 5.46319 1.75 5.82657Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.75013 9.91663C8.28376 10.2797 7.67108 10.5 7.00013 10.5C6.32913 10.5 5.71651 10.2797 5.25012 9.91663" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="navigation__section--right">
            <button className="navigation__icon-btn" onClick={onUserClick}>
              {/* User icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.91671 4.95829C9.91671 3.34746 8.61086 2.04163 7.00004 2.04163C5.38921 2.04163 4.08337 3.34746 4.08337 4.95829C4.08337 6.56911 5.38921 7.87496 7.00004 7.87496C8.61086 7.87496 9.91671 6.56911 9.91671 4.95829Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.0833 11.9583C11.0833 9.70317 9.25513 7.875 6.99996 7.875C4.7448 7.875 2.91663 9.70317 2.91663 11.9583" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="navigation__icon-btn" onClick={onSearchClick}>
              {/* Search icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.91663 9.91663L12.25 12.25" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.0833 6.41667C11.0833 3.83934 8.99401 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.99401 3.83934 11.0833 6.41667 11.0833C8.99401 11.0833 11.0833 8.99401 11.0833 6.41667Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="navigation__icon-btn">
              {/* Bell icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0833 10.5V5.54171C11.0833 3.28655 9.25513 1.45837 6.99996 1.45837C4.7448 1.45837 2.91663 3.28655 2.91663 5.54171V10.5" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9583 10.5H2.04163" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.875 11.6666C7.875 12.1499 7.48323 12.5416 7 12.5416M7 12.5416C6.51677 12.5416 6.125 12.1499 6.125 11.6666M7 12.5416V11.6666" stroke="black" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="navigation__icon-btn">
              {/* Menu icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.33337 4.95837H11.6667" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.33337 9.04163H11.6667" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Navigation;