import { imageService } from '../services/imageService';
import { componentService } from '../services/componentService';

/**
 * Utility for syncing component images from Figma API
 * This will be used for Phase 2 automation
 */

export interface FigmaImageSyncOptions {
  figmaFileId: string;
  figmaAccessToken: string;
  batchSize?: number; // Process components in batches to avoid rate limits
  imageFormat?: 'png' | 'jpg' | 'svg';
  imageScale?: number; // 1, 2, or 4 for different DPI
}

export interface SyncResult {
  success: number;
  failed: number;
  errors: string[];
}

class FigmaImageSync {
  /**
   * Sync all components with images from Figma
   */
  async syncAllComponents(options: FigmaImageSyncOptions): Promise<SyncResult> {
    const result: SyncResult = { success: 0, failed: 0, errors: [] };
    
    try {
      console.log('🔄 Starting Figma image sync...');
      
      // Get all components from database
      const components = await componentService.getAllComponents();
      const componentsWithFigmaKeys = components.filter(c => c.figmaComponentKey);
      
      console.log(`Found ${componentsWithFigmaKeys.length} components with Figma keys`);
      
      // Process in batches to avoid rate limits
      const batchSize = options.batchSize || 50;
      const batches = this.chunkArray(componentsWithFigmaKeys, batchSize);
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} components)`);
        
        try {
          await this.processBatch(batch, options);
          result.success += batch.length;
          
          // Rate limiting: wait between batches
          if (i < batches.length - 1) {
            await this.delay(2000); // 2 second delay between batches
          }
        } catch (error) {
          result.failed += batch.length;
          result.errors.push(`Batch ${i + 1} failed: ${error}`);
        }
      }
      
      console.log(`✅ Sync completed: ${result.success} success, ${result.failed} failed`);
      return result;
    } catch (error) {
      console.error('❌ Fatal error in sync:', error);
      result.errors.push(`Fatal error: ${error}`);
      return result;
    }
  }
  
  /**
   * Process a batch of components
   */
  private async processBatch(
    components: any[], 
    options: FigmaImageSyncOptions
  ): Promise<void> {
    // Build the Figma API request
    const componentIds = components.map(c => c.figmaComponentKey).filter(Boolean);
    
    if (componentIds.length === 0) return;
    
    const exportUrl = `https://api.figma.com/v1/images/${options.figmaFileId}`;
    const params = new URLSearchParams({
      ids: componentIds.join(','),
      format: options.imageFormat || 'png',
      scale: (options.imageScale || 2).toString()
    });
    
    console.log(`📡 Requesting images from Figma: ${exportUrl}?${params}`);
    
