---
title: 'Il sito di MieTi, dove il contatto è un numero di telefono'
date: 2026-08-23
type: lab
tags: ['astro', 'accessibilità', 'tipografia', 'netlify']
excerpt: 'Sito vetrina per un ristorante di Gaglianico: quiet luxury tradotto in due colori e mezzo, nessun form da nessuna parte, e un menu che si aggiorna modificando un JSON.'
draft: false
---

Sito vetrina in Astro per MieTi, ristorante a Gaglianico. Repo su GitHub,
deploy su Netlify, font serviti dal dominio. Non è ancora online: quando lo
sarà, metto il link qui.

## Quiet luxury, tradotto in decisioni

Crema `#f8f4ec` e bruno-nero `#1b1611`. L'oro `#af905c` esiste, ma **solo come
accento**: linee divisorie, occhielli, stati hover, monogramma. Mai come colore
dominante. Cormorant Garamond per titoli e testo corrente, e nei titoli il
corsivo evidenzia solo la parola chiave della frase, mai l'heading intero.
Pinyon Script resta riservato al monogramma.

È tutto qui. La disciplina non sta in quello che c'è, sta in quello che ho
tenuto fuori.

L'oro però non passa il contrasto: `#af905c` sul crema non arriva a 4,5:1,
quindi per il testo esiste un token separato. Il primo valore che avevo scelto
l'avevo tarato sul crema normale e sulle sezioni a crema profondo si fermava a
4,16:1 — passava il controllo dove non serviva e lo falliva dove serviva. Ora è
verificato sul fondo più scuro dei due, che è il caso peggiore. L'oro pieno
resta per linee e superfici, dove il requisito non si applica.

Tutte le pagine passano WCAG 2.2 AA, verificato con axe-core più una batteria
di prove da tastiera che sta negli script del repo.

## Nessun form

Il contatto è telefono, WhatsApp e mail, tutti come link diretti. Non c'è
niente da validare, da proteggere dallo spam, da spiegare in un'informativa.

Per la stessa ragione la mappa in `/contatti` è un'illustrazione statica
cliccabile che apre Google Maps in una scheda nuova, non un iframe incorporato:
l'iframe si porterebbe dietro cookie di terze parti su un sito che altrimenti
non ne ha nemmeno uno.

## Il menu sono quattro file JSON

Uno per categoria. Un cambio stagionale è la modifica di un file, e la pagina
lo legge da sola. Il pattern è pensato apposta perché un aggiornamento si possa
descrivere a parole — «nei primi, al posto dei tagliolini al limone un risotto
agli asparagi a 19€» si traduce direttamente in una riga di `2-primi.json`.

Il sito lo aggiorno io, quindi la cosa che conta davvero è che aggiornarlo
costi poco.

Nella sezione «Dal menu» nome e prezzo sono letti dal menu vero invece di
essere ripetuti a mano. Se una foto smette di corrispondere a un piatto la
build non si rompe: al posto di nome e prezzo compare un avviso visibile. Mai
un'incongruenza silenziosa, e mai un dato inventato per coprirla.

## Cosa non ho messo

Nessun badge con la valutazione Google: non ho un numero reale, e un segnaposto
con cifre inventate non è un badge, è una bugia piccola. I blocchi di racconto
mostrano un'etichetta esplicita «testo segnaposto» finché non arrivano i testi
veri sulla storia del locale.

E niente analytics. Lo snippet cookieless è predisposto nel layout ma resta
spento finché non c'è un token: se un giorno si accende, è una decisione da
prendere, non un default da ereditare.
