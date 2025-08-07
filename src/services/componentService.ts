import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Component variant interface
export interface ComponentVariant {
  id: string;
  name: string; // e.g., "Light Mode", "Dark Mode", "Primary", "Secondary"
  imageUrl: string;
  figmaComponentKey?: string;
  specs?: {
    size?: string;
    device?: string;
    color?: string;
    padding?: string;
  };
  isDefault?: boolean; // Mark which variant is the default
}

// Component data interface
export interface ComponentData {
  id?: string;
  title: string;
  description: string;
  volts: number;
  maxVolts: number;
  voltsCost: number;
  category: string;
  specs: {
    size: string;
    device: string;
    color: string;
    padding: string;
  };
  imageUrl: string; // Default/primary image
  
  // Master component system
  isMasterComponent?: boolean; // True if this has variants
  masterComponentId?: string; // Reference to master if this is a variant
  masterName?: string; // Master component name for grouping variants
  variants?: ComponentVariant[]; // Array of variants for master components
  variantCount?: number; // Number of variants for master components
  
  figmaComponentId?: string; // Reference to Figma component
  figmaFileId?: string; // Reference to Figma file
  figmaComponentKey?: string; // Actual Figma component key for importing
  generateCount: number;
  downloads: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Component metadata interface (for Figma integration)
export interface ComponentMetadata {
  figmaComponentId: string;
  figmaFileId: string;
  componentName: string;
  componentKey: string;
  description: string;
  tags: string[];
  category: string;
  variants?: {
    [key: string]: any;
  };
  properties?: {
    [key: string]: any;
  };
}

// Enhanced component selection interface
export interface ComponentPreferences {
  size: 'large' | 'small';
  style: 'dark' | 'light';
  image?: string; // Firebase image URL
}

// Enhanced component variant with parsed properties
export interface EnhancedComponentVariant extends ComponentData {
  parsedVariants?: {
    size: 'large' | 'small';
    style: 'dark' | 'light';
  };
}

// Enhanced component selection logic
export const selectComponentVariant = (
  components: ComponentData[], 
  preferences: ComponentPreferences
): ComponentData | null => {
  try {
    console.log('🔍 Selecting component variant with preferences:', preferences);
    
    // Find component that matches size + style
    const matchingComponent = components.find(comp => {
      const name = comp.title.toLowerCase();
      const hasSize = name.includes(preferences.size);
      const hasStyle = name.includes(preferences.style);
      
      console.log(`🔍 Checking component: ${comp.title}`);
      console.log(`  - Has size '${preferences.size}': ${hasSize}`);
      console.log(`  - Has style '${preferences.style}': ${hasStyle}`);
      
      return hasSize && hasStyle;
    });
    
    if (matchingComponent) {
      console.log(`✅ Found matching component: ${matchingComponent.title}`);
      return matchingComponent;
    }
    
    // Fallback to first component if no match found
    console.log('⚠️ No matching component found, using first component');
    return components.length > 0 ? components[0] : null;
  } catch (error) {
    console.error('❌ Error selecting component variant:', error);
    return components.length > 0 ? components[0] : null;
  }
};

// Group components by their master component
export const groupComponentsByMaster = (components: ComponentData[]): Record<string, ComponentData[]> => {
  const groups: Record<string, ComponentData[]> = {};
  
  components.forEach(component => {
    const name = component.title;
    
    // Parse component name to extract master name
    // e.g., ".clasroom-card/.dark/.large" -> master: ".clasroom-card"
    let masterName = name;
    
    if (name.includes('/')) {
      const parts = name.split('/');
      if (parts.length >= 2) {
        masterName = parts[0]; // Take the first part as master name
      }
    }
    
    if (!groups[masterName]) {
      groups[masterName] = [];
    }
    
    groups[masterName].push(component);
  });
  
  console.log('📋 Grouped components by master:', groups);
  return groups;
};

// Get default component from a group (for "Generate" button)
export const getDefaultComponent = (components: ComponentData[]): ComponentData | null => {
  if (components.length === 0) return null;
  
  // Priority order for default component:
  // 1. Component with "default" in name
  // 2. Component with "dark" and "large" (most common)
  // 3. First component alphabetically
  
  const defaultComponent = components.find(comp => 
    comp.title.toLowerCase().includes('default')
  );
  
  if (defaultComponent) {
    console.log('✅ Found default component:', defaultComponent.title);
    return defaultComponent;
  }
  
  const darkLargeComponent = components.find(comp => {
    const name = comp.title.toLowerCase();
    return name.includes('dark') && name.includes('large');
  });
  
  if (darkLargeComponent) {
    console.log('✅ Found dark/large component as default:', darkLargeComponent.title);
    return darkLargeComponent;
  }
  
  console.log('✅ Using first component as default:', components[0].title);
  return components[0];
};

// Parse component variants from name
export const parseComponentVariants = (componentName: string): { size: 'large' | 'small', style: 'dark' | 'light' } | null => {
  const name = componentName.toLowerCase();
  
  // Extract size
  let size: 'large' | 'small' = 'large';
  if (name.includes('small')) {
    size = 'small';
  } else if (name.includes('large')) {
    size = 'large';
  }
  
  // Extract style
  let style: 'dark' | 'light' = 'dark';
  if (name.includes('light')) {
    style = 'light';
  } else if (name.includes('dark')) {
    style = 'dark';
  }
  
  return { size, style };
};

class ComponentService {
  private collectionName = 'components';

  // Get all components
  async getAllComponents(): Promise<ComponentData[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentData[];
    } catch (error) {
      console.error('Error getting components:', error);
      throw error;
    }
  }

