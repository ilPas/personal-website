# Istruzioni di progetto — erricopasquale.it

Sito personale statico in Astro. Italiano, prima persona.

## Comandi

```
npm run dev      # server di sviluppo su localhost:4321
npm run build    # build statica in dist/
npm run preview  # serve la build
npm run check    # tipi su .astro e .ts
```

Prima di considerare finito un intervento: `npm run build` e `npm run check`
devono passare puliti.

## Vincoli non negoziabili

Questi non sono preferenze. Se un intervento li viola, la soluzione è
sbagliata, non il vincolo.

1. **Una sola isola JavaScript, ed è la scena dell'hero.** Tutto il resto del
   sito è HTML e CSS: se una cosa si può fare in CSS o in HTML, si fa lì. Il
   filtro per tipo di `/lab` è l'esempio del criterio — radio nativi più
   `:has()`. Le pagine interne non caricano un solo byte di JavaScript.

   L'isola usa three.js. È una scelta esplicita: la scena è un raymarch con
   nebbia volumetrica, riflessione e bloom, e il costo della libreria è stato
   accettato in cambio della resa. Le regole che la tengono onesta:

   - **fuori dal percorso critico.** L'LCP è l'headline, che è testo nel DOM.
     I chunk 3D partono dopo l'evento `load`, in tempo morto. Verifica: nella
     timeline delle risorse `three.module` deve iniziare **dopo**
     `loadEventEnd`. Se parte prima, si contende la banda con i font;
   - **un solo script nel bundle iniziale**, l'orchestratore dell'isola:
     ~1,5 KB compressi. Tutto il resto è codice 3D e arriva dopo;
   - **poster prima, canvas poi.** Lo sfondo è un render vero della scena
     (`public/poster/<mood>.webp`, generato da `scripts/build-posters.mjs`).
     Il poster è il background del **`<body>`**, non di un elemento: Chrome
     esclude i background di body/html dai candidati LCP, e questo è l'unico
     modo di avere sia il poster al primo paint sia l'headline come LCP.
     Se lo shader cambia, i poster vanno rigenerati;
   - **nessun gate.** Il contenuto non aspetta mai il 3D. Senza WebGL, con
     lo shader che non compila o senza JavaScript resta il poster;
   - **decorativa.** `aria-hidden`, nessun evento, nessun contenuto dentro;
   - **rispettosa.** Con `prefers-reduced-motion` il canvas non viene creato
     e i chunk 3D non vengono nemmeno scaricati: resta il poster. In pausa
     fuori dallo schermo e a scheda nascosta. DPR tagliato a 1.5, scala
     interna 0.85, frame rate a 40. Se il passo reale resta oltre il doppio
     del tetto, la scena abbassa da sola la risoluzione, due gradini.

2. **Niente terze parti.** Nessuna richiesta deve uscire dal dominio: font,
   stili, script, immagini. I font sono in `public/fonts/` con i loro
   `@font-face` scritti a mano in `src/styles/fonts.css`: scaricati una volta
   da Google Fonts e serviti da qui, mai linkati.
3. **Niente analytics.** Se un giorno si aggiunge, va aggiornata `/privacy`
   nello stesso intervento: oggi quella pagina dichiara l'assenza di
   tracciamento e deve restare vera.
4. **Focus visibile su ogni elemento interattivo.** La regola sta in
   `global.css` su `:focus-visible`. Dove il controllo visibile non è
   l'elemento che riceve il focus — card cliccabili, etichette del filtro —
   l'anello va spostato sul contenitore giusto, non tolto.
5. **Responsive fino a 360px**, senza scroll orizzontale.

## Direzione visiva

Una scena sola per tutto il sito: fondo nero quasi puro, una sorgente
luminosa, nebbia intorno, acqua sotto con caustiche. Quello che cambia da una
sezione all'altra è il **mood** — colore d'accento e temperatura della luce.
**Mai il layout.**

I quattro mood stanno in `global.css` come blocchi di custom property
(`abisso`, `secca`, `deriva`, `fosforo`) e si applicano con `data-mood` su
`<html>`; l'assegnazione mood → sezione è in `src/consts.ts`. Lo shader legge
`--light-core`, `--light-halo` e `--accent` da lì: tipografia e luce cambiano
insieme, da un punto solo.

