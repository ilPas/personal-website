---
title: 'Il feed diventa un elenco, e anche il changelog del sito'
date: 2026-08-26
type: build
tags: ['astro', 'css', 'contenuti']
excerpt: 'Via la griglia di card dal feed: con due voci lasciava buchi. Elenco cronologico a colonna singola, filtro che sparisce quando non serve, e il feed che da oggi racconta anche le modifiche al sito.'
draft: false
---

Il feed aveva una griglia di card, ereditata dall'impianto iniziale quando era
pieno di contenuti finti. Con due voci vere una griglia lascia tracce vuote e
si vede. Ora `/lab` e la sezione feed della home sono lo stesso elenco
cronologico a colonna singola.

Un dettaglio che non avevo previsto: il filo separatore va **sopra** ogni voce,
prima compresa. Il filtro per tipo è in CSS, quindi non esiste un momento in
cui il sito sappia quale voce sia la prima visibile — un bordo condizionato
sulla prima lascerebbe righe orfane appena filtri. Metterlo su tutte costa una
riga in cima all'elenco e non si rompe mai.

Il tipo è diventato un'etichetta discreta accanto alla data, senza riquadro. E
con un solo tipo presente nel feed il filtro non viene proprio renderizzato,
invece di mostrare un controllo con un'unica opzione.

Stessa regola per le copertine, ovunque: se l'immagine non c'è non si disegna
niente. All'inizio le card dei case study mettevano un rettangolo grigio al
posto della foto mancante, con l'idea di tenere il ritmo della griglia — ma un
segnaposto che resta lì per mesi non tiene un ritmo, promette un'immagine che
non arriva. Ora spariscono anche dalle card in home e dalle pagine dei case
study.

Ho tolto le nove entry segnaposto e i tre link nei case study che ci
puntavano — sarebbero diventati 404. Al loro posto sono arrivate due entry
reali: il sito di MieTi e l'app di budget.

L'altra cosa aggiunta è una convenzione, in `CLAUDE.md`: il feed è anche il
changelog del sito, e ogni intervento che lo modifica si scrive qui come entry
`build`, in prima persona e pescando da quello che è successo davvero nella
sessione. I task banali no — refusi, bump, riformattazioni. Questa è la prima
scritta sotto quella regola.
