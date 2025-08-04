import React from 'react';

const NewsCard: React.FC = () => (
  <div className="news__card">
    <div className="news__card-container">
      <div className="news__card--top">
        <div className="news__card--top-content">
          <div>New Widgets</div>
          <div>Navigation</div>
        </div>
      </div>
      <div className="news__card--bottom-content">
        <div className="news__card--button">
          <div>View Components</div>
        </div>
        <div className="news__card--nav">
          <div className="news__card--nav-container">
            <div className="news__card--nav-content">
              <div className="news__card--nav-content-box">
                <span className="news__card--nav-icon">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 3.5L6 1L7.5 3.5L6 3L4.5 3.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.5 8.5L6 11L7.5 8.5L6 9L4.5 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 6L3.5 4.5L3 6L3.5 7.5L1 6Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 6L8.5 4.5L9 6L8.5 7.5L11 6Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.0002 6.00427C7.0002 6.55702 6.55245 7.00512 6.0001 7.00512C5.44775 7.00512 5 6.55702 5 6.00427C5 5.45152 5.44775 5.00342 6.0001 5.00342C6.55245 5.00342 7.0002 5.45152 7.0002 6.00427Z" stroke="black"/>
                  </svg>
                </span>
                <span className="news__card--nav-text">Nav</span>
              </div>
              <div className="news__card--nav-content-box">
                <span className="news__card--nav-icon">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.75 10.75H9.25C10.0785 10.75 10.75 10.0785 10.75 9.25V2.75C10.75 1.92158 10.0785 1.25 9.25 1.25H2.75C1.92158 1.25 1.25 1.92158 1.25 2.75V9.25C1.25 10.0785 1.92158 10.75 2.75 10.75Z" stroke="black" strokeLinejoin="round"/>
                    <path d="M10.75 4.25H1.25" stroke="black"/>
                    <path d="M10.75 7.75H1.25" stroke="black"/>
                  </svg>
                </span>
                <span className="news__card--nav-text">Card</span>
              </div>
              <div className="news__card--nav-content-box">
                <span className="news__card--nav-icon">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="news__card--nav-text">Button</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NewsCard; 