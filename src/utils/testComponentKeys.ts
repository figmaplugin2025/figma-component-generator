// Utility to test component keys
export const testComponentKey = async (componentKey: string) => {
  try {
    // This will be called from the main thread
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        pluginMessage: {
          type: 'test-component-key',
          componentKey: componentKey
        }
      }, '*');
    }
  } catch (error) {
    console.error('Error testing component key:', error);
  }
};

// Function to validate component key format
export const isValidComponentKey = (key: string): boolean => {
  // Component keys typically follow the pattern: numbers separated by colons
  const componentKeyPattern = /^\d+(:\d+)*$/;
  return componentKeyPattern.test(key);
};

// Function to extract component key from Figma URL
export const extractComponentKeyFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const nodeId = urlObj.searchParams.get('node-id');
    return nodeId;
  } catch (error) {
    console.error('Error extracting component key from URL:', error);
    return null;
  }
}; 