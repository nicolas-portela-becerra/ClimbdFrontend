export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      // storage unavailable (private mode, quota): the app keeps working without persistence
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // see set()
    }
  },
}
