---
title: 'Il budget di performance è un vincolo di progetto, non un report'
date: 2026-02-17
type: talk
tags: ['performance', 'processo']
excerpt: 'Un numero deciso prima di iniziare cambia le discussioni molto più di qualunque audit fatto alla fine.'
links:
  - label: 'Performance budgets su web.dev'
    url: 'https://web.dev/articles/performance-budgets-101'
draft: false
---

Gli audit di performance arrivano quasi sempre troppo tardi. A quel punto la
libreria è già dentro, la dipendenza è già in produzione e la conversazione
diventa una trattativa su cosa si può togliere.

Un budget deciso all'inizio sposta la conversazione di alcuni mesi indietro,
dove costa poco.

## Come lo scrivo

Un numero, un'unità, una pagina di riferimento. Per esempio: *100 KB
trasferiti sulla pagina articolo, immagini escluse.* Niente medie, niente
punteggi sintetici: quelli si muovono per ragioni che non controlliamo.

## Perché funziona

Perché trasforma «questa libreria è pesante?» — una domanda di gusto — in
«questa libreria sta nel budget?», che è una domanda con una risposta. E la
risposta si può dare in cinque minuti, prima del merge, invece che in una
riunione tre mesi dopo.

L'effetto collaterale più interessante è che il budget rende visibili le
decisioni di prodotto travestite da decisioni tecniche.
