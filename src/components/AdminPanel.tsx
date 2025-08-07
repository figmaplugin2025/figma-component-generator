import React, { useState } from 'react';
import { useComponents } from '../hooks/useComponents';
import { figmaImageSync } from '../utils/figmaImageSync';
import { componentService } from '../services/componentService';
import { imageService } from '../services/imageService';
import VersionInfo from './VersionInfo';

// Interface for Figma component data
interface FigmaComponentData {
  name: string;
  key: string;
  node_id: string;
  absoluteBoundingBox?: {
    width: number;
    height: number;
  };
  isVariant?: boolean;
  masterComponentName?: string;
}

const AdminPanel: React.FC = () => {
  const { components, loading, error, fetchComponents } = useComponents();
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [figmaFileId, setFigmaFileId] = useState<string>('WmR2QoB6m9bXeHuHBaRqNf');
  const [figmaAccessToken, setFigmaAccessToken] = useState<string>('');
  const [showCredentials, setShowCredentials] = useState(false);
  const [showVersionInfo, setShowVersionInfo] = useState(false);

  const handleImportAllComponents = async () => {
    if (!figmaFileId || !figmaAccessToken) {
      alert('Please enter both Figma File ID and Access Token');
      return;
    }

    setImporting(true);
    setImportStatus('🔄 Starting import...');

    try {
      // Step 1: Get ALL components and component sets
      const [allComponentsResponse, allComponentSetsResponse] = await Promise.all([
        fetch(`https://api.figma.com/v1/files/${figmaFileId}/components`, {
          headers: { 'X-Figma-Token': figmaAccessToken }
        }),
        fetch(`https://api.figma.com/v1/files/${figmaFileId}/component_sets`, {
          headers: { 'X-Figma-Token': figmaAccessToken }
        })
      ]);

      if (!allComponentsResponse.ok || !allComponentSetsResponse.ok) {
        throw new Error('Failed to fetch components or component sets');
      }

      const allComponents = await allComponentsResponse.json();
      const allComponentSets = await allComponentSetsResponse.json();

      // Step 2: Expand component sets to get their individual variants
      const expandedItems: FigmaComponentData[] = [...(allComponents.meta?.components || [])];
      
      const componentSets = allComponentSets.meta?.component_sets || [];
      
      for (const componentSet of componentSets) {
        try {
          
          // Get detailed information about the component set
          const setDetailsResponse = await fetch(`https://api.figma.com/v1/files/${figmaFileId}/component_sets?ids=${componentSet.key}`, {
            headers: {
              'X-Figma-Token': figmaAccessToken
            }
          });
          
          if (setDetailsResponse.ok) {
            const setDetails = await setDetailsResponse.json();
            
            // If the component set has children (variants), add them
            if (setDetails.meta && setDetails.meta.component_sets && setDetails.meta.component_sets[componentSet.key]) {
              const setInfo = setDetails.meta.component_sets[componentSet.key];
              
              // Instead of adding the component set itself, add each variant as a separate component
              // This way we can import each variant individually
              if (setInfo.children) {
                // Add each child as a separate component
                for (const child of setInfo.children) {
                  if (child.type === 'COMPONENT') {
                    expandedItems.push({
                      ...child,
                      name: `${componentSet.name}/${child.name}`,
                      key: child.key,
                      node_id: child.id,
                      isVariant: true,
                      masterComponentName: componentSet.name
                    });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`❌ Failed to expand component set ${componentSet.name}:`, error);
          // Add the component set as-is if expansion fails
          expandedItems.push(componentSet);
        }
      }
      
      if (!Array.isArray(expandedItems)) {
        throw new Error('Expanded items is not an array');
      }
      
      const masterComponents = groupComponentsByMaster(expandedItems);

      let successCount = 0;
      let failCount = 0;

      // Step 3: Import each master component
      for (const [masterName, variants] of Object.entries(masterComponents)) {
        try {
          if (!Array.isArray(variants) || variants.length === 0) {
            continue;
          }
          
          // Use the first variant's data as the master component data
          const firstVariant = variants[0] as FigmaComponentData;
          
          // Import each variant as a separate component
          for (const variant of variants) {
            try {
              
              // Create component data for each individual variant
              const componentData = {
                title: variant.name, // Use the full variant name (e.g., ".clasroom-card/.dark/.large")
                description: `${variant.name} component variant`,
                volts: calculateVolts(variant),
                maxVolts: 500,
                voltsCost: calculateVolts(variant),
                category: categorizeComponent(variant.name),
                specs: {
                  size: `${Math.round(variant.absoluteBoundingBox?.width || 400)}x${Math.round(variant.absoluteBoundingBox?.height || 240)}px`,
                  device: 'Desktop',
                  color: variant.name.includes('dark') ? 'Dark' : 'Light',
                  padding: '16px'
                },
                imageUrl: '',
                figmaComponentId: variant.node_id || variant.key,
                figmaFileId: figmaFileId,
                figmaComponentKey: variant.key || 'fallback-key',
                generateCount: 0,
                downloads: 0,
                rating: 5.0,
                tags: generateTags(variant.name),
                isPublic: true,
                createdBy: 'admin',
                masterName: masterName // Store the master name for grouping
              };

              // Create component in database
              const createdComponentId = await componentService.createComponent(componentData);
              
              // Try to export image for the variant
              try {
                const imageUrl = await figmaImageSync.exportAndUploadComponentImage(
                  variant.node_id || variant.key,
                  variant.key,
                  createdComponentId,
                  {
                    figmaFileId,
                    figmaAccessToken,
                    imageFormat: 'png',
                    imageScale: 2
                  }
                );
                
                await componentService.updateComponent(createdComponentId, { imageUrl: imageUrl });
              } catch (imageError) {
                console.warn(`⚠️ Could not export image for ${variant.name}:`, imageError);
                await componentService.updateComponent(createdComponentId, {
                  imageUrl: 'https://picsum.photos/400/240?random=' + Math.random()
                });
              }

              successCount++;

            } catch (variantError) {
              console.error(`Failed to import variant: ${variant.name}`, variantError);
              failCount++;
            }
          }

        } catch (error) {
          console.error(`Failed to process ${masterName}:`, error);
          failCount++;
        }
      }

      setImportStatus(`🎉 Import completed! ${successCount} master components, ${failCount} failed`);
      await fetchComponents();
      
      setTimeout(() => setImportStatus(''), 5000);

    } catch (error) {
      setImportStatus(`❌ Import failed: ${error}`);
      setTimeout(() => setImportStatus(''), 5000);
    } finally {
      setImporting(false);
    }
  };

  const handleClearAllComponents = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL components and their images? This action cannot be undone.')) {
      return;
    }

    setImporting(true);
    setImportStatus('🗑️ Clearing all components and images...');

    try {
      // Get all components first
      const allComponents = await componentService.getAllComponents();
      
      // Delete each component from database
      for (const component of allComponents) {
        if (component.id) {
          await componentService.deleteComponent(component.id);
        }
      }

      // Delete all component images from Firebase Storage
      try {
        await imageService.deleteAllComponentImages();
        setImportStatus(`✅ Successfully deleted ${allComponents.length} components and all associated images`);
      } catch (imageError) {
        console.error('❌ Failed to delete images:', imageError);
        setImportStatus(`✅ Deleted ${allComponents.length} components, but some images may remain`);
      }

      await fetchComponents(); // Refresh the list
      
      setTimeout(() => setImportStatus(''), 3000);

    } catch (error) {
      setImportStatus(`❌ Failed to clear components: ${error}`);
      setTimeout(() => setImportStatus(''), 5000);
    } finally {
      setImporting(false);
    }
  };

  // Smart volt calculation based on component complexity
  const calculateVolts = (component: FigmaComponentData): number => {
    const width = component.absoluteBoundingBox?.width || 400;
    const height = component.absoluteBoundingBox?.height || 240;
    const area = width * height;
    
    // Base calculation: larger components cost more
    let volts = Math.max(3, Math.round(area / 20000)); // Minimum 3 volts
    
    // Adjust based on complexity indicators
    if (component.name.toLowerCase().includes('complex')) volts += 2;
    if (component.name.toLowerCase().includes('interactive')) volts += 1;
    if (component.name.toLowerCase().includes('animated')) volts += 1;
    
    return Math.min(volts, 15); // Maximum 15 volts
  };

  // Enhanced categorization for large-scale component management
  const categorizeComponent = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    // UI Components
    if (lowerName.includes('button') || lowerName.includes('btn')) return 'Buttons';
    if (lowerName.includes('card') || lowerName.includes('card')) return 'Cards';
    if (lowerName.includes('nav') || lowerName.includes('header') || lowerName.includes('menu')) return 'Navigation';
    if (lowerName.includes('form') || lowerName.includes('input') || lowerName.includes('field')) return 'Forms';
    if (lowerName.includes('modal') || lowerName.includes('dialog') || lowerName.includes('popup')) return 'Modals';
    if (lowerName.includes('table') || lowerName.includes('list') || lowerName.includes('grid')) return 'Data Display';
    
    // Layout Components
    if (lowerName.includes('container') || lowerName.includes('wrapper') || lowerName.includes('layout')) return 'Layout';
    if (lowerName.includes('section') || lowerName.includes('divider') || lowerName.includes('spacer')) return 'Layout';
    
    // Interactive Components
    if (lowerName.includes('toggle') || lowerName.includes('switch') || lowerName.includes('checkbox')) return 'Interactive';
    if (lowerName.includes('slider') || lowerName.includes('progress') || lowerName.includes('rating')) return 'Interactive';
    
    // Content Components
    if (lowerName.includes('text') || lowerName.includes('title') || lowerName.includes('heading')) return 'Typography';
    if (lowerName.includes('icon') || lowerName.includes('image') || lowerName.includes('avatar')) return 'Media';
    
    // Business Components
    if (lowerName.includes('classroom') || lowerName.includes('lesson') || lowerName.includes('course')) return 'Education';
    if (lowerName.includes('product') || lowerName.includes('item') || lowerName.includes('catalog')) return 'E-commerce';
    if (lowerName.includes('user') || lowerName.includes('profile') || lowerName.includes('account')) return 'User Management';
    
    return 'Components'; // Default category
  };

  // Enhanced tag generation for better organization
  const generateTags = (name: string): string[] => {
    const lowerName = name.toLowerCase();
    const tags = ['component'];
    
    // Theme tags
    if (lowerName.includes('dark')) tags.push('dark-mode');
    if (lowerName.includes('light')) tags.push('light-mode');
    if (lowerName.includes('theme')) tags.push('themed');
    
    // Size tags
    if (lowerName.includes('large') || lowerName.includes('lg')) tags.push('large');
    if (lowerName.includes('small') || lowerName.includes('sm')) tags.push('small');
    if (lowerName.includes('medium') || lowerName.includes('md')) tags.push('medium');
    
    // Device tags
    if (lowerName.includes('mobile') || lowerName.includes('phone')) tags.push('mobile');
    if (lowerName.includes('desktop') || lowerName.includes('web')) tags.push('desktop');
    if (lowerName.includes('tablet')) tags.push('tablet');
    if (lowerName.includes('responsive')) tags.push('responsive');
    
    // State tags
    if (lowerName.includes('hover') || lowerName.includes('active')) tags.push('interactive');
    if (lowerName.includes('disabled') || lowerName.includes('inactive')) tags.push('disabled');
    if (lowerName.includes('loading') || lowerName.includes('spinner')) tags.push('loading');
    
    // Style tags
    if (lowerName.includes('outlined') || lowerName.includes('border')) tags.push('outlined');
    if (lowerName.includes('filled') || lowerName.includes('solid')) tags.push('filled');
    if (lowerName.includes('ghost') || lowerName.includes('transparent')) tags.push('ghost');
    
    // Priority tags
    if (lowerName.includes('primary')) tags.push('primary');
    if (lowerName.includes('secondary')) tags.push('secondary');
    if (lowerName.includes('tertiary')) tags.push('tertiary');
    
    // Business domain tags
    if (lowerName.includes('classroom') || lowerName.includes('lesson')) tags.push('education');
    if (lowerName.includes('product') || lowerName.includes('catalog')) tags.push('e-commerce');
    if (lowerName.includes('user') || lowerName.includes('profile')) tags.push('user-management');
    
    return tags;
  };

  // Helper function to group components by their master component
  const groupComponentsByMaster = (components: FigmaComponentData[]): Record<string, FigmaComponentData[]> => {
    if (!Array.isArray(components)) {
      throw new Error('Components is not an array');
    }
    
    const masterGroups: Record<string, FigmaComponentData[]> = {};
    
    components.forEach((component: FigmaComponentData) => {
      const name = component.name || '';
      
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
        // e.g., ".classroom-card/.light/.large" -> ".classroom-card"
        const parts = name.split('/');
        if (parts.length >= 2) {
          masterName = parts[0]; // Take the first part as master name
        }
      }
      
      if (!masterGroups[masterName]) {
        masterGroups[masterName] = [];
      }
      
      masterGroups[masterName].push(component);
    });
    
    return masterGroups;
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #E0E0E0', 
      borderRadius: '12px',
      margin: '10px',
      backgroundColor: '#FAFAFA'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#333',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        🚀 Figma Component Import
      </h3>
      
      {/* Credentials Section */}
      <div style={{ 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#F5F5F5',
        borderRadius: '8px',
        border: '1px solid #E0E0E0'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ 
            margin: '0', 
            color: '#555',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            🔑 Figma Credentials
          </h4>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showCredentials ? 'Hide' : 'Show'} Help
          </button>
        </div>
        
        {showCredentials && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>🔑 How to Get Your Figma Credentials:</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <strong>📁 Figma File ID:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li><strong>File URL:</strong> Copy from <code>https://www.figma.com/file/XXXXX/...</code></li>
                <li><strong>Design URL:</strong> Copy from <code>https://www.figma.com/design/XXXXX/...</code></li>
                <li>The ID is the part after <code>/file/</code> or <code>/design/</code></li>
              </ul>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <strong>🔐 Figma Developer Token (August 2025):</strong>
              <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Go to <a href="https://www.figma.com/developers/api" target="_blank" rel="noopener noreferrer">https://www.figma.com/developers/api</a></li>
                <li>Click <strong>"Get a personal access token"</strong></li>
                <li>Select these scopes: <code>file:read</code>, <code>file:write</code>, <code>components:read</code></li>
                <li>Copy the token immediately (it won't be shown again)</li>
              </ol>
            </div>
            
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '8px 12px', 
              borderRadius: '4px',
              border: '1px solid #ffeaa7',
              fontSize: '13px'
            }}>
              <strong>⚠️ Note:</strong> Figma now uses Developer Tokens instead of Personal Access Tokens. Make sure you're using the correct token type!
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>
              Figma File ID:
            </label>
            <input
              type="text"
              value={figmaFileId}
              onChange={(e) => setFigmaFileId(e.target.value)}
              placeholder="e.g., abcdefghijklmnop"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D0D0D0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>
              Figma Access Token:
            </label>
            <input
              type="password"
              value={figmaAccessToken}
              onChange={(e) => setFigmaAccessToken(e.target.value)}
              placeholder="figd_..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D0D0D0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleImportAllComponents}
            disabled={importing}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: importing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {importing ? '⏳ Importing...' : '📥 Import All Components from Figma'}
          </button>
          <button 
            onClick={handleClearAllComponents}
            disabled={importing}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF3B30',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: importing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {importing ? '⏳ Processing...' : '🗑️ Clear All Components & Images'}
          </button>
        </div>
        
        {importStatus && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px',
            backgroundColor: '#E3F2FD',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#1976D2'
          }}>
            {importStatus}
          </div>
        )}
      </div>

      {/* Components List */}
      {loading && <div style={{ color: '#666' }}>Loading components...</div>}
      {error && <div style={{ color: '#D32F2F', backgroundColor: '#FFEBEE', padding: '10px', borderRadius: '6px' }}>
        Error: {error}
      </div>}
      
      <div>
        <h4 style={{ 
          color: '#555', 
          fontSize: '16px',
          marginBottom: '15px'
        }}>
          📋 Components ({components.length})
        </h4>
        
        {components.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '40px',
            fontStyle: 'italic'
          }}>
            No components yet. Import from Figma to get started! 🎨
          </div>
        ) : (
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid #E0E0E0',
            borderRadius: '8px'
          }}>
            {components.map((component, index) => (
              <div 
                key={component.id} 
                style={{ 
                  padding: '12px 16px',
                  borderBottom: index < components.length - 1 ? '1px solid #F0F0F0' : 'none',
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9F9F9'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div>
                    <strong style={{ color: '#333' }}>{component.title}</strong>
                    <span style={{ 
                      marginLeft: '8px', 
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {component.category}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      textAlign: 'right'
                    }}>
                      <div>⚡ {component.voltsCost} volts</div>
                      <div>📊 {component.generateCount} generations</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Version Info Button */}
      <div style={{ 
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => setShowVersionInfo(true)}
          style={{
            background: 'linear-gradient(135deg, #FF5C0A, #FF7A2E)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 92, 10, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📋 Version Information
        </button>
      </div>

      {/* Version Info Modal */}
      <VersionInfo 
        isVisible={showVersionInfo}
        onClose={() => setShowVersionInfo(false)}
      />

    </div>
  );
};

export default AdminPanel;
