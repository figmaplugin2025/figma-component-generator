import React, { useState } from 'react';

interface CustomModuleChoiceProps {
  onContinue?: (mode: 'single' | 'set') => void;
  onCancel?: () => void;
}

const CustomModuleChoice: React.FC<CustomModuleChoiceProps> = ({ onContinue, onCancel }) => {
  const [selectedCard, setSelectedCard] = useState<'single' | 'set' | null>(null);

  const handleCardClick = (cardType: 'single' | 'set') => {
    setSelectedCard(cardType);
  };

  const handleContinue = () => {
    if (selectedCard && onContinue) {
      onContinue(selectedCard);
    }
  };

  return (
    <div className="custom__module__choice--option">
      <div className="custom__module__choice--wrapper">
        <div className="custom__module__choice--wrapper-container">
          <div className="custom__module__choice--wrapper-container-content">
            <div className="custom__module__choice--contents">
              {/* Card 1 */}
              <div 
                className={`custom__module__choice--contents-card ${selectedCard === 'single' ? 'selected' : ''}`}
                onClick={() => handleCardClick('single')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick('single');
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selectedCard === 'single'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1859 9.79239L14.1626 12.7495M9.87052 16.6178C11.1647 15.5837 12.965 13.9396 14.4108 12.5033C18.7947 8.14809 21.6822 3.95551 20.8602 3.13887C20.0382 2.32224 15.8179 5.19079 11.434 9.54596C9.98813 10.9823 8.33297 12.7706 7.29206 14.0563M8.95338 19.4031C6.72086 21.621 3 20.8817 3 20.8817C4.11626 18.2942 2.62791 16.8156 4.48834 14.9674C5.72133 13.7425 7.72039 13.7425 8.95338 14.9674C10.1864 16.1923 10.1864 18.1782 8.95338 19.4031Z" stroke="#FF5C0A" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <div style={{ alignSelf: 'stretch', color: '#000', fontFamily: 'Inter', fontSize: 16, fontWeight: 500, lineHeight: 'normal' }}>
                  Edit the look of a single component.
                </div>
                <div style={{ alignSelf: 'stretch', color: '#878787', fontFamily: 'Inter', fontSize: 12, fontWeight: 400, lineHeight: '145%' }}>
                  Quickly adjust colors, padding, corner radius, and other visual styles before placing the component on your board. Ideal for one-off or simple uses.
                </div>
              </div>
              {/* Card 2 */}
              <div 
                className={`custom__module__choice--contents-card ${selectedCard === 'set' ? 'selected' : ''}`}
                onClick={() => handleCardClick('set')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick('set');
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selectedCard === 'set'}
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.2434 13.0005L13.0007 17.2431L8.75809 13.0005L13.0007 8.75781L17.2434 13.0005Z" stroke="#FF5C0A" strokeWidth="1.5"/>
                  <path d="M13.0007 17.2432L15.1221 19.3645C16.2937 20.5361 16.2937 22.4355 15.1221 23.6071C13.9504 24.7787 12.051 24.7787 10.8794 23.6071C9.70781 22.4355 9.70781 20.5361 10.8794 19.3645L13.0007 17.2432Z" stroke="#FF5C0A" strokeWidth="1.5"/>
                  <path d="M8.75656 13.0014L6.63524 10.8801C5.46367 9.70854 3.5642 9.7085 2.3926 10.8801C1.22106 12.0516 1.22103 13.9512 2.3926 15.1228C3.56416 16.2943 5.4637 16.2943 6.63524 15.1228L8.75656 13.0014Z" stroke="#FF5C0A" strokeWidth="1.5"/>
                  <path d="M17.2434 13.0005L19.3648 10.8791C20.5363 9.70756 22.4358 9.70753 23.6074 10.8791C24.779 12.0507 24.779 13.9502 23.6074 15.1218C22.4358 16.2933 20.5364 16.2934 19.3648 15.1218L17.2434 13.0005Z" stroke="#FF5C0A" strokeWidth="1.5"/>
                  <path d="M13.0007 8.75774L15.1221 6.63642C16.2936 5.46485 16.2936 3.56535 15.1221 2.39378C13.9505 1.22221 12.051 1.22221 10.8794 2.39378C9.70784 3.56535 9.70784 5.46485 10.8794 6.63642L13.0007 8.75774Z" stroke="#FF5C0A" strokeWidth="1.5"/>
                </svg>
                <div style={{ alignSelf: 'stretch', color: '#000', fontFamily: 'Inter', fontSize: 16, fontWeight: 500, lineHeight: 'normal' }}>
                  Component Set Prep
                </div>
                <div style={{ alignSelf: 'stretch', color: '#878787', fontFamily: 'Inter', fontSize: 12, fontWeight: 400, lineHeight: '145%' }}>
                  Configure your component for use as a set by adding interactive or structural properties like hover states, size. Perfect for building flexible design systems.
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="custom__module--actions">
              <div className="actions-content">
                <div className="actions-buttons">
                  <button 
                    className={`apply-changes-btn ${!selectedCard ? 'disabled' : ''}`}
                    onClick={handleContinue}
                    disabled={!selectedCard}
                  >
                    Continue
                  </button>
                  <button className="cancel-btn" onClick={onCancel}>Go Back</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModuleChoice;