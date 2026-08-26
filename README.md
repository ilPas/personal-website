# erricopasquale.it

Sito personale di Pasquale Errico, costruito con [Astro](https://astro.build).
Sito statico, senza JavaScript di framework nel bundle.

## Comandi

| Comando           | Cosa fa                                        |
| ----------------- | ---------------------------------------------- |
| `npm install`     | Installa le dipendenze                         |
| `npm run dev`     | Server di sviluppo su `localhost:4321`         |
| `npm run build`   | Build statica in `dist/`                       |
| `npm run preview` | Serve la build locale                          |
| `npm run check`   | Controllo dei tipi su `.astro` e `.ts`         |

## Struttura

```
src/
├── assets/fonts/     # file dei font self-hosted (per ora vuota)
├── components/       # componenti di interfaccia
├── content/
│   ├── work/         # case study (Markdown)
│   └── feed/         # entry del lab (Markdown)
├── layouts/          # Base (html/head/header/footer) e Page (pagine di testo)
├── lib/content.ts    # lettura e ordinamento delle collection
├── pages/
│   ├── index.astro           # home: hero, chi sono, work, feed
│   ├── about.astro
│   ├── privacy.astro
│   ├── 404.astro
│   ├── lab/index.astro       # feed completo con filtro per tipo
│   ├── lab/[slug].astro
│   └── work/[slug].astro
├── styles/           # global.css (token, reset, prosa) e tema del codice
├── consts.ts         # metadati del sito, navigazione, tipi del feed
└── content.config.ts # schema delle collection
```

## Contenuti

Ogni contenuto è un file Markdown. Il nome del file è lo slug dell'URL:
`src/content/feed/token-semantici.md` diventa `/lab/token-semantici`.

### `work` — case study

```yaml
---
title: 'Titolo del case study'      # obbligatorio
excerpt: 'Una riga di sintesi.'     # obbligatorio, usata nelle card
year: 2025                          # obbligatorio
role: 'Design di prodotto'          # obbligatorio
client: 'Nome o contesto'           # opzionale
tags: ['design system', 'form']     # default []
cover:                              # opzionale
  src: './copertina.jpg'
  alt: "Descrizione dell'immagine"
links:                              # default []
  - label: 'Sito live'
    url: 'https://esempio.it'
order: 1                            # ordinamento in home, crescente
draft: false                        # default false
---
```

### `feed` — entry del lab

```yaml
---
title: 'Titolo della entry'         # obbligatorio
date: 2026-08-18                    # obbligatorio
type: lab                           # build | lab | talk
tags: ['css', 'accessibilità']      # default []
excerpt: 'Una riga di sintesi.'     # obbligatorio
cover:                              # opzionale
  src: './copertina.jpg'
  alt: "Descrizione dell'immagine"
links:                              # default []
  - label: 'Documentazione'
    url: 'https://esempio.it'
draft: false                        # default false
---
```

I tre tipi e le loro etichette sono definiti in `src/consts.ts`. Le `cover`
sono opzionali e, dove mancano, non lasciano alcun riquadro vuoto: né nel feed,
né nelle card dei case study, né nelle pagine di dettaglio.

`/lab` è un elenco cronologico a colonna singola — non una griglia — così regge
anche con due sole voci. Il filtro per tipo compare solo se nel feed c'è più di
un tipo.

Il feed è anche il changelog del sito: gli interventi che modificano il sito
diventano una entry `type: build`. La convenzione, con tono ed esempi, è in
`CLAUDE.md`.

### Bozze

`draft: true` rende la entry visibile in `npm run dev` (con un'etichetta
"Bozza") ma la esclude dalla build di produzione, dalle pagine indice e dalla
sitemap.

## Scelte tecniche

**Zero JavaScript.** Il sito buildato non contiene un solo file `.js` e nessun
tag `<script>`. Il filtro per tipo del lab, che sarebbe il candidato naturale a
diventare un'isola, è fatto di radio nativi e `:has()` in CSS: funziona al
primo paint e si naviga con le frecce come qualunque radiogroup. Le isole
restano disponibili per quando serviranno davvero.

**Niente terze parti.** Nessuna richiesta esce dal dominio: font, stili e
immagini sono tutti serviti da qui.

**Font self-hosted.** In attesa della direzione visiva la tipografia è uno
stack di sistema, che non costa nemmeno una richiesta. Lo slot per i font veri
è già predisposto in `astro.config.mjs` (blocco `fonts`, commentato) e in
`src/assets/fonts/`.

**Nessun analytics.** Voluto. Quando verrà aggiunto va aggiornata anche
`/privacy`, che oggi dichiara l'assenza di tracciamento.

**Focus da tastiera.** Regola unica in `global.css` su `:focus-visible`, con
skip link come primo stop di tabulazione. Dove il controllo visibile non è
l'elemento che riceve il focus — le card cliccabili, le etichette del filtro —
l'anello viene spostato sul contenitore giusto.

**Responsive fino a 360px.** Le griglie usano `minmax(min(100%, …), 1fr)` e la
scala tipografica ha i minimi calibrati su viewport strette. L'header va a capo
invece di nascondersi dietro un menu.

## Cosa è ancora placeholder

- **Tipografia e colore.** `src/styles/global.css` usa una scala di grigi e un
  font di sistema: sono segnaposto neutri, non una direzione visiva.
- **Tema del codice.** `src/styles/code-theme.mjs`, anch'esso in scala di
  grigi, distingue i token con peso e corsivo invece che con la tinta.
- **Favicon.** `public/favicon.svg` è un segno provvisorio.
- **Case study.** I tre contenuti in `src/content/work/` sono di riempimento.
- **Email di contatto.** `SITE.email` in `src/consts.ts` è da confermare.

## Nota sul deploy

Il sito precedente (webpack + three.js) è in `legacy/`, insieme alla sua
configurazione di build e al suo `netlify.toml`. La pipeline di deploy punta
ancora a quella build: va aggiornata a `npm run build` con output `dist/` prima
di mandare online questa versione.

## Autore

Pasquale Errico — [GitHub](https://github.com/ilPas),
[CodePen](https://codepen.io/ilPas)
