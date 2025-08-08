export class LocalStorageConfig {
  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static pushItem(key: string, value: string) {
    const items = LocalStorageConfig.getItem<string[]>(key) || [];
    items.push(value);
    LocalStorageConfig.setItem(key, JSON.stringify(items));
  }

  static getItem<T = string>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
