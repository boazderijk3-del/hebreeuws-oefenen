# Hebreeuws Oefenen

Een oefenapp voor het Hebreeuwse alfabet, de nikud, woorden, zinnen en stammen.
Draait in de browser, op laptop én telefoon. Geen installatie, geen bouwstap:
je past een bestand aan en ververst de pagina.

## De bestanden

| bestand | wat het is |
|---|---|
| `index.html` | het programma: schermen, oefenvormen, voortgang |
| `materiaal.js` | **alle leerstof** — hier voeg je woorden en zinnen toe |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | zorgen dat het op je telefoon als app werkt en offline blijft werken |

De scheiding is met opzet: nieuw materiaal toevoegen raakt nooit de
programmacode, dus er kan ook niets stukgaan aan de oefenvormen.

## Op je telefoon gebruiken

**De goede manier: via GitHub Pages.** Dan heb je een vaste link, werkt het
offline, en kun je 'm op je beginscherm zetten alsof het een echte app is.

1. Maak op github.com een **lege, publieke** repository, bijvoorbeeld
   `hebreeuws-oefenen`. Niet aanvinken: README, .gitignore, licentie.
2. Koppel en push (vanuit deze map):

```bash
git remote add origin git@github.com:<jouw-account>/hebreeuws-oefenen.git
git push -u origin main
```

3. Op github.com: **Settings → Pages → Source: Deploy from a branch →
   branch `main`, map `/ (root)` → Save.**
4. Na een minuut staat de app op:
   `https://<jouw-account>.github.io/hebreeuws-oefenen/`

**Op je beginscherm zetten.** Open die link op je telefoon:
- iPhone (Safari): deelknop → *Zet op beginscherm*.
- Android (Chrome): menu ⋮ → *App installeren* / *Toevoegen aan startscherm*.

Daarna opent het zonder adresbalk, en werkt het ook zonder internet.

**Snel even testen zonder GitHub** (laptop en telefoon op hetzelfde wifi):

```bash
python3 -m http.server 8000
```

(draai dit in de map waar `index.html` staat)

Zoek het ip-adres van je laptop (Systeeminstellingen → Wi-Fi → Details) en ga
op je telefoon naar `http://<dat-ip>:8000`. Werkt alleen zolang je laptop
aanstaat en op hetzelfde netwerk zit.

## Updaten en nieuw materiaal toevoegen

De werkwijze is steeds dezelfde:

1. Pas `materiaal.js` aan (of laat het aanpassen).
2. Controleer of er geen typefout in zit:
   ```bash
   node -e "global.window={};eval(require('fs').readFileSync('materiaal.js','utf8'));const M=window.MATERIAAL;console.log(M.WOORDEN.length+' woorden, '+M.ZINNEN.length+' zinnen, '+M.ROOTS.length+' stammen')"
   ```
3. Committen en pushen:
   ```bash
   git add materiaal.js && git commit -m "nieuw materiaal" && git push
   ```
4. Ververs de pagina op je telefoon. De app haalt altijd eerst de nieuwste
   versie op en valt alleen terug op de offline-kopie als er geen verbinding
   is — een update komt dus meteen door.

### Een woord toevoegen

In `materiaal.js`, in de lijst `WOORDEN`:

```js
{he:'מַפְתֵּחַ', trans:'mafteach', nl:'sleutel', categorie:'zelfstandig', niveau:2},
```

- `he` — het Hebreeuwse woord mét nikud
- `trans` — hoe je het uitspreekt, in Nederlandse letters
- `nl` — de betekenis; meerdere betekenissen scheid je met `/`
- `categorie` — een sleutel uit `CATEGORIE_LABELS` bovenin het bestand
- `niveau` — 1 (kern) of 2 (uitbreiding); laat je het weg, dan telt het als 1
- `notitie` — optioneel, verschijnt als extra uitleg op de kaart

Een categorie heeft **minstens vier woorden** nodig, anders kan de app er geen
meerkeuzevraag van maken.

### Een zin toevoegen

In de lijst `ZINNEN`:

```js
{trans:'ma hasha\'a?', nl:'Hoe laat is het?', categorie:'tijd',
 woorden:[{he:'מָה',nl:'wat'},{he:'הַשָּׁעָה',nl:'het uur / de tijd'}]},
```

De Hebreeuwse zin wordt opgebouwd uit `woorden`, zodat je in de app op elk
woord los kunt tikken voor de betekenis. Er is bewust geen apart veld met de
hele zin: dat zou bij een wijziging uit de pas gaan lopen met de losse woorden.

### Een stam toevoegen

In de lijst `ROOTS`: de drie letters, de kernbetekenis, en de woordfamilie.

## Wie oefent er

Rechtsboven staat een profielknop. Meerdere mensen kunnen op hetzelfde
apparaat oefenen; iedereen heeft een eigen voortgang, eigen instellingen, en
de app onthoudt per persoon waar je gebleven was.

De voortgang staat in de browser van dat apparaat (`localStorage`). Dat
betekent: hij gaat niet mee naar een ander apparaat, en hij verdwijnt als je
de websitegegevens van je browser wist.

## Hoe het oefenen werkt

- **Moeilijke onderdelen komen vaker terug.** Bij elke vraag telt de app mee
  hoe vaak je iets goed en fout had; wat je vaak mist, wordt vaker gekozen.
- **Beheerst** betekent: minstens drie keer geoefend en 80% goed.
- **De leescontrole is met opzet mild.** Transliteratie is geen exacte
  wetenschap: `sj`/`sh`, `j`/`y` en `oe`/`u` mogen door elkaar, en één typefout
  per woord wordt vergeven. Te streng afkeuren leert je niets.

## Wat er nog niet is

- **Spraakherkenning** (hardop lezen en automatisch laten nakijken) — staat op
  de lijst voor een volgende grote update.
- **De woordenlijst is nog niet compleet.** Er staan nu 275 woorden in, met
  zorg gekozen en van nikud voorzien. Die groeit in batches; een echte
  frequentielijst van 1500 woorden vraagt een betrouwbare bron, geen giswerk.
- **De nikud is met de hand gezet.** Bij een lijst van deze omvang kan er een
  foutje in zitten. Kom je er een tegen, dan is het één regel in `materiaal.js`.
