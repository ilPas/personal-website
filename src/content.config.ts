import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Un URL assoluto oppure un percorso interno che inizia con "/". */
const linkTarget = z.union([z.url(), z.string().regex(/^\/[^\s]*$/, 'Percorso interno non valido')]);

/** Lista di link contestuali: repo, demo, articolo, slide... */
const links = z
  .array(
    z.object({
      label: z.string().min(1),
      url: linkTarget,
    }),
  )
  .default([]);

/**
 * WORK — i case study.
 * Contenuto lungo: il corpo del Markdown è il case study vero e proprio.
 */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      /** Riga di sintesi usata nelle card e come lead nella pagina. */
      excerpt: z.string().min(1),
      /** Anno (o anno di chiusura) del progetto. */
      year: z.number().int().min(1990).max(2100),
      /** Ruolo ricoperto nel progetto. */
      role: z.string().min(1),
      /** Cliente o contesto. Omesso se il progetto è personale. */
      client: z.string().optional(),
      tags: z.array(z.string().min(1)).default([]),
      cover: z.object({ src: image(), alt: z.string().min(1) }).optional(),
      links,
      /** Ordine manuale in home: numeri più bassi vengono prima. */
      order: z.number().int().default(100),
      draft: z.boolean().default(false),
    }),
});

/**
 * FEED — le entry brevi: cose costruite, esperimenti, talk.
 */
const feed = defineCollection({
  loader: glob({ base: './src/content/feed', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      type: z.enum(['build', 'lab', 'talk']),
      tags: z.array(z.string().min(1)).default([]),
      excerpt: z.string().min(1),
      cover: z.object({ src: image(), alt: z.string().min(1) }).optional(),
      links,
      draft: z.boolean().default(false),
    }),
});

export const collections = { work, feed };
