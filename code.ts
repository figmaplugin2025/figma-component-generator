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

// Function to create individual detached variants
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
    
    // Step 1: Import and position all variants as individual detached components
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      console.log(`🔄 Importing detached variant ${i + 1}/${variants.length}:`, variant.figmaComponentKey);
      
      try {
        const component = await figma.importComponentByKeyAsync(variant.figmaComponentKey);
        
        // Create an instance of the component
        const instance = component.createInstance();
        
        // Set the name from the database (the specific variant name)
        instance.name = variant.name;
        
        // Position the instance horizontally (side by side)
        instance.x = currentX;
        instance.y = 0;
        
        // Add a property to mark this as a generated component
        instance.setPluginData('generated', 'true');
        
        // Add the instance to our list (it will be detached later)
        insertedVariants.push(instance);
        currentX += instance.width + spacing;
        
        console.log(`✅ Instance ${i + 1} created:`, variant.name);
        
      } catch (variantError) {
        console.error(`❌ Failed to import detached variant ${i + 1}:`, variantError);
        
        // Create placeholder for failed variant
        const placeholder = createVariantPlaceholder(masterComponent.title, variant.figmaComponentKey, variant.specs);
        placeholder.x = currentX;
        placeholder.y = 0;
        placeholder.name = variant.name;
        insertedVariants.push(placeholder);
        currentX += placeholder.width + spacing;
      }
    }
    
    // Step 2: Detach all instances to make them independent
    console.log(`🔧 Detaching ${insertedVariants.length} instances...`);
    for (let i = 0; i < insertedVariants.length; i++) {
      const instance = insertedVariants[i];
      if (instance.type === 'INSTANCE') {
        try {
          // Create a regular frame (like yesterday) - not a component with instance inside
          const frame = figma.createFrame();
          frame.name = instance.name;
          frame.resize(instance.width, instance.height);
          frame.x = instance.x;
          frame.y = instance.y;
          
          // Copy all children from the instance to the frame (no instances, just regular content)
          for (const child of instance.children) {
            const clonedChild = child.clone();
            frame.appendChild(clonedChild);
          }
          
          // Remove the original instance
          instance.remove();
          
          // Replace with the regular frame
          insertedVariants[i] = frame;
          console.log(`✅ Created regular frame ${i + 1}: ${frame.name}`);
        } catch (error) {
          console.error(`❌ Failed to create frame ${i + 1}:`, error);
          // If frame creation fails, keep the instance as is
          console.log(`⚠️ Keeping instance ${i + 1} as is: ${instance.name}`);
        }
      }
    }
    
    // Step 3: Auto-select all detached variants
    if (insertedVariants.length > 0) {
      figma.currentPage.selection = insertedVariants;
      console.log(`✅ Auto-selected ${insertedVariants.length} detached variants`);
      
      // Step 3: Send success message with original component names
      const variantNames = insertedVariants.map(node => node.name);
      figma.ui.postMessage({
        type: 'detached-variants-created',
        success: true,
        variantCount: insertedVariants.length,
        variantNames: variantNames
      });
      
      // Step 4: Center the viewport on the variants
      const totalWidth = currentX - spacing;
      const centerX = totalWidth / 2;
      figma.viewport.center = { x: centerX, y: 200 };
      
    } else {
      throw new Error('No detached variants were successfully imported');
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