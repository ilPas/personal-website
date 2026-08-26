/**
 * Costanti del sito.
 * Testi e metadati centralizzati: le pagine non hardcodano stringhe globali.
 */

export const SITE = {
  /** Nome usato nei <title> e nell'header. */
  name: 'Pasquale Errico',
  /** Sottotitolo breve, usato come fallback di descrizione. */
  tagline: 'Designer e sviluppatore front-end',
  /** Descrizione di default per SEO e Open Graph. */
  description:
    'Sito personale di Pasquale Errico: case study, appunti di lavoro ed esperimenti su interfacce, front-end e design di prodotto.',
  lang: 'it',
  locale: 'it_IT',
  /** Email di contatto pubblica. PLACEHOLDER: da confermare. */
  email: 'ciao@erricopasquale.it',
} as const;

/** Navigazione principale. */
export const NAV = [
  { href: '/#work', label: 'Work' },
  { href: '/lab', label: 'Lab' },
  { href: '/about', label: 'About' },
] as const;

/** Link esterni mostrati nel footer. */
export const SOCIAL = [
  { href: 'https://github.com/ilPas', label: 'GitHub' },
  { href: 'https://codepen.io/ilPas', label: 'CodePen' },
  { href: 'https://twitter.com/ilPas_', label: 'Twitter' },
] as const;

/** Tipi ammessi per le entry del feed, con etichetta leggibile. */
export const FEED_TYPES = {
  build: { label: 'Build', description: 'Cose costruite e spedite' },
  lab: { label: 'Lab', description: 'Esperimenti e prove tecniche' },
  talk: { label: 'Talk', description: 'Interventi, scritti e conversazioni' },
} as const;

export type FeedType = keyof typeof FEED_TYPES;

/** Quante voci mostrare nelle sezioni della home. */
export const HOME_WORK_LIMIT = 3;
export const HOME_FEED_LIMIT = 6;

/**
 * I quattro mood.
 *
 * Sono quattro qualità di luce sulla stessa scena: cambiano il colore
 * d'accento e la temperatura della sorgente, mai il layout. I valori
 * cromatici vivono in `global.css`, in quattro blocchi di custom property;
 * qui c'è solo l'assegnazione mood → sezione del sito.
 */
export const MOODS = ['abisso', 'secca', 'deriva', 'fosforo'] as const;

export type Mood = (typeof MOODS)[number];

export const MOOD_BY_SECTION = {
  home: 'abisso',
  work: 'secca',
  lab: 'fosforo',
  pagina: 'deriva',
} as const satisfies Record<string, Mood>;
