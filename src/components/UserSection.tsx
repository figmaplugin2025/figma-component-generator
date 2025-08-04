import React, { useState } from 'react';

type UserSectionProps = {
  onCodeSubmit: (code: string) => void;
};

const UserSection: React.FC<UserSectionProps> = ({ onCodeSubmit }) => {
  const [rightHovered, setRightHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onCodeSubmit(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="user__section">
      <div className={`user__section--left${rightHovered ? ' user__section--left--shrink' : ''}`}>
      <div className="user__section--left-container">
        <div className="user__input-container">
          <div className="user__icon-box">
            {/* User SVG */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.04171 8.45825C10.9747 8.45825 12.5417 6.89124 12.5417 4.95825C12.5417 3.02525 10.9747 1.45825 9.04171 1.45825C7.10872 1.45825 5.54171 3.02525 5.54171 4.95825C5.54171 5.47182 5.65232 5.95954 5.85105 6.39891L1.80008 10.4499C1.58129 10.6687 1.45837 10.9654 1.45837 11.2748V12.5416H3.20837V11.3749H4.37504V10.2083H5.54171L7.60105 8.14891C8.04042 8.34765 8.52814 8.45825 9.04171 8.45825Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.2083 3.79175L9.625 4.37508" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
            <input
              className="user__input"
              type="text"
              placeholder="Type here..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="user__input-button" type="button" onClick={handleSubmit}>Button</button>
        </div>
      </div>
      <div className="user__section--right">
        <div
          className="user__section--right-container"
          onMouseEnter={() => setRightHovered(true)}
          onMouseLeave={() => setRightHovered(false)}
        >
          <button className="user__input-g-button" type="button">
            <div className="user__input-g-icon">
            {/* Google SVG */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_191_385)">
                <path d="M13.1255 7.136C13.1255 6.6324 13.0838 6.2649 12.9935 5.88379H7.12549V8.15682H10.5699C10.5005 8.72172 10.1255 9.57239 9.29212 10.144L9.28044 10.2202L11.1358 11.6287L11.2644 11.6413C12.4449 10.5728 13.1255 9.00071 13.1255 7.136Z" fill="#4285F4"/>
                <path d="M7.12532 13.1251C8.8128 13.1251 10.2294 12.5806 11.2642 11.6415L9.29195 10.1442C8.76419 10.5049 8.05584 10.7567 7.12532 10.7567C5.47258 10.7567 4.0698 9.68825 3.56975 8.21143L3.49646 8.21751L1.56722 9.68073L1.54199 9.74946C2.56976 11.7503 4.68088 13.1251 7.12532 13.1251Z" fill="#34A853"/>
                  <path d="M3.57015 8.21137C3.43821 7.83027 3.36185 7.4219 3.36185 6.99998C3.36185 6.57801 3.43821 6.16969 3.56321 5.78858L3.55971 5.70738L1.6063 4.2207L1.54239 4.2505C1.11879 5.0808 0.875732 6.01315 0.875732 6.999C0.875732 7.98676 1.11879 8.91912 1.54239 9.7494L3.57015 8.21137Z" fill="#FBBC05"/>
                <path d="M7.12536 3.24332C8.29896 3.24332 9.09061 3.74012 9.54203 4.15529L11.3059 2.4675C10.2226 1.4807 8.81284 0.875 7.12536 0.875C4.68088 0.875 2.56976 2.24971 1.54199 4.25053L3.56282 5.78861C4.06981 4.3118 5.47258 3.24332 7.12536 3.24332Z" fill="#EB4335"/>
              </g>
              <defs>
                <clipPath id="clip0_191_385">
                  <rect width="14" height="14" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            </div>
            <span className="user__input-g-text">Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSection;

