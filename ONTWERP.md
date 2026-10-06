# Ontwerp-handoff — Hebreeuws Oefenen

Dit document is bedoeld om aan een ontwerper (of een ontwerpsessie) te geven,
zodat die de app kan herstylen zonder eerst de hele codebase te moeten lezen —
en zonder per ongeluk beslissingen om te gooien die er om een reden zijn.

Live: https://boazderijk3-del.github.io/hebreeuws-oefenen/
Opmaak: `styles.css` (177 regels, 126 klassen, allemaal in gebruik)

---

## 1. Waar het voor is

Twee volwassen beginners (een echtpaar) leren Hebreeuws lezen. Niet een cursus,
maar een oefenapp: korte sessies, vaak op de telefoon, soms op de laptop.

Dat bepaalt bijna alles aan het ontwerp:

- **Telefoon eerst.** Staand, met één duim, soms onderweg.
- **Korte sessies.** Je moet binnen één tik kunnen oefenen, niet eerst door een
  menu.
- **Lezen is de kerntaak.** De Hebreeuwse tekst is het onderwerp van de pagina,
  niet een decoratief element. Alles eromheen moet daarvoor wijken.

---

## 2. Hoe je eraan werkt

Er is **geen bouwstap**. `styles.css` wordt rechtstreeks door de browser
geladen; aanpassen en verversen is genoeg.

```
index.html      programma (schermen, oefenvormen) — hoef je niet aan te raken
styles.css      ALLE opmaak — hier werk je
materiaal.js    de leerstof (woorden, zinnen, stammen)
sw.js           offline-cache
```

De klassenamen in `index.html` zijn de koppeling. Hernoem je een klasse in de
CSS, dan moet hij ook in `index.html` mee — daarom liever niet hernoemen tenzij
het echt beter wordt.

Lokaal bekijken:

```bash
python3 -m http.server 8000
```

---

## 3. Tokens (huidige waarden)

Alles staat op `:root` in `styles.css`. Dit is het hele palet:

| token | waarde | waar het voor staat |
|---|---|---|
| `--bg` | `#141026` | paginagrond (met radiale gradient eroverheen) |
| `--panel` | `#211b3f` | kaarten, knoppen in rust |
| `--panel2` | `#291f4d` | vlak binnen een kaart, invoervelden, speelkaarten |
| `--accent` | `#e8b04b` | goud — de Hebreeuwse taal zelf, nadruk, "juist antwoord" |
| `--accent2` | `#7b6ef6` | paars — navigatie, actieve staat, het *programma* |
| `--good` | `#4cc38a` | goed beantwoord |
| `--bad` | `#e8607a` | fout beantwoord |
| `--text` | `#f2eefb` | gewone tekst |
| `--text-dim` | `#b3a9d4` | bijschriften, uitleg, labels |
| `--border` | `#382f5e` | alle randen en scheidingslijnen |
| `--radius` | `16px` | *bedoeld* als standaardhoek — zie punt 7 |
| `--font-ui` | `Rubik` | alle Nederlandse tekst |

**De kleurlogica die erachter zit:** goud is de taal, paars is het apparaat.
Alles wat Hebreeuws ís of eraan raakt (letters, de stam, het juiste antwoord)
is goud; alles wat navigatie of bediening is, is paars. Als je dat omgooit,
gooi het dan consequent om — half is verwarrender dan beide.

### Contrast (nagemeten, WCAG AA)

| voorgrond op achtergrond | ratio | kleine tekst (4.5) |
|---|---|---|
| `--text` op `--panel` | 14.23 | ja |
| `--text-dim` op `--panel` | 7.38 | ja |
| `--accent` op `--panel` | 8.31 | ja |
| `--good` op `--panel` | 7.33 | ja |
| `--bad` op `--panel` | 4.94 | ja |
| **`--accent2` op `--panel`** | **4.18** | **nee — alleen groot** |

**Eén echt probleem:** `--accent2` wordt als tekstkleur gebruikt op
`.chip-toggle.on` (0.78rem) en `.profiel-rij.actief`. Dat haalt AA niet voor
tekst van dat formaat. Twee uitwegen: paars oplichten voor tekstgebruik, of
paars alleen nog als rand/vulling gebruiken en de tekst wit laten.

---

## 4. Typografie

**Nederlands:** Rubik (400/600/800).

**Hebreeuws:** zes verschillende schriftstijlen, en dat is een leerkundige
keuze, geen opsmuk. Een letter ziet er in Rasji-schrift heel anders uit dan in
blokschrift; wie alleen één lettertype leert, herkent de letter in een boek
niet terug. De app wisselt daarom bewust van lettertype tussen vragen.

| stijl | font |
|---|---|
| Blokschrift (modern) | Noto Sans Hebrew |
| Klassiek boekschrift | Frank Ruhl Libre |
| Krantenletter | David Libre |
| Rasji-schrift | Noto Rashi Hebrew |
| Vet display | Suez One |
| Sierserif | Noto Serif Hebrew |

Ze komen van Google Fonts (één `<link>` in `index.html`). Vervang je ze, zorg
dan dat de vervanger **nikud ondersteunt** — veel Hebreeuwse fonts hebben geen
klinkertekens, en dan verdwijnt stilzwijgend de helft van de leerstof.

