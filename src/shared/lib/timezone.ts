// Time-zone helpers built on Intl.DateTimeFormat (no external dependency).

// The IANA zone the device is currently using; 'UTC' when it can't be determined.
export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

// Offset of `timeZone` at the instant `date`, in minutes east of UTC.
function offsetMinutes(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0')
  // The wall-clock parts, rebuilt as if they were UTC, differ from the instant by the offset.
  const asUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour') % 24,
    value('minute'),
    value('second'),
  )
  return Math.round((asUtc - date.getTime()) / 60000)
}

// Reads a `datetime-local` value ("YYYY-MM-DDTHH:mm", optionally with seconds) as wall-clock
// time in `timeZone` and returns the instant it represents. Invalid input → invalid Date.
export function wallClockToDate(wallClock: string, timeZone: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(wallClock)
  if (!match) return new Date(NaN)
  const [, year, month, day, hour, minute, second] = match
  const asUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? '0'),
  )
  const offset = offsetMinutes(timeZone, new Date(asUtc))
  let instant = asUtc - offset * 60000
  // A DST transition can move the offset between the two readings; recompute once.
  const offset2 = offsetMinutes(timeZone, new Date(instant))
  if (offset2 !== offset) instant = asUtc - offset2 * 60000
  return new Date(instant)
}

// Formats an instant (an ISO string, a Date or a timestamp) in `timeZone`. Falls back to the
// device's zone when `timeZone` is empty or not a valid IANA zone.
export function formatDateTime(iso: string, language: string, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' }
  if (timeZone) {
    try {
      return new Intl.DateTimeFormat(language, { ...options, timeZone }).format(new Date(iso))
    } catch {
      // Unknown zone: fall through to the device's zone.
    }
  }
  return new Intl.DateTimeFormat(language, options).format(new Date(iso))
}

const FALLBACK_TIME_ZONES = [
  'UTC',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Africa/Nairobi',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Caracas',
  'America/Chicago',
  'America/Denver',
  'America/Lima',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Phoenix',
  'America/Santiago',
  'America/Sao_Paulo',
  'America/Toronto',
  'America/Vancouver',
  'Asia/Bangkok',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Karachi',
  'Asia/Kathmandu',
  'Asia/Kolkata',
  'Asia/Kuala_Lumpur',
  'Asia/Manila',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Taipei',
  'Asia/Tokyo',
  'Atlantic/Azores',
  'Atlantic/Canary',
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Athens',
  'Europe/Berlin',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Helsinki',
  'Europe/Istanbul',
  'Europe/Kyiv',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Prague',
  'Europe/Rome',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Vienna',
  'Europe/Warsaw',
  'Europe/Zurich',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'Pacific/Honolulu',
]

// The IANA time zones this device can use, for the gym's zone picker. Prefers the runtime's
// full list, falling back to a curated set where `Intl.supportedValuesOf` is unavailable.
export function ianaTimeZones(): readonly string[] {
  const supported = (Intl as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf
  if (typeof supported === 'function') {
    try {
      const zones = supported.call(Intl, 'timeZone')
      if (Array.isArray(zones) && zones.length > 0) return zones
    } catch {
      // Fall through to the static list.
    }
  }
  return FALLBACK_TIME_ZONES
}
