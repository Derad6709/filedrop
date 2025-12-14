import React, { useState } from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { IoAdd, IoClose } from 'react-icons/io5';
import clsx from 'clsx';

import styles from './StunSelector.module.scss';
import { settingsStore } from '../stores/index.js';
import {
  STUN_PRESETS,
  isValidStunUrl,
  normalizeStunUrl,
} from '../utils/stun.js';
import { IconButton } from './IconButton.js';

export const StunSelector: React.FC = observer(() => {
  const { t } = useTranslation();
  const { stunConfig } = settingsStore;
  const [customInput, setCustomInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    settingsStore.updateStunConfig({ presetId });
    setValidationError('');
  };

  const handleAddCustomUrl = () => {
    if (!customInput.trim()) {
      return;
    }

    const normalized = normalizeStunUrl(customInput.trim());
    if (!isValidStunUrl(normalized)) {
      setValidationError(t('stunSelector.invalidUrl'));
      return;
    }

    // Check for duplicates
    if (stunConfig.customUrls.includes(normalized)) {
      setValidationError(t('stunSelector.duplicateUrl'));
      return;
    }

    settingsStore.updateStunConfig({
      customUrls: [...stunConfig.customUrls, normalized],
    });
    setCustomInput('');
    setValidationError('');
  };

  const handleRemoveCustomUrl = (index: number) => {
    const newUrls = stunConfig.customUrls.filter((_, i) => i !== index);
    settingsStore.updateStunConfig({ customUrls: newUrls });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCustomUrl();
    }
  };

  return (
    <div className={styles.stunSelector}>
      <label className={styles.label}>
        <span>{t('stunSelector.label')}</span>
      </label>

      <select
        value={stunConfig.presetId}
        onChange={handlePresetChange}
        className={styles.select}
      >
        {STUN_PRESETS.map(preset => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>

      {stunConfig.presetId === 'custom' && (
        <div className={styles.customSection}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder={t('stunSelector.customPlaceholder')}
              value={customInput}
              onChange={e => {
                setCustomInput(e.target.value);
                setValidationError('');
              }}
              onKeyPress={handleKeyPress}
              className={clsx(styles.input, {
                [styles.error]: validationError,
              })}
            />
            <IconButton
              onClick={handleAddCustomUrl}
              title={t('stunSelector.add')}
              className={styles.addButton}
            >
              <IoAdd />
            </IconButton>
          </div>

          {validationError && (
            <div className={styles.errorMessage}>{validationError}</div>
          )}

          {stunConfig.customUrls.length > 0 && (
            <div className={styles.urlList}>
              {stunConfig.customUrls.map((url, index) => (
                <div key={index} className={styles.urlItem}>
                  <span className={styles.urlText}>{url}</span>
                  <IconButton
                    onClick={() => handleRemoveCustomUrl(index)}
                    title={t('stunSelector.remove')}
                    className={styles.removeButton}
                  >
                    <IoClose />
                  </IconButton>
                </div>
              ))}
            </div>
          )}

          {stunConfig.customUrls.length === 0 && (
            <div className={styles.hint}>{t('stunSelector.hint')}</div>
          )}
        </div>
      )}

      <div className={styles.info}>{t('stunSelector.info')}</div>
    </div>
  );
});
