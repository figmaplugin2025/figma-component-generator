// Figma API Helper to get component keys
export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    handle: string;
    img_url: string;
  };
  containing_frame: {
    name: string;
    node_id: string;
  };
}

export interface FigmaFileResponse {
  document: {
    children: any[];
  };
  components: {
    [key: string]: FigmaComponent;
  };
  componentSets: {
    [key: string]: any;
  };
  schemaVersion: number;
  styles: {
    [key: string]: any;
  };
}

// Function to get all components from a Figma file
export const getFigmaComponents = async (fileKey: string, accessToken: string): Promise<FigmaComponent[]> => {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': accessToken
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FigmaFileResponse = await response.json();
    
    // Extract components from the response
    const components: FigmaComponent[] = Object.values(data.components || {});
    
    console.log(`Found ${components.length} components in file`);
    return components;
    
  } catch (error) {
    console.error('Error fetching Figma components:', error);
    throw error;
  }
};

// Function to get a specific component by name
export const getComponentByName = async (
  fileKey: string, 
  accessToken: string, 
  componentName: string
): Promise<FigmaComponent | null> => {
  try {
    const components = await getFigmaComponents(fileKey, accessToken);
    return components.find(comp => comp.name === componentName) || null;
  } catch (error) {
    console.error('Error getting component by name:', error);
    return null;
  }
};

// Function to list all component names and keys
export const listComponentKeys = async (fileKey: string, accessToken: string): Promise<void> => {
  try {
    const components = await getFigmaComponents(fileKey, accessToken);
    
    console.log('📋 Available Components:');
    console.log('========================');
    
    components.forEach((component, index) => {
      console.log(`${index + 1}. ${component.name}`);
      console.log(`   Key: ${component.key}`);
      console.log(`   Description: ${component.description || 'No description'}`);
      console.log('---');
    });
    
    // Also log as a copy-paste friendly format
    console.log('📋 Copy-paste format:');
    console.log('========================');
    components.forEach(component => {
      console.log(`figmaComponentKey: '${component.key}', // ${component.name}`);
    });
    
  } catch (error) {
    console.error('Error listing components:', error);
  }
}; 