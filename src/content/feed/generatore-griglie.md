---
title: 'Un piccolo generatore di griglie tipografiche'
date: 2025-12-03
type: build
tags: ['css', 'tipografia', 'strumenti']
excerpt: 'Uno strumento da cinquanta righe che sputa fuori le custom property di una scala modulare, perché rifare i conti a mano è il modo più veloce per sbagliarli.'
draft: false
---

Ogni volta che inizio un progetto rifaccio la stessa scala tipografica, e ogni
volta arrotondo diversamente. Ho smesso e ho scritto uno strumento.

## Cosa fa

Prende quattro parametri — dimensione base, rapporto, numero di passi verso
l'alto e verso il basso — e restituisce un blocco di custom property pronto da
incollare, con i valori in `rem` e i `clamp()` per la versione fluida.

```css
--text-base: clamp(1rem, 0.97rem + 0.15vw, 1.0625rem);
--text-lg: clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem);
```

## La parte che non avevo previsto

Il valore minimo della scala fluida va calibrato su una viewport stretta, non
sul valore che sembra ragionevole. Con un minimo troppo alto, a 360px i titoli
mandano a capo parole di sette lettere. Ora lo strumento chiede la larghezza
minima da supportare e ci calibra i minimi.
