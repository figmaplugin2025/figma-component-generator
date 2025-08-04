import React, { useState } from 'react';
import { 
  VersionManager, 
  ComponentVersionTracker, 
  PLUGIN_VERSIONS, 
  GENERATION_METHODS,
  CURRENT_PLUGIN_CONFIG,
  formatVersionInfo,
  formatGenerationMethod,
  type PluginVersion,
  type GenerationMethod
} from '../utils/versioning';
import './VersionInfo.css';

interface VersionInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

const VersionInfo: React.FC<VersionInfoProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'versions' | 'generation' | 'features'>('versions');

  if (!isVisible) return null;

  const currentVersion = VersionManager.getCurrentVersion();
  const workingMethod = VersionManager.getWorkingGenerationMethod();
  const featureStatus = VersionManager.getFeatureStatus();

  return (
    <div className="version-info-overlay">
      <div className="version-info-modal">
        <div className="version-info-header">
          <h3>Plugin Version Information</h3>
          <button onClick={onClose} className="version-info-close">×</button>
        </div>

        <div className="version-info-tabs">
          <button 
            className={`version-info-tab ${activeTab === 'versions' ? 'active' : ''}`}
            onClick={() => setActiveTab('versions')}
          >
            Versions
          </button>
          <button 
            className={`version-info-tab ${activeTab === 'generation' ? 'active' : ''}`}
            onClick={() => setActiveTab('generation')}
          >
            Generation Methods
          </button>
          <button 
            className={`version-info-tab ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
        </div>

        <div className="version-info-content">
          {activeTab === 'versions' && (
            <div className="version-info-section">
              <div className="current-version">
                <h4>Current Version</h4>
                <div className="version-card current">
                  <div className="version-header">
                    <span className="version-number">{currentVersion.version}</span>
                    <span className="version-date">{currentVersion.date}</span>
                  </div>
                  <p className="version-description">{currentVersion.description}</p>
                  <div className="version-changes">
                    <h5>Recent Changes:</h5>
                    <ul>
                      {currentVersion.changes.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="version-history">
                <h4>Version History</h4>
                <div className="version-list">
                  {PLUGIN_VERSIONS.map((version) => (
                    <div key={version.version} className={`version-item ${version.isCurrent ? 'current' : ''}`}>
                      <div className="version-item-header">
                        <span className="version-number">{version.version}</span>
                        <span className="version-status">
                          {version.isCurrent ? '🟢 Current' : version.isStable ? '✅ Stable' : '⚠️ Experimental'}
                        </span>
                      </div>
                      <p className="version-description">{version.description}</p>
                      <span className="version-date">{version.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generation' && (
            <div className="version-info-section">
              <div className="working-method">
                <h4>Current Working Method</h4>
                <div className="method-card working">
                  <h5>{workingMethod.name}</h5>
                  <p>{workingMethod.description}</p>
                  <div className="method-status">
                    <span className="status working">✅ Working</span>
                    <span className="last-tested">Last tested: {workingMethod.lastTested}</span>
                  </div>
                  <p className="method-notes">{workingMethod.notes}</p>
                </div>
              </div>

              <div className="method-history">
                <h4>Generation Method History</h4>
                <div className="method-list">
                  {GENERATION_METHODS.map((method) => (
                    <div key={method.id} className={`method-item ${method.isWorking ? 'working' : 'failed'}`}>
                      <div className="method-item-header">
                        <h5>{method.name}</h5>
                        <span className={`method-status ${method.isWorking ? 'working' : 'failed'}`}>
                          {method.isWorking ? '✅ Working' : '❌ Failed'}
                        </span>
                      </div>
                      <p>{method.description}</p>
                      <span className="last-tested">Last tested: {method.lastTested}</span>
                      <p className="method-notes">{method.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="version-info-section">
              <div className="feature-status">
                <h4>Feature Status</h4>
                <div className="feature-list">
                  {Object.entries(featureStatus).map(([feature, isEnabled]) => (
                    <div key={feature} className={`feature-item ${isEnabled ? 'enabled' : 'disabled'}`}>
                      <span className="feature-name">{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className={`feature-status ${isEnabled ? 'enabled' : 'disabled'}`}>
                        {isEnabled ? '✅ Enabled' : '❌ Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="plugin-config">
                <h4>Plugin Configuration</h4>
                <div className="config-info">
                  <div className="config-item">
                    <span className="config-label">Current Version:</span>
                    <span className="config-value">{CURRENT_PLUGIN_CONFIG.version}</span>
                  </div>
                  <div className="config-item">
                    <span className="config-label">Stable Version:</span>
                    <span className="config-value">{CURRENT_PLUGIN_CONFIG.stableVersion}</span>
                  </div>
                  <div className="config-item">
                    <span className="config-label">Last Updated:</span>
                    <span className="config-value">{CURRENT_PLUGIN_CONFIG.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionInfo; 