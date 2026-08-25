---
title: 'Un design system che regge dopo che me ne sono andato'
excerpt: 'Componenti, token e documentazione per un team di sei persone, progettati per essere mantenuti da chi non era nella stanza quando sono stati scritti.'
year: 2024
role: 'Design system e documentazione'
client: 'Team di prodotto interno'
tags: ['design system', 'token', 'documentazione']
order: 2
draft: false
---

## Il punto di partenza

Tre prodotti, tre librerie di componenti diverse, la stessa identità visiva
applicata in tre modi incompatibili. Ogni nuova schermata riapriva discussioni
già chiuse altrove: quanto spazio sotto un titolo, quale grigio per un testo
secondario, come si comporta un bottone che carica.

## L'approccio

Ho evitato la tentazione di partire dai componenti. Prima i token, e per essere
precisi i token *semantici*: non `grigio-400` ma `testo-secondario`. Un nome che
dice a cosa serve sopravvive a un cambio di palette; un nome che descrive il
colore no.

Sopra i token, un insieme volutamente piccolo di componenti — dodici, non
sessanta — scelti contando cosa comparisse davvero nelle schermate esistenti.

### La documentazione

La regola che ha fatto la differenza è stata scrivere la documentazione **prima**
del componente. Se non riuscivo a spiegare in un paragrafo quando usarlo e
quando no, il componente era sbagliato o non serviva.

Ogni pagina risponde a tre domande, sempre nello stesso ordine:

- Quando lo uso?
- Quando **non** lo uso, e cosa uso al suo posto?
- Cosa devo garantire perché resti accessibile?

## Cosa è rimasto

Il sistema ha continuato a essere aggiornato dal team dopo la fine del mio
lavoro, che era esattamente l'obiettivo. Le pull request sui componenti hanno
smesso di essere occasioni di dibattito estetico e sono diventate discussioni
tecniche, molto più brevi.
