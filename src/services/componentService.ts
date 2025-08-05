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
}

export const componentService = new ComponentService(); 