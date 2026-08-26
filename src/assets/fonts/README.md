# (cartella storica)

I font del sito **non** stanno più qui. Sono in `public/fonts/`, con i loro
`@font-face` scritti a mano in `src/styles/fonts.css`.

La scelta è dovuta ai sottoinsiemi: ogni famiglia ha un file `latin` e uno
`latin-ext` con `unicode-range` diversi, e il blocco `fonts` di
`astro.config.mjs` gestisce varianti di peso e stile, non sottoinsiemi dello
stesso volto. Scrivere le regole a mano costa dieci righe e le tiene tutte
leggibili in un punto solo.

Resta valido il vincolo: nessuna richiesta esce dal dominio. I file sono
scaricati una volta da Google Fonts e serviti da qui.
