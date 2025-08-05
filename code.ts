// code.ts
figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
  
  if (msg.type === 'test-component-key') {
    try {
      const { componentKey } = msg;
      console.log('Testing component key:', componentKey);
      
      const component = await figma.importComponentByKeyAsync(componentKey);
      console.log('✅ Component key is valid! Component name:', component.name);
      
      figma.ui.postMessage({
        type: 'component-key-test-result',
        success: true,
        componentName: component.name,
        componentKey: componentKey
      });
      
    } catch (error) {
      console.error('❌ Component key is invalid:', error);
      figma.ui.postMessage({
        type: 'component-key-test-result',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        componentKey: msg.componentKey
      });
    }
  }
  
  if (msg.type === 'insert-component') {
    try {
      console.log('🎯 Figma received insert-component message:', msg);
      const { componentId, figmaFileId, figmaComponentKey, title, specs, variantKeys } = msg;
      console.log('🔑 Component key:', figmaComponentKey);
      console.log('📦 Title:', title);
      console.log('⚙️ Specs:', specs);
      console.log('🎨 Variant keys:', variantKeys);
      
      // NEW: Check if we have variant keys for master component creation
      if (variantKeys && variantKeys.length > 0) {
        console.log('🚀 Creating master component with variants...');
        await createMasterComponentWithVariants(variantKeys, title, specs);
      } else {
        // Original single component insertion logic
        await insertSingleComponent(figmaComponentKey, title, specs, componentId);
      }
      
    } catch (error) {
      console.error('Error inserting component:', error);
      figma.ui.postMessage({
        type: 'component-inserted',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  if (msg.type === 'insert-detached-variants') {
    try {
      console.log('🎯 Figma received insert-detached-variants message:', msg);
      const { masterComponent, variants } = msg;
      console.log('🔑 Master component:', masterComponent);
      console.log('🎨 Variants:', variants);
      
      await createDetachedVariants(masterComponent, variants);
      
    } catch (error) {
      console.error('Error creating detached variants:', error);
      figma.ui.postMessage({
        type: 'detached-variants-created',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

// NEW: Function to create master component with variants
async function createMasterComponentWithVariants(variantKeys: string[], title: string, specs: any) {
  try {
    console.log('🎨 Starting master component creation with variants:', variantKeys);
    
    const insertedVariants: SceneNode[] = [];
    let currentX = 0;
    const spacing = 50; // Space between variants
    
    // Step 1: Import and position all variants
    for (let i = 0; i < variantKeys.length; i++) {
      const variantKey = variantKeys[i];
      console.log(`🔄 Importing variant ${i + 1}/${variantKeys.length}:`, variantKey);
      
      try {
        const variant = await figma.importComponentByKeyAsync(variantKey);
        const instance = variant.createInstance();
        
        // Position variants side by side
        instance.x = currentX;
        instance.y = 0;
        
        // Rename instance to follow Figma naming convention for component sets
        // Extract variant properties from the key or name
        const variantName = extractVariantName(variant.name);
        instance.name = `${title}/${variantName}`;
        
        insertedVariants.push(instance);
        currentX += instance.width + spacing;
        
        console.log(`✅ Variant ${i + 1} imported and positioned`);
        
      } catch (variantError) {
        console.error(`❌ Failed to import variant ${i + 1}:`, variantError);
        
        // Create placeholder for failed variant
        const placeholder = createVariantPlaceholder(title, variantKey, specs);
        placeholder.x = currentX;
        placeholder.y = 0;
        insertedVariants.push(placeholder);
        currentX += placeholder.width + spacing;
      }
    }
    
    // Step 2: Auto-select all variants
    if (insertedVariants.length > 0) {
      figma.currentPage.selection = insertedVariants;
      console.log(`✅ Auto-selected ${insertedVariants.length} variants`);
      
      // Step 3: Show instructions for creating component set
      figma.ui.postMessage({
        type: 'master-component-created',
        success: true,
        variantCount: insertedVariants.length,
        instructions: [
          '🎯 All variants have been inserted and selected!',
          ' To create a master component with variant picker:',
          '1. Right-click on any selected variant',
          '2. Choose "Create component set"',
          '3. Figma will automatically create a master component',
          '4. You can now switch between variants using the variant picker!'
        ]
      });
      
      // Step 4: Center the viewport on the variants
      const totalWidth = currentX - spacing;
      const centerX = totalWidth / 2;
      figma.viewport.center = { x: centerX, y: 200 };
      
    } else {
      throw new Error('No variants were successfully imported');
    }
    
  } catch (error) {
    console.error('❌ Error creating master component:', error);
    figma.ui.postMessage({
      type: 'master-component-created',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function to extract variant name from component name
function extractVariantName(componentName: string): string {
  // Handle different naming patterns
  if (componentName.includes('=')) {
    // Pattern: "Component Name=variant"
    return componentName.split('=')[1] || 'default';
  } else if (componentName.includes('/')) {
    // Pattern: "Component Name/variant"
    return componentName.split('/').pop() || 'default';
  } else {
    // Pattern: "Component Name variant"
    const parts = componentName.split(' ');
    return parts[parts.length - 1] || 'default';
  }
}

// Helper function to create placeholder for failed variants
function createVariantPlaceholder(title: string, variantKey: string, specs: any): SceneNode {
  const frame = figma.createFrame();
  frame.name = `${title}/failed-variant`;
  frame.resize(240, 200);
  
  // Add error styling
  frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.2, b: 0.2 } }];
  
  // Add error text
  const text = figma.createText();
  text.characters = 'Failed to import variant';
  text.fontSize = 12;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  text.x = 10;
  text.y = 10;
  
  frame.appendChild(text);
  return frame;
}

// UPDATED: Function to create individual detached variants using the proper workflow
// Global flag to prevent multiple executions
let isGenerating = false;

async function createDetachedVariants(masterComponent: any, variants: any[]) {
  // Prevent multiple simultaneous executions
  if (isGenerating) {
    console.log('⚠️ Generation already in progress, skipping...');
    return;
  }
  
  isGenerating = true;
  
  try {
    console.log('🎨 Starting detached variants creation:', variants.length, 'variants');
    
    // Only clear components that were created by previous generation runs
    // Look for components with the 'generated' property
    const generatedComponents = figma.currentPage.findAll(node => {
      if (!node.name || !node.name.includes('.clasroom-card')) return false;
      
      // Check if this component was generated by our plugin
      const isGenerated = node.getPluginData('generated') === 'true';
      
      return isGenerated;
    });
    
    if (generatedComponents.length > 0) {
      console.log(`🗑️ Removing ${generatedComponents.length} previously generated components to avoid duplicates`);
      for (const component of generatedComponents) {
        try {
          component.remove();
        } catch (error) {
          console.log(`⚠️ Could not remove generated component: ${component.name}`);
        }
      }
    }
    
    const insertedVariants: SceneNode[] = [];
    let currentX = 0;
    const spacing = 50; // Space between variants
    
    // NEW WORKFLOW: Import published components directly and detach them immediately
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      console.log(`🔄 Processing variant ${i + 1}/${variants.length}:`, variant.figmaComponentKey);
      
      try {
        // Step 1: Import the published component directly
        console.log(`📥 Importing published component: ${variant.figmaComponentKey}`);
        const publishedComponent = await figma.importComponentByKeyAsync(variant.figmaComponentKey);
        console.log(`✅ Published component imported: ${publishedComponent.name}`);
        
        // Step 2: Create an instance from the published component
        const instance = publishedComponent.createInstance();
        console.log(`✅ Instance created from published component`);
        
        // Step 3: IMMEDIATELY detach the instance to convert it to a regular frame
        // This preserves ALL original properties automatically
        console.log(`🔧 Detaching instance to convert to regular frame...`);
        const detachedFrame = instance.detachInstance();
        console.log(`✅ Instance detached successfully! Frame name: ${detachedFrame.name}`);
        
        // Step 4: Set the proper name from the database
        detachedFrame.name = variant.name;
        
        // Step 5: Position the detached frame
        detachedFrame.x = currentX;
        detachedFrame.y = 0;
        
        // Step 6: Mark as generated
        detachedFrame.setPluginData('generated', 'true');
        
        // Step 7: Add to our list
        insertedVariants.push(detachedFrame);
        currentX += detachedFrame.width + spacing;
        
        console.log(`✅ Detached frame ${i + 1} created: ${variant.name}`);
        console.log(`📏 Frame dimensions: ${detachedFrame.width}x${detachedFrame.height}`);
        console.log(`🎨 Frame children count: ${detachedFrame.children?.length || 0}`);
        
      } catch (variantError) {
        console.error(`❌ Failed to process variant ${i + 1}:`, variantError);
        
        // Create placeholder for failed variant
        const placeholder = createVariantPlaceholder(masterComponent.title, variant.figmaComponentKey, variant.specs);
        placeholder.x = currentX;
        placeholder.y = 0;
        placeholder.name = variant.name;
        insertedVariants.push(placeholder);
        currentX += placeholder.width + spacing;
      }
    }
    
    // Step 8: Auto-select all detached variants
    if (insertedVariants.length > 0) {
      figma.currentPage.selection = insertedVariants;
      console.log(`✅ Auto-selected ${insertedVariants.length} detached variants`);
      
      // Step 9: Send success message with original component names
      const variantNames = insertedVariants.map(node => node.name);
      figma.ui.postMessage({
        type: 'detached-variants-created',
        success: true,
        variantCount: insertedVariants.length,
        variantNames: variantNames,
        message: `✅ Successfully created ${insertedVariants.length} detached frames with preserved properties!`
      });
      
      // Step 10: Center the viewport on the variants
      const totalWidth = currentX - spacing;
      const centerX = totalWidth / 2;
      figma.viewport.center = { x: centerX, y: 200 };
      
    } else {
      throw new Error('No detached variants were successfully created');
    }
    
  } catch (error) {
    console.error('❌ Error creating detached variants:', error);
    figma.ui.postMessage({
      type: 'detached-variants-created',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // Reset the flag when done
    isGenerating = false;
  }
}

// Original single component insertion logic
async function insertSingleComponent(figmaComponentKey: string, title: string, specs: any, componentId: string) {
  let insertedNode: SceneNode | null = null;
  
  // Try to import the actual Figma component if we have a key
  if (figmaComponentKey) {
    try {
      console.log('🚀 Attempting to import component with key:', figmaComponentKey);
      
      // Check if this is a component set (master component with variants)
      if (figmaComponentKey.includes(':')) {
        console.log(' This appears to be a component set (master component)');
        
        // For component sets, we need to handle them differently
        // First, try to import the master component itself
        try {
          const masterComponent = await figma.importComponentByKeyAsync(figmaComponentKey);
          console.log('✅ Successfully imported master component:', masterComponent.name);
          
          // Create an instance of the master component
          // This will show the default variant or allow users to switch variants
          insertedNode = masterComponent.createInstance();
          
          // If the master component has variants, we could potentially show a variant picker
          // For now, we'll use the default variant
          console.log('📋 Master component variants available:', masterComponent.children?.length || 0);
          
        } catch (masterError) {
          console.error('❌ Failed to import master component:', masterError);
          
          // Fallback: try to import the first variant
          console.log('🔄 Trying to import first variant as fallback...');
          const component = await figma.importComponentByKeyAsync(figmaComponentKey);
          insertedNode = component.createInstance();
        }
      } else {
        // Regular component (not a component set)
        console.log('🔍 This is a regular component');
        const component = await figma.importComponentByKeyAsync(figmaComponentKey);
        insertedNode = component.createInstance();
        console.log('✅ Successfully imported component:', component.name);
      }
      
    } catch (importError) {
      console.error('❌ Failed to import component:', importError);
      
      // If the component is not published, try to find it locally in the current file
      console.log('🔄 Component not published, trying to find it locally...');
      
      // Note: Components need to be published to be imported
      // Local components cannot be imported via figma.importComponentByKeyAsync()
      console.log('❌ Component not found locally either');
      
      console.log('🔄 Falling back to placeholder');
      // Fall back to creating a placeholder
    }
  } else {
    console.warn('⚠️ No figmaComponentKey provided, creating placeholder');
  }
  
  // If import failed or no key provided, create a placeholder
  if (!insertedNode) {
    console.log('Creating placeholder component');
    const rect = figma.createRectangle();
    rect.name = title || 'Component';
    rect.resize(240, 200); // Default size
    
    // Add some styling based on specs
    if (specs) {
      // Parse size from specs.size (e.g., "240x200 px")
      const sizeMatch = specs.size?.match(/(\d+)x(\d+)/);
      if (sizeMatch) {
        const width = parseInt(sizeMatch[1]);
        const height = parseInt(sizeMatch[2]);
        rect.resize(width, height);
      }
      
      // Set color based on specs.color
      if (specs.color === 'Light') {
        rect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      } else if (specs.color === 'Dark') {
        rect.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
      } else if (specs.color === 'Primary') {
        rect.fills = [{ type: 'SOLID', color: { r: 0.36, g: 0.36, b: 0.95 } }];
      }
    }
    
    insertedNode = rect;
  }
  
  // Set position to center of viewport
  const center = figma.viewport.center;
  insertedNode.x = center.x - insertedNode.width / 2;
  insertedNode.y = center.y - insertedNode.height / 2;
  
  // Select the new component
  figma.currentPage.selection = [insertedNode];
  
  // Notify the UI that the component was inserted
  figma.ui.postMessage({
    type: 'component-inserted',
    success: true,
    componentId: componentId,
    title: title
  });
}