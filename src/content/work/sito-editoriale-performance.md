---
title: 'Un sito editoriale che carica anche in galleria'
excerpt: 'Ricostruzione di un magazine online con un budget di performance dichiarato prima di scrivere la prima riga di codice.'
year: 2023
role: 'Front-end e performance'
tags: ['performance', 'html', 'css']
order: 3
links:
  - label: 'Nota: il budget di performance come vincolo di progetto'
    url: '/lab/budget-performance'
draft: false
---

## Il vincolo

Buona parte dei lettori arrivava da mobile, spesso in condizioni di rete
mediocri. Il sito precedente pesava oltre due megabyte per articolo, quasi tutti
JavaScript, e il testo compariva dopo diversi secondi.

Abbiamo fissato un budget prima di iniziare: **100 KB** trasferiti per una
pagina articolo, immagini escluse, e nessun blocco del rendering oltre il CSS
critico.

## Le decisioni

Il budget ha reso quasi tutte le scelte successive automatiche.

- HTML generato in fase di build, niente rendering lato client.
- Nessun framework UI: gli unici comportamenti interattivi sono due, entrambi
  scritti in JavaScript nativo e caricati solo dove servono.
- Font serviti dal nostro dominio, con `font-display: swap` e fallback metrici
  calibrati per evitare lo spostamento del testo.
- Immagini in formati moderni, dimensioni esplicite in pagina per non far
  saltare il layout durante il caricamento.

## Il compromesso

La galleria fotografica era l'unico punto in cui il budget rischiava di saltare.
La soluzione non è stata ottimizzare la galleria, ma cambiarne il
comportamento: le prime due immagini sono nel documento, il resto arriva solo
quando il lettore lo chiede esplicitamente.

Non è la scelta più spettacolare. È quella che tiene la pagina leggibile in
metropolitana.

## Risultato

La pagina articolo si è assestata sotto il budget, con il contenuto testuale
leggibile al primo paint. Il dato che ha convinto la redazione non è stato un
punteggio sintetico, ma il tempo di lettura medio dei lettori su connessione
lenta, che è tornato in linea con quello degli altri.
