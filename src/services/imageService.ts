import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata 
} from 'firebase/storage';
import { storage } from '../firebase';
import { componentService } from './componentService';

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