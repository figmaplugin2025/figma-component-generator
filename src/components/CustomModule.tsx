import React, { useState } from 'react';
import './CustomModule.css';

interface CustomModuleProps {
  className?: string;
  onApplyChanges?: (changes: any) => void;
  onCancel?: () => void;
  customizationMode?: 'single' | 'set' | null;
}

const CustomModule: React.FC<CustomModuleProps> = ({ 
  className = '', 
  onApplyChanges,
  onCancel,
  customizationMode = 'single'
}) => {
  const handleApplyChanges = () => {
    if (onApplyChanges) {
      onApplyChanges({});
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`custom__module ${className}`}>
      <div className="custom__module--wrapper">
        <div className="custom__module--wrapper-container">
          <div className="custom__module--wrapper-container-content">
            
            {/* Contents Section */}
            <div className="custom__module--contents">
              <div className="custom__module--contents-wrapper">
                
                {customizationMode === 'single' ? (
                  <>
                    {/* Size Option */}
                    <div className="custom__module--contents-input-wrapper">
                      <div className="choose-size-label">Choose Size</div>
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
                            <span className="size-label">Size</span>
                          </div>
                          
                          {/* Drop Down */}
                          <div className="custom__module--drop-down">
                            <span className="drop-down-text">340x280</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Style Option */}
                    <div className="custom__module--contents-input-wrapper">
                      <div className="choose-size-label">Choose Style</div>
                      <div className="custom__module--contents-input">
                        <div className="custom__module--contents-input-container">
                          
                          {/* Icon Box */}
                          <div className="custom__module--icon-box">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.91675 8.1665V7.42544C2.91675 6.98549 3.16421 6.58299 3.55676 6.38442L5.15724 5.57472C5.54986 5.3761 5.79733 4.97349 5.79726 4.5335L5.79682 1.74993C5.79676 1.42773 6.05794 1.1665 6.38017 1.1665H8.13496C8.45713 1.1665 8.71835 1.42773 8.71829 1.74993L8.71782 4.52593C8.71776 4.96987 8.96965 5.37538 9.36766 5.57205L11.0169 6.38705C11.4149 6.58369 11.6667 6.9891 11.6667 7.43296V8.1665C11.6667 8.48868 11.4056 8.74984 11.0834 8.74984H3.50008C3.17792 8.74984 2.91675 8.48868 2.91675 8.1665Z" stroke="#FF5C0A" strokeLinejoin="round"/>
                              <path d="M3.49992 8.75C3.49992 9.33333 3.49992 10.9667 2.33325 12.8333C5.24992 12.8333 7.58325 12.8333 9.04159 10.5V12.25C9.04159 12.5722 9.30274 12.8333 9.62492 12.8333H11.0833C11.4054 12.8333 11.6678 12.5719 11.665 12.2497C11.6551 11.1122 11.5847 10.2544 11.0833 8.75" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                          {/* Module Description */}
                          <div className="module__description">
                            <span className="size-label">Style</span>
                          </div>
                          
                          {/* Drop Down */}
                          <div className="custom__module--drop-down">
                            <span className="drop-down-text">Dark Atmosphere</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Image Option */}
                    <div className="custom__module--contents-input-wrapper">
                      <div className="choose-size-label">Choose Image</div>
                      <div className="custom__module--contents-input">
                        <div className="custom__module--contents-input-container">
                          
                          {/* Icon Box */}
                          <div className="custom__module--icon-box">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.66675 5.5415C5.15 5.5415 5.54175 5.14975 5.54175 4.6665C5.54175 4.18325 5.15 3.7915 4.66675 3.7915C4.1835 3.7915 3.79175 4.18325 3.79175 4.6665C3.79175 5.14975 4.1835 5.5415 4.66675 5.5415Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12.5416 11.3752V2.62516C12.5416 1.98083 12.0193 1.4585 11.3749 1.4585H2.62492C1.98059 1.4585 1.45825 1.98083 1.45825 2.62516V11.3752C1.45825 12.0195 1.98059 12.5418 2.62492 12.5418H11.3749C12.0193 12.5418 12.5416 12.0195 12.5416 11.3752Z" stroke="#FF5C0A" strokeLinejoin="round"/>
                              <path d="M3.20825 12.5414L8.36801 7.89769C8.76433 7.54098 9.35198 7.49834 9.7956 7.79409L12.5416 9.62476" stroke="#FF5C0A"/>
                            </svg>
                          </div>
                          
                          {/* Module Description */}
                          <div className="module__description">
                            <span className="size-label">Image</span>
                          </div>
                          
                          {/* Drop Down */}
                          <div className="custom__module--drop-down">
                            <span className="drop-down-text">Dark Atmosphere</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Choose States Option */}
                    <div className="custom__module--contents-input-wrapper">
                      <div className="choose-size-label">Choose States</div>
                      <div className="custom__module--contents-input">
                        <div className="custom__module--contents-input-container">
                          
                          {/* Icon Box */}
                          <div className="custom__module--icon-box">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.8334 6.99984C12.8334 10.2215 10.2217 12.8332 7.00008 12.8332C3.77842 12.8332 1.16675 10.2215 1.16675 6.99984C1.16675 3.77817 3.77842 1.1665 7.00008 1.1665C10.2217 1.1665 12.8334 3.77817 12.8334 6.99984Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
                            </svg>
                          </div>
                          
                          {/* Module Description */}
                          <div className="module__description">
                            <span className="size-label">State</span>
                          </div>
                          
                          {/* Drop Down */}
                          <div className="custom__module--drop-down">
                            <span className="drop-down-text">Theme, State, Size</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Choose Color Option */}
                    <div className="custom__module--contents-input-wrapper">
                      <div className="choose-size-label">Choose Color</div>
                      <div className="custom__module--contents-input">
                        <div className="custom__module--contents-input-container">
                          
                          {/* Icon Box */}
                          <div className="custom__module--icon-box">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.91675 8.1665V7.42544C2.91675 6.98549 3.16421 6.58299 3.55676 6.38442L5.15724 5.57472C5.54986 5.3761 5.79733 4.97349 5.79726 4.5335L5.79682 1.74993C5.79676 1.42773 6.05794 1.1665 6.38017 1.1665H8.13496C8.45713 1.1665 8.71835 1.42773 8.71829 1.74993L8.71782 4.52593C8.71776 4.96987 8.96965 5.37538 9.36766 5.57205L11.0169 6.38705C11.4149 6.58369 11.6667 6.9891 11.6667 7.43296V8.1665C11.6667 8.48868 11.4056 8.74984 11.0834 8.74984H3.50008C3.17792 8.74984 2.91675 8.48868 2.91675 8.1665Z" stroke="#FF5C0A" strokeLinejoin="round"/>
                              <path d="M3.49992 8.75C3.49992 9.33333 3.49992 10.9667 2.33325 12.8333C5.24992 12.8333 7.58325 12.8333 9.04159 10.5V12.25C9.04159 12.5722 9.30274 12.8333 9.62492 12.8333H11.0833C11.4054 12.8333 11.6678 12.5719 11.665 12.2497C11.6551 11.1122 11.5847 10.2544 11.0833 8.75" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                          {/* Module Description */}
                          <div className="module__description">
                            <span className="size-label">Style</span>
                          </div>
                          
                          {/* Drop Down */}
                          <div className="custom__module--drop-down">
                            <span className="drop-down-text">Dark Atmosphere</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
              </div>
            </div>
            
            {/* Actions Section */}
            <div className="custom__module--actions">
              <div className="actions-content">
                <div className="actions-buttons">
                  {/* Apply Changes Button */}
                  <button 
                    className="apply-changes-btn"
                    onClick={handleApplyChanges}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Apply Changes
                  </button>
                  
                  {/* Cancel Button */}
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModule; 