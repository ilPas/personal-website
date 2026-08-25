# Font

I file dei font vanno qui, **non** in `public/`: durante la build Astro copia
`public/` così com'è, quindi i font finirebbero duplicati nell'output.

Da qui vengono referenziati nel blocco `fonts` di `astro.config.mjs`, che
genera `@font-face`, preload e fallback metrici servendo tutto dal nostro
dominio. Nessun CDN di terze parti.

Al momento la cartella è vuota: la tipografia è un placeholder di sistema in
attesa della direzione visiva.
