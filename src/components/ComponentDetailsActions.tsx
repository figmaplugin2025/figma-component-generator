import React, { useEffect } from 'react';

interface ComponentDetailsActionsProps {
  onGenerate: () => void;
  onCustomize: () => void;
  componentData?: {
    figmaComponentId?: string;
    figmaFileId?: string;
    figmaComponentKey?: string;
    title?: string;
    specs?: any;
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
  };
}

const ComponentDetailsActions: React.FC<ComponentDetailsActionsProps> = ({
  onGenerate,
  onCustomize,
  componentData
}) => {
  const handleGenerate = async () => {
    try {
      console.log('🔥 Generate button clicked!');
      console.log('📦 Component data:', componentData);
      
      // Call the parent's onGenerate handler
      onGenerate();

      // Check if this is a master component with variants
      if (componentData?.isMasterComponent && componentData.variants && componentData.variants.length > 0) {
        console.log('🎨 Generating group of variants:', componentData.variants);
        
        // Send message to Figma to generate all variants
        if (window.parent && window.parent !== window) {
          const message = {
            pluginMessage: {
              type: 'insert-detached-variants',
              masterComponent: {
                componentId: componentData.figmaComponentId,
                figmaFileId: componentData.figmaFileId,
                figmaComponentKey: componentData.figmaComponentKey,
                title: componentData.title,
                specs: componentData.specs
              },
              variants: componentData.variants.map((variant) => ({
                figmaComponentKey: variant.figmaComponentKey,
                name: variant.name,
                specs: variant.specs
              }))
            }
          };
          
          console.log('📤 Sending grouped variants message to Figma:', message);
          window.parent.postMessage(message, '*');
        }
      } else {
        // Original single component generation logic
        console.log('🔍 Generating single component');
        
        // Send message to Figma to insert component
        if (window.parent && window.parent !== window && componentData) {
          const message = {
            pluginMessage: {
              type: 'insert-component',
              componentId: componentData.figmaComponentId,
              figmaFileId: componentData.figmaFileId,
              figmaComponentKey: componentData.figmaComponentKey,
              title: componentData.title,
              specs: componentData.specs
            }
          };
          
          console.log('📤 Sending single component message to Figma:', message);
          window.parent.postMessage(message, '*');
        } else {
          console.warn('⚠️ No parent window or component data missing');
        }
      }
    } catch (error) {
      console.error('❌ Error generating component in Figma:', error);
    }
  };

  // Add event listener for detached variants creation messages
  useEffect(() => {
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

  return (
    <div className="component__details--actions">
      <button className="component__details--actions-button" onClick={handleGenerate}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M6 0.625C3.03147 0.625 0.625 3.03147 0.625 6C0.625 8.96855 3.03147 11.375 6 11.375C8.96855 11.375 11.375 8.96855 11.375 6C11.375 3.03147 8.96855 0.625 6 0.625ZM6.37455 6.82945V3.73483H5.62455V6.82945L4.76473 5.96955L4.23438 6.4999L5.99955 8.2652L7.7647 6.4999L7.2344 5.96955L6.37455 6.82945Z" fill="white"/>
        </svg>
        <span>Generate</span>
        <div className="component__details--actions-button-token">
          <span>25 left</span>
        </div>
      </button>
      
      <button className="component__details--actions-button-2" onClick={onCustomize}>
        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3.5L6.5 1L8 3.5L6.5 3L5 3.5Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 8.5L6.5 11L8 8.5L6.5 9L5 8.5Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 6L4 4.5L3.5 6L4 7.5L1.5 6Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.5 6L9 4.5L9.5 6L9 7.5L11.5 6Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5002 6.00427C7.5002 6.55702 7.05245 7.00512 6.5001 7.00512C5.94775 7.00512 5.5 6.55702 5.5 6.00427C5.5 5.45152 5.94775 5.00342 6.5001 5.00342C7.05245 5.00342 7.5002 5.45152 7.5002 6.00427Z" stroke="#FF5C0A"/>
        </svg>
        <span>Customize</span>
      </button>
    </div>
  );
};

export default ComponentDetailsActions; 