const storageKey = "ttm_token";

export const tokenStore = {
  get: () => localStorage.getItem(storageKey),
  set: (token: string) => localStorage.setItem(storageKey, token),
  clear: () => localStorage.removeItem(storageKey)
};
