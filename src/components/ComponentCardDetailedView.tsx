import React, { useState, useEffect } from 'react';
import BackSection from './BackSection';
import ComponentDetailsActions from './ComponentDetailsActions';
import CustomModuleModal from './CustomModuleModal';
import CustomModuleChoice from './CustomModuleChoice';
import { getDefaultComponent, groupComponentsByMaster, selectComponentVariant, ComponentPreferences } from '../services/componentService';
import { Timestamp } from 'firebase/firestore';


interface ComponentDetailData {
  id: string;
  title: string;
  image: string;
  volts: number;
  maxVolts: number;
  voltsCost: number;
  description: string;
  specs: {
    size: string;
    device: string;
    color: string;
    padding: string;
  };
  generateCount: number;
  date: {
    month: string;
    day: string;
    weekday: string;
  };
  figmaComponentId?: string;
  figmaFileId?: string;
  figmaComponentKey?: string;
  isMasterComponent?: boolean;
  variants?: Array<{
    id: string;
    name: string;
    imageUrl: string;
    figmaComponentKey: string;
    specs: Record<string, unknown>;
    isDefault: boolean;
  }>;
  variantCount?: number;
}

interface ComponentCardDetailedViewProps {
  data: ComponentDetailData;
  onBack: () => void;
  onGenerate: () => void;
}

