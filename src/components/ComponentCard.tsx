import React, { useEffect, useState } from 'react';
import { useComponents } from '../hooks/useComponents';

export interface ComponentCardData {
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

interface ComponentCardProps {
  onCardClick: (card: ComponentCardData) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ onCardClick }) => {
  const { 
    components, 
    loading, 
    error, 
    fetchComponents,
    incrementGenerateCount 
  } = useComponents();

  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Fetch components when component mounts
  useEffect(() => {
    // Fetch all components
    fetchComponents();
  }, [fetchComponents]);

  const handleCardClick = async (component: any) => {
    // Increment generate count when component is clicked
    if (component.id) {
      await incrementGenerateCount(component.id);
    }

    // DEBUG: Log the raw Firebase component data
    console.log('🔍 RAW Firebase component data:', component);
    console.log('🖼️ Raw imageUrl from Firebase:', component.imageUrl);
    console.log('🖼️ imageUrl type:', typeof component.imageUrl);
    console.log('🖼️ imageUrl length:', component.imageUrl?.length);

    // Convert Firebase data to ComponentCardData format
    const cardData: ComponentCardData = {
      id: component.id || '',
      title: component.title || 'Component',
      image: component.imageUrl || '',
      volts: component.volts || 0,
      maxVolts: component.maxVolts || 500,
      voltsCost: component.voltsCost || 0,
      description: component.description || '',
      specs: component.specs || {
        size: '240x200 px',
        device: 'Desktop',
        color: 'Light',
        padding: '16px'
      },
      generateCount: component.generateCount || 0,
      date: {
        month: 'Jan',
        day: '15',
        weekday: 'Mon'
      },
      figmaComponentId: component.figmaComponentId,
      figmaFileId: component.figmaFileId,
      figmaComponentKey: component.figmaComponentKey,
      isMasterComponent: component.isMasterComponent,
      variants: component.variants?.map((variant: any) => ({
        id: variant.id,
        name: variant.title || variant.name,
        imageUrl: variant.imageUrl,
        figmaComponentKey: variant.figmaComponentKey,
        specs: variant.specs,
        isDefault: variant.isDefault || false
      })),
      variantCount: component.variantCount
    };

    // DEBUG: Log the mapped card data
    console.log('🔄 MAPPED CardData:', cardData);
    console.log('🖼️ Mapped image field:', cardData.image);
    console.log('🖼️ Image mapping successful:', component.imageUrl === cardData.image);

    onCardClick(cardData);
  };

  const handleDragStart = (e: React.DragEvent, component: any) => {
    setDraggingId(component.id);
    
    // Set drag data with component information
    const dragData = {
      componentId: component.id,
      figmaComponentId: component.figmaComponentId,
      figmaFileId: component.figmaFileId,
      figmaComponentKey: component.figmaComponentKey,
      title: component.title,
      type: 'figma-component'
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Set a custom drag image (optional)
    const dragImage = new Image();
    dragImage.src = component.imageUrl || '';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleGenerateInFigma = async (component: any) => {
    try {
      // Increment generate count
      if (component.id) {
        await incrementGenerateCount(component.id);
      }

      // Check if this is a master component with variants
      if (component.isMasterComponent && component.variants && component.variants.length > 0) {
        console.log('🎨 Generating group of variants:', component.variants);
        
        // Send message to Figma to generate all variants
        if (window.parent && window.parent !== window) {
          const variantKeys = component.variants
            .filter((variant: any) => variant.figmaComponentKey)
            .map((variant: any) => variant.figmaComponentKey);
          
          console.log('🔑 Variant keys for group:', variantKeys);
          
          window.parent.postMessage({
            pluginMessage: {
              type: 'insert-detached-variants',
              masterComponent: {
                componentId: component.figmaComponentId,
                figmaFileId: component.figmaFileId,
                figmaComponentKey: component.figmaComponentKey,
                title: component.title,
                specs: component.specs
              },
              variants: component.variants.map((variant: any) => ({
                figmaComponentKey: variant.figmaComponentKey,
                name: variant.title,
                specs: variant.specs
              }))
            }
          }, '*');
        }
      } else {
        // Original single component generation logic
        console.log('🔍 Generating single component');
        
        // Send message to Figma to insert component
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            pluginMessage: {
              type: 'insert-component',
              componentId: component.figmaComponentId,
              figmaFileId: component.figmaFileId,
              figmaComponentKey: component.figmaComponentKey,
              title: component.title,
              specs: component.specs
            }
          }, '*');
        }
      }
    } catch (error) {
      console.error('Error generating component in Figma:', error);
    }
  };

  // Add event listener for detached variants creation messages
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage?.type === 'detached-variants-created') {
        const { success, variantCount, variantNames, error } = event.data.pluginMessage;
        
        if (success) {
          console.log(`🎉 Created ${variantCount} detached components!`);
          
          // Show success message with variant names
          const variantList = variantNames.join('\n• ');
          alert(`🎉 Successfully created ${variantCount} detached components!\n\n• ${variantList}`);
        } else {
          console.error('❌ Failed to create detached components:', error);
          alert(`❌ Failed to create detached components: ${error}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (loading) {
    return (
      <div className="component__card">
        <div>Loading components...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="component__card">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="component__card">
        <div>No components found</div>
      </div>
    );
  }

  // Group components by master component
  const groupComponentsByMaster = (components: any[]): Record<string, any[]> => {
    const masterGroups: Record<string, any[]> = {};
    
    components.forEach((component: any) => {
      const name = component.title || component.name || '';
      
      // Debug: Log each component being processed
      console.log(`🔍 Processing component:`, component.title, component.name);
      
      // Handle different naming patterns
      let masterName = name;
      
      // If this is a variant, use the master component name
      if (component.isVariant && component.masterComponentName) {
        masterName = component.masterComponentName;
      } else if (name.includes('=')) {
        // Pattern: "Component Name=variant"
        masterName = name.split('=')[0] || name;
      } else if (name.includes('/')) {
        // Pattern: "Component Name/variant1/variant2" -> "Component Name"
        const parts = name.split('/');
        if (parts.length >= 2) {
          masterName = parts[0]; // Take the first part as master name
        }
      }
      
      console.log(`🔍 Component "${name}" -> Master name: "${masterName}"`);
      
      if (!masterGroups[masterName]) {
        masterGroups[masterName] = [];
      }
      
      masterGroups[masterName].push(component);
    });
    
    return masterGroups;
  };

  // Group components by masterName and show 1 card per group
  const groupedComponents = groupComponentsByMaster(components);
  
  // Debug: Log the grouping results
  console.log('🔍 Grouped components:', groupedComponents);
  console.log('🔍 Number of groups:', Object.keys(groupedComponents).length);
  Object.entries(groupedComponents).forEach(([masterName, variants]) => {
    console.log(`🔍 Group "${masterName}": ${variants.length} variants`);
  });
  
  return (
    <div className="component__card">
      {Object.entries(groupedComponents).map(([masterName, variants]) => (
                <div 
          key={masterName} 
          className={`component__card-box ${draggingId === variants[0]?.id ? 'dragging' : ''}`}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, variants[0])}
          onDragEnd={handleDragEnd}
          onClick={() => handleCardClick({
            ...variants[0],
            isMasterComponent: true,
            variants: variants,
            variantCount: variants.length,
            title: masterName
          })}
          onDoubleClick={() => handleGenerateInFigma({
            ...variants[0],
            isMasterComponent: true,
            variants: variants,
            variantCount: variants.length,
            title: masterName
          })}
          style={{ cursor: 'pointer' }}
          title={`Master: ${masterName} (${variants.length} variants) - Click to view details, double-click to generate in Figma, drag to insert`}
        >
          <div className="component__card-container">
            <div 
              className="component__card-image"
              style={{
                backgroundImage: `url(${variants[0].imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <svg 
              width="84" 
              height="123" 
              viewBox="0 0 84 123" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: '80px',
                top: '70px'
              }}
            >
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
      ))}
    </div>
  );
};

export default ComponentCard; 