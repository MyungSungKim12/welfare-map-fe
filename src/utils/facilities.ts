import type { Facility } from '@/types/welfare';

export interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  distance?: string;
}

export interface FacilityQuery {
  query: string;
  label: string;
}

export const FACILITY_QUERIES: FacilityQuery[] = [
  { query: '복지관', label: '복지관' },
  { query: '주민센터', label: '주민센터' },
  { query: '보건소', label: '보건소' },
  { query: '노인복지관', label: '노인복지관' },
  { query: '장애인복지관', label: '장애인복지관' },
  { query: '어린이집', label: '어린이집' },
];

const CATEGORY_FALLBACK = '복지시설';

export function inferFacilityCategory(rawCategory: string, fallback: string): string {
  const tail = rawCategory.split('>').map((part) => part.trim()).filter(Boolean).pop();
  if (tail) return tail;
  return fallback || CATEGORY_FALLBACK;
}

export function documentToFacility(doc: KakaoPlaceDocument, fallbackLabel: string): Facility | null {
  const lat = Number(doc.y);
  const lng = Number(doc.x);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (!doc.id || !doc.place_name) return null;

  const distance = Number(doc.distance);
  return {
    id: doc.id,
    name: doc.place_name,
    category: inferFacilityCategory(doc.category_name, fallbackLabel),
    rawCategory: doc.category_name,
    lat,
    lng,
    address: doc.road_address_name || doc.address_name || '',
    phone: doc.phone || '',
    placeUrl: doc.place_url || '',
    distance: Number.isFinite(distance) ? distance : 0,
  };
}

export function dedupeFacilities(items: Facility[]): Facility[] {
  const seen = new Set<string>();
  const result: Facility[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

export function sortByDistance(items: Facility[]): Facility[] {
  return [...items].sort((a, b) => a.distance - b.distance);
}

export function mergeFacilityResults(groups: Array<{ docs: KakaoPlaceDocument[]; label: string }>): Facility[] {
  const all: Facility[] = [];
  for (const group of groups) {
    for (const doc of group.docs) {
      const facility = documentToFacility(doc, group.label);
      if (facility) all.push(facility);
    }
  }
  return sortByDistance(dedupeFacilities(all));
}
