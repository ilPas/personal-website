import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Le bozze sono visibili in `astro dev` (per poterle rileggere) ma non
 * finiscono mai nella build di produzione, né nelle pagine né in sitemap.
 */
const includeDrafts = import.meta.env.DEV;

const isVisible = (entry: { data: { draft: boolean } }) => includeDrafts || !entry.data.draft;

/** Case study ordinati: prima `order`, a parità di ordine l'anno più recente. */
export async function getWork(): Promise<CollectionEntry<'work'>[]> {
  const entries = await getCollection('work', isVisible);
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

/** Entry del feed dalla più recente alla più vecchia. */
export async function getFeed(): Promise<CollectionEntry<'feed'>[]> {
  const entries = await getCollection('feed', isVisible);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Conteggio delle entry per tipo, usato dal filtro del Lab. */
export function countByType(entries: CollectionEntry<'feed'>[]): Record<string, number> {
  return entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.data.type] = (acc[entry.data.type] ?? 0) + 1;
    return acc;
  }, {});
}

/** Data in formato esteso italiano: "12 marzo 2026". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Data in formato ISO (YYYY-MM-DD) per l'attributo datetime. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
