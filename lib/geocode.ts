import { CityKey, CITIES } from "./data";

// Geocode submitted cross-streets with OpenStreetMap's Nominatim. Free, no
// key; we send a descriptive User-Agent per their usage policy. Returns null
// on any failure so callers can fall back to the neighborhood centroid.
export async function geocodeCross(
  cross: string,
  city: CityKey
): Promise<{ lat: number; lng: number } | null> {
  const q = (cross || "").trim();
  if (q.length < 3) return null;

  const region = city === "honolulu" ? "Honolulu, Hawaii" : city === "postfalls" ? "Post Falls, Idaho" : "Spokane, Washington";
  const center = CITIES[city].center;
  const normalized = q.replace(/&/g, " and ").replace(/\s+/g, " ");

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
      encodeURIComponent(`${normalized}, ${region}`);
    const res = await fetch(url, {
      headers: { "User-Agent": "GoodNewsBadNews/1.0 (civic signal platform; contact via site)" },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || !data[0]) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (!isFinite(lat) || !isFinite(lng)) return null;
    // Sanity: the result must actually be in/near the city (~40km box),
    // so a bad geocode can't fling a pin to another state.
    if (Math.abs(lat - center[0]) > 0.4 || Math.abs(lng - center[1]) > 0.5) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
