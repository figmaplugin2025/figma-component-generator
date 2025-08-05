import React from 'react';
import CustomModule from './CustomModule';
import './CustomModuleModal.css';

interface CustomModuleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyChanges?: (changes: any) => void;
}

const CustomModuleModal: React.FC<CustomModuleModalProps> = ({ 
  isVisible, 
  onClose,
  onApplyChanges 
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
        />
      </div>
    </div>
  );
};

export default CustomModuleModal; 