⚠️ **I quattro accenti sono una proposta, non il brief.** Sono derivati dal
materiale — luce che attraversa l'acqua a profondità e temperature diverse —
perché il brief di riferimento non è mai arrivato. Quando arriva, si
sostituiscono i quattro blocchi in `global.css` e basta: nient'altro nel sito
nomina un colore d'accento.

**Regole di composizione**, prese dai riferimenti e da rispettare:

- occhiello in accento sopra il titolo;
- **una sola** parola del titolo in accento. Una;
- micro-testo in basso a sinistra, con filetto d'accento sopra;
- la sorgente luminosa sta fuori dalla colonna di testo. La sua x è una
  frazione della **mezza-larghezza**, non dell'altezza, o su una banda bassa
  e larga finisce in mezzo al titolo.

**Tipografia off-grid.** Syne per il display, Space Grotesk per il testo,
Space Mono per micro-testo e codice — tutti in `public/fonts/`, serviti dal
dominio. L'off-grid è dichiarativo: `--shift` sposta ogni riga del titolo di
una quantità **irregolare**, e occhiello, testo e comandi vivono su assi
diversi fra loro. Due vincoli da non perdere:

1. lo scarto non porta mai il testo fuori dal contenitore. Fuori dal
   contenitore non è composizione, è un difetto: la riga più a sinistra è
   quella a scarto zero, le altre rientrano;
2. sotto i 48rem gli scarti vanno a zero. In colonna stretta non è una
   scelta compositiva, è solo testo che non si allinea.

**Da non replicare** dai riferimenti: preloader-gate, navigazione a
trascinamento, registro da agency.

**Come si verifica il contrasto.** Il testo sta sopra una scena che si muove,
quindi il contrasto va misurato, non stimato. Il metodo che funziona:
rendere trasparenti i **glifi** (non nascondere gli elementi, o sparisce
anche il velo che li protegge), catturare la scena, e misurare la luminanza
peggiore sotto i rettangoli dei **nodi di testo** — non il box dell'elemento,
che per un titolo è largo quanto la colonna anche dove non c'è inchiostro.
Misurato male, questo controllo dà numeri falsi in entrambe le direzioni.

## Contenuti

Due collection in `src/content/`, schema in `src/content.config.ts`. Il nome
del file è lo slug: `src/content/feed/mieti.md` → `/lab/mieti`.

- **`work`** — case study. Corpo lungo, uno per progetto.
- **`feed`** — entry brevi. `type` è `build`, `lab` o `talk`.

`draft: true` mostra la entry in `npm run dev` e la esclude dalla produzione.

`/lab` è un elenco cronologico a colonna singola, non una griglia: deve reggere
anche con due sole voci. Le copertine sono opzionali e non lasciano mai
riquadri vuoti quando mancano.

Scrivi contenuti reali o chiedi i dettagli che mancano. Non inventare clienti,
date, numeri o link.

## Convenzione: changelog nel feed

Il feed è anche il changelog del sito. **A ogni task completato che modifica il
sito, aggiungi una entry `type: build`** in `src/content/feed/`.

Cosa ci va dentro: quello che è successo davvero in quella sessione, pescato
dal log. Le decisioni prese, i vincoli che le hanno guidate, quello che si è
scelto di non fare. Se un intervento ha avuto un compromesso, dillo.

**Come si scrive.** Prima persona. Tono diretto e concreto, come raccontandolo
a qualcuno che sa leggere il codice. Niente release note aziendali: nessun
"siamo lieti di annunciare", nessun elenco puntato di feature, nessun numero di
versione, nessun superlativo.

```
✗ "Rilasciata la nuova sezione Lab con sistema di filtraggio avanzato
   e performance ottimizzate."

✓ "Ho rifatto /lab come elenco cronologico a colonna singola. Il filtro
   per tipo è di radio nativi più :has(): niente JavaScript, e con un
   solo tipo presente sparisce del tutto."
```

**Frontmatter.** `type: build`, `date` del giorno in cui il lavoro è finito,
`excerpt` di una riga che dice la cosa concreta, `tags` con la tecnologia o
l'area toccata. `links` solo se c'è davvero qualcosa da linkare.

**Quando non scriverla.** I task banali non meritano una entry: refusi, bump di
dipendenze, riformattazioni, ritocchi di copy, correzioni di un link. Se dopo
l'intervento non sapresti cosa raccontare oltre "ho sistemato una cosa", non
scriverla. Una entry per task, non una per commit.
