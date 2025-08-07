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
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CategoriesCard; 