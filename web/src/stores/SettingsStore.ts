import { autorun, makeAutoObservable } from 'mobx';
import { getItem, setItem } from '../utils/storage.js';
import { DEFAULT_STUN_PRESET } from '../utils/stun.js';

type Settings = Record<keyof typeof DEFAULT_SETTINGS, boolean>;

const DEFAULT_SETTINGS = {
  autoAccept: false,
  autoDownload: true,
  displayIcons: false,
};

export interface StunConfig {
  presetId: string;
  customUrls: string[];
}

const DEFAULT_STUN_CONFIG: StunConfig = {
  presetId: DEFAULT_STUN_PRESET,
  customUrls: [],
};

export class SettingsStore {
  keys = Object.keys(DEFAULT_SETTINGS);
  settings: Settings = {
    ...DEFAULT_SETTINGS,
    ...getItem('settings', {}),
  };

  stunConfig: StunConfig = {
    ...DEFAULT_STUN_CONFIG,
    ...getItem('stunConfig', {}),
  };

  constructor() {
    makeAutoObservable(this);

    autorun(() => {
      setItem('settings', this.settings);
    });

    autorun(() => {
      setItem('stunConfig', this.stunConfig);
    });
  }

  updateStunConfig(config: Partial<StunConfig>) {
    this.stunConfig = {
      ...this.stunConfig,
      ...config,
    };
  }
}

export const settingsStore = new SettingsStore();
