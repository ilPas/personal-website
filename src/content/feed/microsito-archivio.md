---
title: 'Un microsito per un archivio fotografico di famiglia'
date: 2026-06-10
type: build
tags: ['astro', 'immagini', 'progetti personali']
excerpt: 'Quattrocento scatti scansionati, un indice navigabile e una regola: niente deve dipendere da un servizio che tra dieci anni potrebbe non esistere.'
draft: false
---

Ho passato un inverno a scansionare le fotografie di famiglia. Il problema
successivo era renderle consultabili senza affidarle a una piattaforma.

## Il vincolo

Doveva essere consultabile anche tra dieci anni, quindi: file statici, nessun
database, nessun servizio esterno, tutto in una cartella che si può copiare su
un disco e aprire.

## Come è fatto

Un file di testo per ogni fotografia, con data, luogo e persone riconosciute.
Da lì si generano l'indice, le pagine per anno e quelle per luogo. Le immagini
sono servite in due formati e tre dimensioni, generate in fase di build.

La parte più utile non è tecnica: è aver deciso un formato per i metadati
abbastanza semplice da poter essere compilato da qualcuno che non scrive codice.
Mia madre ha aggiunto centoventi didascalie senza fare domande.
