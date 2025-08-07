import React from 'react';
import CustomModule from './CustomModule';
import './CustomModuleModal.css';

interface CustomModuleModalProps {
  isVisible: boolean;
  onClose: () => void;
  customizationMode?: 'single' | 'set' | null;
  onApplyChanges?: (changes: Record<string, string>) => void;
  availableComponents?: any[]; // Add this prop for component selection
  componentId?: string; // Add componentId prop for database updates
}

const CustomModuleModal: React.FC<CustomModuleModalProps> = ({ 
  isVisible, 
  onClose,
  onApplyChanges,
  customizationMode,
  availableComponents = [],
  componentId // Add componentId prop
}) => {
  const handleApplyChanges = (changes: Record<string, string>) => {
    if (onApplyChanges) {
      onApplyChanges(changes);
    }
    
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={`custom-module-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className="custom-module-modal" onClick={(e) => e.stopPropagation()}>
        <CustomModule 
          onApplyChanges={handleApplyChanges}
          onCancel={handleCancel}
          customizationMode={customizationMode}
          availableComponents={availableComponents}
          componentId={componentId} // Pass componentId to CustomModule
        />
      </div>
    </div>
  );
};

export default CustomModuleModal; 