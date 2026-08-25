---
title: 'Riprogettare un flusso di prenotazione in tre schermate'
excerpt: 'Un percorso di prenotazione lungo undici passaggi ridotto a tre, senza togliere nessuna delle opzioni che gli utenti usavano davvero.'
year: 2025
role: 'Design di prodotto e front-end'
client: 'Servizio B2B, settore ricettivo'
tags: ['design system', 'form', 'accessibilità']
order: 1
links:
  - label: 'Nota tecnica sul componente calendario'
    url: '/lab/calendario-accessibile'
draft: false
---

## Il problema

Il flusso esistente chiedeva undici passaggi per completare una prenotazione,
distribuiti su sei schermate. Il tasso di abbandono si concentrava tra il terzo
e il quinto passaggio, dove venivano richiesti dati che il sistema, in buona
parte dei casi, già possedeva.

L'ipotesi iniziale del team era che il problema fosse estetico. Guardando le
sessioni registrate, il problema era invece di sequenza: si chiedeva troppo
presto qualcosa che serviva troppo tardi.

## Cosa ho fatto

Ho ricostruito la mappa dei campi effettivamente necessari per chiudere una
prenotazione, distinguendo tre categorie: dati indispensabili, dati deducibili
dal contesto e dati utili solo a valle. Il risultato è stato un flusso in tre
schermate:

1. **Cosa e quando** — selezione della data e della disponibilità.
2. **Chi** — anagrafica minima, precompilata quando l'utente è riconosciuto.
3. **Conferma** — riepilogo modificabile in linea, senza tornare indietro.

Tutto il resto è diventato opzionale e recuperabile dopo la conferma.

### Il calendario

Il componente più delicato è stato il calendario: doveva restare navigabile da
tastiera, annunciare correttamente le date non disponibili e funzionare a 360px
senza scroll orizzontale. È diventato un `grid` di bottoni con un unico stop di
tabulazione e navigazione a frecce, secondo il pattern del composite widget.

```html
<div role="grid" aria-labelledby="cal-title">
  <div role="row">
    <button role="gridcell" aria-disabled="true" tabindex="-1">3</button>
  </div>
</div>
```

## Come è andata

Il flusso ridotto è entrato in produzione in due rilasci, prima come test su una
quota di traffico e poi per tutti. Gli abbandoni intermedi si sono spostati
verso la prima schermata — dove il costo dell'uscita è basso — e il numero di
richieste di assistenza legate alla prenotazione è calato in modo evidente nel
trimestre successivo.

La parte che porto con me: il pezzo di lavoro più utile non è stato ridisegnare
le schermate, ma decidere cosa non chiedere.
