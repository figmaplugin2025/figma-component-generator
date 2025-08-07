// Plugin Versioning System
export interface PluginVersion {
  version: string;
  date: string;
  description: string;
  changes: string[];
  isStable: boolean;
  isCurrent: boolean;
}

export interface ComponentVersion {
  componentId: string;
  componentName: string;
  version: string;
  lastUpdated: string;
  changes: string[];
  figmaComponentKey: string;
}

export interface GenerationMethod {
  id: string;
  name: string;
  description: string;
  isWorking: boolean;
  lastTested: string;
  notes: string;
}

// Plugin Version History
export const PLUGIN_VERSIONS: PluginVersion[] = [
  {
    version: "1.0.0",
    date: "2024-01-01",
    description: "Initial plugin setup",
    changes: [
      "Basic component import functionality",
      "Simple UI for component display",
      "Firebase integration for storage"
    ],
    isStable: true,
    isCurrent: false
  },
  {
    version: "1.1.0", 
    date: "2024-01-05",
    description: "Added component grouping",
    changes: [
      "Group components by master name",
      "Show 1 card per master component",
      "Updated UI to display grouped components"
    ],
    isStable: true,
    isCurrent: false
  },
  {
    version: "1.2.0",
    date: "2024-01-10", 
    description: "Component generation improvements",
    changes: [
      "Added generation logic for master components",
      "Fixed data flow between components",
      "Updated interfaces for master component data"
    ],
    isStable: true,
    isCurrent: false
  },
  {
    version: "1.3.0",
    date: "2024-01-15",
    description: "Fixed component generation with detachInstance()",
    changes: [
      "Replaced complex cloning with detachInstance()",
      "Fixed dark/light theme preservation",
      "Improved timing of detachment process",
      "Perfect visual fidelity achieved"
    ],
    isStable: true,
    isCurrent: false
  },
  {
    version: "1.4.0",
    date: "2024-01-20",
    description: "Enhanced UI with standardized buttons and customization system",
    changes: [
      "Standardized primary and secondary button styles",
      "Added reset functionality for customizations",
      "Implemented customization token system with change counting",
      "Added CustomModuleChoice component for mode selection",
      "Enhanced dropdown functionality in CustomModule",
      "Updated navigation background to light gray (#F9F9F9)",
      "Improved button layout with proper flex properties",
      "Added real-time customization count tracking",
      "Enhanced user experience with toggle functionality"
    ],
    isStable: true,
    isCurrent: true
  }
];

// Component Generation Methods History
export const GENERATION_METHODS: GenerationMethod[] = [
  {
    id: "basic-clone",
    name: "Basic Clone",
    description: "Simple child.clone() without property copying",
    isWorking: false,
    lastTested: "2024-01-10",
    notes: "Lost visual properties, missing dark themes"
  },
  {
    id: "deep-clone", 
    name: "Deep Clone with Properties",
    description: "Manual copying of all visual properties",
    isWorking: false,
    lastTested: "2024-01-12",
    notes: "Complex code, error-prone, timing issues"
  },
  {
    id: "detach-instance",
    name: "detachInstance() Method",
    description: "Figma's built-in instance detachment",
    isWorking: true,
    lastTested: "2024-01-15", 
    notes: "Perfect! Preserves all properties automatically"
  }
];

// Current Plugin Configuration
export const CURRENT_PLUGIN_CONFIG = {
  version: "1.3.0",
  stableVersion: "1.3.0",
  experimentalVersion: "1.4.0",
  lastUpdated: "2024-01-15",
  features: {
    componentGrouping: true,
    masterComponentGeneration: true,
    visualFidelity: true,
    autoLayoutPreservation: true
  }
};

// Version Management Functions
export class VersionManager {
  static getCurrentVersion(): PluginVersion {
    return PLUGIN_VERSIONS.find(v => v.isCurrent) || PLUGIN_VERSIONS[PLUGIN_VERSIONS.length - 1];
  }

  static getStableVersions(): PluginVersion[] {
    return PLUGIN_VERSIONS.filter(v => v.isStable);
  }

  static getVersionHistory(): PluginVersion[] {
    return [...PLUGIN_VERSIONS].reverse(); // Most recent first
  }

  static getWorkingGenerationMethod(): GenerationMethod {
    return GENERATION_METHODS.find(m => m.isWorking) || GENERATION_METHODS[GENERATION_METHODS.length - 1];
  }

  static getGenerationHistory(): GenerationMethod[] {
    return [...GENERATION_METHODS].reverse();
  }

  static isVersionStable(version: string): boolean {
    const versionInfo = PLUGIN_VERSIONS.find(v => v.version === version);
    return versionInfo?.isStable || false;
  }

  static getVersionInfo(version: string): PluginVersion | undefined {
    return PLUGIN_VERSIONS.find(v => v.version === version);
  }

  static getLatestChanges(): string[] {
    const current = this.getCurrentVersion();
    return current.changes;
  }

  static getFeatureStatus(): Record<string, boolean> {
    return CURRENT_PLUGIN_CONFIG.features;
  }
}

// Component Version Tracking
export class ComponentVersionTracker {
  private static componentVersions: Map<string, ComponentVersion> = new Map();

  static trackComponent(componentId: string, componentName: string, figmaComponentKey: string, changes: string[] = []): void {
    const version: ComponentVersion = {
      componentId,
      componentName,
      version: CURRENT_PLUGIN_CONFIG.version,
      lastUpdated: new Date().toISOString(),
      changes,
      figmaComponentKey
    };

    this.componentVersions.set(componentId, version);
  }

  static getComponentVersion(componentId: string): ComponentVersion | undefined {
    return this.componentVersions.get(componentId);
  }

  static getAllComponentVersions(): ComponentVersion[] {
    return Array.from(this.componentVersions.values());
  }

  static updateComponentChanges(componentId: string, changes: string[]): void {
    const version = this.componentVersions.get(componentId);
    if (version) {
      version.changes = [...version.changes, ...changes];
      version.lastUpdated = new Date().toISOString();
      version.version = CURRENT_PLUGIN_CONFIG.version;
    }
  }
}

// Version Display Utilities
export const formatVersionInfo = (version: PluginVersion): string => {
  return `${version.version} (${version.date}) - ${version.description}`;
};

export const formatGenerationMethod = (method: GenerationMethod): string => {
  const status = method.isWorking ? "✅ Working" : "❌ Failed";
  return `${method.name} - ${status} (${method.lastTested})`;
};

// Export for use in components
export default {
  VersionManager,
  ComponentVersionTracker,
  PLUGIN_VERSIONS,
  GENERATION_METHODS,
  CURRENT_PLUGIN_CONFIG,
  formatVersionInfo,
  formatGenerationMethod
}; 