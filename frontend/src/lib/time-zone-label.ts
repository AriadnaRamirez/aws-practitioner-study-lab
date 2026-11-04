const CITY_NAMES: Record<string, string> = {
  Mexico_City: "Ciudad de México",
  Cancun: "Cancún",
  Merida: "Mérida",
  Bogota: "Bogotá",
  Sao_Paulo: "São Paulo",
  New_York: "Nueva York",
  Los_Angeles: "Los Ángeles",
  Buenos_Aires: "Buenos Aires",
};

/** "America/Mexico_City" → "Ciudad de México (GMT-6)". */
export function timeZoneLabel(timeZone: string, at: Date = new Date()): string {
  const raw = timeZone.split("/").pop() ?? timeZone;
  const city = CITY_NAMES[raw] ?? raw.replace(/_/g, " ");
  try {
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value;
    return offset && offset !== city ? `${city} (${offset})` : city;
  } catch {
    return city;
  }
}
