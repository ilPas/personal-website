---
title: 'Un calendario che si usa davvero con la tastiera'
date: 2026-07-02
type: lab
tags: ['accessibilità', 'aria', 'componenti']
excerpt: 'Un solo stop di tabulazione, navigazione a frecce e date non disponibili annunciate: appunti dopo aver riscritto lo stesso componente per la terza volta.'
links:
  - label: 'APG: pattern Date Picker Dialog'
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/'
draft: false
---

Il calendario è il componente in cui si vedono subito le scorciatoie prese in
fase di design. Se ogni cella è un `tab stop`, arrivare al mese successivo
richiede trenta pressioni di tasto.

## Le tre regole che uso

**Un solo stop di tabulazione.** La griglia riceve il focus una volta sola; poi
ci si muove con le frecce. È il pattern del composite widget, lo stesso di una
toolbar.

**Le date non disponibili restano raggiungibili.** `aria-disabled="true"`, non
l'attributo `disabled`: un utente che naviga da tastiera deve poter capire
*perché* quel giorno non si può scegliere, e per capirlo deve poterlo
raggiungere.

**Il cambio di mese va annunciato.** Cambiare la griglia senza dire niente
lascia chi usa uno screen reader in un contesto che è mutato sotto le mani.

## Il pezzo che sbaglio sempre

La gestione del focus quando cambia il mese. Se il focus resta sulla cella e la
cella sparisce, il focus torna al `body` e si perde il posto. La soluzione che
funziona è spostare il focus sulla stessa posizione nel nuovo mese, oppure
sull'ultimo giorno valido se il mese è più corto.
