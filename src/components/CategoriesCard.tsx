import React from 'react';

type CategoriesCardProps = {
  onCategoryClick: (categoryIndex: number) => void;
};

const CategoriesCard: React.FC<CategoriesCardProps> = ({ onCategoryClick }) => (
  <div className="categories__card">
    <div className="categories__card-box" onClick={() => onCategoryClick(0)}>
      <div className="categories__card-container">
        <div className="categories__card-container-content">
          <div className="categories__card-content-box">
            <div>New Widgets</div>
            <div>Navigation</div>
            <svg width="84" height="123" viewBox="0 0 84 123" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" fill="white"/>
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" stroke="#D1D1D1"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" fill="#F9F9F9"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" stroke="#D1D1D1"/>
              <rect x="12" y="12" width="125" height="19.2" rx="8" fill="white"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <path d="M23.9301 56.8H22.9983L25.092 50.9819H26.1062L28.2 56.8H27.2681L25.6233 52.0387H25.5778L23.9301 56.8ZM24.0863 54.5216H27.109V55.2603H24.0863V54.5216Z" fill="black"/>
              <rect x="44.8" y="44.2" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
              <rect x="8" y="72.3999" width="133" height="35.6" rx="9.6" fill="#FF5C0A"/>
              <rect x="14.9" y="79.3" width="21.4" height="21.8" rx="9.1" stroke="#FFAF87"/>
              <path d="M23.9301 93.2H22.9983L25.092 87.3818H26.1062L28.2 93.2H27.2681L25.6233 88.4386H25.5778L23.9301 93.2ZM24.0863 90.9215H27.109V91.6602H24.0863V90.9215Z" fill="white"/>
              <rect x="44.8" y="80.5999" width="89.8" height="19.2" rx="9.6" fill="#FF7E3E"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <rect x="44.8" y="117" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div className="categories__card-box" onClick={() => onCategoryClick(1)}>
      <div className="categories__card-container">
        <div className="categories__card-container-content">
          <div className="categories__card-content-box">
            <div>New Widgets</div>
            <div>Navigation</div>
            <svg width="84" height="123" viewBox="0 0 84 123" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" fill="white"/>
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" stroke="#D1D1D1"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" fill="#F9F9F9"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" stroke="#D1D1D1"/>
              <rect x="12" y="12" width="125" height="19.2" rx="8" fill="white"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <path d="M23.9301 56.8H22.9983L25.092 50.9819H26.1062L28.2 56.8H27.2681L25.6233 52.0387H25.5778L23.9301 56.8ZM24.0863 54.5216H27.109V55.2603H24.0863V54.5216Z" fill="black"/>
              <rect x="44.8" y="44.2" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
              <rect x="8" y="72.3999" width="133" height="35.6" rx="9.6" fill="#FF5C0A"/>
              <rect x="14.9" y="79.3" width="21.4" height="21.8" rx="9.1" stroke="#FFAF87"/>
              <path d="M23.9301 93.2H22.9983L25.092 87.3818H26.1062L28.2 93.2H27.2681L25.6233 88.4386H25.5778L23.9301 93.2ZM24.0863 90.9215H27.109V91.6602H24.0863V90.9215Z" fill="white"/>
              <rect x="44.8" y="80.5999" width="89.8" height="19.2" rx="9.6" fill="#FF7E3E"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <rect x="44.8" y="117" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div className="categories__card-box" onClick={() => onCategoryClick(2)}>
      <div className="categories__card-container">
        <div className="categories__card-container-content">
          <div className="categories__card-content-box">
            <div>New Widgets</div>
            <div>Navigation</div>
            <svg width="84" height="123" viewBox="0 0 84 123" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" fill="white"/>
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" stroke="#D1D1D1"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" fill="#F9F9F9"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" stroke="#D1D1D1"/>
              <rect x="12" y="12" width="125" height="19.2" rx="8" fill="white"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <path d="M23.9301 56.8H22.9983L25.092 50.9819H26.1062L28.2 56.8H27.2681L25.6233 52.0387H25.5778L23.9301 56.8ZM24.0863 54.5216H27.109V55.2603H24.0863V54.5216Z" fill="black"/>
              <rect x="44.8" y="44.2" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
              <rect x="8" y="72.3999" width="133" height="35.6" rx="9.6" fill="#FF5C0A"/>
              <rect x="14.9" y="79.3" width="21.4" height="21.8" rx="9.1" stroke="#FFAF87"/>
              <path d="M23.9301 93.2H22.9983L25.092 87.3818H26.1062L28.2 93.2H27.2681L25.6233 88.4386H25.5778L23.9301 93.2ZM24.0863 90.9215H27.109V91.6602H24.0863V90.9215Z" fill="white"/>
              <rect x="44.8" y="80.5999" width="89.8" height="19.2" rx="9.6" fill="#FF7E3E"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <rect x="44.8" y="117" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div className="categories__card-box" onClick={() => onCategoryClick(3)}>
      <div className="categories__card-container">
        <div className="categories__card-container-content">
          <div className="categories__card-content-box">
            <div>New Widgets</div>
            <div>Navigation</div>
            <svg width="84" height="123" viewBox="0 0 84 123" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" fill="white"/>
              <rect x="0.5" y="0.5" width="148" height="151.4" rx="9.1" stroke="#D1D1D1"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" fill="#F9F9F9"/>
              <rect x="8.5" y="8.5" width="132" height="26.2" rx="9.1" stroke="#D1D1D1"/>
              <rect x="12" y="12" width="125" height="19.2" rx="8" fill="white"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="42.9001" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <path d="M23.9301 56.8H22.9983L25.092 50.9819H26.1062L28.2 56.8H27.2681L25.6233 52.0387H25.5778L23.9301 56.8ZM24.0863 54.5216H27.109V55.2603H24.0863V54.5216Z" fill="black"/>
              <rect x="44.8" y="44.2" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
              <rect x="8" y="72.3999" width="133" height="35.6" rx="9.6" fill="#FF5C0A"/>
              <rect x="14.9" y="79.3" width="21.4" height="21.8" rx="9.1" stroke="#FFAF87"/>
              <path d="M23.9301 93.2H22.9983L25.092 87.3818H26.1062L28.2 93.2H27.2681L25.6233 88.4386H25.5778L23.9301 93.2ZM24.0863 90.9215H27.109V91.6602H24.0863V90.9215Z" fill="white"/>
              <rect x="44.8" y="80.5999" width="89.8" height="19.2" rx="9.6" fill="#FF7E3E"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" fill="#F9F9F9"/>
              <rect x="14.9" y="115.7" width="21.4" height="21.8" rx="9.1" stroke="#D1D1D1"/>
              <rect x="44.8" y="117" width="89.8" height="19.2" rx="9.6" fill="#F9F9F9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CategoriesCard; 