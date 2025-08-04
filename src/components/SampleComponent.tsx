import React from 'react';
import './SampleComponent.css';

const SampleComponent: React.FC = () => {
  return (
    <div className="custom__module">
      <div className="custom__module--wrapper">
        <div className="custom__module--wrapper-container">
          <div className="custom__module--wrapper-container-content">
            
            <div className="custom__module--contents">
              <div className="custom__module--contents-input-wrapper">
                
                {/* Choose Size Label */}
                <div className="choose-size-label">
                  Choose Size
                </div>
                
                <div className="custom__module--contents-input">
                  <div className="custom__module--contents-input-container">
                    
                    {/* Icon Box */}
                    <div className="custom__module--icon-box">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.91675 2.33317H12.2501M9.91675 2.33317C9.91675 2.65994 10.7884 3.27046 11.0834 3.49984M9.91675 2.33317C9.91675 2.0064 10.7884 1.39588 11.0834 1.1665" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.08333 2.33317H1.75M4.08333 2.33317C4.08333 2.0064 3.21166 1.39588 2.91667 1.1665M4.08333 2.33317C4.08333 2.65994 3.21166 3.27046 2.91667 3.49984" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.73705 12.8332V12.2798C5.73705 11.9032 5.6153 11.5367 5.38987 11.2345L3.25628 8.37452C3.01021 8.04465 2.81367 7.63544 2.97613 7.25761C3.23912 6.64605 3.98108 6.24874 4.88925 7.16568L5.82096 8.16283V2.08267C5.85377 0.890833 7.77177 0.831753 7.85379 2.08267V5.54769C8.71712 5.43619 12.7841 6.04486 12.1913 8.62331C12.1632 8.74581 12.135 8.87018 12.1076 8.9928C11.9876 9.52876 11.633 10.4839 11.242 11.0423C10.835 11.6237 10.9786 12.2027 10.9786 12.8332" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    
                    {/* Module Description */}
                    <div className="module__description">
                      <span>Size</span>
                    </div>
                    
                    {/* Drop Down */}
                    <div className="custom__module--drop-down">
                      <span>340x280</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="custom__module--actions">
              {/* Actions content would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleComponent; 