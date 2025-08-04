import React from 'react';

const SearchSection: React.FC = () => {
  return (
    <div className="search__section">
      <div className="search__section--left">
        <div className="search__icon-box">
          {/* search-01 SVG */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.91663 9.91675L12.25 12.2501" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.0833 6.41667C11.0833 3.83934 8.99401 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.99401 3.83934 11.0833 6.41667 11.0833C8.99401 11.0833 11.0833 8.99401 11.0833 6.41667Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input className="search__input" placeholder="Search ..." />
      </div>
      <div className="search__section--right">
        <div className="search__icon-container">
          <div className="search__icon-box">
            {/* books-02 SVG (using same as search for now) */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.75 2.625H9.625C10.1082 2.625 10.5 3.01675 10.5 3.5V4.66665C10.5 5.14991 10.1082 5.54166 9.625 5.54166H1.75" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.75 5.54175H11.375C11.8582 5.54175 12.25 5.93351 12.25 6.41674V7.58341C12.25 8.06664 11.8582 8.45841 11.375 8.45841H7.58333M1.75 8.45841H4.66667" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.75 8.45825H4.66667M1.75 11.3749H9.625C10.1082 11.3749 10.5 10.9832 10.5 10.4999V9.33325C10.5 8.85002 10.1082 8.45825 9.625 8.45825H7.58333" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.66663 5.54175V9.62508L6.12496 8.45841L7.58329 9.62508V5.54175" stroke="black" stroke-linejoin="round"/>
</svg>

          </div>
          <input className="search__input" placeholder="Search ..." />
          {/* arrow-right-01 SVG */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchSection; 