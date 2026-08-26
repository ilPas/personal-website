---
title: 'Un budget a serbatoi che legge le notifiche della banca'
date: 2026-08-26
type: lab
tags: ['android', 'kotlin', 'gemini', 'ai studio']
excerpt: "App Android per il budget mensile: Gemini legge il testo grezzo delle notifiche bancarie e ne estrae la spesa. Funziona, tranne quando non funziona — ed è lì che è servito un modo per contestarlo."
draft: false
---

App Android di finanza personale, in sviluppo. Non è un tracciatore di spese
generico: è un *envelope budgeting* a serbatoi, calibrato sulle mie regole di
gestione. Quattro contenitori separati — costi fissi essenziali, discrezionale
e personale, casa e imprevisti, fondo risparmi — e cicli di spesa che non
coincidono col mese solare.

Kotlin e Jetpack Compose, Material 3 con una palette ad alto contrasto, MVVM
con ViewModel, coroutine e StateFlow. I dati stanno in Room. Le spese arrivano
da un `NotificationListenerService` che intercetta le notifiche di pagamento.

Google AI Studio fa due lavori diversi qui. Da una parte è il copilota che
scrive e refattorizza il codice nel workspace. Dall'altra l'app chiama l'API di
Gemini a runtime, e quello è il pezzo interessante.

## Il pezzo che funziona

Il testo di una notifica bancaria non ha struttura. Gemini lo legge, distingue
un addebito vero da un alert di sicurezza o da un doppione, e ne tira fuori
importo, valuta ed esercente. L'attrito dell'inserimento manuale crolla: la
spesa si registra da sola, io confermo.

L'altra cosa che ha retto meglio del previsto è l'ammortamento. Una spesa
grossa non si scarica tutta sul mese in cui la faccio: si divide in quote sui
cicli successivi, così il residuo mensile resta un numero realistico invece di
un buco che si richiude da solo il mese dopo.

## Il pezzo che non funziona

Le spese atipiche. Imposta di bollo, addebiti conto: roba che non somiglia a un
pagamento da esercente e che Gemini scartava o classificava male.

La risposta non è stata un prompt migliore. Ho aggiunto una schermata di log
con lo storico di ogni notifica analizzata e un pulsante di contestazione, per
recuperare come spesa reale qualcosa che l'analisi aveva buttato, con un
fallback a espressioni regolari. Un classificatore probabilistico su una cosa
che tocca i soldi ha bisogno di una via d'uscita manuale, e la via d'uscita va
progettata insieme al classificatore, non aggiunta quando ci si accorge che
sbaglia.

Due bug che vale la pena ricordare. Un file di font custom corrotto mandava in
crash l'app a runtime con `Resources$NotFoundException`: risolto togliendolo e
passando alla tipografia di sistema integrata con la palette M3. E il form di
inserimento leggeva liste di categorie statiche invece di quelle salvate su
Room, così l'app mostrava due verità diverse a seconda della schermata:
unificato su un solo StateFlow.

## Dove finiscono i dati

Tutto in locale, su Room. Spese, categorie, impostazioni e log delle notifiche
non lasciano il dispositivo, e non c'è nessun server mio in mezzo. L'unica cosa
che esce è il testo della notifica, che va a Gemini per l'estrazione: nessun
profilo utente memorizzato da remoto.

## Cosa manca

Sincronizzazione fra dispositivi — al momento vive su uno solo. Backup
automatico ed export in un formato contabile serio. Un widget per la home di
Android. Niente repo pubblico né link allo store per ora.
