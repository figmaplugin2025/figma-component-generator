import { componentService } from '../services/componentService';

// Sample component data with working placeholder images
const sampleComponents = [
  {
    title: 'Navigation Bar',
    description: 'A responsive navigation bar component with multiple variants',
    volts: 5,
    maxVolts: 500,
    voltsCost: 5,
    category: 'Navigation',
    specs: {
      size: '240x64px',
      device: 'Desktop',
      color: 'Light',
      padding: '16px'
    },
    imageUrl: 'https://via.placeholder.com/400x240/FF5C0A/FFFFFF?text=Navigation+Bar',
    figmaComponentId: 'comp_123',
    figmaFileId: 'WmR2QoB6m9bXeHuHBaRqNf',
    figmaComponentKey: '21dec29ff1244eedd26d01652d7788c23b0867d0',
    generateCount: 25,
    downloads: 42,
    rating: 4.8,
    tags: ['navigation', 'header', 'responsive'],
    isPublic: true,
    createdBy: 'user123',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Primary Button',
    description: 'A customizable primary button with hover states',
    volts: 3,
    maxVolts: 500,
    voltsCost: 3,
    category: 'Buttons',
    specs: {
      size: '120x40px',
      device: 'Desktop',
      color: 'Primary',
      padding: '12px'
    },
    imageUrl: 'https://via.placeholder.com/400x240/4A90E2/FFFFFF?text=Primary+Button',
    figmaComponentId: 'comp_124',
    figmaFileId: 'WmR2QoB6m9bXeHuHBaRqNf',
    figmaComponentKey: '21dec29ff1244eedd26d01652d7788c23b0867d1',
    generateCount: 15,
    downloads: 28,
    rating: 4.6,
    tags: ['button', 'primary', 'interactive'],
    isPublic: true,
    createdBy: 'user123',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Card Component',
    description: 'A flexible card layout with image and content areas',
    volts: 8,
    maxVolts: 500,
    voltsCost: 8,
    category: 'Cards',
    specs: {
      size: '320x200px',
      device: 'Desktop',
      color: 'Light',
      padding: '24px'
    },
    imageUrl: 'https://via.placeholder.com/400x240/50C878/FFFFFF?text=Card+Component',
    figmaComponentId: 'comp_125',
    figmaFileId: 'WmR2QoB6m9bXeHuHBaRqNf',
    figmaComponentKey: '21dec29ff1244eedd26d01652d7788c23b0867d2',
    generateCount: 35,
    downloads: 52,
    rating: 4.9,
    tags: ['card', 'layout', 'content'],
    isPublic: true,
    createdBy: 'user123',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to populate database with sample data
export const populateSampleData = async () => {
  try {
    console.log('Starting to populate sample data...');
    
    for (const componentData of sampleComponents) {
      const id = await componentService.createComponent(componentData);
      console.log(`Created component with ID: ${id}`);
    }
    
    console.log('Sample data population completed!');
  } catch (error) {
    console.error('Error populating sample data:', error);
  }
};

// Function to clear all components (use with caution!)
export const clearAllComponents = async () => {
  try {
    const components = await componentService.getAllComponents();
    
    for (const component of components) {
      if (component.id) {
        await componentService.deleteComponent(component.id);
        console.log(`Deleted component: ${component.id}`);
      }
    }
    
    console.log('All components cleared!');
  } catch (error) {
    console.error('Error clearing components:', error);
  }
};

// Function to update existing components with working image URLs
export const fixImageUrls = async () => {
  try {
    console.log('🔧 Starting to fix image URLs...');
    const components = await componentService.getAllComponents();
    
    for (const component of components) {
      if (component.id) {
        // Update with working placeholder URL based on component title
        let newImageUrl = '';
        if (component.title.toLowerCase().includes('navigation')) {
          newImageUrl = 'https://via.placeholder.com/400x240/FF5C0A/FFFFFF?text=Navigation+Bar';
        } else if (component.title.toLowerCase().includes('button')) {
          newImageUrl = 'https://via.placeholder.com/400x240/4A90E2/FFFFFF?text=Primary+Button';
        } else if (component.title.toLowerCase().includes('card')) {
          newImageUrl = 'https://via.placeholder.com/400x240/50C878/FFFFFF?text=Card+Component';
        } else {
          newImageUrl = 'https://via.placeholder.com/400x240/888888/FFFFFF?text=' + encodeURIComponent(component.title);
        }
        
        // Update the component with new image URL
        await componentService.updateComponent(component.id, {
          ...component,
          imageUrl: newImageUrl
        });
        
        console.log(`✅ Updated ${component.title} with new image URL: ${newImageUrl}`);
      }
    }
    
    console.log('🎉 All image URLs fixed!');
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
  }
}; 