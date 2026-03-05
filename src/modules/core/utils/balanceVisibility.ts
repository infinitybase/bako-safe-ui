/**
 * Balance Visibility Utilities
 * Manages localStorage persistence for balance visibility state
 */

const BALANCE_VISIBILITY_KEY = '@bakosafe/balance-is-visible';

/**
 * Retrieves the balance visibility state from localStorage
 * @returns {boolean} Whether the balance should be visible
 */
export const getBalanceVisibility = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  return localStorage.getItem(BALANCE_VISIBILITY_KEY) === 'true';
};

/**
 * Sets the balance visibility state in localStorage
 * @param {boolean} isVisible - Whether the balance should be visible
 */
export const setBalanceVisibility = (isVisible: boolean): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  localStorage.setItem(BALANCE_VISIBILITY_KEY, isVisible ? 'true' : 'false');
};
