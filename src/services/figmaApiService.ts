import { tokenManager } from '../utils/tokenManager';

// Secure Figma API service
export class FigmaApiService {
  private static instance: FigmaApiService;
  private baseUrl = 'https://api.figma.com/v1';

  private constructor() {}

  public static getInstance(): FigmaApiService {
    if (!FigmaApiService.instance) {
      FigmaApiService.instance = new FigmaApiService();
    }
    return FigmaApiService.instance;
  }

  /**
   * Get file information from Figma API
   */
  public async getFile(fileKey: string): Promise<any> {
    const token = await tokenManager.getFigmaToken();
    
    const response = await fetch(`${this.baseUrl}/files/${fileKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get file images from Figma API
   */
  public async getFileImages(fileKey: string, nodeIds: string[]): Promise<any> {
    const token = await tokenManager.getFigmaToken();
    
    const params = new URLSearchParams({
      ids: nodeIds.join(','),
      format: 'png',
      scale: '2'
    });

    const response = await fetch(`${this.baseUrl}/images/${fileKey}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get team projects (requires team access)
   */
  public async getTeamProjects(teamId: string): Promise<any> {
    const token = await tokenManager.getFigmaToken();
    
    const response = await fetch(`${this.baseUrl}/teams/${teamId}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get project files
   */
  public async getProjectFiles(projectId: string): Promise<any> {
    const token = await tokenManager.getFigmaToken();
    
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/files`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Validate token by making a simple API call
   */
  public async validateToken(): Promise<boolean> {
    try {
      const token = await tokenManager.getFigmaToken();
      
      // Make a simple API call to validate the token
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const figmaApiService = FigmaApiService.getInstance();
