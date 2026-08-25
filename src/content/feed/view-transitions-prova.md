---
title: 'View Transitions: cosa succede se se ne abusa'
date: 2025-09-05
type: lab
tags: ['css', 'animazioni', 'esperimenti']
excerpt: 'Prova pratica sulle transizioni tra pagine, con particolare attenzione a chi ha chiesto meno movimento.'
draft: true
---

> Bozza. Appunti ancora disordinati, pubblicati solo in locale.

Le View Transitions rendono facile qualcosa che prima era difficile, e questo è
esattamente il motivo per cui vale la pena stare attenti.

## Il test

Ho applicato una transizione tra la pagina indice e quella di dettaglio,
misurando cosa succede quando la navigazione è rapida e ripetuta.

## Da approfondire

- Comportamento con `prefers-reduced-motion: reduce`: la transizione va
  disattivata, non solo accorciata.
- Cosa succede al focus dopo la transizione.
- Il costo reale su dispositivi lenti.
