import { normalizeTimezone } from './timezone.util';

describe('normalizeTimezone', () => {
  it('keeps valid IANA timezones', () => {
    expect(normalizeTimezone('America/Mexico_City')).toBe('America/Mexico_City');
    expect(normalizeTimezone(' Europe/Madrid ')).toBe('Europe/Madrid');
  });

  it('falls back on empty or invalid values', () => {
    expect(normalizeTimezone(undefined)).toBe('UTC');
    expect(normalizeTimezone('')).toBe('UTC');
    expect(normalizeTimezone('Mars/Olympus')).toBe('UTC');
    expect(normalizeTimezone('nope', 'America/Lima')).toBe('America/Lima');
  });
});
