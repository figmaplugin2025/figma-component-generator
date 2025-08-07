import React, { useState, useEffect } from 'react';
import './CustomModule.css';
import { getPluginImages, PluginImage } from '../services/imageService';
import { ComponentPreferences, selectComponentVariant, groupComponentsByMaster, componentService } from '../services/componentService';

interface CustomModuleProps {
  className?: string;
  onApplyChanges?: (changes: Record<string, string>) => void;
  onCancel?: () => void;
  customizationMode?: 'single' | 'set' | null;
  availableComponents?: any[]; // Add this prop for component selection
  componentId?: string; // Add componentId prop for database updates
}

const CustomModule: React.FC<CustomModuleProps> = ({ 
  className = '', 
  onApplyChanges,
  onCancel,
  customizationMode = 'single',
  availableComponents = [],
  componentId // Add componentId prop
}) => {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({
    size: 'Large',
    style: 'Dark',
    image: 'Dark',
    state: 'Theme, State, Size',
    color: 'Dark'
  });
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [availableImages, setAvailableImages] = useState<PluginImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Load images from Firebase on component mount
  useEffect(() => {
    const loadImages = async () => {
      setLoadingImages(true);
      try {
        const images = await getPluginImages();
        setAvailableImages(images);
        console.log('📸 Loaded plugin images from Firebase:', images);
      } catch (error) {
        console.error('❌ Failed to load plugin images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImages();
  }, []);

  // Calculate changes count based on mode and defaults
  const getChangesCount = () => {
    if (customizationMode === 'single') {
      const defaults = {
        size: 'Large',
        style: 'Dark', 
        image: 'Dark'
      };
      const singleOptions = ['size', 'style', 'image'];
      return singleOptions.filter(option => 
        selectedOptions[option as keyof typeof selectedOptions] !== defaults[option as keyof typeof defaults]
      ).length;
    } else if (customizationMode === 'set') {
      const defaults = {
        state: 'Theme, State, Size',
        style: 'Dark'
      };
      const setOptions = ['state', 'style'];
      return setOptions.filter(option => 
        selectedOptions[option as keyof typeof selectedOptions] !== defaults[option as keyof typeof defaults]
      ).length;
    }
    return 0;
  };

  const changesCount = getChangesCount();

  const handleDropdownClick = (dropdownType: string) => {
    if (dropdownType === 'image') {
      setShowImageSelector(true);
    } else {
      setExpandedDropdown(expandedDropdown === dropdownType ? null : dropdownType);
    }
  };

  const handleOptionSelect = (dropdownType: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [dropdownType]: value
    }));
    setExpandedDropdown(null);
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setSelectedOptions(prev => ({
      ...prev,
      image: imageUrl
    }));
    setShowImageSelector(false);
  };

  const handleApplyChanges = async () => {
    // Update database if image was selected and componentId is provided
    if (selectedImage && componentId) {
      try {
        await componentService.updateComponent(componentId, { imageUrl: selectedImage });
        console.log('✅ Updated component image in database:', componentId, selectedImage);
      } catch (error) {
        console.error('❌ Failed to update component image in database:', error);
      }
    }

    // Filtering only: just pass preferences to parent
    onApplyChanges?.({
      size: selectedOptions.size,
      style: selectedOptions.style,
      image: selectedImage || '',
      state: selectedOptions.state,
      color: selectedOptions.color,
      selectedImageUrl: selectedImage || '' // Add the actual image URL
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const getDropdownOptions = (type: string) => {
    switch (type) {
      case 'size':
        return ['Large', 'Small'];
      case 'style':
      case 'color':
        return ['Dark', 'Light'];
      case 'state':
        return ['Theme, State, Size', 'Hover, Active', 'Default, Focused'];
      default:
        return [];
    }
  };

  const renderDropdown = (type: string, label: string, icon: React.ReactNode) => (
    <div className="custom__module--contents-input-wrapper">
      <div className="choose-size-label">{label}</div>
      <div className="custom__module--contents-input">
        <div className="custom__module--contents-input-container">
          
          {/* Icon Box */}
          <div className="custom__module--icon-box">
            {icon}
          </div>
          
          {/* Module Description */}
          <div className="module__description">
            <span className="size-label">{label.split(' ')[1]}</span>
          </div>
          
          {/* Drop Down */}
          <div 
            className={`custom__module--drop-down ${expandedDropdown === type ? 'expanded' : ''}`}
            onClick={() => handleDropdownClick(type)}
          >
            <span className="drop-down-text">{selectedOptions[type as keyof typeof selectedOptions]}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.50002 3L7.5 6L4.5 9" stroke="black" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Dropdown Menu */}
            {expandedDropdown === type && type !== 'image' && (
              <div className="custom__module--drop-down-menu">
                {getDropdownOptions(type).map((option, index) => (
                  <div 
                    key={index}
                    className={`custom__module--drop-down-option ${
                      selectedOptions[type as keyof typeof selectedOptions] === option ? 'selected' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(type, option);
                    }}
                  >
                    <span className="custom__module--drop-down-option-text">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Image Selector Modal
  if (showImageSelector) {
    return (
      <div className="custom__module">
        <div className="custom__module--wrapper">
          <div className="custom__module--wrapper-container">
            <div className="custom__module--wrapper-container-content">
              {/* Header */}
              <div className="custom__module--header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <h3>Choose Image</h3>
                <button 
                  className="custom__module--close-btn"
                  onClick={() => setShowImageSelector(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* Image Grid */}
              <div className="custom__module--image-grid" style={{display:'flex',gap:'16px',flexWrap:'wrap',marginTop:'16px'}}>
                {loadingImages ? (
                  <div style={{width:'100%',textAlign:'center',padding:'20px'}}>
                    <p>Loading images from Firebase...</p>
                  </div>
                ) : availableImages.length === 0 ? (
                  <div style={{width:'100%',textAlign:'center',padding:'20px'}}>
                    <p>No images found in the plugin-images collection.</p>
                    <p style={{fontSize:'12px',color:'#888'}}>Please add images to your Firebase plugin-images collection.</p>
                  </div>
                ) : (
                  availableImages.map((image) => (
                    <div 
                      key={image.id}
                      className={`custom__module--image-option ${selectedImage === image.url ? 'selected' : ''}`}
                      style={{
                        border: selectedImage === image.url ? '2px solid #FF5C0A' : '1px solid #eee',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        width: '120px',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name} 
                        style={{
                          width: '100%',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load image:', image.url);
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMTIwIDcwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjYwIiB5PSIzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                      <div className="custom__module--image-info" style={{marginTop:'8px'}}>
                        <h4 style={{fontSize:'12px',margin:'0 0 4px 0'}}>{image.name}</h4>
                        <p style={{fontSize:'10px',color:'#888',margin:0}}>{image.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Actions */}
              <div className="custom__module--actions" style={{marginTop:'16px'}}>
                <div className="actions-content">
                  <div className="actions-buttons" style={{display:'flex',gap:'8px'}}>
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowImageSelector(false)}
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
  }

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
                    {renderDropdown('size', 'Choose Size', (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.91675 2.33317H12.2501M9.91675 2.33317C9.91675 2.65994 10.7884 3.27046 11.0834 3.49984M9.91675 2.33317C9.91675 2.0064 10.7884 1.39588 11.0834 1.1665" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.08333 2.33317H1.75M4.08333 2.33317C4.08333 2.0064 3.21166 1.39588 2.91667 1.1665M4.08333 2.33317C4.08333 2.65994 3.21166 3.27046 2.91667 3.49984" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.73705 12.8332V12.2798C5.73705 11.9032 5.6153 11.5367 5.38987 11.2345L3.25628 8.37452C3.01021 8.04465 2.81367 7.63544 2.97613 7.25761C3.23912 6.64605 3.98108 6.24874 4.88925 7.16568L5.82096 8.16283V2.08267C5.85377 0.890833 7.77177 0.831753 7.85379 2.08267V5.54769C8.71712 5.43619 12.7841 6.04486 12.1913 8.62331C12.1632 8.74581 12.135 8.87018 12.1076 8.9928C11.9876 9.52876 11.633 10.4839 11.242 11.0423C10.835 11.6237 10.9786 12.2027 10.9786 12.8332" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    ))}
                    {renderDropdown('style', 'Choose Style', (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.91675 8.1665V7.42544C2.91675 6.98549 3.16421 6.58299 3.55676 6.38442L5.15724 5.57472C5.54986 5.3761 5.79733 4.97349 5.79726 4.5335L5.79682 1.74993C5.79676 1.42773 6.05794 1.1665 6.38017 1.1665H8.13496C8.45713 1.1665 8.71835 1.42773 8.71829 1.74993L8.71782 4.52593C8.71776 4.96987 8.96965 5.37538 9.36766 5.57205L11.0169 6.38705C11.4149 6.58369 11.6667 6.9891 11.6667 7.43296V8.1665C11.6667 8.48868 11.4056 8.74984 11.0834 8.74984H3.50008C3.17792 8.74984 2.91675 8.48868 2.91675 8.1665Z" stroke="#FF5C0A" strokeLinejoin="round"/>
                        <path d="M3.49992 8.75C3.49992 9.33333 3.49992 10.9667 2.33325 12.8333C5.24992 12.8333 7.58325 12.8333 9.04159 10.5V12.25C9.04159 12.5722 9.30274 12.8333 9.62492 12.8333H11.0833C11.4054 12.8333 11.6678 12.5719 11.665 12.2497C11.6551 11.1122 11.5847 10.2544 11.0833 8.75" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ))}
                    {renderDropdown('image', 'Choose Image', (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.66675 5.5415C5.15 5.5415 5.54175 5.14975 5.54175 4.6665C5.54175 4.18325 5.15 3.7915 4.66675 3.7915C4.1835 3.7915 3.79175 4.18325 3.79175 4.6665C3.79175 5.14975 4.1835 5.5415 4.66675 5.5415Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.5416 11.3752V2.62516C12.5416 1.98083 12.0193 1.4585 11.3749 1.4585H2.62492C1.98059 1.4585 1.45825 1.98083 1.45825 2.62516V11.3752C1.45825 12.0195 1.98059 12.5418 2.62492 12.5418H11.3749C12.0193 12.5418 12.5416 12.0195 12.5416 11.3752Z" stroke="#FF5C0A" strokeLinejoin="round"/>
                        <path d="M3.20825 12.5414L8.36801 7.89769C8.76433 7.54098 9.35198 7.49834 9.7956 7.79409L12.5416 9.62476" stroke="#FF5C0A"/>
                      </svg>
                    ))}
                  </>
                ) : (
                  <>
                    {renderDropdown('state', 'Choose States', (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8334 6.99984C12.8334 10.2215 10.2217 12.8332 7.00008 12.8332C3.77842 12.8332 1.16675 10.2215 1.16675 6.99984C1.16675 3.77817 3.77842 1.1665 7.00008 1.1665C10.2217 1.1665 12.8334 3.77817 12.8334 6.99984Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
                      </svg>
                    ))}
                    {renderDropdown('style', 'Choose Style', (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.91675 8.1665V7.42544C2.91675 6.98549 3.16421 6.58299 3.55676 6.38442L5.15724 5.57472C5.54986 5.3761 5.79733 4.97349 5.79726 4.5335L5.79682 1.74993C5.79676 1.42773 6.05794 1.1665 6.38017 1.1665H8.13496C8.45713 1.1665 8.71835 1.42773 8.71829 1.74993L8.71782 4.52593C8.71776 4.96987 8.96965 5.37538 9.36766 5.57205L11.0169 6.38705C11.4149 6.58369 11.6667 6.9891 11.6667 7.43296V8.1665C11.6667 8.48868 11.4056 8.74984 11.0834 8.74984H3.50008C3.17792 8.74984 2.91675 8.48868 2.91675 8.1665Z" stroke="#FF5C0A" strokeLinejoin="round"/>
                        <path d="M3.49992 8.75C3.49992 9.33333 3.49992 10.9667 2.33325 12.8333C5.24992 12.8333 7.58325 12.8333 9.04159 10.5V12.25C9.04159 12.5722 9.30274 12.8333 9.62492 12.8333H11.0833C11.4054 12.8333 11.6678 12.5719 11.665 12.2497C11.6551 11.1122 11.5847 10.2544 11.0833 8.75" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    ))}
                  </>
                )}
              </div>
            </div>
            {/* Actions Section */}
            <div className="custom__module--actions">
              <div className="actions-content">
                <div className="actions-buttons">
                  <button 
                    className="btn-primary"
                    onClick={handleApplyChanges}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Apply Changes
                    {changesCount > 0 && (
                      <div className="component__details--actions-button-token">
                        <span>{changesCount}</span>
                      </div>
                    )}
                  </button>
                  <button 
                    className="btn-secondary"
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