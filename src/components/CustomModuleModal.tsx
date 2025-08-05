import React from 'react';
import CustomModule from './CustomModule';
import './CustomModuleModal.css';

interface CustomModuleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyChanges?: (changes: any) => void;
  customizationMode?: 'single' | 'set' | null;
}

const CustomModuleModal: React.FC<CustomModuleModalProps> = ({ 
  isVisible, 
  onClose,
  onApplyChanges,
  customizationMode
}) => {
  const handleApplyChanges = (changes: any) => {
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
        />
      </div>
    </div>
  );
};

export default CustomModuleModal; 