import React, { useState } from 'react';
import BackSection from './BackSection';
import ComponentDetailsActions from './ComponentDetailsActions';
import CustomModuleModal from './CustomModuleModal';
import CustomModuleChoice from './CustomModuleChoice';
import { getDefaultComponent, groupComponentsByMaster, selectComponentVariant, ComponentPreferences } from '../services/componentService';
import { Timestamp } from 'firebase/firestore';
// import UserLoggedInSection from './UserLoggedInSection'; // Commented out after removal

interface ComponentDetailData {
  id: string;
  title: string;
  image: string;
  volts: number;
  maxVolts: number;
  voltsCost: number;
  description: string;
  specs: {
    size: string;
    device: string;
    color: string;
    padding: string;
  };
  generateCount: number;
  date: {
    month: string;
    day: string;
    weekday: string;
  };
  figmaComponentId?: string;
  figmaFileId?: string;
  figmaComponentKey?: string;
  isMasterComponent?: boolean;
  variants?: Array<{
    id: string;
    name: string;
    imageUrl: string;
    figmaComponentKey: string;
    specs: Record<string, unknown>;
    isDefault: boolean;
  }>;
  variantCount?: number;
}

interface ComponentCardDetailedViewProps {
  data: ComponentDetailData;
  onBack: () => void;
  onGenerate: () => void;
}

