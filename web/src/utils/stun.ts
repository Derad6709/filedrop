export interface StunPreset {
  id: string;
  name: string;
  urls: string[];
}

export const STUN_PRESETS: StunPreset[] = [
  {
    id: 'google',
    name: 'Google STUN',
    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare STUN',
    urls: ['stun:stun.cloudflare.com:3478'],
  },
  {
    id: 'custom',
    name: 'Custom',
    urls: [],
  },
];

export const DEFAULT_STUN_PRESET = 'google';

/**
 * Validates a STUN URL
 * @param url STUN URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidStunUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim();
  
  // Check for stun: or stuns: scheme
  if (!trimmed.match(/^stuns?:/i)) {
    return false;
  }

  try {
    // Parse the URL format: stun:host[:port] or stuns:host[:port]
    const match = trimmed.match(/^(stuns?):\/\/([^:/\s]+)(?::(\d+))?$/i);
    if (!match) {
      return false;
    }

    const [, , host, port] = match;
    
    // Validate host is present
    if (!host || host.length === 0) {
      return false;
    }

    // Validate port if present
    if (port) {
      const portNum = parseInt(port, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes a STUN URL by ensuring it has the proper format
 * @param url STUN URL to normalize
 * @returns Normalized URL or original if already valid
 */
export function normalizeStunUrl(url: string): string {
  if (!url) {
    return url;
  }

  const trimmed = url.trim();
  
  // If it already has stun:// or stuns://, return as-is
  if (trimmed.match(/^stuns?:\/\//i)) {
    return trimmed;
  }

  // If it has stun: or stuns: without //, add it
  if (trimmed.match(/^stuns?:/i)) {
    return trimmed.replace(/^(stuns?):/i, '$1://');
  }

  // Otherwise, assume it's just host:port and add stun://
  return `stun://${trimmed}`;
}

/**
 * Gets the STUN preset by ID
 * @param id Preset ID
 * @returns StunPreset or undefined
 */
export function getStunPresetById(id: string): StunPreset | undefined {
  return STUN_PRESETS.find(preset => preset.id === id);
}

/**
 * Gets ICE servers configuration from preset ID and custom URLs
 * @param presetId Selected preset ID
 * @param customUrls Custom STUN URLs (used when preset is 'custom')
 * @returns Array of RTCIceServer configurations
 */
export function getIceServers(
  presetId: string,
  customUrls: string[]
): RTCIceServer[] {
  if (presetId === 'custom' && customUrls.length > 0) {
    const validUrls = customUrls.filter(url => isValidStunUrl(url));
    if (validUrls.length > 0) {
      return [{ urls: validUrls }];
    }
  }

  const preset = getStunPresetById(presetId);
  if (preset && preset.urls.length > 0) {
    return [{ urls: preset.urls }];
  }

  // Fallback to default Google STUN
  const defaultPreset = getStunPresetById(DEFAULT_STUN_PRESET);
  return defaultPreset ? [{ urls: defaultPreset.urls }] : [];
}
