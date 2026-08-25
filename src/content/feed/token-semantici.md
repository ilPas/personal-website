---
title: 'I token di colore semantici invecchiano meglio'
date: 2026-05-21
type: talk
tags: ['design system', 'token', 'naming']
excerpt: 'Il nome grigio-400 racconta com''è fatto il colore, testo-secondario racconta a cosa serve. Solo il secondo sopravvive a un cambio di palette.'
draft: false
---

Ogni design system arriva prima o poi al giorno in cui la palette cambia. È lì
che si scopre se i nomi erano buoni.

## Il problema del nome descrittivo

`grigio-400` descrive il colore. Quando la palette diventa leggermente più
calda, il nome diventa una piccola bugia, e cambiarlo significa toccare ogni
punto che lo usa. Peggio: nessuno sa quali di quei punti volessero *quel*
grigio e quali volessero *un testo secondario* che per caso era grigio.

## Due livelli, non uno

La struttura che uso ha due strati:

1. **Primitivi** — la scala grezza. `neutral-100`, `neutral-900`. Non compaiono
   mai nei componenti.
2. **Semantici** — l'uso. `testo-primario`, `testo-secondario`, `bordo-sottile`,
   `superficie-elevata`. Puntano ai primitivi.

I componenti usano solo il secondo strato. Un cambio di palette diventa una
modifica in un solo file, e il tema scuro smette di essere una riscrittura.

## L'obiezione ragionevole

«Sono due nomi da mantenere invece di uno.» Vero, e all'inizio sembra
burocrazia. Il costo si ripaga la prima volta che qualcuno chiede il tema
scuro, che nella mia esperienza è sempre.
