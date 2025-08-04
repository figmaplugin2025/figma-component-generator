import { useState, useEffect, useCallback } from 'react';
import { componentService, ComponentData } from '../services/componentService';

export const useComponents = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all components
  const fetchComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await componentService.getAllComponents();
      setComponents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch components');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get components by category
  const fetchComponentsByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await componentService.getComponentsByCategory(category);
      setComponents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch components');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get component by ID
  const fetchComponentById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const component = await componentService.getComponentById(id);
      if (component) {
        setComponents([component]);
      } else {
        setComponents([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch component');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create component
  const createComponent = useCallback(async (componentData: Omit<ComponentData, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = await componentService.createComponent(componentData);
      // Refresh the components list
      await fetchComponents();
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create component');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchComponents]);

  // Update component
  const updateComponent = useCallback(async (id: string, updates: Partial<ComponentData>) => {
    setLoading(true);
    setError(null);
    try {
      await componentService.updateComponent(id, updates);
      // Refresh the components list
      await fetchComponents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update component');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchComponents]);

  // Delete component
  const deleteComponent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await componentService.deleteComponent(id);
      // Remove from local state
      setComponents(prev => prev.filter(comp => comp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete component');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Increment generate count
  const incrementGenerateCount = useCallback(async (id: string) => {
    try {
      await componentService.incrementGenerateCount(id);
      // Update local state
      setComponents(prev => prev.map(comp => 
        comp.id === id 
          ? { ...comp, generateCount: (comp.generateCount || 0) + 1 }
          : comp
      ));
    } catch (err) {
      console.error('Failed to increment generate count:', err);
    }
  }, []);

  // Increment download count
  const incrementDownloadCount = useCallback(async (id: string) => {
    try {
      await componentService.incrementDownloadCount(id);
      // Update local state
      setComponents(prev => prev.map(comp => 
        comp.id === id 
          ? { ...comp, downloads: (comp.downloads || 0) + 1 }
          : comp
      ));
    } catch (err) {
      console.error('Failed to increment download count:', err);
    }
  }, []);

  // Search components
  const searchComponents = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await componentService.searchComponents(searchTerm);
      setComponents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search components');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get popular components
  const fetchPopularComponents = useCallback(async (limitCount: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await componentService.getPopularComponents(limitCount);
      setComponents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch popular components');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    components,
    loading,
    error,
    fetchComponents,
    fetchComponentsByCategory,
    fetchComponentById,
    createComponent,
    updateComponent,
    deleteComponent,
    incrementGenerateCount,
    incrementDownloadCount,
    searchComponents,
    fetchPopularComponents,
  };
}; 