---

## 5. Componenten

| klasse | wat het is |
|---|---|
| `.section-switch` / `.sect-btn` | hoofdkeuze: Letters ↔ Woorden & zinnen |
| `nav.tabs` / `.tab-btn` | tabbalk per sectie, horizontaal schuifbaar |
| `.checkbox-row` / `.chip-toggle` | filterknoppen (categorie, niveau, modus) |
| `.checkbox-row.chip-scroll` | zelfde rij, maar schuivend ipv afbrekend |
| `.card-surface` | standaard kaart |
| `.flashcard` (+`.word`) | oefenkaart die omdraait bij een tik |
| `.quiz-stage` / `.quiz-glyph` | het podium met de vraag erop |
| `.options-grid` / `.opt-btn` | meerkeuze, 2×2; `.correct` / `.wrong` |
| `.feedback-bar` | terugkoppelingsregel onder een vraag |
| `.lees-controle` / `.lees-veld` | zelf het antwoord opschrijven, dan nakijken |
| `.zin-card` / `.zin-word` | zin met aantikbare woorden; `.ok` / `.mis` |
| `.trace-stage` / `#traceCanvas` | schrijfveld met voorbeeldletter eronder |
| `.memory-grid` / `.mem-card` | geheugenspel |
| `.bib-rij` / `.bib-stip` | bibliotheekregel met voortgangsstip |
| `.prog-row` / `.prog-bar-*` | voortgangsbalk per onderdeel |
| `.score-kaart` / `.score-vak` | de drie cijfers bovenaan Voortgang |
| `.profiel-rij` | wie er oefent |
| `.nav-btn` | standaardknop |
| `.he` | **Hebreeuwse tekst — zie hieronder** |

---

## 6. Harde randvoorwaarden

Deze vier zijn geen smaak. Ga eroverheen en de app gaat stuk op een manier die
je niet meteen ziet.

1. **`.he` moet `direction:rtl` en `unicode-bidi:isolate` houden.** Zonder die
   isolatie springt Hebreeuwse tekst in de verkeerde volgorde zodra er een
   cijfer, haakje of Nederlands woord naast staat.
2. **Regelhoogte bij Hebreeuwse tekst ruim houden** (nu `1.9`–`2` bij zinnen).
   Nikud staat ONDER de letter; bij een krappe regelhoogte vallen de
   klinkertekens weg tegen de regel eronder — precies wat de gebruiker moet
   leren lezen.
3. **Raakdoelen minstens ~44px.** Telefoon, duim, soms onderweg.
4. **Geen horizontale paginascroll op 375px.** Lange rijen (tabs, categorieën)
   schuiven in hun eigen container, de pagina zelf niet.

---

## 7. Wat zwak is (eerlijke lijst)

Dit zijn de plekken waar een ontwerper daadwerkelijk iets kan verbeteren:

- **De hoeken zijn inconsequent.** `--radius` (16px) wordt precies één keer
  gebruikt; verder staan er hardgecodeerde 10, 12, 14, 16 en 20px door elkaar.
  Dit vraagt om een kleine schaal (bijv. 10 / 14 / 20) als token.
- **Er is geen ruimte-schaal.** Marges en padding zijn per component bedacht.
  Een schaal van vier of vijf stappen zou het rustiger maken.
- **Twee navigatielagen boven elkaar** (sectie + tabs) kosten op een telefoon
  ruim 100px voordat de oefening begint. Dat werkt, maar het is veel chroom
  voor een app waar je snel in wilt.
- **Alleen donker.** Er is geen lichte variant. Buiten in de zon is dat
  slechter leesbaar — en lezen is nou net de kerntaak.
- **De emoji in knoplabels** (🗂 ✍️ ❓) doen het werk van iconen. Ze renderen
  per platform anders en zijn niet te stylen.
- **`.quiz-glyph` is `clamp(4rem, 20vw, 6rem)`.** Op een brede laptop wordt een
  letter daardoor gigantisch terwijl de rest klein blijft.

---

## 8. Wat niet omgegooid moet worden zonder reden

- De **lettertypewisseling** (punt 4). Ziet eruit als inconsistentie, is een
  leerdoel.
- **Een leeg vak blijft staan.** Waar niets gevonden is, staat dat er; het vak
  verdwijnt niet. Anders weet je niet of er niets is of dat er niet gekeken is.
- **Goud = taal, paars = programma** (punt 3).
- **Fout-feedback verdwijnt niet meteen.** Je moet kunnen zien wát er fout was,
  niet alleen dát het fout was.

---

## 9. Hoe je controleert of een restyle klopt

Minimaal deze vijf, op 375px breed én op een laptop:

1. Zinnetjes met **nikud aan** — staan alle klinkertekens vrij?
2. Een zin waar je een woord aantikt — is de uitlichting zichtbaar zonder de
   tekst te laten verspringen?
3. Een meerkeuzevraag fout beantwoorden — zijn goed (groen) en fout (rood)
   allebei duidelijk, ook naast elkaar?
4. Bibliotheek met 275 regels — scrollt dat vloeiend, zijn de stippen leesbaar?
5. Geheugenspel — passen 16 kaarten op een telefoonscherm zonder knijpen?
