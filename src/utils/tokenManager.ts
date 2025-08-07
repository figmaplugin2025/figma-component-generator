// Secure token management for Figma plugin
export class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;

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
    if (this.token) {
      return this.token;
    }

    // Try environment variable first
    const envToken = this.getEnvToken();
    if (envToken) {
      this.token = envToken;
      return this.token;
    }

    // Try local storage
    const storedToken = this.getStoredToken();
    if (storedToken) {
      this.token = storedToken;
      return this.token;
    }

    // Request from user
    const userToken = await this.requestTokenFromUser();
    if (userToken) {
      this.storeToken(userToken);
      this.token = userToken;
      return this.token;
    }

    throw new Error('No Figma token available');
  }

  private getEnvToken(): string | null {
    // In Figma plugin context, environment variables might not be available
    // This is a fallback for development
    return null;
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('figma_token');
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    try {
      localStorage.setItem('figma_token', token);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  private async requestTokenFromUser(): Promise<string | null> {
    return new Promise((resolve) => {
      const token = prompt(
        'Please enter your Figma access token:\n\n' +
        '1. Go to Figma → Settings → Account → Personal access tokens\n' +
        '2. Generate a new token\n' +
        '3. Paste it here:'
      );
      resolve(token || null);
    });
  }

  /**
   * Clear stored token (for security)
   */
  public clearToken(): void {
    this.token = null;
    try {
      localStorage.removeItem('figma_token');
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Validate token format
   */
  public isValidToken(token: string): boolean {
    return token.startsWith('figd_') && token.length > 20;
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();
