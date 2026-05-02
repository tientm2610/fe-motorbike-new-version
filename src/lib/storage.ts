type StorageValue = string | number | boolean | object | null;

class StorageClient {
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  get<T extends StorageValue>(key: string): T | null {
    if (!this.isClient()) return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T extends StorageValue>(key: string, value: T): boolean {
    if (!this.isClient()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key: string): boolean {
    if (!this.isClient()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  clear(): boolean {
    if (!this.isClient()) return false;
    try {
      window.localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new StorageClient();