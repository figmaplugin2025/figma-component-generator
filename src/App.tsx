import React, { useState, useEffect } from 'react';
import './App.css';
import SearchSection from './components/SearchSection';
import UserSection from './components/UserSection';
import UserLoggedInSection from './components/UserLoggedInSection';
import NewsCard from './components/NewsCard';
import CategoriesCard from './components/CategoriesCard';
import BackSection from './components/BackSection';
import ComponentCard, { ComponentCardData } from './components/ComponentCard';
import ComponentCardDetailedView from './components/ComponentCardDetailedView';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<null | 'user' | 'search'>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'category' | 'detail'>('main');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<ComponentCardData | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Listen for messages from Figma
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage) {
        const { type, success, error, title } = event.data.pluginMessage;
        
        if (type === 'component-inserted') {
          if (success) {
            setNotification({
              message: `Component "${title}" inserted successfully!`,
              type: 'success'
            });
          } else {
            setNotification({
              message: `Failed to insert component: ${error}`,
              type: 'error'
            });
          }
          
          // Clear notification after 3 seconds
          setTimeout(() => setNotification(null), 3000);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handler for login (code or Google)
  const handleCodeSubmit = (code: string) => {
    if (code === '5555') {
      setIsLoggedIn(true);
      setActiveSection('user');
    }
  };
  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
    setActiveSection('user');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection(null);
  };

  // Toggle section handlers
  const toggleUserSection = () => {
    if (isLoggedIn) {
      setActiveSection(activeSection === 'user' ? null : 'user');
    } else {
      setActiveSection(activeSection === 'user' ? null : 'user');
    }
  };

  const toggleSearchSection = () => {
    setActiveSection(activeSection === 'search' ? null : 'search');
  };

  // Navigation handlers
  const handleCategoryClick = (categoryIndex: number) => {
    setSelectedCategory(categoryIndex);
    setCurrentPage('category');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setSelectedCategory(null);
    setSelectedCard(null);
  };

  // Card click handler
  const handleCardClick = (card: ComponentCardData) => {
    setSelectedCard(card);
    setCurrentPage('detail');
  };

  // Placeholder handlers for detail view actions
  const handleGenerate = () => {
    console.log('Generate clicked');
  };
  const handleCustomize = () => {
    console.log('Customize clicked');
  };
  const handleGetVolts = () => {
    console.log('Get volts clicked');
  };

  return (
    <div className="app-sections-wrapper">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="navigation">
        <div className="navigation__section">
          <div className="content-box">
            <div className="navigation__section--left">
              {/* Home icon - click to go back to main page */}
              <button 
                className="navigation__home-btn" 
                onClick={handleBackToMain}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="10" height="6" rx="1" stroke="black" strokeWidth="1.2"/>
                  <path d="M7 2L2 6" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M7 2L12 6" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
      </div>
            <div className="navigation__section--right">
              <button className="navigation__icon-btn" onClick={toggleUserSection}>
                {/* User icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="user">
                    <path id="Vector" d="M9.91659 4.95841C9.91659 3.34759 8.61074 2.04175 6.99992 2.04175C5.38909 2.04175 4.08325 3.34759 4.08325 4.95841C4.08325 6.56923 5.38909 7.87508 6.99992 7.87508C8.61074 7.87508 9.91659 6.56923 9.91659 4.95841Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path id="Vector_2" d="M11.0834 11.9583C11.0834 9.70317 9.25525 7.875 7.00008 7.875C4.74492 7.875 2.91675 9.70317 2.91675 11.9583" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </button>
              <button className="navigation__icon-btn" onClick={toggleSearchSection}>
                {/* Search icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.91663 9.91675L12.2501 12.2501" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.0833 6.41667C11.0833 3.83934 8.99401 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.99401 3.83934 11.0833 6.41667 11.0833C8.99401 11.0833 11.0833 8.99401 11.0833 6.41667Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="navigation__icon-btn">
                {/* Bell icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0834 10.4999V5.54159C11.0834 3.28642 9.25525 1.45825 7.00008 1.45825C4.74492 1.45825 2.91675 3.28642 2.91675 5.54159V10.4999" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.9584 10.5H2.04175" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.875 11.6667C7.875 12.15 7.48323 12.5417 7 12.5417M7 12.5417C6.51677 12.5417 6.125 12.15 6.125 11.6667M7 12.5417V11.6667" stroke="black" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="navigation__icon-btn">
                {/* Menu icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.33325 4.95825H11.6666" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.33325 9.04175H11.6666" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        </button>
            </div>
          </div>
        </div>
        {/* Section toggling logic */}
        {isLoggedIn && activeSection === 'user' ? (
          <UserLoggedInSection onLogout={handleLogout} />
        ) : !isLoggedIn && activeSection === 'user' ? (
          <UserSection onCodeSubmit={handleCodeSubmit} />
        ) : activeSection === 'search' ? (
          <SearchSection />
        ) : null}
      </div>
      
      {/* BackSection appears on sub-pages */}
      {currentPage === 'category' && <BackSection onBack={handleBackToMain} />}
      
      {/* Page content */}
      {currentPage === 'main' ? (
        <>
          <NewsCard />
          <CategoriesCard onCategoryClick={handleCategoryClick} />
          <AdminPanel />
        </>
      ) : currentPage === 'category' ? (
        <ComponentCard onCardClick={handleCardClick} />
      ) : currentPage === 'detail' && selectedCard ? (
        <ComponentCardDetailedView
          data={selectedCard}
          onBack={handleBackToMain}
          onGenerate={handleGenerate}
          onCustomize={handleCustomize}
          onGetVolts={handleGetVolts}
          onLogout={handleLogout}
        />
      ) : null}
    </div>
  );
};

export default App;
