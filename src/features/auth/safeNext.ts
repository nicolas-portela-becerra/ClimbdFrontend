// Where to go after logging in. Only same-origin paths are accepted, to avoid open redirects: the value
// is resolved like the browser would (so `/\evil.com` or `/\t/evil.com` are caught) and its origin compared.
export function safeNext(next: string | null, origin = window.location.origin): string {
  if (!next) return '/gyms'
  let url: URL
  try {
    url = new URL(next, origin)
  } catch {
    return '/gyms'
  }
  if (url.origin !== origin || url.pathname.startsWith('/login')) return '/gyms'
  return url.pathname + url.search + url.hash
}
