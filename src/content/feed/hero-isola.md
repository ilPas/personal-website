---
title: "L'hero diventa un'isola, e l'LCP smette di essere lo sfondo"
date: 2026-08-26
type: build
tags: ['webgl', 'three.js', 'performance', 'astro']
excerpt: 'Scena raymarched con three.js caricata dopo il load, poster statico prima. Il pezzo interessante è stato scoprire che il poster si stava prendendo l’LCP.'
draft: false
---

Ho rifatto l'hero come isola vera: poster statico al primo paint, e la scena
in three.js che lo sostituisce dopo, se e quando può. Sotto, un raymarch con
nebbia volumetrica a scattering in avanti, riflessione con Fresnel su una
superficie animata e bloom. La versione precedente era uno shader piatto: si
vedeva.

## Il poster si prendeva l'LCP

Il vincolo era: l'elemento più grande della pagina deve essere l'headline, non
la grafica. Ho messo il poster come background di un `div` a tutto schermo e
misurato: **LCP = quel div**, 957.000 pixel di immagine contro un titolo di
testo. Ovvio col senno di poi.

Ho provato l'ipotesi su due file statici, uno col poster su un `div` e uno col
poster sul `body`. Chrome esclude i background di `body` e `html` dai candidati
LCP. Sul `div` vinceva l'immagine, sul `body` vinceva l'`h1`.

Quindi il poster è diventato il background del `body`, e il livello della scena
è salito in cima alla pagina — passa dietro l'header, così il canvas occupa
esattamente il rettangolo del poster e al cambio non c'è scarto di
inquadratura.

Non è bastato: l'LCP è finito sul paragrafo sotto il titolo. Le righe del
titolo erano `span` di tipo blocco, e ogni blocco è un candidato a sé — nessuna
riga da sola batteva il paragrafo. Sono diventate `span` inline separati da
`<br>`, dentro un solo `h1`. Ora l'LCP è il titolo.

## Lo zero di CLS è costato tre tentativi

Prima misura: 0,053, spostamento al momento in cui il font vero sostituiva il
ripiego. Ho aggiunto i ripieghi con metriche allineate — `size-adjust`,
`ascent-override`, `descent-override` misurati con `measureText` contro Arial —
e il CLS è **salito** a 0,092.

Il mio strumento registrava solo la posizione verticale, quindi non vedevo il
problema: lo spostamento era **orizzontale**. Gli scarti off-grid erano in
`ch`, e `ch` dipende dall'avanzamento del carattere «0»: cambia col font.
Convertiti in `em`, il CLS è salito ancora — 0,279 — perché restava un
`max-width` in `ch` sul titolo, che spostava il punto di andata a capo e
cambiava il numero di righe.

La soluzione non era inseguire le unità una per una: `font-display: optional`
più il preload dei tre sottoinsiemi latini. O il font c'è al primo paint, o non
viene usato per quella visita. Nessuno scambio, quindi niente da spostare.
**CLS 0.**

## Quello che non posso misurare da qui

Il costo di frame sulla GPU. L'ambiente in cui lavoro rasterizza via software:
la scena gira a circa un fotogramma al secondo, e non dice niente su cosa farà
una GPU vera. Il timer query di WebGL è esposto ma restituisce risultati non
utilizzabili.

Quindi ho fatto l'unica cosa sensata: invece di fidarmi di un numero che non
ho, la scena misura da sola l'intervallo reale fra i disegni e, se resta oltre
il doppio del tetto, abbassa la risoluzione interna di un gradino. Due
gradini al massimo. Nell'ambiente di test è scattato, ed è così che ho potuto
verificare che funziona.
