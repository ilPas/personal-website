---
title: 'Il focus visibile non è un dettaglio da rifinitura'
date: 2026-04-08
type: lab
tags: ['accessibilità', 'css', 'focus']
excerpt: 'Perché outline:none continua a comparire nei progetti, e cosa scrivere al suo posto perché funzioni in chiaro, in scuro e su qualunque sfondo.'
links:
  - label: ':focus-visible su MDN'
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible'
draft: false
---

`outline: none` compare nei progetti per una ragione comprensibile: l'anello di
focus di default appariva anche al clic del mouse, e sembrava un errore. Da qui
la cancellazione, e da qui una lunga serie di siti inutilizzabili da tastiera.

`:focus-visible` risolve il malinteso alla radice: il browser mostra l'anello
quando serve, cioè quando l'utente sta navigando da tastiera.

## La regola che uso

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
  border-radius: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

Tre cose la rendono robusta:

- `outline` e non `border`, così non sposta il layout.
- `outline-offset`, così l'anello non si confonde con il bordo del controllo.
- un colore che è un token, così cambia con il tema invece di sparire nel buio.

## Il caso che dimentichiamo

I controlli custom. Quando l'input reale è nascosto e l'elemento visibile è una
`label`, l'anello va spostato a mano:

```css
input:focus-visible + label {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}
```

Se l'input è nascosto con `display: none` non riceve focus e il controllo
diventa irraggiungibile. Va nascosto visivamente, non rimosso.
