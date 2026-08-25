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

1. **Zero JavaScript nel bundle.** La build non deve contenere file `.js` né
   tag `<script>`. Verifica: `find dist -name "*.js"` deve essere vuoto.
   Le isole Astro restano disponibili, ma servono un motivo reale: se la cosa
   si può fare in CSS o in HTML, si fa in CSS o in HTML. Il filtro per tipo di
   `/lab` è l'esempio del criterio — radio nativi più `:has()`.
2. **Niente terze parti.** Nessuna richiesta deve uscire dal dominio: font,
   stili, script, immagini. I font stanno in `src/assets/fonts/` e passano dal
   blocco `fonts` di `astro.config.mjs`.
3. **Niente analytics.** Se un giorno si aggiunge, va aggiornata `/privacy`
   nello stesso intervento: oggi quella pagina dichiara l'assenza di
   tracciamento e deve restare vera.
4. **Focus visibile su ogni elemento interattivo.** La regola sta in
   `global.css` su `:focus-visible`. Dove il controllo visibile non è
   l'elemento che riceve il focus — card cliccabili, etichette del filtro —
   l'anello va spostato sul contenitore giusto, non tolto.
5. **Responsive fino a 360px**, senza scroll orizzontale.

## Aspetto

Tipografia e colore sono ancora segnaposto neutri: scala di grigi e font di
sistema, tema del codice compreso. Non introdurre palette, font o effetti di
atmosfera finché non arriva la direzione visiva.

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
