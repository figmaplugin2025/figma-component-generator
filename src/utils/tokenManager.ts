// Secure token management for Figma plugin
export class TokenManager {
  private static instance: TokenManager;
  private figmaToken: string | null = null;
  private githubToken: string | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Get the Figma access token securely
   * Priority: Environment variable > Local storage > User input
   */
  public async getFigmaToken(): Promise<string> {
    if (this.figmaToken) {
      return this.figmaToken;
    }

    // Try environment variable first
    const envToken = this.getEnvToken('FIGMA_ACCESS_TOKEN');
    if (envToken) {
      this.figmaToken = envToken;
      return this.figmaToken;
    }

    // Try local storage
    const storedToken = this.getStoredToken('figma_token');
    if (storedToken) {
      this.figmaToken = storedToken;
      return this.figmaToken;
    }

    // Request from user
    const userToken = await this.requestTokenFromUser('Figma');
    if (userToken) {
      this.storeToken('figma_token', userToken);
      this.figmaToken = userToken;
      return this.figmaToken;
    }

    throw new Error('No Figma token available');
  }

  /**
   * Get the GitHub access token securely
   * Priority: Environment variable > Local storage > User input
   */
  public async getGitHubToken(): Promise<string> {
    if (this.githubToken) {
      return this.githubToken;
    }

    // Try environment variable first
    const envToken = this.getEnvToken('GITHUB_ACCESS_TOKEN');
    if (envToken) {
      this.githubToken = envToken;
      return this.githubToken;
    }

    // Try local storage
    const storedToken = this.getStoredToken('github_token');
    if (storedToken) {
      this.githubToken = storedToken;
      return this.githubToken;
    }

    // Request from user
    const userToken = await this.requestTokenFromUser('GitHub');
    if (userToken) {
      this.storeToken('github_token', userToken);
      this.githubToken = userToken;
      return this.githubToken;
    }

    throw new Error('No GitHub token available');
  }

  private getEnvToken(key: string): string | null {
    // In Figma plugin context, environment variables might not be available
    // This is a fallback for development
    return null;
  }

  private getStoredToken(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private storeToken(key: string, token: string): void {
    try {
      localStorage.setItem(key, token);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  private async requestTokenFromUser(service: string): Promise<string | null> {
    return new Promise((resolve) => {
      const instructions = service === 'Figma' 
        ? '1. Go to Figma → Settings → Account → Personal access tokens\n2. Generate a new token\n3. Paste it here:'
        : '1. Go to GitHub → Settings → Developer settings → Personal access tokens\n2. Generate a new token\n3. Paste it here:';

      const token = prompt(
        `Please enter your ${service} access token:\n\n${instructions}`
      );
      resolve(token || null);
    });
  }

  /**
   * Clear stored tokens (for security)
   */
  public clearTokens(): void {
    this.figmaToken = null;
    this.githubToken = null;
    try {
      localStorage.removeItem('figma_token');
      localStorage.removeItem('github_token');
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Validate token format
   */
  public isValidFigmaToken(token: string): boolean {
    return token.startsWith('figd_') && token.length > 20;
  }

  public isValidGitHubToken(token: string): boolean {
    return token.startsWith('ghp_') && token.length > 30;
  }

  /**
   * Get token status (for debugging)
   */
  public getTokenStatus(): {
    figma: boolean;
    github: boolean;
  } {
    return {
      figma: !!this.figmaToken,
      github: !!this.githubToken
    };
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();
