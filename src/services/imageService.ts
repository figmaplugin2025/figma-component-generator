import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata as getStorageMetadata 
} from 'firebase/storage';
import { storage } from '../firebase';
import { componentService } from './componentService';
import { 
  collection, 
  getDocs, 
  addDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ImageUploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export interface ComponentImageMetadata {
  componentId: string;
  figmaComponentKey?: string;
  originalName: string;
  uploadedAt: Date;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

// Plugin image interface
export interface PluginImage {
  id: string;
  name: string;
  url: string;
  description: string;
  category?: string;
  tags?: string[];
}

// Add test images to Firebase plugin-images collection
export const addTestImages = async (): Promise<void> => {
  try {
    const testImages = [
      {
        name: 'Classroom Card',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075a655?w=400&h=300&fit=crop',
        description: 'Modern classroom setting',
        category: 'education'
      },
      {
        name: 'Office Space',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        description: 'Professional office environment',
        category: 'business'
      },
      {
        name: 'Meeting Room',
        url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=400&h=300&fit=crop',
        description: 'Conference room setup',
        category: 'business'
      },
      {
        name: 'Home Office',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        description: 'Cozy home workspace',
        category: 'lifestyle'
      }
    ];

    for (const image of testImages) {
      await addDoc(collection(db, 'plugin-images'), image);
    }

    console.log('✅ Added test images to Firebase plugin-images collection');
  } catch (error) {
    console.error('❌ Error adding test images:', error);
    throw error;
  }
};

// Get images directly from Firebase Storage plugin-images folder
export const getPluginImagesFromStorage = async (): Promise<PluginImage[]> => {
  try {
    console.log('🔍 Fetching images from Firebase Storage...');
    // Reference to the plugin-images folder
    const pluginImagesRef = ref(storage, 'plugin-images');
    const result = await listAll(pluginImagesRef);
    console.log(`📸 Found ${result.items.length} images in Firebase Storage`);
    // Convert storage items to PluginImage format
    const images = await Promise.all(
      result.items.map(async (item) => {
        try {
          // Get download URL
          const downloadURL = await getDownloadURL(item);
          // Get metadata for additional info
          const metadata = await getStorageMetadata(item);
          // Extract name from path (e.g., "plugin-image-1.webp" -> "Plugin Image 1")
          const fileName = item.name.replace(/\.[^.]+$/, '');
          const displayName = fileName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return {
            id: item.name,
            name: displayName,
            url: downloadURL,
            description: `${displayName} - ${metadata.contentType || 'Image'}`,
            category: 'plugin-images',
            tags: ['plugin', 'customization']
          } as PluginImage;
        } catch (error) {
          console.error(`❌ Error processing image ${item.name}:`, error);
          return null;
        }
      })
    );
    // Filter out any null results
    const validImages: PluginImage[] = (images.filter((img): img is PluginImage => img !== null));
    console.log('✅ Successfully loaded images from Firebase Storage:', validImages);
    return validImages;
  } catch (error) {
    console.error('❌ Error getting plugin images from storage:', error);
    return [];
  }
};

// Enhanced function that tries Firebase Storage first, then Firestore as fallback
export const getPluginImages = async (): Promise<PluginImage[]> => {
  try {
    // First, try to get images from Firebase Storage
    const storageImages = await getPluginImagesFromStorage();
    if (storageImages.length > 0) {
      console.log('✅ Using images from Firebase Storage');
      return storageImages;
    }
    // If no storage images, try Firestore collection
    console.log('🔄 No storage images found, trying Firestore collection...');
    const querySnapshot = await getDocs(collection(db, 'plugin-images'));
    const firestoreImages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PluginImage[];
    if (firestoreImages.length > 0) {
      console.log('✅ Using images from Firestore collection');
      return firestoreImages;
    }
    // If neither has images, return fallback
    console.log('⚠️ No images found in Firebase, using fallback images');
    return [
      {
        id: 'fallback1',
        name: 'Classroom Card',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075a655?w=400&h=300&fit=crop',
        description: 'Modern classroom setting',
        category: 'education'
      },
      {
        id: 'fallback2', 
        name: 'Office Space',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        description: 'Professional office environment',
        category: 'business'
      }
    ];
  } catch (error) {
    console.error('❌ Error getting plugin images:', error);
    // Return fallback images if everything fails
    return [
      {
        id: 'fallback1',
        name: 'Classroom Card',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075a655?w=400&h=300&fit=crop',
        description: 'Modern classroom setting',
        category: 'education'
      },
      {
        id: 'fallback2', 
        name: 'Office Space',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        description: 'Professional office environment',
        category: 'business'
      }
    ];
  }
};

// Get plugin images by category
export const getPluginImagesByCategory = async (category: string): Promise<PluginImage[]> => {
  try {
    const q = query(
      collection(db, 'plugin-images'),
      orderBy('category')
    );
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PluginImage[];
    
    return images.filter(image => image.category === category);
  } catch (error) {
    console.error('Error getting plugin images by category:', error);
    return [];
  }
};

class ImageService {
  private readonly STORAGE_PATH = 'component-images';
  
  /**
   * Upload a component image to Firebase Storage
   */
  async uploadComponentImage(
    file: File, 
    componentId: string,
    figmaComponentKey?: string
  ): Promise<ImageUploadResult> {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${componentId}_${timestamp}.${file.name.split('.').pop()}`;
      const imagePath = `${this.STORAGE_PATH}/${fileName}`;
      
      // Create storage reference
      const imageRef = ref(storage, imagePath);
      
      // Upload file
      console.log(`📤 Uploading image for component ${componentId}...`);
      const snapshot = await uploadBytes(imageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update component in database with new image URL
      await componentService.updateComponent(componentId, {
        imageUrl: downloadURL
      });
      
      console.log(`✅ Image uploaded successfully: ${downloadURL}`);
      
      return {
        url: downloadURL,
        path: imagePath,
        size: snapshot.metadata.size,
        contentType: snapshot.metadata.contentType || 'image/unknown'
      };
    } catch (error) {
      console.error('❌ Error uploading component image:', error);
      throw error;
    }
  }
  
  /**
   * Upload image from URL (for automation)
   */
  async uploadImageFromUrl(
    imageUrl: string,
    componentId: string,
    figmaComponentKey?: string
  ): Promise<ImageUploadResult> {
    try {
      console.log(`📥 Downloading image from URL: ${imageUrl}`);
      
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      // Convert to blob
      const blob = await response.blob();
      
      // Create a File object
      const file = new File([blob], `component_${componentId}.png`, {
        type: blob.type || 'image/png'
      });
      
      // Upload using existing method
      return await this.uploadComponentImage(file, componentId, figmaComponentKey);
    } catch (error) {
      console.error('❌ Error uploading image from URL:', error);
      throw error;
    }
  }
  
  /**
   * Delete component image from storage
   */
  async deleteComponentImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      console.log(`🗑️ Deleted image: ${imagePath}`);
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Delete all component images from storage
   */
  async deleteAllComponentImages(): Promise<void> {
    try {
      console.log('🗑️ Starting deletion of all component images...');
      const imagesRef = ref(storage, this.STORAGE_PATH);
      const result = await listAll(imagesRef);
      
      console.log(`📸 Found ${result.items.length} component images to delete`);
      
      // Delete all images in parallel
      const deletePromises = result.items.map(async (item) => {
        try {
          await deleteObject(item);
          console.log(`🗑️ Deleted: ${item.name}`);
          return true;
        } catch (error) {
          console.error(`❌ Failed to delete ${item.name}:`, error);
          return false;
        }
      });
      
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;
      const failCount = results.length - successCount;
      
      console.log(`✅ Deleted ${successCount} images, ${failCount} failed`);
    } catch (error) {
      console.error('❌ Error deleting all component images:', error);
      throw error;
    }
  }
  
  /**
   * List all component images
   */
  async listComponentImages(): Promise<string[]> {
    try {
      const imagesRef = ref(storage, this.STORAGE_PATH);
      const result = await listAll(imagesRef);
      
      const imageUrls = await Promise.all(
        result.items.map(async (item) => {
          return await getDownloadURL(item);
        })
      );
      
      return imageUrls;
    } catch (error) {
      console.error('❌ Error listing images:', error);
      throw error;
    }
  }
  
  /**
   * Get optimized image URL with size parameters
   */
  getOptimizedImageUrl(originalUrl: string, width?: number, height?: number): string {
    // For Firebase Storage, we can add size parameters
    if (originalUrl.includes('firebasestorage.googleapis.com')) {
      const url = new URL(originalUrl);
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      return url.toString();
    }
    
    return originalUrl;
  }
  
  /**
   * Batch update component images from Figma API
   * This will be used for automation
   */
  async batchUpdateFromFigma(
    figmaFileId: string,
    figmaAccessToken: string,
    componentIds: string[]
  ): Promise<void> {
    try {
      console.log(`🔄 Starting batch update for ${componentIds.length} components...`);
      
      // Export all components as images from Figma
      const exportUrl = `https://api.figma.com/v1/images/${figmaFileId}`;
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'X-Figma-Token': figmaAccessToken
        },
        body: JSON.stringify({
          ids: componentIds.join(','),
          format: 'png',
          scale: 2 // High DPI for crisp images
        })
      });
      
      if (!response.ok) {
        throw new Error(`Figma API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Upload each exported image
      for (const [componentId, imageUrl] of Object.entries(data.images)) {
        if (typeof imageUrl === 'string') {
          await this.uploadImageFromUrl(imageUrl, componentId, componentId);
        }
      }
      
      console.log(`✅ Batch update completed for ${componentIds.length} components`);
    } catch (error) {
      console.error('❌ Error in batch update:', error);
      throw error;
    }
  }
}

export const imageService = new ImageService();