const ComponentCardDetailedView: React.FC<ComponentCardDetailedViewProps> = ({
  data,
  onBack,
  onGenerate
}) => {

  
  const [showCustomModuleModal, setShowCustomModuleModal] = useState(false);
  const [showCustomModuleChoice, setShowCustomModuleChoice] = useState(false);
  const [customizationMode, setCustomizationMode] = useState<'single' | 'set' | null>(null);
  const [customizationCount, setCustomizationCount] = useState(0);
  
  // Convert Cloudinary WebP URLs to PNG format for Figma compatibility
  const convertToPngIfCloudinary = (url: string): string => {
    if (url.includes('res.cloudinary.com') && url.includes('.webp')) {
      // Check if f_png transformation is already applied
      if (url.includes('/f_png/')) {
        return url; // Already converted
      }
      return url.replace('/upload/', '/upload/f_png/');
    }
    return url;
  };

  // Get the correct image for this specific variant
  const getVariantImage = () => {
    let imageUrl = '';
    
    if (data.variants && data.variants.length > 0) {
      // Check if user has selected specific preferences
      const selectedStyle = customizationPreferences?.style?.toLowerCase();
      const selectedSize = customizationPreferences?.size?.toLowerCase() || 'large';
      
      console.log('🔍 getVariantImage - User preferences:', { selectedStyle, selectedSize });
      console.log('🔍 Available variants:', data.variants.map(v => v.name));
      
      if (selectedStyle || selectedSize) {
        // Find the variant that best matches the user's selection
        let selectedVariant = null;
        
        // First, try to find exact match (both style and size)
        if (selectedStyle && selectedSize) {
          selectedVariant = data.variants.find(variant => {
            const name = variant.name.toLowerCase();
            return name.includes(selectedStyle) && name.includes(selectedSize);
          });
          console.log('🔍 Looking for exact match (style + size):', selectedStyle, selectedSize);
        }
        
        // If no exact match, try to find style match first
        if (!selectedVariant && selectedStyle) {
          selectedVariant = data.variants.find(variant => {
            const name = variant.name.toLowerCase();
            return name.includes(selectedStyle);
          });
          console.log('🔍 Looking for style match only:', selectedStyle);
        }
        
        // If still no match, try to find size match first
        if (!selectedVariant && selectedSize) {
          selectedVariant = data.variants.find(variant => {
            const name = variant.name.toLowerCase();
            return name.includes(selectedSize);
          });
          console.log('🔍 Looking for size match only:', selectedSize);
        }
        
        if (selectedVariant) {
          console.log('✅ Found matching variant:', selectedVariant.name);
          imageUrl = selectedVariant.imageUrl;
        } else {
          console.log('⚠️ No matching variant found, using first available variant');
          imageUrl = data.variants[0].imageUrl;
        }
      } else {
        // No preferences selected - show the first available variant (usually the default)
        console.log('🔍 No preferences selected, showing first available variant');
        imageUrl = data.variants[0].imageUrl;
      }
    } else {
      imageUrl = data.image;
    }
    
    console.log('🖼️ Final image URL:', imageUrl);
    return convertToPngIfCloudinary(imageUrl);
  };

  // Get the correct variant's figmaComponentKey based on user preferences
  const getCorrectVariantKey = () => {
    if (data.variants && data.variants.length > 0) {
      const selectedStyle = customizationPreferences?.style?.toLowerCase();
      const selectedSize = customizationPreferences?.size?.toLowerCase() || 'large';
      
      // Find the variant that best matches the user's selection
      let selectedVariant = null;
      
      // First, try to find exact match (both style and size)
      if (selectedStyle && selectedSize) {
        selectedVariant = data.variants.find(variant => {
          const name = variant.name.toLowerCase();
          return name.includes(selectedStyle) && name.includes(selectedSize);
        });
        console.log('🔍 getCorrectVariantKey - Looking for exact match (style + size):', selectedStyle, selectedSize);
      }
      
      // If no exact match, try to find style match first
      if (!selectedVariant && selectedStyle) {
        selectedVariant = data.variants.find(variant => {
          const name = variant.name.toLowerCase();
          return name.includes(selectedStyle);
        });
        console.log('🔍 getCorrectVariantKey - Looking for style match only:', selectedStyle);
      }
      
      // If still no match, try to find size match first
      if (!selectedVariant && selectedSize) {
        selectedVariant = data.variants.find(variant => {
          const name = variant.name.toLowerCase();
          return name.includes(selectedSize);
        });
        console.log('🔍 getCorrectVariantKey - Looking for size match only:', selectedSize);
      }
      
      if (selectedVariant) {
        console.log('✅ getCorrectVariantKey - Found matching variant:', selectedVariant.name);
        console.log('✅ getCorrectVariantKey - Using variant key:', selectedVariant.figmaComponentKey);
        return selectedVariant.figmaComponentKey;
      } else {
        console.log('⚠️ getCorrectVariantKey - No matching variant found, falling back to master key');
        return data.figmaComponentKey;
      }
    } else {
      console.log('🔍 getCorrectVariantKey - No variants, using master key');
      return data.figmaComponentKey;
    }
  };

  // Get the correct variant's figmaComponentKey based on explicit preferences
  const getCorrectVariantKeyWithPreferences = (preferences: Record<string, string>) => {
    if (data.variants && data.variants.length > 0) {
      const selectedStyle = preferences?.style?.toLowerCase();
      const selectedSize = preferences?.size?.toLowerCase() || 'large';
      
      // Find the variant that best matches the user's selection
      let selectedVariant = null;
      
      // First, try to find exact match (both style and size)
      if (selectedStyle && selectedSize) {
        selectedVariant = data.variants.find(variant => {
          const name = variant.name.toLowerCase();
          return name.includes(selectedStyle) && name.includes(selectedSize);
        });
        console.log('🔍 getCorrectVariantKeyWithPreferences - Looking for exact match (style + size):', selectedStyle, selectedSize);
      }
      
      // If no exact match, try to find style match first
      if (!selectedVariant && selectedStyle) {
        selectedVariant = data.variants.find(variant => {
          const name = variant.name.toLowerCase();
          return name.includes(selectedStyle);
        });
        console.log('🔍 getCorrectVariantKeyWithPreferences - Looking for style match only:', selectedStyle);
      }
      
      // If still no match, try to find size match first
      if (!selectedVariant && selectedSize) {
        selectedVariant = data.variants.find(variant => {
          const name = variant.name.toLowerCase();
          return name.includes(selectedSize);
        });
        console.log('🔍 getCorrectVariantKeyWithPreferences - Looking for size match only:', selectedSize);
      }
      
      if (selectedVariant) {
        console.log('✅ getCorrectVariantKeyWithPreferences - Found matching variant:', selectedVariant.name);
        console.log('✅ getCorrectVariantKeyWithPreferences - Using variant key:', selectedVariant.figmaComponentKey);
        return selectedVariant.figmaComponentKey;
      } else {
        console.log('⚠️ getCorrectVariantKeyWithPreferences - No matching variant found, falling back to master key');
        return data.figmaComponentKey;
      }
    } else {
      console.log('🔍 getCorrectVariantKeyWithPreferences - No variants, using master key');
      return data.figmaComponentKey;
    }
  };

  const [currentImage, setCurrentImage] = useState(() => {
    // Initialize with the .dark/.large variant specifically (default)
    if (data.variants && data.variants.length > 0) {
      // Find the .dark/.large variant specifically
      const darkLargeVariant = data.variants.find(variant => 
        variant.name.toLowerCase().includes('dark') && variant.name.toLowerCase().includes('large')
      );
      
      if (darkLargeVariant) {
        console.log('🎯 Initializing with .dark/.large variant:', darkLargeVariant.name);
        return convertToPngIfCloudinary(darkLargeVariant.imageUrl);
      } else {
        // Fallback to first variant if .dark/.large not found
        console.log('⚠️ .dark/.large variant not found, using first available variant');
        return convertToPngIfCloudinary(data.variants[0].imageUrl);
      }
    }
    return data.image || '';
  });
  const [temporaryPreviewUrl, setTemporaryPreviewUrl] = useState<string>(''); // For temporary preview
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false); // Track if we're generating preview
  const [customizationPreferences, setCustomizationPreferences] = useState<Record<string, string>>({});
  const [hasCustomizations, setHasCustomizations] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error', message: string } | null>(null);

  // ❌ REMOVED: Problematic initial useEffect that caused wrong initial image

  // Update current image when customization preferences change
  useEffect(() => {
    if (Object.keys(customizationPreferences).length > 0) {
      console.log('🔄 Preferences changed, updating image...');
      
      // NEVER update currentImage if there's a temporary preview active
      // This ensures the temporary preview stays visible until reset or generate
      if (!temporaryPreviewUrl) {
        const newImage = getVariantImage();
        setCurrentImage(newImage);
        console.log('🔄 Updated currentImage to variant:', newImage);
      } else {
        console.log('🔄 PERMANENTLY skipping currentImage update - temporary preview is active and will stay');
      }
    }
  }, [customizationPreferences, temporaryPreviewUrl]);


  // Create temporary preview image for immediate visual feedback
  const createTemporaryPreview = async (customImageUrl: string) => {
    try {
      setIsGeneratingPreview(true);
      
      // Generate the full component preview with custom image inserted
      // This creates the component card with the custom image in the .placeholder-image frame
      if (window.parent && window.parent !== window) {
        const previewComponentId = `temp-preview-${data.id}-${Date.now()}`;
        
        // Send message to code.ts to generate the full component preview
        const variantKey = Object.keys(customizationPreferences).length > 0 ? getCorrectVariantKey() : data.figmaComponentKey;
        console.log('🔍 DEBUG: About to send figmaComponentKey to Figma plugin:', {
          hasPreferences: Object.keys(customizationPreferences).length > 0,
          preferences: customizationPreferences,
          variantKey: variantKey,
          masterKey: data.figmaComponentKey
        });
        
        window.parent.postMessage({
          pluginMessage: {
            type: 'generate-temporary-preview',
            componentId: previewComponentId,
            figmaFileId: data.figmaFileId,
            figmaComponentKey: variantKey,
            title: data.title,
            specs: data.specs,
            customImageUrl: customImageUrl
          }
        }, '*');
        
        console.log('⏳ Generating component preview...');
        
        // Listen for the response from code.ts
        const handleMessage = async (event: MessageEvent) => {
          if (event.data.pluginMessage?.type === 'temporary-preview-generated') {
            const { componentId, previewDataUrl } = event.data.pluginMessage;
            
            if (componentId === previewComponentId) {
              try {
                const { imageService } = await import('../services/imageService');
                
                const response = await fetch(previewDataUrl);
                const blob = await response.blob();
                
                const file = new File([blob], `temp-preview-${data.id}-${Date.now()}.png`, {
                  type: 'image/png'
                });
                
                const uploadResult = await imageService.uploadGeneratedComponentPreview(file, data.id);
                setTemporaryPreviewUrl(uploadResult.url);
                console.log('✅ Component preview uploaded');
                
              } catch (error) {
                console.error('❌ Upload failed, using Firebase fallback');
                // Try to use the Firebase image instead of Cloudinary
                const firebaseImage = getVariantImage();
                if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
                  setTemporaryPreviewUrl(firebaseImage);
                  console.log('🔄 Using Firebase image as fallback:', firebaseImage);
                } else {
                  // Only use Cloudinary as absolute last resort
                  const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
                  setTemporaryPreviewUrl(tempPreviewUrl);
                  console.log('🔄 Using Cloudinary as last resort:', tempPreviewUrl);
                }
              }
              
              // Clear generating state
              setIsGeneratingPreview(false);
              
              // Remove the event listener
              window.removeEventListener('message', handleMessage);
            }
          } else if (event.data.pluginMessage?.type === 'temporary-preview-error') {
            const { componentId, error } = event.data.pluginMessage;
            
            if (componentId === previewComponentId) {
              console.error('❌ Preview generation failed, using Firebase fallback');
              // Try to use the Firebase image instead of Cloudinary
              const firebaseImage = getVariantImage();
              if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
                setTemporaryPreviewUrl(firebaseImage);
                console.log('🔄 Using Firebase image as error fallback:', firebaseImage);
              } else {
                // Only use Cloudinary as absolute last resort
                const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
                setTemporaryPreviewUrl(tempPreviewUrl);
                console.log('🔄 Using Cloudinary as error last resort:', tempPreviewUrl);
              }
              setIsGeneratingPreview(false);
              window.removeEventListener('message', handleMessage);
            }
          }
        };
        
        // Add event listener for the response
        window.addEventListener('message', handleMessage);
        
        // Set a timeout as fallback
        setTimeout(() => {
          if (isGeneratingPreview) {
            console.log('⏰ Timeout: No response from Figma plugin, using Firebase fallback');
            // Try to use the Firebase image instead of Cloudinary
            const firebaseImage = getVariantImage();
            if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
              setTemporaryPreviewUrl(firebaseImage);
              console.log('🔄 Using Firebase image as timeout fallback:', firebaseImage);
            } else {
              // Only use Cloudinary as absolute last resort
              const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
              setTemporaryPreviewUrl(tempPreviewUrl);
              console.log('🔄 Using Cloudinary as timeout last resort:', tempPreviewUrl);
            }
            setIsGeneratingPreview(false);
          }
          window.removeEventListener('message', handleMessage);
        }, 30000);
        
      } else {
        // Fallback if no parent window
        console.log('🔄 No parent window, using Firebase fallback');
        const firebaseImage = getVariantImage();
        if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
          setTemporaryPreviewUrl(firebaseImage);
          console.log('🔄 Using Firebase image as no-parent fallback:', firebaseImage);
        } else {
          // Only use Cloudinary as absolute last resort
          const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
          setTemporaryPreviewUrl(tempPreviewUrl);
          console.log('🔄 Using Cloudinary as no-parent last resort:', tempPreviewUrl);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to create temporary preview:', error);
      // Try Firebase image first, then Cloudinary as last resort
      const firebaseImage = getVariantImage();
      if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
        setTemporaryPreviewUrl(firebaseImage);
        console.log('🔄 Using Firebase image as error fallback:', firebaseImage);
      } else {
        // Only use Cloudinary as absolute last resort
        const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
        setTemporaryPreviewUrl(tempPreviewUrl);
        console.log('🔄 Using Cloudinary as error last resort:', tempPreviewUrl);
      }
    }
  };

  // Create temporary preview with explicit preferences (for immediate use)
  const createTemporaryPreviewWithPreferences = async (customImageUrl: string, preferences: Record<string, string>) => {
    try {
      setIsGeneratingPreview(true);
      
      // Generate the full component preview with custom image inserted
      if (window.parent && window.parent !== window) {
        const previewComponentId = `temp-preview-${data.id}-${Date.now()}`;
        
        // Use the preferences directly to get the correct variant key
        const variantKey = Object.keys(preferences).length > 0 ? getCorrectVariantKeyWithPreferences(preferences) : data.figmaComponentKey;
        console.log('🔍 DEBUG: createTemporaryPreviewWithPreferences - About to send figmaComponentKey to Figma plugin:', {
          hasPreferences: Object.keys(preferences).length > 0,
          preferences: preferences,
          variantKey: variantKey,
          masterKey: data.figmaComponentKey
        });
        
        window.parent.postMessage({
          pluginMessage: {
            type: 'generate-temporary-preview',
            componentId: previewComponentId,
            figmaFileId: data.figmaFileId,
            figmaComponentKey: variantKey,
            title: data.title,
            specs: data.specs,
            customImageUrl: customImageUrl
          }
        }, '*');
        
        console.log('⏳ Generating component preview with preferences...');
        
        // Listen for the response from code.ts
        const handleMessage = async (event: MessageEvent) => {
          if (event.data.pluginMessage?.type === 'temporary-preview-generated') {
            const { componentId, previewDataUrl } = event.data.pluginMessage;
            
            if (componentId === previewComponentId) {
              try {
                const { imageService } = await import('../services/imageService');
                
                const response = await fetch(previewDataUrl);
                const blob = await response.blob();
                
                const file = new File([blob], `temp-preview-${data.id}-${Date.now()}.png`, {
                  type: 'image/png'
                });
                
                const uploadResult = await imageService.uploadGeneratedComponentPreview(file, data.id);
                setTemporaryPreviewUrl(uploadResult.url);
                console.log('✅ Component preview uploaded with preferences');
                
              } catch (error) {
                console.error('❌ Upload failed, using Firebase fallback');
                // Try to use the Firebase image instead of Cloudinary
                const firebaseImage = getVariantImage();
                if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
                  setTemporaryPreviewUrl(firebaseImage);
                  console.log('🔄 Using Firebase image as fallback:', firebaseImage);
                } else {
                  // Only use Cloudinary as absolute last resort
                  const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
                  setTemporaryPreviewUrl(tempPreviewUrl);
                  console.log('🔄 Using Cloudinary as last resort:', tempPreviewUrl);
                }
              }
              
              // Clear generating state
              setIsGeneratingPreview(false);
              
              // Remove the event listener
              window.removeEventListener('message', handleMessage);
            }
          }
        };
        
        // Add event listener for the response
        window.addEventListener('message', handleMessage);
        
        // Set a timeout to clean up if no response
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          setIsGeneratingPreview(false);
          console.log('⏰ Timeout: No response from Figma plugin, using Firebase fallback');
          // Try to use the Firebase image instead of Cloudinary
          const firebaseImage = getVariantImage();
          if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
            setTemporaryPreviewUrl(firebaseImage);
            console.log('🔄 Using Firebase image as timeout fallback:', firebaseImage);
          } else {
            // Only use Cloudinary as absolute last resort
            const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
            setTemporaryPreviewUrl(tempPreviewUrl);
            console.log('🔄 Using Cloudinary as timeout last resort:', tempPreviewUrl);
          }
        }, 10000);
        
      } else {
        // Fallback for non-Figma environment
        console.log('🔄 Non-Figma environment, using Firebase fallback');
        const firebaseImage = getVariantImage();
        if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
          setTemporaryPreviewUrl(firebaseImage);
          console.log('🔄 Using Firebase image as non-Figma fallback:', firebaseImage);
        } else {
          // Only use Cloudinary as absolute last resort
          const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
          setTemporaryPreviewUrl(tempPreviewUrl);
          console.log('🔄 Using Cloudinary as non-Figma last resort:', tempPreviewUrl);
        }
      }
    } catch (error) {
      console.error('❌ Error in createTemporaryPreviewWithPreferences:', error);
      setIsGeneratingPreview(false);
      // Try Firebase image first, then Cloudinary as last resort
      const firebaseImage = getVariantImage();
      if (firebaseImage && firebaseImage.includes('firebasestorage.googleapis.com')) {
        setTemporaryPreviewUrl(firebaseImage);
        console.log('🔄 Using Firebase image as error fallback:', firebaseImage);
      } else {
        // Only use Cloudinary as absolute last resort
        const tempPreviewUrl = convertToPngIfCloudinary(customImageUrl);
        setTemporaryPreviewUrl(tempPreviewUrl);
        console.log('🔄 Using Cloudinary as error last resort:', tempPreviewUrl);
      }
    }
  };

  // Clear temporary preview after generation
  const clearTemporaryPreview = async () => {
    // Delete the temporary preview from Firebase Storage if it exists
    if (temporaryPreviewUrl && temporaryPreviewUrl.includes('firebasestorage.googleapis.com')) {
      try {
        const { imageService } = await import('../services/imageService');
        await imageService.deleteTemporaryPreview(temporaryPreviewUrl);
      } catch (error) {
        console.error('❌ Failed to delete temporary preview from Firebase:', error);
      }
    }
    
    // Clear the local state
    setTemporaryPreviewUrl('');
  };



  // Get available components for variant selection
  const getAvailableComponents = () => {
    const components = [];
    
    if (data) {
      components.push({
        id: data.id,
        title: data.title,
        imageUrl: data.image,
        figmaComponentKey: data.figmaComponentKey,
        specs: data.specs,
        description: data.description || '',
        volts: data.volts || 0,
        maxVolts: data.maxVolts || 0,
        voltsCost: data.voltsCost || 0,
        category: '',
        generateCount: data.generateCount || 0,
        date: data.date || { month: '', day: '', weekday: '' },
        downloads: 0,
        rating: 0,
        tags: [],
        isPublic: true,
        createdBy: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    
    if (data.variants && data.variants.length > 0) {
      data.variants.forEach(variant => {
        components.push({
          id: variant.id,
          title: variant.name,
          imageUrl: variant.imageUrl,
          figmaComponentKey: variant.figmaComponentKey,
          specs: variant.specs as any,
          description: '',
          volts: 0,
          maxVolts: 0,
          voltsCost: 0,
          category: '',
          generateCount: 0,
          date: { month: '', day: '', weekday: '' },
          downloads: 0,
          rating: 0,
          tags: [],
          isPublic: true,
          createdBy: '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });
    }
    
    return components;
  };

  const handleCustomize = () => {
    setShowCustomModuleChoice(true);
  };

  const handleChoiceContinue = (mode: 'single' | 'set') => {
    setCustomizationMode(mode);
    setShowCustomModuleChoice(false);
    setShowCustomModuleModal(true);
  };

  const handleChoiceCancel = () => {
    setShowCustomModuleChoice(false);
  };

  const handleCustomModuleClose = () => {
    setShowCustomModuleModal(false);
    setCustomizationMode(null);
  };

  // Get the default dark/large variant image
  const getDefaultDarkLargeImage = () => {
    if (data.variants && data.variants.length > 0) {
      const darkLargeVariant = data.variants.find(variant => 
        variant.name.toLowerCase().includes('dark') && variant.name.toLowerCase().includes('large')
      );
      if (darkLargeVariant) {
        console.log('🎯 Returning to default .dark/.large variant:', darkLargeVariant.name);
        return convertToPngIfCloudinary(darkLargeVariant.imageUrl);
      }
    }
    // Fallback to first variant or master image
    return data.variants && data.variants.length > 0 
      ? convertToPngIfCloudinary(data.variants[0].imageUrl)
      : convertToPngIfCloudinary(data.image || '');
  };

  const handleReset = () => {
    setCurrentImage(getDefaultDarkLargeImage()); // Reset to default dark/large
    setTemporaryPreviewUrl(''); // Clear temporary preview
    setCustomizationPreferences({});
    setHasCustomizations(false);
    console.log('🔄 Customizations reset to 0');
  };

  const handleGenerate = async () => {
    const availableComponents = getAvailableComponents();
    const grouped = groupComponentsByMaster(availableComponents);
    const masterNames = Object.keys(grouped);
    let selectedComponent;
    let customImageUrl: string | undefined;
    
    if (hasCustomizations && Object.keys(customizationPreferences).length > 0) {
      const size = (customizationPreferences['size'] || 'Large').toLowerCase() as 'large' | 'small';
      const style = (customizationPreferences['style'] || 'Dark').toLowerCase() as 'dark' | 'light';
      const image = customizationPreferences['image'] || undefined;
      
      if (image && image !== 'Default') {
        customImageUrl = customizationPreferences['selectedImageUrl'];
      }
      
      selectedComponent = selectComponentVariant(grouped[masterNames[0]], { size, style, image });
    } else {
      selectedComponent = getDefaultComponent(grouped[masterNames[0]]);
    }
    
    if (window.parent && window.parent !== window && selectedComponent) {
      setNotification({
        type: 'success',
        message: customImageUrl ? 
          '🎨 Generating component with custom image in Figma...' : 
          '🎨 Generating component in Figma...'
      });
      
      window.parent.postMessage({
        pluginMessage: {
          type: 'insert-component',
          componentId: selectedComponent.id,
          figmaFileId: data.figmaFileId,
          figmaComponentKey: selectedComponent.figmaComponentKey,
          title: selectedComponent.title,
          specs: selectedComponent.specs,
          customImageUrl: customImageUrl
        }
      }, '*');
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      // Clear temporary preview after generation (including Firebase cleanup)
      await clearTemporaryPreview();
      
      // Reset to default dark/large variant after generation
      setCurrentImage(getDefaultDarkLargeImage());
      setCustomizationPreferences({});
      setHasCustomizations(false);
      setCustomizationCount(0);
      
      console.log('🔄 Reset to default .dark/.large variant after generation');
    }
  };

  // Debug logging - only log essential info
  console.log('🔍 ComponentCardDetailedView received data:', { 
    id: data.id, 
    title: data.title, 
    hasVariants: !!data.variants?.length 
  });

  return (
    <div className="component-detail-page">
      {/* Debug fallback - show if data is missing */}
      {!data && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <h3>⚠️ No component data received</h3>
          <p>ComponentCardDetailedView is not receiving data properly.</p>
        </div>
      )}
      
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          background: notification.type === 'success' ? '#10b981' : 
                     notification.type === 'warning' ? '#f59e0b' : '#ef4444',
          color: 'white',
          maxWidth: '300px',
          wordWrap: 'break-word'
        }}>
          {notification.message}
        </div>
      )}

      <BackSection onBack={onBack} />

      {/* Component Details Image Section - Generated Preview */}
      <div className="component__details--image">
        <div className="component__details--image-container" style={{ position: 'relative' }}>
          {/* Loading Animation - Show while generating preview */}
          {isGeneratingPreview && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 20,
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #FF5C0A',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <div style={{
                  color: '#FF5C0A',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Generating Preview...
                </div>
              </div>
            </div>
          )}
          
          {(() => {
            // Show temporary preview if available, otherwise show current image
            const displayImageUrl = temporaryPreviewUrl || currentImage;
            const isTemporaryPreview = temporaryPreviewUrl !== '';
            
            return displayImageUrl && isTemporaryPreview ? (
              // Show temporary preview image directly
              <div style={{ 
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <img 
                  src={displayImageUrl} 
                  alt={`${data.title} Preview`}
                  style={{
                    width: '50%',
                    maxWidth: '250px',
                    objectFit: 'contain'
                  }}
                  onLoad={(e) => {
                    console.log('✅ Temporary preview image loaded successfully:', displayImageUrl);
                  }}
                  onError={(e) => {
                    console.error('❌ Failed to load temporary preview image:', displayImageUrl);
                    // Don't clear temporary preview on error - let it stay visible
                    // This prevents the image from disappearing when there are loading issues
                    console.log('🔄 Keeping temporary preview visible despite loading error');
                  }}
                />
                
                {/* Custom Image Indicator Overlay */}
                {customizationPreferences.selectedImageUrl && (
                  <div className="custom-image-indicator" style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10
                  }}>
                    <div className="custom-image-badge" style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}>
                      <span className="custom-image-icon">🖼️</span>
                      <span className="custom-image-text">Temporary Preview</span>
                    </div>
                  </div>
                )}
              </div>
            ) : displayImageUrl ? (
              // Show regular preview image directly
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <img 
                  src={displayImageUrl} 
                  alt={`${data.title} Preview`}
                  style={{
                    width: '50%',
                    maxWidth: '250px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ) : (
              // Show current image as fallback
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <img 
                  src={currentImage} 
                  alt={data.title}
                  style={{
                    width: '50%',
                    maxWidth: '250px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            );
          })()}
          
          {/* Component Variant Label */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '16px',
            backgroundColor: '#FF5C0A',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            zIndex: 5
          }}>
            {data.title.includes('/') ? data.title : `${data.title}/dark/large`}
          </div>
        </div>
      </div>

      <div className="component__details--info">
        <div className="component__details--info-banner">
          <span className="component__details--info-volts">{data.volts} volts</span>
        </div>
        <h3 className="component__details--info-title">{data.title}</h3>
        <p className="component__details--info-description">
          {data.description}
        </p>
      </div>

      <div className="component__details--specs">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="component__details--specs-box">
            <div className="component__details--specs-box-container">
              <div className="component__details--specs-box-container-content">
                <div className="component__details--specs-box-container-content-left">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75 5.25L9 1.5L11.25 5.25L9 4.5L6.75 5.25Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.75 12.75L9 16.5L11.25 12.75L9 13.5L6.75 12.75Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.5 9L5.25 6.75L4.5 9L5.25 11.25L1.5 9Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 9L12.75 6.75L13.5 9L12.75 11.25L16.5 9Z" stroke="#FF5C0A" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5003 9.0064C10.5003 9.83553 9.82868 10.5077 9.00015 10.5077C8.17163 10.5077 7.5 9.83553 7.5 9.0064C7.5 8.17728 8.17163 7.50513 9.00015 7.50513C9.82868 7.50513 10.5003 8.17728 10.5003 9.0064Z" stroke="#FF5C0A"/>
                  </svg>
                  <span>Size</span>
                </div>
                <span>{data.specs.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ComponentDetailsActions
        onGenerate={handleGenerate}
        onCustomize={handleCustomize}
        componentData={{
          figmaComponentId: data.figmaComponentId,
          figmaFileId: data.figmaFileId,
          figmaComponentKey: (() => {
            const variantKey = Object.keys(customizationPreferences).length > 0 ? getCorrectVariantKey() : data.figmaComponentKey;
            console.log('🔍 DEBUG: ComponentDetailsActions figmaComponentKey:', {
              hasPreferences: Object.keys(customizationPreferences).length > 0,
              preferences: customizationPreferences,
              variantKey: variantKey,
              masterKey: data.figmaComponentKey
            });
            return variantKey;
          })(),
          title: data.title,
          specs: data.specs,
          isMasterComponent: data.isMasterComponent,
          variants: data.variants,
          variantCount: data.variantCount
        }}
        customizationCount={customizationCount}
        onReset={handleReset}
      />

      {showCustomModuleChoice && (
        <div className="modal-overlay">
          <CustomModuleChoice
            onContinue={(mode) => handleChoiceContinue(mode)}
            onCancel={handleChoiceCancel}
          />
        </div>
      )}

      {showCustomModuleModal && (
        <CustomModuleModal 
          isVisible={showCustomModuleModal}
          onClose={handleCustomModuleClose}
          customizationMode={customizationMode}
          availableComponents={getAvailableComponents()}
          componentId={data.id}
          onApplyChanges={async prefs => {
            // Set preferences first
            setCustomizationPreferences(prefs);
            setHasCustomizations(true);
            
            // Log the variant change
            console.log('🎨 Variant changed to:', {
              style: prefs.style || 'Dark',
              size: prefs.size || 'Large',
              image: prefs.image || 'Default'
            });
            
            // Calculate customization count
            let count = 0;
            if (customizationMode === 'single') {
              const defaults = { size: 'Large', style: 'Dark', image: 'Dark' };
              const singleOptions = ['size', 'style', 'image'];
              count = singleOptions.filter(option => 
                prefs[option] !== undefined && 
                prefs[option] !== null && 
                prefs[option] !== '' &&
                prefs[option] !== defaults[option as keyof typeof defaults]
              ).length;
            } else if (customizationMode === 'set') {
              const defaults = { state: 'Theme, State, Size', style: 'Dark' };
              const setOptions = ['state', 'style'];
              count = setOptions.filter(option => 
                prefs[option] !== undefined && 
                prefs[option] !== null && 
                prefs[option] !== '' &&
                prefs[option] !== defaults[option as keyof typeof defaults]
              ).length;
            }
            setCustomizationCount(count);
            
            // If there's a custom image, create temporary preview AFTER preferences are set
            if (prefs.selectedImageUrl && prefs.selectedImageUrl !== '') {
              try {
                console.log('🖼️ Creating temporary preview with custom image');
                // Use the preferences directly instead of relying on state
                await createTemporaryPreviewWithPreferences(prefs.selectedImageUrl, prefs);
              } catch (error) {
                console.error('❌ Failed to create temporary preview:', error);
              }
            } else {
              // Only update current image if there's NO custom image
              // This prevents overriding the temporary preview
              const newImage = getVariantImage();
              setCurrentImage(newImage);
              console.log('🔄 Updated currentImage to variant (no custom image):', newImage);
            }
          }}
        />
      )}
    </div>
  );
};

export default ComponentCardDetailedView; 