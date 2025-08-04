import React, { useState } from 'react';
import BackSection from './BackSection';
import ComponentDetailsActions from './ComponentDetailsActions';
import CustomModuleModal from './CustomModuleModal';
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
    specs: any;
    isDefault: boolean;
  }>;
  variantCount?: number;
}

interface ComponentCardDetailedViewProps {
  data: ComponentDetailData;
  onBack: () => void;
  onGenerate: () => void;
  onCustomize: () => void;
  onGetVolts: () => void;
  onLogout: () => void;
}

const ComponentCardDetailedView: React.FC<ComponentCardDetailedViewProps> = ({
  data,
  onBack,
  onGenerate,
  onCustomize,
  onGetVolts,
  onLogout
}) => {
  const [showCustomModuleModal, setShowCustomModuleModal] = useState(false);

  const handleCustomize = () => {
    setShowCustomModuleModal(true);
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

      {/* Back Navigation Section - using existing BackSection */}
      <BackSection onBack={onBack} />

      {/* Component Details Image Section */}
      <div className="component__details--image">
        <div className="component__details--image-container">
          <img 
            src={data.image} 
            alt={data.title}
            className="component__details--image-img"
            onLoad={(e) => {
              console.log('✅ Component image loaded successfully:', data.image);
              console.log('✅ Image element src:', e.currentTarget.src);
              console.log('✅ Image natural dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
            }}
            onError={(e) => {
              console.error('❌ Failed to load component image:', data.image);
              console.error('❌ Image element src:', e.currentTarget.src);
              console.error('❌ Error details:', e);
              
              // Test if we can load the URL directly
              console.log('🧪 Testing direct URL access...');
              fetch(data.image)
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
        onGenerate={onGenerate}
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
      />

      {/* CustomModule Modal */}
      <CustomModuleModal 
        isVisible={showCustomModuleModal}
        onClose={() => setShowCustomModuleModal(false)}
      />
    </div>
  );
};

export default ComponentCardDetailedView; 