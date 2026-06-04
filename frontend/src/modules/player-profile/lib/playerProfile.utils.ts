import type { FaceitRawObject } from "../../../types/faceit.interface";

export function getStats(data: unknown): Array<[string, unknown]> {
  if (!isRecord(data)) return [];

  const lifetime = data.lifetime;
  if (isRecord(lifetime)) {
    return Object.entries(lifetime);
  }

  return Object.entries(data).filter(([, value]) => !isRecord(value));
}

export function getItems(data: unknown): FaceitRawObject[] {
  if (!isRecord(data) || !Array.isArray(data.items)) return [];

  return data.items.filter(isRecord);
}

export function getStableKey(item: FaceitRawObject, index: number) {
  const id = item.match_id ?? item.team_id ?? item.hub_id ?? item.id;

  return typeof id === "string" ? id : String(index);
}

export function isRecord(value: unknown): value is FaceitRawObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") {
    const timestamp = Number(value);
    if (Number.isFinite(timestamp) && timestamp > 1_000_000_000) {
      return new Date(timestamp * 1000).toLocaleDateString();
    }

    return value;
  }

  return JSON.stringify(value);
}
