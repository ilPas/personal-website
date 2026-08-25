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
