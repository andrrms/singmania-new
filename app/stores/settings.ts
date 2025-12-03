import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const prefersReducedMotion = ref(false);
  const navigatorPrefersReducedMotion = usePreferredReducedMotion();
  function setPreferredMotion(value: 'normal' | 'reduced') {
    if (value === 'reduced') {
      prefersReducedMotion.value = true;
    } else {
      prefersReducedMotion.value = false;
    }
  }

  const overallQuality = ref<'low' | 'medium' | 'high'>('high');
  function setOverallQuality(value: 'low' | 'medium' | 'high') {
    overallQuality.value = value;
  }

  watch(navigatorPrefersReducedMotion, (newValue) => {
    prefersReducedMotion.value = newValue === 'reduce';
  });

  return {
    prefersReducedMotion,
    setPreferredMotion,
    overallQuality,
    setOverallQuality,
  }
});