    const response = await fetch(`${exportUrl}?${params}`, {
      headers: {
        'X-Figma-Token': options.figmaAccessToken
      }
    });
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.err) {
      throw new Error(`Figma API error: ${data.err}`);
    }
    
    // Upload each image to Firebase Storage
    const uploadPromises = components.map(async (component) => {
      const figmaImageUrl = data.images[component.figmaComponentKey];
      
      if (!figmaImageUrl) {
        console.warn(`⚠️ No image URL for component ${component.id}`);
        return;
      }
      
      try {
        await imageService.uploadImageFromUrl(
          figmaImageUrl,
          component.id,
          component.figmaComponentKey
        );
        console.log(`✅ Updated image for ${component.title}`);
      } catch (error) {
        console.error(`❌ Failed to update ${component.title}:`, error);
        throw error;
      }
    });
    
    await Promise.all(uploadPromises);
  }
  
  /**
   * Sync a single component
   */
  async syncSingleComponent(
    componentId: string, 
    options: FigmaImageSyncOptions
  ): Promise<void> {
    const component = await componentService.getComponentById(componentId);
    
    if (!component || !component.figmaComponentKey) {
      throw new Error('Component not found or missing Figma key');
    }
    
    await this.processBatch([component], options);
  }
  
  /**
   * Export and upload image for a new component by Figma node ID
   */
  async exportAndUploadComponentImage(
    figmaNodeId: string,
    figmaComponentKey: string,
    componentId: string,
    options: FigmaImageSyncOptions
  ): Promise<string> {
    // Debug: Log what we're trying to export
    console.log(`🔍 Exporting component:`, {
      figmaNodeId,
      figmaComponentKey,
      componentId
    });
    
    // For component sets, we need to get multiple variants to create a composite image
    let exportNodeIds = [figmaNodeId];
    
    // Check if this is a component set by looking at the component key structure
    if (figmaComponentKey.includes(':')) {
      console.log(`🔍 This appears to be a component set, getting all variants...`);
      
      try {
        // Get the component set details to find all variants
        const componentResponse = await fetch(`https://api.figma.com/v1/files/${options.figmaFileId}/component_sets?ids=${figmaComponentKey}`, {
          headers: {
            'X-Figma-Token': options.figmaAccessToken
          }
        });
        
        if (componentResponse.ok) {
          const componentData = await componentResponse.json();
          const componentSet = componentData.meta?.component_sets?.[figmaComponentKey];
          
          if (componentSet && componentSet.children && componentSet.children.length > 0) {
            // Get all variant node IDs for export
            exportNodeIds = componentSet.children.map((child: any) => child.node_id);
            console.log(`🔍 Found ${exportNodeIds.length} variants for component set`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not get component set variants, using original node ID:`, error);
      }
    }
    
    // Export images from Figma (multiple variants if it's a component set)
    const exportUrl = `https://api.figma.com/v1/images/${options.figmaFileId}`;
    const params = new URLSearchParams({
      ids: exportNodeIds.join(','),
      format: options.imageFormat || 'png',
      scale: (options.imageScale || 2).toString()
    });
    
    console.log(`📡 Exporting images for nodes: ${exportNodeIds.join(', ')}`);
    console.log(`📡 Full URL: ${exportUrl}?${params}`);
    
    const response = await fetch(`${exportUrl}?${params}`, {
      headers: {
        'X-Figma-Token': options.figmaAccessToken
      }
    });
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.err) {
      throw new Error(`Figma API error: ${data.err}`);
    }
    
    // If we have multiple variants, create a composite image
    if (exportNodeIds.length > 1) {
      console.log(`🔍 Creating composite image from ${exportNodeIds.length} variants`);
      
      // For now, use the first variant as the main image
      // In the future, we could create a composite image by combining all variants
      const firstVariantId = exportNodeIds[0];
      const figmaImageUrl = data.images[firstVariantId];
      
      if (!figmaImageUrl) {
        throw new Error(`No image URL returned for node ${firstVariantId}`);
      }
      
      // Upload to Firebase Storage
      const firebaseUrl = await imageService.uploadImageFromUrl(
        figmaImageUrl,
        componentId,
        figmaComponentKey
      );
      
      console.log(`✅ Composite image uploaded for component ${componentId} (showing first variant)`);
      return firebaseUrl.url;
    } else {
      // Single component export
      const figmaImageUrl = data.images[exportNodeIds[0]];
      
      if (!figmaImageUrl) {
        throw new Error(`No image URL returned for node ${exportNodeIds[0]}`);
      }
      
      // Upload to Firebase Storage
      const firebaseUrl = await imageService.uploadImageFromUrl(
        figmaImageUrl,
        componentId,
        figmaComponentKey
      );
      
      console.log(`✅ Image uploaded for component ${componentId}`);
      return firebaseUrl.url;
    }
  }
  
  /**
   * Utility: Split array into chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  
  /**
   * Utility: Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Get Figma file components (for discovering new components)
   */
  async discoverFigmaComponents(
    figmaFileId: string,
    figmaAccessToken: string
  ): Promise<any[]> {
    const response = await fetch(`https://api.figma.com/v1/files/${figmaFileId}/components`, {
      headers: {
        'X-Figma-Token': figmaAccessToken
      }
    });
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return Object.values(data.meta.components || {});
  }

  /**
   * Get only Master Components (component sets) from Figma
   */
  async discoverMasterComponents(figmaFileId: string, figmaAccessToken: string): Promise<any[]> {
    const response = await fetch(`https://api.figma.com/v1/files/${figmaFileId}`, {
      headers: {
        'X-Figma-Token': figmaAccessToken
      }
    });
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Get component sets (true master components)
    const componentSets = data.componentSets ? Object.values(data.componentSets) : [];
    console.log(`🔍 Found ${componentSets.length} component sets (true master components)`);
    
    // Transform to match the expected structure
    const masterComponents = componentSets.map((set: any) => ({
      key: set.key,
      name: set.name,
      description: set.description || `${set.name} master component`,
      node_id: set.node_id,
      absoluteBoundingBox: set.absoluteBoundingBox,
      containing_frame: set.containing_frame,
      children: set.children || [] // Include children for variant handling
    }));
    
    // If no component sets found, use a more sophisticated filtering approach
    if (masterComponents.length === 0) {
      console.log(`🔍 No component sets found, falling back to filtering regular components`);
      const allComponents = await this.discoverFigmaComponents(figmaFileId, figmaAccessToken);
      console.log(`🔍 Found ${allComponents.length} total components`);
      
      // Filter for true master components (not instances)
      const filteredComponents = allComponents.filter((comp: any) => {
        // Skip instances (components that reference other components)
        if (comp.containing_frame && comp.containing_frame.name.includes('Instance')) {
          console.log(`❌ Skipping ${comp.name} - contains 'Instance' in frame name`);
          return false;
        }
        
        // Skip components that are clearly variants/instances
        if (comp.name.includes('Instance') || comp.name.includes('Copy')) {
          console.log(`❌ Skipping ${comp.name} - contains 'Instance' or 'Copy' in name`);
          return false;
        }
        
        // Look for master components by naming patterns
        const isMasterByName = comp.name.includes('Set') || 
                             comp.name.includes('Master') || 
                             comp.name.includes('Default') ||
                             comp.name.includes('Primary') ||
                             !comp.name.includes('Light') && !comp.name.includes('Dark') && !comp.name.includes('Hover');
        
        // Look for master components by frame context
        const isMasterByFrame = comp.containing_frame && 
                               (comp.containing_frame.name.includes('Set') || 
                                comp.containing_frame.name.includes('Master') ||
                                comp.containing_frame.name.includes('Components'));
        
        const isMaster = isMasterByName || isMasterByFrame;
        console.log(`${isMaster ? '✅' : '❌'} ${comp.name} - isMasterByName: ${isMasterByName}, isMasterByFrame: ${isMasterByFrame}`);
        
        return isMaster;
      });
      
      console.log(`🔍 After filtering: ${filteredComponents.length} master components`);
      return filteredComponents;
    }
    
    console.log(`🔍 Using ${masterComponents.length} component sets as master components`);
    return masterComponents;
  }
}

export const figmaImageSync = new FigmaImageSync();