  // Get components by category
  async getComponentsByCategory(category: string): Promise<ComponentData[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('category', '==', category),
        where('isPublic', '==', true)
        // Removed orderBy to avoid requiring composite index
      );
      const querySnapshot = await getDocs(q);
      const components = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentData[];
      
      // Sort in memory instead
      return components.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting components by category:', error);
      throw error;
    }
  }

  // Get component by ID
  async getComponentById(id: string): Promise<ComponentData | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('🔍 Raw Firestore data for component:', data);
        console.log('🔍 isMasterComponent in Firestore:', data.isMasterComponent);
        console.log('🔍 variants in Firestore:', data.variants);
        console.log('🔍 variantCount in Firestore:', data.variantCount);
        
        const componentData = {
          id: docSnap.id,
          ...data
        } as ComponentData;
        
        console.log('🔍 Processed ComponentData:', componentData);
        console.log('🔍 isMasterComponent in ComponentData:', componentData.isMasterComponent);
        console.log('🔍 variants in ComponentData:', componentData.variants);
        console.log('🔍 variantCount in ComponentData:', componentData.variantCount);
        
        return componentData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting component:', error);
      throw error;
    }
  }

  // Create new component
  async createComponent(componentData: Omit<ComponentData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...componentData,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating component:', error);
      throw error;
    }
  }

  // Update component
  async updateComponent(id: string, updates: Partial<ComponentData>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  }

  // Delete component
  async deleteComponent(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  }

  // Increment generate count
  async incrementGenerateCount(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentCount = docSnap.data().generateCount || 0;
        await updateDoc(docRef, {
          generateCount: currentCount + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error incrementing generate count:', error);
      throw error;
    }
  }

  // Increment download count
  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentCount = docSnap.data().downloads || 0;
        await updateDoc(docRef, {
          downloads: currentCount + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  }

  // Search components by tags or title
  async searchComponents(searchTerm: string): Promise<ComponentData[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - for production, consider using Algolia or similar
      const q = query(
        collection(db, this.collectionName),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const components = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentData[];
      
      return components.filter(component => 
        component.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching components:', error);
      throw error;
    }
  }

  // Get popular components (by downloads)
  async getPopularComponents(limitCount: number = 10): Promise<ComponentData[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isPublic', '==', true)
        // Removed orderBy to avoid requiring composite index
      );
      const querySnapshot = await getDocs(q);
      const components = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentData[];
      
      // Sort in memory and limit
      return components
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting popular components:', error);
      throw error;
    }
  }

  /**
   * Add variant to a master component
   */
  async addVariantToComponent(
    masterComponentId: string,
    variant: Omit<ComponentVariant, 'id'>
  ): Promise<string> {
    try {
      const masterComponent = await this.getComponentById(masterComponentId);
      if (!masterComponent) {
        throw new Error('Master component not found');
      }

      // Generate variant ID
      const variantId = `${masterComponentId}_variant_${Date.now()}`;
      const newVariant: ComponentVariant = {
        ...variant,
        id: variantId
      };

      // Update master component
      const updatedVariants = [...(masterComponent.variants || []), newVariant];
      
      await this.updateComponent(masterComponentId, {
        isMasterComponent: true,
        variants: updatedVariants
      });

      console.log(`✅ Added variant "${variant.name}" to component ${masterComponentId}`);
      return variantId;
    } catch (error) {
      console.error('❌ Error adding variant:', error);
      throw error;
    }
  }

  /**
   * Update a specific variant
   */
  async updateVariant(
    masterComponentId: string,
    variantId: string,
    updates: Partial<ComponentVariant>
  ): Promise<void> {
    try {
      const masterComponent = await this.getComponentById(masterComponentId);
      if (!masterComponent || !masterComponent.variants) {
        throw new Error('Master component or variants not found');
      }

      const updatedVariants = masterComponent.variants.map(variant =>
        variant.id === variantId ? { ...variant, ...updates } : variant
      );

      await this.updateComponent(masterComponentId, {
        variants: updatedVariants
      });

      console.log(`✅ Updated variant ${variantId}`);
    } catch (error) {
      console.error('❌ Error updating variant:', error);
      throw error;
    }
  }

  /**
   * Clear all components from the database
   */
  async clearAllComponents(): Promise<void> {
    try {
      const allComponents = await this.getAllComponents();
      
      // Delete each component
      for (const component of allComponents) {
        if (component.id) {
          await this.deleteComponent(component.id);
        }
      }
      
      console.log(`✅ Cleared ${allComponents.length} components`);
    } catch (error) {
      console.error('❌ Error clearing components:', error);
      throw error;
    }
  }

  // Get components by master name (for variant selection)
  async getComponentsByMasterName(masterName: string): Promise<ComponentData[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('masterName', '==', masterName)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentData[];
    } catch (error) {
      console.error('Error getting components by master name:', error);
      throw error;
    }
  }

  // Get default component for a master component
  async getDefaultComponentForMaster(masterName: string): Promise<ComponentData | null> {
    try {
      const components = await this.getComponentsByMasterName(masterName);
      return getDefaultComponent(components);
    } catch (error) {
      console.error('Error getting default component for master:', error);
      throw error;
    }
  }

  // Get component variant based on preferences
  async getComponentVariant(
    masterName: string, 
    preferences: ComponentPreferences
  ): Promise<ComponentData | null> {
    try {
      const components = await this.getComponentsByMasterName(masterName);
      return selectComponentVariant(components, preferences);
    } catch (error) {
      console.error('Error getting component variant:', error);
      throw error;
    }
  }
}

export const componentService = new ComponentService(); 