const ComponentCardDetailedView: React.FC<ComponentCardDetailedViewProps> = ({
  data,
  onBack,
  onGenerate
}) => {
  const [showCustomModuleModal, setShowCustomModuleModal] = useState(false);
  const [showCustomModuleChoice, setShowCustomModuleChoice] = useState(false);
  const [customizationMode, setCustomizationMode] = useState<'single' | 'set' | null>(null);
  const [customizationCount, setCustomizationCount] = useState(0);
  // Get the correct image for this specific variant
  const getVariantImage = () => {
    // If this is a specific variant (title contains the full variant path)
    if (data.title && data.title.includes('/')) {
      // This is already a specific variant, use its image
      return data.image;
    }
    
    // If this is a master component, find the specific variant image
    if (data.variants && data.variants.length > 0) {
      // Look for the .dark/.large variant
      const darkLargeVariant = data.variants.find(variant => 
        variant.name.includes('/dark/') && variant.name.includes('/large')
      );
      if (darkLargeVariant) {
        return darkLargeVariant.imageUrl;
      }
      
      // Fallback to first variant
      return data.variants[0].imageUrl;
    }
    
    // Fallback to master component image
    return data.image;
  };

  const [currentImage, setCurrentImage] = useState(getVariantImage());
  const [customizationPreferences, setCustomizationPreferences] = useState<Record<string, string>>({});
  const [hasCustomizations, setHasCustomizations] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error', message: string } | null>(null);

  // Get available components for variant selection
  const getAvailableComponents = () => {
    const components = [];
    
    // Add the current component
    if (data) {
      components.push({
        id: data.id,
        title: data.title,
        imageUrl: data.image,
        figmaComponentKey: data.figmaComponentKey,
        specs: data.specs,
        // Fallbacks for required fields
        description: data.description || '',
        volts: data.volts || 0,
        maxVolts: data.maxVolts || 0,
        voltsCost: data.voltsCost || 0,
        category: '',
        generateCount: data.generateCount || 0,
        date: data.date || { month: '', day: '', weekday: '' },
        downloads: 0,
        rating: 0,
        tags: [],
        isPublic: true,
        createdBy: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    
    // Add variants if available
    if (data.variants && data.variants.length > 0) {
      data.variants.forEach(variant => {
        components.push({
          id: variant.id,
          title: variant.name,
          imageUrl: variant.imageUrl,
          figmaComponentKey: variant.figmaComponentKey,
          specs: variant.specs as any,
          // Fallbacks for required fields
          description: '',
          volts: 0,
          maxVolts: 0,
          voltsCost: 0,
          category: '',
          generateCount: 0,
          date: { month: '', day: '', weekday: '' },
          downloads: 0,
          rating: 0,
          tags: [],
          isPublic: true,
          createdBy: '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });
    }
    
    return components;
  };

  const handleCustomize = () => {
    setShowCustomModuleChoice(true);
  };

  const handleChoiceContinue = (mode: 'single' | 'set') => {
    setCustomizationMode(mode);
    setShowCustomModuleChoice(false);
    setShowCustomModuleModal(true);
  };

  const handleChoiceCancel = () => {
    setShowCustomModuleChoice(false);
  };

  const handleCustomModuleClose = () => {
    setShowCustomModuleModal(false);
    setCustomizationMode(null);
  };

  const handleReset = () => {
    setCustomizationCount(0);
    setCurrentImage(getVariantImage()); // Reset image to variant image
    setCustomizationPreferences({});
    setHasCustomizations(false);
    console.log('🔄 Customizations reset to 0');
  };

  // Enhanced Generate logic: generate only the default component (first in group)
  const handleGenerate = () => {
    const availableComponents = getAvailableComponents();
    const grouped = groupComponentsByMaster(availableComponents);
    const masterNames = Object.keys(grouped);
    let selectedComponent;
    let customImageUrl: string | undefined;
    
    if (hasCustomizations && Object.keys(customizationPreferences).length > 0) {
      const size = (customizationPreferences['size'] || 'Large').toLowerCase() as 'large' | 'small';
      const style = (customizationPreferences['style'] || 'Dark').toLowerCase() as 'dark' | 'light';
      const image = customizationPreferences['image'] || undefined;
      
      // Get the custom image URL if an image was selected
      if (image && image !== 'Default') {
        // Get the selected image URL from the preferences
        customImageUrl = customizationPreferences['selectedImageUrl'];
      }
      
      selectedComponent = selectComponentVariant(grouped[masterNames[0]], { size, style, image });
    } else {
      selectedComponent = getDefaultComponent(grouped[masterNames[0]]);
    }
    
    if (window.parent && window.parent !== window && selectedComponent) {
      // Show generating notification
      setNotification({
        type: 'success',
        message: customImageUrl ? 
          '🎨 Generating component with custom image in Figma...' : 
          '🎨 Generating component in Figma...'
      });
      
      window.parent.postMessage({
        pluginMessage: {
          type: 'insert-component',
          componentId: selectedComponent.id,
          figmaFileId: data.figmaFileId,
          figmaComponentKey: selectedComponent.figmaComponentKey,
          title: selectedComponent.title,
          specs: selectedComponent.specs,
          customImageUrl: customImageUrl
        }
      }, '*');
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      setCustomizationPreferences({});
      setHasCustomizations(false);
      setCustomizationCount(0);
    }
  };

  // Debug: Log the data being received
  console.log('🔍 ComponentCardDetailedView received data:', data);
  console.log('🖼️ Image URL:', data.image);
  console.log('🖼️ Image URL type:', typeof data.image);
  console.log('🖼️ Image URL length:', data.image?.length);
  console.log('🖼️ Is image URL empty?', !data.image || data.image.trim() === '');
  
  // Debug: Log master component fields
  console.log('🔍 isMasterComponent:', data.isMasterComponent);
  console.log('🔍 variants:', data.variants);
  console.log('🔍 variantCount:', data.variantCount);
  console.log('🔍 figmaComponentId:', data.figmaComponentId);
  console.log('🔍 figmaFileId:', data.figmaFileId);
  console.log('🔍 figmaComponentKey:', data.figmaComponentKey);

  return (
    <div className="component-detail-page">
      {/* Removed UserLoggedInSection from here */}

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          background: notification.type === 'success' ? '#10b981' : 
                     notification.type === 'warning' ? '#f59e0b' : '#ef4444',
          color: 'white',
          maxWidth: '300px',
          wordWrap: 'break-word'
        }}>
          {notification.message}
        </div>
      )}

      {/* Back Navigation Section - using existing BackSection */}
      <BackSection onBack={onBack} />

      {/* Component Details Image Section */}
      <div className="component__details--image">
        <div className="component__details--image-container" style={{ position: 'relative' }}>
          <img 
            src={currentImage} 
            alt={data.title}
            className="component__details--image-img"
            onLoad={(e) => {
              console.log('✅ Component image loaded successfully:', currentImage);
              console.log('✅ Image element src:', e.currentTarget.src);
              console.log('✅ Image natural dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
            }}
            onError={(e) => {
              console.error('❌ Failed to load component image:', currentImage);
              console.error('❌ Image element src:', e.currentTarget.src);
              console.error('❌ Error details:', e);
              
              // Test if we can load the URL directly
              console.log('🧪 Testing direct URL access...');
              fetch(currentImage)
                .then(response => {
                  console.log('🧪 Fetch response status:', response.status);
                  console.log('🧪 Fetch response headers:', response.headers);
                })
                .catch(fetchError => {
                  console.error('🧪 Fetch failed:', fetchError);
                });
              
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
            }}
          />
          
          {/* Custom Image Indicator Overlay */}
          {customizationPreferences.selectedImageUrl && (
            <div className="custom-image-indicator" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10
            }}>
              <div className="custom-image-badge" style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                <span className="custom-image-icon">🖼️</span>
                <span className="custom-image-text">Custom Image Selected</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Component Details Info Section */}
      <div className="component__details--info">
        <div className="component__details--info-banner">
          <span className="component__details--info-volts">{data.volts} volts</span>
        </div>
        <h3 className="component__details--info-title">{data.title}</h3>
        <p className="component__details--info-description">
          {data.description}
        </p>
      </div>

      {/* Component Details Specs Section */}
      <div className="component__details--specs">
        {/* Four identical spec boxes */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="component__details--specs-box">
            <div className="component__details--specs-box-container">
              <div className="component__details--specs-box-container-content">
                <div className="component__details--specs-box-container-content-left">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75 5.25L9 1.5L11.25 5.25L9 4.5L6.75 5.25Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.75 12.75L9 16.5L11.25 12.75L9 13.5L6.75 12.75Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.5 9L5.25 6.75L4.5 9L5.25 11.25L1.5 9Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 9L12.75 6.75L13.5 9L12.75 11.25L16.5 9Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5003 9.0064C10.5003 9.83553 9.82868 10.5077 9.00015 10.5077C8.17163 10.5077 7.5 9.83553 7.5 9.0064C7.5 8.17728 8.17163 7.50513 9.00015 7.50513C9.82868 7.50513 10.5003 8.17728 10.5003 9.0064Z" stroke="#FF5C0A"/>
                  </svg>
                  <span>Size</span>
                </div>
                <span>{data.specs.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Component Actions Section */}
      <ComponentDetailsActions
        onGenerate={handleGenerate}
        onCustomize={handleCustomize}
        componentData={{
          figmaComponentId: data.figmaComponentId,
          figmaFileId: data.figmaFileId,
          figmaComponentKey: data.figmaComponentKey,
          title: data.title,
          specs: data.specs,
          isMasterComponent: data.isMasterComponent,
          variants: data.variants,
          variantCount: data.variantCount
        }}
        customizationCount={customizationCount}
        onReset={handleReset}
      />

      {/* CustomModuleChoice Modal */}
      {showCustomModuleChoice && (
        <div className="modal-overlay">
          <CustomModuleChoice
            onContinue={(mode) => handleChoiceContinue(mode)}
            onCancel={handleChoiceCancel}
          />
        </div>
      )}

      {/* CustomModule Modal */}
      {showCustomModuleModal && (
        <CustomModuleModal 
          isVisible={showCustomModuleModal}
          onClose={handleCustomModuleClose}
          customizationMode={customizationMode}
          availableComponents={getAvailableComponents()}
          componentId={data.id} // Add componentId for database updates
          onApplyChanges={async prefs => {
            setCustomizationPreferences(prefs);
            setHasCustomizations(true);
            let count = 0;
            
            if (customizationMode === 'single') {
              const defaults = {
                size: 'Large',
                style: 'Dark', 
                image: 'Dark'
              };
              const singleOptions = ['size', 'style', 'image'];
              count = singleOptions.filter(option => 
                prefs[option] !== undefined && 
                prefs[option] !== null && 
                prefs[option] !== '' &&
                prefs[option] !== defaults[option as keyof typeof defaults]
              ).length;
              
              // Update image based on style selection
              if (prefs.style && prefs.style !== defaults.style) {
                const availableComponents = getAvailableComponents();
                const grouped = groupComponentsByMaster(availableComponents);
                const masterNames = Object.keys(grouped);
                if (masterNames.length > 0) {
                  const size = (prefs.size || 'Large').toLowerCase() as 'large' | 'small';
                  const style = prefs.style.toLowerCase() as 'dark' | 'light';
                  const matchingComponent = selectComponentVariant(grouped[masterNames[0]], { size, style });
                  if (matchingComponent) {
                    setCurrentImage(matchingComponent.imageUrl);
                    console.log('🎨 Updated image to match style:', prefs.style, '->', matchingComponent.imageUrl);
                  }
                }
              }
              
              // NEW: Handle custom image selection for live preview
              if (prefs.selectedImageUrl && prefs.selectedImageUrl !== '') {
                try {
                  console.log('🖼️ Live preview: Showing original component with custom image indicator');
                  
                  // For live preview, show the original component image
                  // The custom image will be placed inside the .placeholder-image frame when generated
                  setCurrentImage(getVariantImage());
                  console.log('🖼️ Live preview: Updated to original component image');
                  
                  // Update the database with the custom image URL for persistence
                  if (data.id) {
                    const { componentService } = await import('../services/componentService');
                    await componentService.updateComponent(data.id, { 
                      imageUrl: getVariantImage() // Keep original component image
                    });
                    
                    console.log('✅ Custom image URL saved to database');
                  }
                  
                } catch (error) {
                  console.error('❌ Failed to update live preview:', error);
                  // Fallback to showing just the custom image
                  setCurrentImage(prefs.selectedImageUrl);
                }
              } else if (prefs.image && prefs.image !== defaults.image) {
                // Handle other image selections (not custom uploaded images)
                setCurrentImage(prefs.image);
                console.log('🖼️ Updated image to selection:', prefs.image);
              }
            } else if (customizationMode === 'set') {
              const defaults = {
                state: 'Theme, State, Size',
                style: 'Dark'
              };
              const setOptions = ['state', 'style'];
              count = setOptions.filter(option => 
                prefs[option] !== undefined && 
                prefs[option] !== null && 
                prefs[option] !== '' &&
                prefs[option] !== defaults[option as keyof typeof defaults]
              ).length;
              
              // Update image based on style selection for set mode
              if (prefs.style && prefs.style !== defaults.style) {
                const availableComponents = getAvailableComponents();
                const grouped = groupComponentsByMaster(availableComponents);
                const masterNames = Object.keys(grouped);
                if (masterNames.length > 0) {
                  const style = prefs.style.toLowerCase() as 'dark' | 'light';
                  // For set mode, use default size (large) when style changes
                  const matchingComponent = selectComponentVariant(grouped[masterNames[0]], { size: 'large', style });
                  if (matchingComponent) {
                    setCurrentImage(matchingComponent.imageUrl);
                    console.log('🎨 Updated image to match style (set mode):', prefs.style, '->', matchingComponent.imageUrl);
                  }
                }
              }
            }
            setCustomizationCount(count);
          }}
        />
      )}
    </div>
  );
};

export default ComponentCardDetailedView; 