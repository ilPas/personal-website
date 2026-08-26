---
title: 'La direzione visiva, e il vincolo che ho dovuto emendare'
date: 2026-08-26
type: build
tags: ['webgl', 'tipografia', 'accessibilità', 'css']
excerpt: 'Acqua, luce e nebbia calcolate da uno shader. Per averle ho rotto di proposito la regola dello zero JavaScript, invece di fingere le caustiche con un gradiente.'
draft: false
---

Il sito aveva un vincolo scritto in cima alle istruzioni: zero JavaScript nel
bundle, «non una preferenza». La direzione visiva chiede acqua in WebGL. I due
non stanno insieme, e fingere non era un'opzione: senza shader le caustiche
diventano gradienti animati travestiti, che è esattamente il default da cui la
direzione voleva stare lontana.

Ho emendato il vincolo invece di aggirarlo. Ora dice: una sola isola, ed è la
scena. Con le regole che la tengono onesta scritte accanto — niente librerie,
`aria-hidden`, ferma con «riduci movimento», in pausa fuori schermo, e senza
JavaScript resta il fondo dipinto in CSS, che è già la scena giusta, solo
immobile. WebGL2 nudo: 2,6 KB compressi. Quello è il tetto, non il punto di
partenza.

## La sorgente finiva dentro il titolo

Nello shader le coordinate sono normalizzate sull'**altezza**, ed è comodo
finché la scena è alta. Avevo messo la sorgente a una x fissa in quello
spazio, con un limite per non farla uscire dallo schermo.

Poi la scena è diventata anche una banda bassa e larga dietro le testate delle
pagine interne. Lì il rapporto si ribalta: quel limite, che sull'hero teneva la
luce a destra, nella banda la piazzava in mezzo al titolo. Il testo bianco
finiva sopra il nucleo bianco della sorgente — contrasto 1,02:1, cioè
illeggibile.

La x giusta è una frazione della **mezza-larghezza**, non dell'altezza. Un
carattere cambiato, e la luce sta al 72% dello schermo su qualunque forma di
canvas.

## Misurare il contrasto sopra una cosa che si muove

Non si stima a occhio. Ma il controllo l'ho sbagliato due volte prima di
farlo dire il vero.

La prima volta nascondevo il testo per fotografare la scena sotto: nascondendo
l'elemento spariva anche il velo che protegge il testo, e i numeri uscivano
catastrofici. La seconda misuravo il riquadro dell'elemento: un titolo è largo
quanto la colonna anche dove non c'è inchiostro, quindi includeva mezza scena.

Il metodo che regge: rendere trasparenti i **glifi**, non l'elemento, e
misurare la luminanza peggiore sotto i rettangoli dei **nodi di testo**. Da lì
sono usciti numeri veri, e con quelli tre difetti reali da correggere.

## Tipografia

Il font indicato non è un carattere che si trovi da nessuna parte, quindi non
potevo sceglierne «uno simile» guardandolo. Ho scelto sulla proprietà
dichiarata — modulare, off-grid — e sono finito su Syne per il display, Space
Grotesk per il testo, Space Mono per micro-testo e codice. Tutti scaricati una
volta e serviti dal dominio: il vincolo sulle terze parti resta intatto.

L'off-grid è dichiarativo: ogni riga del titolo ha uno scarto irregolare, e
occhiello, testo e comandi stanno su assi diversi. Una cosa che ho dovuto
disfare: avevo dato alla terza riga uno scarto negativo, perché sporgesse a
sinistra. A 768px sporgeva fuori dallo schermo. Fuori dal contenitore non è
composizione, è un difetto — ora la riga più a sinistra è quella a scarto
zero, e sono le altre a rientrare.

## Quello che non ho

Il brief di riferimento non è mai arrivato, e senza non potevo inventarmi i
quattro mood. Quelli che ci sono — `abisso`, `secca`, `deriva`, `fosforo` —
sono derivati dal materiale: luce che attraversa l'acqua a profondità e
temperature diverse. Sono una proposta, dichiarata come tale, e vivono in
quattro blocchi di custom property. Quando il brief arriva si sostituiscono
quelli e basta: nient'altro nel sito nomina un colore d'accento.
