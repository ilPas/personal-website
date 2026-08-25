---
title: 'Front-end senza framework: appunti da un intervento'
date: 2025-10-15
type: talk
tags: ['front-end', 'talk', 'html']
excerpt: 'Mezz''ora su cosa la piattaforma fa già da sola, e su come riconoscere il momento in cui serve davvero uno strato in più.'
draft: false
---

Un intervento a un meetup locale, nato da una domanda che mi era stata fatta in
modo un po' polemico: «quindi secondo te i framework non servono?».

## La risposta breve

Servono. Servono quando c'è stato condiviso che cambia in molti punti e in
tempo reale. Fuori da quel caso, spesso stiamo pagando un costo fisso per un
problema che non abbiamo.

## Le tre domande che propongo

1. **Quanto stato condiviso c'è davvero?** Se la risposta è «un menu che si
   apre», la piattaforma basta.
2. **Chi manterrà questo codice tra tre anni?** Le dipendenze invecchiano più in
   fretta dell'HTML.
3. **Cosa succede se lo script non arriva?** Se la risposta è «pagina bianca»,
   vale la pena chiedersi se il contenuto poteva essere HTML.

## La parte che ha generato più discussione

Non i framework, ma i form. Gran parte della validazione riscritta a mano che
ho visto negli anni riproduce, peggio, quello che il browser fa già con
`required`, `type` e `pattern` — inclusi i messaggi tradotti nella lingua
dell'utente.
