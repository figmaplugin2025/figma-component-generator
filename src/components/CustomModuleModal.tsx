import React from 'react';
import CustomModule from './CustomModule';
import './CustomModuleModal.css';

interface CustomModuleModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CustomModuleModal: React.FC<CustomModuleModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="custom-module-modal-overlay" onClick={onClose}>
      <div className="custom-module-modal" onClick={(e) => e.stopPropagation()}>
        <div className="custom-module-modal-header">
          <h3 className="custom-module-modal-title">Customize Component</h3>
          <button onClick={onClose} className="custom-module-modal-close">×</button>
        </div>
        
        <div className="custom-module-modal-content">
          <CustomModule />
        </div>
      </div>
    </div>
  );
};

export default CustomModuleModal; 