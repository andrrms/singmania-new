import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const prefersReducedMotion = ref(true);
  const navigatorPrefersReducedMotion = usePreferredReducedMotion();

  watch(navigatorPrefersReducedMotion, (newValue) => {
    prefersReducedMotion.value = newValue === 'reduce';
  });

  function setPreferredMotion(value: 'normal' | 'reduced') {
    if (value === 'reduced') {
      prefersReducedMotion.value = true;
    } else {
      prefersReducedMotion.value = false;
    }
  }

  return {
    prefersReducedMotion,
    setPreferredMotion,
  }
});
