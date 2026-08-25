---
title: 'Un filtro per categorie senza una riga di JavaScript'
date: 2026-08-18
type: lab
tags: ['css', 'progressive enhancement', 'accessibilità']
excerpt: 'Radio nativi più il selettore :has(): il filtro di questo lab funziona al primo paint, resta navigabile da tastiera e non spedisce script al browser.'
links:
  - label: ':has() su MDN'
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has'
draft: false
---

Il filtro che vedi in cima a questa pagina è fatto di un gruppo di `input`
radio nascosti visivamente e di una manciata di regole CSS. Nessun listener,
nessun bundle, nessuno stato da sincronizzare.

## Come funziona

I radio stanno in un `fieldset` con la sua `legend`, quindi il gruppo viene
annunciato correttamente e si naviga con le frecce come qualunque radiogroup
nativo. Ogni entry porta un attributo `data-type`. Il resto lo fa `:has()`:

```css
.feed:has(#filtro-build:checked) .feed__item:not([data-type='build']) {
  display: none;
}
```

L'input è invisibile ma non rimosso dal flusso di focus, e l'anello di focus
viene disegnato sull'etichetta, che è il controllo che si vede davvero:

```css
.feed__input:focus-visible + .feed__label {
  outline: 2px solid;
  outline-offset: 3px;
}
```

## Cosa si perde

Due cose, ed è giusto dirle. La selezione non finisce nell'URL, quindi non si
può condividere un link già filtrato. E su un browser senza `:has()` il filtro
non filtra: si vedono tutte le entry, che è il peggior esito possibile e non è
poi male.

Se un giorno servisse davvero il link condivisibile, l'isola JavaScript avrà un
motivo per esistere. Oggi no.
