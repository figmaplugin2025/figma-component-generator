import React from 'react';

interface ComponentDetailsActionsProps {
  onGenerate: () => void;
  onCustomize: () => void;
  onReset?: () => void;
  componentData?: {
    figmaComponentId?: string;
    figmaFileId?: string;
    figmaComponentKey?: string;
    title?: string;
    specs?: Record<string, unknown>;
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
  };
  customizationCount?: number;
}

const ComponentDetailsActions: React.FC<ComponentDetailsActionsProps> = ({
  onGenerate,
  onCustomize,
  onReset,
  componentData,
  customizationCount = 0
}) => {
  return (
    <div className="component__details--actions">
      <button className="btn-primary" onClick={onGenerate}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M6 0.625C3.03147 0.625 0.625 3.03147 0.625 6C0.625 8.96855 3.03147 11.375 6 11.375C8.96855 11.375 11.375 8.96855 11.375 6C11.375 3.03147 8.96855 0.625 6 0.625ZM6.37455 6.82945V3.73483H5.62455V6.82945L4.76473 5.96955L4.23438 6.4999L5.99955 8.2652L7.7647 6.4999L7.2344 5.96955L6.37455 6.82945Z" fill="white"/>
        </svg>
        <span>Generate</span>
        <div className="component__details--actions-button-token">
          <span>25 left</span>
        </div>
      </button>
      
      <div className="customize-buttons-container">
        {customizationCount > 0 && (
          <button 
            className="btn-secondary btn-reset" 
            onClick={onReset}
            title="Reset customizations"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.1016 4.6665C12.5629 5.3279 12.8335 6.1323 12.8335 6.99984C12.8335 9.255 11.0053 11.0832 8.75016 11.0832H3.2085L4.9585 12.5415" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.89841 9.3335C1.43706 8.67211 1.1665 7.8677 1.1665 7.00016C1.1665 4.745 2.99468 2.91683 5.24984 2.91683H10.7915L9.0415 1.4585" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        
        <button className="btn-secondary" onClick={onCustomize}>
          <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3.5L6.5 1L8 3.5L6.5 3L5 3.5Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 8.5L6.5 11L8 8.5L6.5 9L5 8.5Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.5 6L4 4.5L3.5 6L4 7.5L1.5 9Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.5 6L9 4.5L9.5 6L9 7.5L11.5 6Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5002 6.00427C7.5002 6.55702 7.05245 7.00512 6.5001 7.00512C5.94775 7.00512 5.5 6.55702 5.5 6.00427C5.5 5.45152 5.94775 5.00342 6.5001 5.00342C7.05245 5.00342 7.5002 5.45152 7.5002 6.00427Z" stroke="#FF5C0A"/>
          </svg>
          <span>Customize</span>
          {customizationCount > 0 && (
            <div className="component__details--actions-button-token-customize">
              <span>{customizationCount}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ComponentDetailsActions; 