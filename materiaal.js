/* ===========================================================================
   MATERIAAL — alle leerstof van de oefenapp staat in dit bestand.

   Nieuw materiaal toevoegen doe je HIER. index.html bevat alleen het
   programma; die hoef je er niet voor open te maken.

   Formaat van een woord:
     {he:'שָׁלוֹם', trans:'shalom', nl:'hallo', categorie:'begroeting'}
     - he        : het Hebreeuwse woord, met nikud
     - trans     : hoe je het uitspreekt, in Nederlandse letters
     - nl        : de betekenis
     - categorie : een sleutel uit CATEGORIE_LABELS hieronder
     - notitie   : (optioneel) extra uitleg, verschijnt op de achterkant

   Formaat van een zin:
     {trans:'ma nishma?', nl:'Hoe gaat het?', categorie:'smalltalk',
      woorden:[{he:'מַה',nl:'wat'},{he:'נִּשְׁמַע',nl:'wordt gehoord'}]}
     - de Hebreeuwse zin wordt opgebouwd uit `woorden`, zodat je in de app
       op elk woord los kunt tikken. Er is dus GEEN apart veld met de hele
       zin: die zou bij een wijziging uit de pas gaan lopen.

   Formaat van een stam (shoresh):
     {letters:['כ','ת','ב'], betekenis:'schrijven', familie:[
        {he:'כָּתַב', trans:'katav', nl:'schreef (hij)', vorm:'verleden tijd'} ]}

   Een nieuwe categorie maken: zet hem erbij in CATEGORIE_LABELS (woorden) of
   ZIN_CATEGORIE_LABELS (zinnen); de keuzeknop in de app verschijnt vanzelf.
   Let op: een woordcategorie heeft minstens 4 woorden nodig, anders kan de
   app er geen meerkeuzevraag van maken.
   =========================================================================== */

window.MATERIAAL = (function(){
"use strict";

/* ---------------------------------------------------------------- LETTERS */

const LETTERS = [
  {letter:'א', naam:'Alef',  klank:"stemloos — drager voor een klinker", trans:"'"},
  {letter:'ב', naam:'Bet',   klank:'b (met dagesj) / v (zonder dagesj)', trans:'b / v'},
  {letter:'ג', naam:'Gimel', klank:'g (harde g, zoals in "goal")', trans:'g'},
  {letter:'ד', naam:'Dalet', klank:'d', trans:'d'},
  {letter:'ה', naam:'Hee',   klank:'h', trans:'h'},
  {letter:'ו', naam:'Vav',   klank:'v, of oe/o als klinkerdrager', trans:'v / oe / o'},
  {letter:'ז', naam:'Zayin', klank:'z', trans:'z'},
  {letter:'ח', naam:'Chet',  klank:'ch — schrapende keelklank', trans:'ch'},
  {letter:'ט', naam:'Tet',   klank:'t', trans:'t'},
  {letter:'י', naam:'Jod',   klank:'j, of i als klinkerdrager', trans:'j / i'},
  {letter:'כ', naam:'Kaf',   klank:'k (met dagesj) / ch (zonder dagesj)', trans:'k / ch', sofit:'ך'},
  {letter:'ל', naam:'Lamed', klank:'l', trans:'l'},
  {letter:'מ', naam:'Mem',   klank:'m', trans:'m', sofit:'ם'},
  {letter:'נ', naam:'Nun',   klank:'n', trans:'n', sofit:'ן'},
  {letter:'ס', naam:'Samech',klank:'s', trans:'s'},
  {letter:'ע', naam:'Ayin',  klank:'stemloos — keelklank (in modern Hebreeuws vaak nauwelijks hoorbaar)', trans:"'"},
  {letter:'פ', naam:'Pe',    klank:'p (met dagesj) / f (zonder dagesj)', trans:'p / f', sofit:'ף'},
  {letter:'צ', naam:'Tsadi', klank:'ts', trans:'ts', sofit:'ץ'},
  {letter:'ק', naam:'Kof',   klank:'k', trans:'k'},
  {letter:'ר', naam:'Resj',  klank:'r', trans:'r'},
  {letter:'ש', naam:'Shin / Sin', klank:'sj (punt rechtsboven) / s (punt linksboven)', trans:'sj / s'},
  {letter:'ת', naam:'Tav',   klank:'t', trans:'t'},
];

const SLOTLETTERS = LETTERS.filter(l=>l.sofit).map(l=>({
  letter:l.sofit, naam:l.naam+' sofit', van:l.letter,
  klank:'slotvorm van '+l.naam+' — '+l.klank, trans:l.trans
}));

/* ------------------------------------------------------------------ NIKUD */

const NIKUD = [
  {teken:'ָ', naam:'Kamats',  klank:'lange a-klank', vb:'בָ', vbklank:'baa'},
  {teken:'ַ', naam:'Patach',  klank:'korte a-klank', vb:'בַ', vbklank:'ba'},
  {teken:'ֵ', naam:'Tsere',   klank:'lange e-klank (als in "vee")', vb:'בֵ', vbklank:'bee'},
  {teken:'ֶ', naam:'Segol',   klank:'korte e-klank', vb:'בֶ', vbklank:'be'},
  {teken:'ִ', naam:'Chiriek', klank:'i-klank', vb:'בִ', vbklank:'bi'},
  {teken:'ֹ', naam:'Cholam',  klank:'o-klank', vb:'בֹ', vbklank:'bo'},
  {teken:'ֻ', naam:'Kubuts',  klank:'u-klank (kort, zonder vav)', vb:'בֻ', vbklank:'boe'},
  {teken:'ְ', naam:'Sjva',    klank:'stom, of een zeer korte doffe e', vb:'בְ', vbklank:'b(e)'},
  {teken:'ֲ', naam:'Chataf-Patach', klank:'zeer korte a — bij keelletters', vb:'אֲ', vbklank:'a'},
  {teken:'ֱ', naam:'Chataf-Segol',  klank:'zeer korte e — bij keelletters', vb:'אֱ', vbklank:'e'},
  {teken:'ֳ', naam:'Chataf-Kamats', klank:'zeer korte o — bij keelletters', vb:'אֳ', vbklank:'o'},
];

const DIAKRIETEN = [
  {naam:'Dagesj', teken:'בּ', klank:'punt in de letter: verhardt (b/k/p ipv v/ch/f) of verdubbelt de medeklinker'},
  {naam:'Sjin-punt', teken:'שׁ', klank:'punt rechtsboven op de ש: spreek uit als "sj"'},
  {naam:'Sin-punt', teken:'שׂ', klank:'punt linksboven op de ש: spreek uit als "s"'},
];

/* -------------------------------------------------- CATEGORIEËN VAN WOORDEN */

const CATEGORIE_LABELS = {
  alle:'Alle', begroeting:'Begroetingen', vraagwoord:'Vraagwoorden', voornaamwoord:'Voornaamwoorden',
  familie:'Familie', getal:'Getallen', tijd:'Tijd & dagen', werkwoord:'Werkwoorden',
  kleur:'Kleuren', bijvoeglijk:'Bijvoeglijk', zelfstandig:'Voorwerpen & plekken',
  uitdrukking:'Spreektaal (klink als local)',
  mens:'Mensen & beroepen', plek:'Plekken & gebouwen', vervoer:'Vervoer & onderweg',
  eten_drinken:'Eten & drinken', lichaam:'Lichaam & gezondheid', functiewoord:'Kleine woorden'
};

/* ------------------------------------------------------------------ WOORDEN */

const WOORDEN = [
  // Begroetingen & beleefdheid
  {he:'שָׁלוֹם', trans:'shalom', nl:'hallo / vrede / tot ziens', categorie:'begroeting'},
  {he:'בֹּקֶר טוֹב', trans:'boker tov', nl:'goedemorgen', categorie:'begroeting'},
  {he:'עֶרֶב טוֹב', trans:'erev tov', nl:'goedenavond', categorie:'begroeting'},
  {he:'לַיְלָה טוֹב', trans:'layla tov', nl:'welterusten', categorie:'begroeting'},
  {he:'לְהִתְרָאוֹת', trans:'lehitraot', nl:'tot ziens', categorie:'begroeting'},
  {he:'תּוֹדָה', trans:'toda', nl:'dank je', categorie:'begroeting'},
  {he:'תּוֹדָה רַבָּה', trans:'toda raba', nl:'hartelijk dank', categorie:'begroeting'},
  {he:'בְּבַקָּשָׁה', trans:'bevakasha', nl:'alsjeblieft / graag gedaan', categorie:'begroeting'},
  {he:'סְלִיחָה', trans:'slicha', nl:'sorry / pardon', categorie:'begroeting'},
  {he:'כֵּן', trans:'ken', nl:'ja', categorie:'begroeting'},
  {he:'לֹא', trans:'lo', nl:'nee', categorie:'begroeting'},
  {he:'אוּלַי', trans:'ulai', nl:'misschien', categorie:'begroeting'},
  {he:'בְּסֵדֶר', trans:'beseder', nl:'oké / in orde', categorie:'begroeting'},
  {he:'מַזָּל טוֹב', trans:'mazal tov', nl:'gefeliciteerd', categorie:'begroeting'},
  {he:'נָעִים מְאֹד', trans:'naim meod', nl:'aangenaam', categorie:'begroeting'},
  // Vraagwoorden
  {he:'מָה', trans:'ma', nl:'wat', categorie:'vraagwoord'},
  {he:'מִי', trans:'mi', nl:'wie', categorie:'vraagwoord'},
  {he:'אֵיפֹה', trans:'eifo', nl:'waar', categorie:'vraagwoord'},
  {he:'מָתַי', trans:'matai', nl:'wanneer', categorie:'vraagwoord'},
  {he:'לָמָּה', trans:'lama', nl:'waarom', categorie:'vraagwoord'},
  {he:'אֵיךְ', trans:'eich', nl:'hoe', categorie:'vraagwoord'},
  {he:'כַּמָּה', trans:'kama', nl:'hoeveel', categorie:'vraagwoord'},
  {he:'אֵיזֶה', trans:'eize', nl:'welke', categorie:'vraagwoord'},
  // Voornaamwoorden
  {he:'אֲנִי', trans:'ani', nl:'ik', categorie:'voornaamwoord'},
  {he:'אַתָּה', trans:'ata', nl:'jij (mannelijk)', categorie:'voornaamwoord'},
  {he:'אַתְּ', trans:'at', nl:'jij (vrouwelijk)', categorie:'voornaamwoord'},
  {he:'הוּא', trans:'hu', nl:'hij', categorie:'voornaamwoord'},
  {he:'הִיא', trans:'hi', nl:'zij', categorie:'voornaamwoord'},
  {he:'אֲנַחְנוּ', trans:'anachnu', nl:'wij', categorie:'voornaamwoord'},
  {he:'אַתֶּם', trans:'atem', nl:'jullie (mannelijk)', categorie:'voornaamwoord'},
  {he:'הֵם', trans:'hem', nl:'zij (meervoud)', categorie:'voornaamwoord'},
  // Familie
  {he:'אִמָּא', trans:'ima', nl:'mama', categorie:'familie'},
  {he:'אַבָּא', trans:'aba', nl:'papa', categorie:'familie'},
  {he:'אָח', trans:'ach', nl:'broer', categorie:'familie'},
  {he:'אָחוֹת', trans:'achot', nl:'zus', categorie:'familie'},
  {he:'סַבָּא', trans:'saba', nl:'opa', categorie:'familie'},
  {he:'סַבְתָּא', trans:'savta', nl:'oma', categorie:'familie'},
  {he:'בֵּן', trans:'ben', nl:'zoon', categorie:'familie'},
  {he:'בַּת', trans:'bat', nl:'dochter', categorie:'familie'},
  {he:'מִשְׁפָּחָה', trans:'mishpacha', nl:'familie', categorie:'familie'},
  // Getallen 0-10
  {he:'אֶפֶס', trans:'efes', nl:'nul', categorie:'getal'},
  {he:'אַחַת', trans:'achat', nl:'een', categorie:'getal', notitie:'Hebreeuwse telwoorden hebben een aparte mannelijke en vrouwelijke vorm — dit is de vorm die je meestal het eerst leert.'},
  {he:'שְׁתַּיִם', trans:'shtayim', nl:'twee', categorie:'getal'},
  {he:'שָׁלוֹשׁ', trans:'shalosh', nl:'drie', categorie:'getal'},
  {he:'אַרְבַּע', trans:'arba', nl:'vier', categorie:'getal'},
  {he:'חָמֵשׁ', trans:'chamesh', nl:'vijf', categorie:'getal'},
  {he:'שֵׁשׁ', trans:'shesh', nl:'zes', categorie:'getal'},
  {he:'שֶׁבַע', trans:'sheva', nl:'zeven', categorie:'getal'},
  {he:'שְׁמוֹנֶה', trans:'shmone', nl:'acht', categorie:'getal'},
  {he:'תֵּשַׁע', trans:'tesha', nl:'negen', categorie:'getal'},
  {he:'עֶשֶׂר', trans:'eser', nl:'tien', categorie:'getal'},
  // Tijd & dagen
  {he:'הַיּוֹם', trans:'hayom', nl:'vandaag', categorie:'tijd'},
  {he:'מָחָר', trans:'machar', nl:'morgen', categorie:'tijd'},
  {he:'אֶתְמוֹל', trans:'etmol', nl:'gisteren', categorie:'tijd'},
  {he:'עַכְשָׁו', trans:'achshav', nl:'nu', categorie:'tijd'},
  {he:'שָׁבוּעַ', trans:'shavua', nl:'week', categorie:'tijd'},
  {he:'יוֹם רִאשׁוֹן', trans:'yom rishon', nl:'zondag', categorie:'tijd', notitie:'De Hebreeuwse week begint op zondag.'},
  {he:'יוֹם שֵׁנִי', trans:'yom sheni', nl:'maandag', categorie:'tijd'},
  {he:'יוֹם שְׁלִישִׁי', trans:'yom shlishi', nl:'dinsdag', categorie:'tijd'},
  {he:'יוֹם רְבִיעִי', trans:'yom revii', nl:'woensdag', categorie:'tijd'},
  {he:'יוֹם חֲמִישִׁי', trans:'yom chamishi', nl:'donderdag', categorie:'tijd'},
  {he:'יוֹם שִׁישִׁי', trans:'yom shishi', nl:'vrijdag', categorie:'tijd'},
  {he:'שַׁבָּת', trans:'shabat', nl:'zaterdag (shabbat)', categorie:'tijd'},
  // Werkwoorden (mannelijke tegenwoordige tijd)
  {he:'רוֹצֶה', trans:'rotse', nl:'wil (mannelijk)', categorie:'werkwoord', notitie:'De vrouwelijke vorm eindigt meestal op -ה, bijv. רוֹצָה.'},
  {he:'אוֹהֵב', trans:'ohev', nl:'houdt van (mannelijk)', categorie:'werkwoord'},
  {he:'הוֹלֵךְ', trans:'holech', nl:'gaat / loopt (mannelijk)', categorie:'werkwoord'},
  {he:'אוֹכֵל', trans:'ochel', nl:'eet (mannelijk)', categorie:'werkwoord'},
  {he:'שׁוֹתֶה', trans:'shote', nl:'drinkt (mannelijk)', categorie:'werkwoord'},
  {he:'רוֹאֶה', trans:'roe', nl:'ziet (mannelijk)', categorie:'werkwoord'},
  {he:'יוֹדֵעַ', trans:'yodea', nl:'weet (mannelijk)', categorie:'werkwoord'},
  {he:'מֵבִין', trans:'mevin', nl:'begrijpt (mannelijk)', categorie:'werkwoord'},
  {he:'אוֹמֵר', trans:'omer', nl:'zegt (mannelijk)', categorie:'werkwoord'},
  {he:'גָּר', trans:'gar', nl:'woont (mannelijk)', categorie:'werkwoord'},
  // Kleuren
  {he:'אָדֹם', trans:'adom', nl:'rood', categorie:'kleur'},
  {he:'כָּחֹל', trans:'kachol', nl:'blauw', categorie:'kleur'},
  {he:'יָרֹק', trans:'yarok', nl:'groen', categorie:'kleur'},
  {he:'צָהֹב', trans:'tsahov', nl:'geel', categorie:'kleur'},
  {he:'לָבָן', trans:'lavan', nl:'wit', categorie:'kleur'},
  {he:'שָׁחֹר', trans:'shachor', nl:'zwart', categorie:'kleur'},
  // Bijvoeglijke naamwoorden
  {he:'טוֹב', trans:'tov', nl:'goed', categorie:'bijvoeglijk'},
  {he:'רַע', trans:'ra', nl:'slecht', categorie:'bijvoeglijk'},
  {he:'גָּדוֹל', trans:'gadol', nl:'groot', categorie:'bijvoeglijk'},
  {he:'קָטָן', trans:'katan', nl:'klein', categorie:'bijvoeglijk'},
  {he:'יָפֶה', trans:'yafe', nl:'mooi', categorie:'bijvoeglijk'},
  {he:'חָדָשׁ', trans:'chadash', nl:'nieuw', categorie:'bijvoeglijk'},
  {he:'יָשָׁן', trans:'yashan', nl:'oud', categorie:'bijvoeglijk'},
  // Voorwerpen & plekken
  {he:'בַּיִת', trans:'bayit', nl:'huis', categorie:'zelfstandig'},
  {he:'מַיִם', trans:'mayim', nl:'water', categorie:'zelfstandig'},
  {he:'אֹכֶל', trans:'ochel', nl:'eten / voedsel', categorie:'zelfstandig'},
  {he:'סֵפֶר', trans:'sefer', nl:'boek', categorie:'zelfstandig'},
  {he:'כֶּסֶף', trans:'kesef', nl:'geld', categorie:'zelfstandig'},
  {he:'זְמַן', trans:'zman', nl:'tijd', categorie:'zelfstandig'},
  {he:'עִיר', trans:'ir', nl:'stad', categorie:'zelfstandig'},
  {he:'רְחוֹב', trans:'rechov', nl:'straat', categorie:'zelfstandig'},
  {he:'שֵׁם', trans:'shem', nl:'naam', categorie:'zelfstandig'},
  // Spreektaal — hiermee klink je als local
  {he:'יאללה', trans:'yalla', nl:'kom op! / vooruit / laten we gaan', categorie:'uitdrukking', notitie:'Arabisch leenwoord, een van de meest gebruikte woorden in het dagelijks Hebreeuws.'},
  {he:'סַבַּבָּה', trans:'sababa', nl:'cool / prima / het gaat goed', categorie:'uitdrukking'},
  {he:'אַחְלָה', trans:'achla', nl:'geweldig / te gek', categorie:'uitdrukking', notitie:'Ook een Arabisch leenwoord, vaak vóór een woord: "אחלה רעיון" = een geweldig idee.'},
  {he:'וואלה', trans:'walla', nl:'echt waar? / serieus / nee toch', categorie:'uitdrukking', notitie:'Uitroep van verbazing of bevestiging, afhankelijk van de intonatie.'},
  {he:'כַּפָּרָה', trans:'kapara', nl:'schat / liefje', categorie:'uitdrukking', notitie:'Letterlijk "verzoening" — een gangbare, affectieve aanspreekvorm.'},
  {he:'חֲבָל עַל הַזְּמַן', trans:'chaval al hazman', nl:'geweldig! / de moeite waard', categorie:'uitdrukking', notitie:'Letterlijk "zonde van de tijd", maar juist heel positief bedoeld. Kan sarcastisch ook negatief.'},
  {he:'בְּקִיצוּר', trans:'bekitsur', nl:'kortom / lang verhaal kort', categorie:'uitdrukking'},
  {he:'סְתָם', trans:'stam', nl:'zomaar / voor de grap / nergens om', categorie:'uitdrukking'},
  {he:'דַּוְקָא', trans:'davka', nl:'juist / expres / toevallig net', categorie:'uitdrukking', notitie:'Lastig één-op-één te vertalen bijwoord, maar extreem vaak gebruikt.'},
  {he:'נוּ', trans:'nu', nl:'nou? / kom op / schiet op', categorie:'uitdrukking', notitie:'Jiddisch leenwoord, gebruikt om aan te sporen of ongeduld te tonen.'},
  {he:'אֵין דָּבָר', trans:'ein davar', nl:'geen probleem / het is niets', categorie:'uitdrukking'},
  {he:'מַה נִּשְׁמַע', trans:'ma nishma', nl:'hoe gaat het? (informeel)', categorie:'uitdrukking', notitie:'Letterlijk "wat wordt er gehoord" — de gewone informele begroeting onder vrienden.'},
  {he:'אֵין מַצָּב', trans:'ein matsav', nl:'echt niet / onmogelijk / nooit', categorie:'uitdrukking', notitie:'Letterlijk "er is geen situatie" — gebruikt om iets resoluut af te wijzen of ongeloof te uiten.'},
  {he:'כַּנִּרְאֶה', trans:'kanir\'e', nl:'waarschijnlijk', categorie:'uitdrukking'},
  {he:'בֶּאֱמֶת', trans:'be\'emet', nl:'echt / serieus', categorie:'uitdrukking'},
  {he:'תַּכְלֶס', trans:'tachles', nl:'eigenlijk / laten we ter zake komen', categorie:'uitdrukking', notitie:'Jiddisch/Arabisch leenwoord, heel gangbaar om ergens snel ter zake te komen.'},
  {he:'חֶבְרֶה', trans:'chevre', nl:'jongens / mensen / gasten', categorie:'uitdrukking', notitie:'Aanspreekvorm voor een groep vrienden, zoals "hey chevre!"'},
  {he:'סוֹף הַדֶּרֶךְ', trans:'sof haderech', nl:'fantastisch / het einde (in positieve zin)', categorie:'uitdrukking', notitie:'Letterlijk "einde van de weg" — net als in het Nederlands "het einde" kan betekenen.'},
  {he:'מָה הָעִנְיָנִים', trans:'ma ha\'inyanim', nl:'hoe gaat het? (letterlijk: wat zijn de zaken)', categorie:'uitdrukking'},
  {he:'בְּכֵיף', trans:'bekeif', nl:'met plezier / graag', categorie:'uitdrukking'},

  /* ======================= NIVEAU 2 =======================
     Alles hierboven is niveau 1 (de eerste kern). Hieronder de
     volgende laag alledaagse woorden. Zet bij nieuw materiaal een
     `niveau` mee; zonder dat veld telt een woord als niveau 1. */

  // Werkwoorden (mannelijke tegenwoordige tijd)
  {he:'בָּא', trans:'ba', nl:'komt', categorie:'werkwoord', niveau:2},
  {he:'נוֹתֵן', trans:'noten', nl:'geeft', categorie:'werkwoord', niveau:2},
  {he:'לוֹקֵחַ', trans:'lokeach', nl:'neemt / pakt', categorie:'werkwoord', niveau:2},
  {he:'עוֹשֶׂה', trans:'ose', nl:'doet / maakt', categorie:'werkwoord', niveau:2},
  {he:'שׁוֹאֵל', trans:'shoel', nl:'vraagt', categorie:'werkwoord', niveau:2},
  {he:'עוֹנֶה', trans:'one', nl:'antwoordt', categorie:'werkwoord', niveau:2},
  {he:'עוֹבֵד', trans:'oved', nl:'werkt', categorie:'werkwoord', niveau:2},
  {he:'יָשֵׁן', trans:'yashen', nl:'slaapt', categorie:'werkwoord', niveau:2},
  {he:'עוֹמֵד', trans:'omed', nl:'staat', categorie:'werkwoord', niveau:2},
  {he:'יוֹשֵׁב', trans:'yoshev', nl:'zit', categorie:'werkwoord', niveau:2},
  {he:'רָץ', trans:'rats', nl:'rent', categorie:'werkwoord', niveau:2},
  {he:'נוֹסֵעַ', trans:'nosea', nl:'reist / rijdt', categorie:'werkwoord', niveau:2},
  {he:'קוֹנֶה', trans:'kone', nl:'koopt', categorie:'werkwoord', niveau:2},
  {he:'מוֹכֵר', trans:'mocher', nl:'verkoopt', categorie:'werkwoord', niveau:2},
  {he:'פּוֹתֵחַ', trans:'poteach', nl:'opent', categorie:'werkwoord', niveau:2},
  {he:'סוֹגֵר', trans:'soger', nl:'sluit', categorie:'werkwoord', niveau:2},
  {he:'מַתְחִיל', trans:'matchil', nl:'begint', categorie:'werkwoord', niveau:2},
  {he:'עוֹזֵר', trans:'ozer', nl:'helpt', categorie:'werkwoord', niveau:2},
  {he:'מְחַכֶּה', trans:'mechake', nl:'wacht', categorie:'werkwoord', niveau:2},
  {he:'מְחַפֵּשׂ', trans:'mechapes', nl:'zoekt', categorie:'werkwoord', niveau:2},
  {he:'מוֹצֵא', trans:'motse', nl:'vindt', categorie:'werkwoord', niveau:2},
  {he:'חוֹשֵׁב', trans:'choshev', nl:'denkt', categorie:'werkwoord', niveau:2},
  {he:'קוֹרֵא', trans:'kore', nl:'leest / roept', categorie:'werkwoord', niveau:2},
  {he:'כּוֹתֵב', trans:'kotev', nl:'schrijft', categorie:'werkwoord', niveau:2},
  {he:'שׁוֹמֵעַ', trans:'shomea', nl:'hoort', categorie:'werkwoord', niveau:2},
  {he:'שׁוֹכֵחַ', trans:'shokeach', nl:'vergeet', categorie:'werkwoord', niveau:2},
  {he:'זוֹכֵר', trans:'zocher', nl:'herinnert zich', categorie:'werkwoord', niveau:2},
  {he:'מְשַׁלֵּם', trans:'meshalem', nl:'betaalt', categorie:'werkwoord', niveau:2},
  // Mensen & beroepen
  {he:'אִישׁ', trans:'ish', nl:'man', categorie:'mens', niveau:2},
  {he:'אִשָּׁה', trans:'isha', nl:'vrouw', categorie:'mens', niveau:2},
  {he:'יֶלֶד', trans:'yeled', nl:'kind / jongen', categorie:'mens', niveau:2},
  {he:'יַלְדָּה', trans:'yalda', nl:'meisje', categorie:'mens', niveau:2},
  {he:'אָדָם', trans:'adam', nl:'mens', categorie:'mens', niveau:2},
  {he:'חָבֵר', trans:'chaver', nl:'vriend', categorie:'mens', niveau:2},
  {he:'חֲבֵרָה', trans:'chavera', nl:'vriendin', categorie:'mens', niveau:2},
  {he:'שָׁכֵן', trans:'shachen', nl:'buurman', categorie:'mens', niveau:2},
  {he:'רוֹפֵא', trans:'rofe', nl:'dokter', categorie:'mens', niveau:2},
  {he:'מוֹרֶה', trans:'more', nl:'leraar', categorie:'mens', niveau:2},
  {he:'שׁוֹטֵר', trans:'shoter', nl:'politieagent', categorie:'mens', niveau:2},
  // Plekken & gebouwen
  {he:'חֲנוּת', trans:'chanut', nl:'winkel', categorie:'plek', niveau:2},
  {he:'שׁוּק', trans:'shuk', nl:'markt', categorie:'plek', niveau:2},
  {he:'מִסְעָדָה', trans:'misada', nl:'restaurant', categorie:'plek', niveau:2},
  {he:'מָלוֹן', trans:'malon', nl:'hotel', categorie:'plek', niveau:2},
  {he:'בֵּית חוֹלִים', trans:'beit cholim', nl:'ziekenhuis', categorie:'plek', niveau:2, notitie:'Letterlijk "huis van zieken" — veel plekken heten zo: בֵּית + iets.'},
  {he:'בֵּית סֵפֶר', trans:'beit sefer', nl:'school', categorie:'plek', niveau:2, notitie:'Letterlijk "huis van het boek".'},
  {he:'בֵּית כְּנֶסֶת', trans:'beit knesset', nl:'synagoge', categorie:'plek', niveau:2},
  {he:'מִשְׂרָד', trans:'misrad', nl:'kantoor', categorie:'plek', niveau:2},
  {he:'חוֹף', trans:'chof', nl:'strand / kust', categorie:'plek', niveau:2},
  {he:'גַּן', trans:'gan', nl:'tuin / park', categorie:'plek', niveau:2},
  {he:'מִטְבָּח', trans:'mitbach', nl:'keuken', categorie:'plek', niveau:2},
  {he:'חֶדֶר', trans:'cheder', nl:'kamer', categorie:'plek', niveau:2},
  // Vervoer & onderweg
  {he:'מְכוֹנִית', trans:'mechonit', nl:'auto', categorie:'vervoer', niveau:2},
  {he:'אוֹטוֹבּוּס', trans:'otobus', nl:'bus', categorie:'vervoer', niveau:2},
  {he:'רַכֶּבֶת', trans:'rakevet', nl:'trein', categorie:'vervoer', niveau:2},
  {he:'מָטוֹס', trans:'matos', nl:'vliegtuig', categorie:'vervoer', niveau:2},
  {he:'אוֹפַנַּיִם', trans:'ofanayim', nl:'fiets', categorie:'vervoer', niveau:2},
  {he:'דֶּרֶךְ', trans:'derech', nl:'weg', categorie:'vervoer', niveau:2},
  {he:'כְּבִישׁ', trans:'kvish', nl:'straatweg', categorie:'vervoer', niveau:2},
  {he:'תַּחֲנָה', trans:'tachana', nl:'halte / station', categorie:'vervoer', niveau:2},
  // Voorwerpen
  {he:'דֶּלֶת', trans:'delet', nl:'deur', categorie:'zelfstandig', niveau:2},
  {he:'חַלּוֹן', trans:'chalon', nl:'raam', categorie:'zelfstandig', niveau:2},
  {he:'שֻׁלְחָן', trans:'shulchan', nl:'tafel', categorie:'zelfstandig', niveau:2},
  {he:'כִּסֵּא', trans:'kise', nl:'stoel', categorie:'zelfstandig', niveau:2},
  {he:'מִטָּה', trans:'mita', nl:'bed', categorie:'zelfstandig', niveau:2},
  {he:'מַפְתֵּחַ', trans:'mafteach', nl:'sleutel', categorie:'zelfstandig', niveau:2},
  {he:'תִּיק', trans:'tik', nl:'tas', categorie:'zelfstandig', niveau:2},
  {he:'בְּגָדִים', trans:'bgadim', nl:'kleren', categorie:'zelfstandig', niveau:2},
  {he:'נַעֲלַיִם', trans:'na\'alayim', nl:'schoenen', categorie:'zelfstandig', niveau:2},
  {he:'טֶלֶפוֹן', trans:'telefon', nl:'telefoon', categorie:'zelfstandig', niveau:2},
  {he:'מַחְשֵׁב', trans:'machshev', nl:'computer', categorie:'zelfstandig', niveau:2},
  {he:'כֶּלֶב', trans:'kelev', nl:'hond', categorie:'zelfstandig', niveau:2},
  {he:'חָתוּל', trans:'chatul', nl:'kat', categorie:'zelfstandig', niveau:2},
  // Eten & drinken
  {he:'לֶחֶם', trans:'lechem', nl:'brood', categorie:'eten_drinken', niveau:2},
  {he:'חָלָב', trans:'chalav', nl:'melk', categorie:'eten_drinken', niveau:2},
  {he:'גְּבִינָה', trans:'gvina', nl:'kaas', categorie:'eten_drinken', niveau:2},
  {he:'בָּשָׂר', trans:'basar', nl:'vlees', categorie:'eten_drinken', niveau:2},
  {he:'דָּג', trans:'dag', nl:'vis', categorie:'eten_drinken', niveau:2},
  {he:'יְרָקוֹת', trans:'yerakot', nl:'groenten', categorie:'eten_drinken', niveau:2},
  {he:'פֵּרוֹת', trans:'perot', nl:'fruit', categorie:'eten_drinken', niveau:2},
  {he:'תַּפּוּחַ', trans:'tapuach', nl:'appel', categorie:'eten_drinken', niveau:2},
  {he:'בֵּיצָה', trans:'beitsa', nl:'ei', categorie:'eten_drinken', niveau:2},
  {he:'אֹרֶז', trans:'orez', nl:'rijst', categorie:'eten_drinken', niveau:2},
  {he:'מָרָק', trans:'marak', nl:'soep', categorie:'eten_drinken', niveau:2},
  {he:'סָלָט', trans:'salat', nl:'salade', categorie:'eten_drinken', niveau:2},
  {he:'תֵּה', trans:'te', nl:'thee', categorie:'eten_drinken', niveau:2},
  {he:'קָפֶה', trans:'kafe', nl:'koffie', categorie:'eten_drinken', niveau:2},
  {he:'יַיִן', trans:'yayin', nl:'wijn', categorie:'eten_drinken', niveau:2},
  {he:'בִּירָה', trans:'bira', nl:'bier', categorie:'eten_drinken', niveau:2},
  {he:'סֻכָּר', trans:'sukar', nl:'suiker', categorie:'eten_drinken', niveau:2},
  {he:'מֶלַח', trans:'melach', nl:'zout', categorie:'eten_drinken', niveau:2},
  // Lichaam & gezondheid
  {he:'רֹאשׁ', trans:'rosh', nl:'hoofd', categorie:'lichaam', niveau:2},
  {he:'יָד', trans:'yad', nl:'hand', categorie:'lichaam', niveau:2},
  {he:'רֶגֶל', trans:'regel', nl:'been / voet', categorie:'lichaam', niveau:2},
  {he:'עַיִן', trans:'ayin', nl:'oog', categorie:'lichaam', niveau:2},
  {he:'לֵב', trans:'lev', nl:'hart', categorie:'lichaam', niveau:2},
  {he:'גּוּף', trans:'guf', nl:'lichaam', categorie:'lichaam', niveau:2},
  {he:'כְּאֵב', trans:'ke\'ev', nl:'pijn', categorie:'lichaam', niveau:2},
  {he:'בָּרִיא', trans:'bari', nl:'gezond', categorie:'lichaam', niveau:2},
  {he:'חוֹלֶה', trans:'chole', nl:'ziek', categorie:'lichaam', niveau:2},
  // Bijvoeglijke naamwoorden
  {he:'חַם', trans:'cham', nl:'warm', categorie:'bijvoeglijk', niveau:2},
  {he:'קַר', trans:'kar', nl:'koud', categorie:'bijvoeglijk', niveau:2},
  {he:'מָהִיר', trans:'mahir', nl:'snel', categorie:'bijvoeglijk', niveau:2},
  {he:'אִטִּי', trans:'iti', nl:'langzaam', categorie:'bijvoeglijk', niveau:2},
  {he:'קַל', trans:'kal', nl:'makkelijk / licht', categorie:'bijvoeglijk', niveau:2},
  {he:'קָשֶׁה', trans:'kashe', nl:'moeilijk / hard', categorie:'bijvoeglijk', niveau:2},
  {he:'מָלֵא', trans:'male', nl:'vol', categorie:'bijvoeglijk', niveau:2},
  {he:'רֵיק', trans:'reik', nl:'leeg', categorie:'bijvoeglijk', niveau:2},
  {he:'חָזָק', trans:'chazak', nl:'sterk', categorie:'bijvoeglijk', niveau:2},
  {he:'חַלָּשׁ', trans:'chalash', nl:'zwak', categorie:'bijvoeglijk', niveau:2},
  {he:'צָעִיר', trans:'tsa\'ir', nl:'jong', categorie:'bijvoeglijk', niveau:2},
  {he:'נָקִי', trans:'naki', nl:'schoon', categorie:'bijvoeglijk', niveau:2},
  {he:'מְלֻכְלָךְ', trans:'meluchlach', nl:'vies', categorie:'bijvoeglijk', niveau:2},
  {he:'יָקָר', trans:'yakar', nl:'duur', categorie:'bijvoeglijk', niveau:2},
  {he:'זוֹל', trans:'zol', nl:'goedkoop', categorie:'bijvoeglijk', niveau:2},
  {he:'חָשׁוּב', trans:'chashuv', nl:'belangrijk', categorie:'bijvoeglijk', niveau:2},
  {he:'מְעַנְיֵן', trans:'me\'anyen', nl:'interessant', categorie:'bijvoeglijk', niveau:2},
  {he:'שָׂמֵחַ', trans:'sameach', nl:'blij', categorie:'bijvoeglijk', niveau:2},
  {he:'עָצוּב', trans:'atsuv', nl:'verdrietig', categorie:'bijvoeglijk', niveau:2},
  {he:'כּוֹעֵס', trans:'ko\'es', nl:'boos', categorie:'bijvoeglijk', niveau:2},
  {he:'עָיֵף', trans:'ayef', nl:'moe', categorie:'bijvoeglijk', niveau:2},
  // Kleine woorden
  {he:'כָּאן', trans:'kan', nl:'hier', categorie:'functiewoord', niveau:2},
  {he:'שָׁם', trans:'sham', nl:'daar', categorie:'functiewoord', niveau:2},
  {he:'תָּמִיד', trans:'tamid', nl:'altijd', categorie:'functiewoord', niveau:2},
  {he:'אַף פַּעַם', trans:'af pa\'am', nl:'nooit', categorie:'functiewoord', niveau:2},
  {he:'לִפְעָמִים', trans:'lif\'amim', nl:'soms', categorie:'functiewoord', niveau:2},
  {he:'הַרְבֵּה', trans:'harbe', nl:'veel', categorie:'functiewoord', niveau:2},
  {he:'מְעַט', trans:'me\'at', nl:'weinig', categorie:'functiewoord', niveau:2},
  {he:'גַּם', trans:'gam', nl:'ook', categorie:'functiewoord', niveau:2},
  {he:'רַק', trans:'rak', nl:'alleen / slechts', categorie:'functiewoord', niveau:2},
  {he:'יַחַד', trans:'yachad', nl:'samen', categorie:'functiewoord', niveau:2},
  {he:'יוֹתֵר', trans:'yoter', nl:'meer', categorie:'functiewoord', niveau:2},
  {he:'פָּחוֹת', trans:'pachot', nl:'minder', categorie:'functiewoord', niveau:2},
  {he:'מַסְפִּיק', trans:'maspik', nl:'genoeg', categorie:'functiewoord', niveau:2},
  {he:'כִּמְעַט', trans:'kim\'at', nl:'bijna', categorie:'functiewoord', niveau:2},
  {he:'כְּבָר', trans:'kvar', nl:'al', categorie:'functiewoord', niveau:2},
  {he:'עוֹד', trans:'od', nl:'nog / meer', categorie:'functiewoord', niveau:2},
  {he:'שׁוּב', trans:'shuv', nl:'weer / opnieuw', categorie:'functiewoord', niveau:2},
  {he:'אֲבָל', trans:'aval', nl:'maar', categorie:'functiewoord', niveau:2},
  {he:'כִּי', trans:'ki', nl:'want / omdat', categorie:'functiewoord', niveau:2},
  {he:'אִם', trans:'im', nl:'als / indien', categorie:'functiewoord', niveau:2},
  {he:'עִם', trans:'im', nl:'met', categorie:'functiewoord', niveau:2, notitie:'Klinkt hetzelfde als אִם ("als"), maar wordt anders geschreven: ע tegenover א.'},
  {he:'בְּלִי', trans:'bli', nl:'zonder', categorie:'functiewoord', niveau:2},
  {he:'בֵּין', trans:'bein', nl:'tussen', categorie:'functiewoord', niveau:2},
  {he:'מִתַּחַת', trans:'mitachat', nl:'onder', categorie:'functiewoord', niveau:2},
  {he:'מֵעַל', trans:'me\'al', nl:'boven', categorie:'functiewoord', niveau:2},
  {he:'לְיַד', trans:'leyad', nl:'naast', categorie:'functiewoord', niveau:2},
  // Getallen
  {he:'אַחַת עֶשְׂרֵה', trans:'achat esre', nl:'elf', categorie:'getal', niveau:2},
  {he:'שְׁתֵּים עֶשְׂרֵה', trans:'shteim esre', nl:'twaalf', categorie:'getal', niveau:2},
  {he:'עֶשְׂרִים', trans:'esrim', nl:'twintig', categorie:'getal', niveau:2},
  {he:'שְׁלוֹשִׁים', trans:'shloshim', nl:'dertig', categorie:'getal', niveau:2},
  {he:'מֵאָה', trans:'me\'a', nl:'honderd', categorie:'getal', niveau:2},
  {he:'אֶלֶף', trans:'elef', nl:'duizend', categorie:'getal', niveau:2},
  // Tijd
  {he:'חֹדֶשׁ', trans:'chodesh', nl:'maand', categorie:'tijd', niveau:2},
  {he:'שָׁנָה', trans:'shana', nl:'jaar', categorie:'tijd', niveau:2},
  {he:'בֹּקֶר', trans:'boker', nl:'ochtend', categorie:'tijd', niveau:2},
  {he:'צָהֳרַיִם', trans:'tsohorayim', nl:'middag', categorie:'tijd', niveau:2},
  {he:'עֶרֶב', trans:'erev', nl:'avond', categorie:'tijd', niveau:2},
  {he:'לַיְלָה', trans:'layla', nl:'nacht', categorie:'tijd', niveau:2},
  {he:'שָׁעָה', trans:'sha\'a', nl:'uur', categorie:'tijd', niveau:2},
  {he:'דַּקָּה', trans:'daka', nl:'minuut', categorie:'tijd', niveau:2},
];

/* ---------------------------------------------------- CATEGORIEËN VAN ZINNEN */

const ZIN_CATEGORIE_LABELS = {
  alle:'Alle',
  kennismaken:'Kennismaken',
  smalltalk:'Small talk',
  spreektaal:'Spreektaal',
  onderweg:'Onderweg',
  eten:'Eten & drinken',
  winkelen:'Winkelen & geld',
  begrip:'Begrijpen & vragen',
  hulp:'Hulp & noodgeval',
  tijd:'Tijd & afspraken',
  gevoelens:'Gevoelens & beleefdheid'
};

/* -------------------------------------------------------------------- ZINNEN */

const ZINNEN = [
  // --- Kennismaken ---
  {trans:'ma hashem shelcha?', nl:'Wat is je naam? (tegen een man)', categorie:'kennismaken',
   woorden:[{he:'מַה',nl:'wat'},{he:'הַשֵּׁם',nl:'de naam'},{he:'שֶׁלְךָ',nl:'van jou (mannelijk)'}]},
  {trans:'korim li David', nl:'Ik heet David (lett. "ze noemen mij David")', categorie:'kennismaken',
   woorden:[{he:'קוֹרְאִים',nl:'(ze) noemen'},{he:'לִי',nl:'mij'},{he:'דָּוִד',nl:'David (naam)'}]},
  {trans:'naim meod', nl:'Aangenaam (kennis te maken)', categorie:'kennismaken',
   woorden:[{he:'נָעִים',nl:'prettig'},{he:'מְאֹד',nl:'zeer'}]},
  {trans:'ani gar beTel Aviv', nl:'Ik woon in Tel Aviv (mannelijk)', categorie:'kennismaken',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'גָּר',nl:'woon (mannelijk)'},{he:'בְּתֵל אָבִיב',nl:'in Tel Aviv'}]},
  {trans:'me\'eifo ata?', nl:'Waar kom je vandaan? (tegen een man)', categorie:'kennismaken',
   woorden:[{he:'מֵאֵיפֹה',nl:'vanwaar'},{he:'אַתָּה',nl:'jij (mannelijk)'}]},
  {trans:'ani meHolland', nl:'Ik kom uit Nederland', categorie:'kennismaken',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'מֵהוֹלַנְד',nl:'uit Nederland'}]},
  {trans:'eifo ata oved?', nl:'Waar werk je? (tegen een man)', categorie:'kennismaken',
   woorden:[{he:'אֵיפֹה',nl:'waar'},{he:'אַתָּה',nl:'jij (mannelijk)'},{he:'עוֹבֵד',nl:'werkt (mannelijk)'}]},
  {trans:'kama zman ata kan?', nl:'Hoe lang ben je hier al? (tegen een man)', categorie:'kennismaken',
   woorden:[{he:'כַּמָּה',nl:'hoeveel'},{he:'זְמַן',nl:'tijd'},{he:'אַתָּה',nl:'jij (mannelijk)'},{he:'כָּאן',nl:'hier'}]},

  // --- Small talk ---
  {trans:'shalom, ma shlomcha?', nl:'Hallo, hoe gaat het met je? (tegen een man)', categorie:'smalltalk',
   woorden:[{he:'שָׁלוֹם',nl:'hallo'},{he:'מַה',nl:'wat'},{he:'שְׁלוֹמְךָ',nl:'gaat het met jou (mannelijk)'}]},
  {trans:'ani beseder, toda', nl:'Het gaat goed met me, dank je', categorie:'smalltalk',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'בְּסֵדֶר',nl:'in orde / goed'},{he:'תּוֹדָה',nl:'dank je'}]},
  {trans:'ma nishma?', nl:'Hoe gaat het? (informeel, onder vrienden)', categorie:'smalltalk',
   woorden:[{he:'מַה',nl:'wat'},{he:'נִּשְׁמַע',nl:'wordt er gehoord'}]},
  {trans:'ma kara?', nl:'Wat is er gebeurd?', categorie:'smalltalk',
   woorden:[{he:'מָה',nl:'wat'},{he:'קָּרָה',nl:'is gebeurd'}]},
  {trans:'hakol beseder', nl:'Alles is in orde', categorie:'smalltalk',
   woorden:[{he:'הַכֹּל',nl:'alles'},{he:'בְּסֵדֶר',nl:'in orde'}]},
  {trans:'boker tov, eich yashanta?', nl:'Goedemorgen, hoe heb je geslapen? (tegen een man)', categorie:'smalltalk',
   woorden:[{he:'בֹּקֶר',nl:'ochtend'},{he:'טוֹב',nl:'goed'},{he:'אֵיךְ',nl:'hoe'},{he:'יָשַׁנְתָּ',nl:'heb jij geslapen (mannelijk)'}]},
  {trans:'ma chadash?', nl:'Wat is er nieuws?', categorie:'smalltalk',
   woorden:[{he:'מָה',nl:'wat'},{he:'חָדָשׁ',nl:'nieuw'}]},
  {trans:'hakol tov?', nl:'Alles goed?', categorie:'smalltalk',
   woorden:[{he:'הַכֹּל',nl:'alles'},{he:'טוֹב',nl:'goed'}]},
  {trans:'eich haya hayom shelcha?', nl:'Hoe was je dag? (tegen een man)', categorie:'smalltalk',
   woorden:[{he:'אֵיךְ',nl:'hoe'},{he:'הָיָה',nl:'was'},{he:'הַיּוֹם',nl:'de dag'},{he:'שֶׁלְּךָ',nl:'van jou (mannelijk)'}]},
  {trans:'tov lir\'ot otcha', nl:'Fijn om je te zien (tegen een man)', categorie:'smalltalk',
   woorden:[{he:'טוֹב',nl:'goed'},{he:'לִרְאוֹת',nl:'te zien'},{he:'אוֹתְךָ',nl:'jou (mannelijk)'}]},

  // --- Spreektaal ---
  {trans:'ein be\'aya', nl:'Geen probleem', categorie:'spreektaal',
   woorden:[{he:'אֵין',nl:'er is niet'},{he:'בְּעָיָה',nl:'probleem'}]},
  {trans:'bo nelech', nl:'Laten we gaan', categorie:'spreektaal',
   woorden:[{he:'בּוֹא',nl:'kom'},{he:'נֵלֵךְ',nl:'laten we gaan'}]},
  {trans:'yalla, bo nelech', nl:'Kom op, laten we gaan', categorie:'spreektaal',
   woorden:[{he:'יאללה',nl:'kom op / vooruit'},{he:'בּוֹא',nl:'kom'},{he:'נֵלֵךְ',nl:'laten we gaan'}]},
  {trans:'ze lo nora', nl:'Het is niet erg / geen big deal', categorie:'spreektaal',
   woorden:[{he:'זֶה',nl:'dit'},{he:'לֹא',nl:'niet'},{he:'נוֹרָא',nl:'erg / vreselijk'}]},
  {trans:'sababa, bo na\'ase et ze', nl:'Cool, laten we dat doen', categorie:'spreektaal',
   woorden:[{he:'סַבַּבָּה',nl:'cool / prima'},{he:'בּוֹא',nl:'kom'},{he:'נַעֲשֶׂה',nl:'laten we maken/doen'},{he:'אֶת זֶה',nl:'dat (lijdend voorwerp)'}]},
  {trans:'yalla bye', nl:'Doei dan! (informeel afscheid)', categorie:'spreektaal',
   woorden:[{he:'יאללה',nl:'kom op / vooruit'},{he:'בַּיי',nl:'doei (Engels leenwoord)'}]},
  {trans:'tachles, ma ata rotse?', nl:'Eigenlijk, wat wil je nou? (ter zake)', categorie:'spreektaal',
   woorden:[{he:'תַּכְלֶס',nl:'ter zake / eigenlijk'},{he:'מָה',nl:'wat'},{he:'אַתָּה',nl:'jij (mannelijk)'},{he:'רוֹצֶה',nl:'wil (mannelijk)'}]},
  {trans:'yalla, zazim', nl:'Kom op, we gaan (lett. "we bewegen")', categorie:'spreektaal',
   woorden:[{he:'יאללה',nl:'kom op / vooruit'},{he:'זָזִים',nl:'we gaan / bewegen'}]},
  {trans:'ein matsav!', nl:'Echt niet! / Geen sprake van!', categorie:'spreektaal',
   woorden:[{he:'אֵין',nl:'er is niet'},{he:'מַצָּב',nl:'situatie'}]},

  // --- Onderweg ---
  {trans:'eifo hasherutim?', nl:'Waar is het toilet?', categorie:'onderweg',
   woorden:[{he:'אֵיפֹה',nl:'waar'},{he:'הַשֵּׁרוּתִים',nl:'het toilet'}]},
  {trans:'le\'an ata holech?', nl:'Waar ga je heen? (tegen een man)', categorie:'onderweg',
   woorden:[{he:'לְאָן',nl:'waarheen'},{he:'אַתָּה',nl:'jij (mannelijk)'},{he:'הוֹלֵךְ',nl:'gaat (mannelijk)'}]},
  {trans:'eifo hatachana?', nl:'Waar is de halte / het station?', categorie:'onderweg',
   woorden:[{he:'אֵיפֹה',nl:'waar'},{he:'הַתַּחֲנָה',nl:'de halte / het station'}]},
  {trans:'ze rachok mikan?', nl:'Is het ver hiervandaan?', categorie:'onderweg',
   woorden:[{he:'זֶה',nl:'dit'},{he:'רָחוֹק',nl:'ver'},{he:'מִכָּאן',nl:'hiervandaan'}]},
  {trans:'ani mechapes et harechov haze', nl:'Ik zoek deze straat (mannelijk)', categorie:'onderweg',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'מְחַפֵּשׂ',nl:'zoek (mannelijk)'},{he:'אֶת',nl:'(wijst het lijdend voorwerp aan)'},{he:'הָרְחוֹב',nl:'de straat'},{he:'הַזֶּה',nl:'deze'}]},
  {trans:'tifne yamina', nl:'Sla rechtsaf (tegen een man)', categorie:'onderweg',
   woorden:[{he:'תִּפְנֶה',nl:'sla af (mannelijk)'},{he:'יָמִינָה',nl:'naar rechts'}]},
  {trans:'tamshich yashar', nl:'Ga rechtdoor (tegen een man)', categorie:'onderweg',
   woorden:[{he:'תַּמְשִׁיךְ',nl:'ga door (mannelijk)'},{he:'יָשָׁר',nl:'rechtdoor / recht'}]},

  // --- Eten & drinken ---
  {trans:'ani rotse kafe bevakasha', nl:'Ik wil graag koffie (mannelijk)', categorie:'eten',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'רוֹצֶה',nl:'wil (mannelijk)'},{he:'קָפֶה',nl:'koffie'},{he:'בְּבַקָּשָׁה',nl:'alsjeblieft'}]},
  {trans:'hacheshbon bevakasha', nl:'De rekening graag', categorie:'eten',
   woorden:[{he:'הַחֶשְׁבּוֹן',nl:'de rekening'},{he:'בְּבַקָּשָׁה',nl:'alsjeblieft'}]},
  {trans:'mayim bevakasha', nl:'Water graag', categorie:'eten',
   woorden:[{he:'מַיִם',nl:'water'},{he:'בְּבַקָּשָׁה',nl:'alsjeblieft'}]},
  {trans:'ze ta\'im meod', nl:'Dit is erg lekker', categorie:'eten',
   woorden:[{he:'זֶה',nl:'dit'},{he:'טָעִים',nl:'lekker'},{he:'מְאֹד',nl:'zeer'}]},
  {trans:'ani tsimchoni', nl:'Ik ben vegetariër (mannelijk)', categorie:'eten',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'צִמְחוֹנִי',nl:'vegetariër (mannelijk)'}]},
  {trans:'yesh lachem tafrit be\'anglit?', nl:'Hebben jullie een menu in het Engels?', categorie:'eten',
   woorden:[{he:'יֵשׁ',nl:'er is / hebben'},{he:'לָכֶם',nl:'jullie'},{he:'תַּפְרִיט',nl:'menu'},{he:'בְּאַנְגְּלִית',nl:'in het Engels'}]},

  // --- Winkelen & geld ---
  {trans:'kama ze ole?', nl:'Hoeveel kost dit?', categorie:'winkelen',
   woorden:[{he:'כַּמָּה',nl:'hoeveel'},{he:'זֶה',nl:'dit'},{he:'עוֹלֶה',nl:'kost'}]},
  {trans:'ze yakar miday', nl:'Dit is te duur', categorie:'winkelen',
   woorden:[{he:'זֶה',nl:'dit'},{he:'יָקָר',nl:'duur'},{he:'מִדַּי',nl:'te (veel)'}]},
  {trans:'yesh hanacha?', nl:'Is er korting?', categorie:'winkelen',
   woorden:[{he:'יֵשׁ',nl:'er is'},{he:'הַנָּחָה',nl:'korting'}]},
  {trans:'ani rak mistakel', nl:'Ik kijk alleen even (mannelijk)', categorie:'winkelen',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'רַק',nl:'alleen maar'},{he:'מִסְתַּכֵּל',nl:'kijk (mannelijk)'}]},
  {trans:'efshar leshalem bekartis?', nl:'Kan ik met kaart betalen?', categorie:'winkelen',
   woorden:[{he:'אֶפְשָׁר',nl:'is het mogelijk'},{he:'לְשַׁלֵּם',nl:'betalen'},{he:'בְּכַרְטִיס',nl:'met kaart'}]},

  // --- Begrijpen & vragen ---
  {trans:'ani lo mevin', nl:'Ik begrijp het niet (mannelijk)', categorie:'begrip',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'לֹא',nl:'niet'},{he:'מֵבִין',nl:'begrijp (mannelijk)'}]},
  {trans:'ata medaber anglit?', nl:'Spreek je Engels? (tegen een man)', categorie:'begrip',
   woorden:[{he:'אַתָּה',nl:'jij (mannelijk)'},{he:'מְדַבֵּר',nl:'spreekt (mannelijk)'},{he:'אַנְגְּלִית',nl:'Engels'}]},
  {trans:'ani lo yodea', nl:'Ik weet het niet (mannelijk)', categorie:'begrip',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'לֹא',nl:'niet'},{he:'יוֹדֵעַ',nl:'weet (mannelijk)'}]},
  {trans:'ata yachol lachazor al ze?', nl:'Kun je dat herhalen? (tegen een man)', categorie:'begrip',
   woorden:[{he:'אַתָּה',nl:'jij (mannelijk)'},{he:'יָכוֹל',nl:'kan (mannelijk)'},{he:'לַחֲזֹר',nl:'herhalen / terugkomen'},{he:'עַל זֶה',nl:'daarop / daarover'}]},
  {trans:'le\'at yoter bevakasha', nl:'Langzamer alsjeblieft', categorie:'begrip',
   woorden:[{he:'לְאַט',nl:'langzaam'},{he:'יוֹתֵר',nl:'meer'},{he:'בְּבַקָּשָׁה',nl:'alsjeblieft'}]},
  {trans:'eich omrim et ze be\'ivrit?', nl:'Hoe zeg je dat in het Hebreeuws?', categorie:'begrip',
   woorden:[{he:'אֵיךְ',nl:'hoe'},{he:'אוֹמְרִים',nl:'zegt men'},{he:'אֶת זֶה',nl:'dat'},{he:'בְּעִבְרִית',nl:'in het Hebreeuws'}]},
  {trans:'ma ze omer?', nl:'Wat betekent dat?', categorie:'begrip',
   woorden:[{he:'מָה',nl:'wat'},{he:'זֶה',nl:'dit'},{he:'אוֹמֵר',nl:'zegt / betekent'}]},

  // --- Hulp & noodgeval ---
  {trans:'ani tsarich ezra', nl:'Ik heb hulp nodig (mannelijk)', categorie:'hulp',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'צָרִיךְ',nl:'heb nodig (mannelijk)'},{he:'עֶזְרָה',nl:'hulp'}]},
  {trans:'titkasher lamishtara', nl:'Bel de politie (tegen een man)', categorie:'hulp',
   woorden:[{he:'תִּתְקַשֵּׁר',nl:'bel (mannelijk)'},{he:'לַמִּשְׁטָרָה',nl:'naar de politie'}]},
  {trans:'ibadeti et hatelefon sheli', nl:'Ik ben mijn telefoon kwijt', categorie:'hulp',
   woorden:[{he:'אִבַּדְתִּי',nl:'ik ben kwijtgeraakt'},{he:'אֶת',nl:'(wijst het lijdend voorwerp aan)'},{he:'הַטֶּלֶפוֹן',nl:'de telefoon'},{he:'שֶׁלִּי',nl:'van mij'}]},
  {trans:'ani lo margish tov', nl:'Ik voel me niet goed (mannelijk)', categorie:'hulp',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'לֹא',nl:'niet'},{he:'מַרְגִּישׁ',nl:'voel (mannelijk)'},{he:'טוֹב',nl:'goed'}]},
  {trans:'tsarich rofe', nl:'Er is een dokter nodig', categorie:'hulp',
   woorden:[{he:'צָרִיךְ',nl:'nodig'},{he:'רוֹפֵא',nl:'dokter'}]},

  // --- Tijd & afspraken ---
  {trans:'ma hasha\'a?', nl:'Hoe laat is het?', categorie:'tijd',
   woorden:[{he:'מָה',nl:'wat'},{he:'הַשָּׁעָה',nl:'het uur / de tijd'}]},
  {trans:'ani me\'acher', nl:'Ik ben te laat (mannelijk)', categorie:'tijd',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'מְאַחֵר',nl:'ben laat (mannelijk)'}]},
  {trans:'nitra\'e machar', nl:'Tot morgen (we zien elkaar morgen)', categorie:'tijd',
   woorden:[{he:'נִתְרָאֶה',nl:'we zien elkaar'},{he:'מָחָר',nl:'morgen'}]},
  {trans:'yesh li pgisha', nl:'Ik heb een afspraak', categorie:'tijd',
   woorden:[{he:'יֵשׁ',nl:'er is'},{he:'לִי',nl:'voor mij'},{he:'פְּגִישָׁה',nl:'afspraak / ontmoeting'}]},
  {trans:'besha\'a shmone', nl:'Om acht uur', categorie:'tijd',
   woorden:[{he:'בְּשָׁעָה',nl:'om (het uur)'},{he:'שְׁמוֹנֶה',nl:'acht'}]},

  // --- Gevoelens & beleefdheid ---
  {trans:'ani ohev otach', nl:'Ik hou van jou (man tegen vrouw)', categorie:'gevoelens',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'אוֹהֵב',nl:'houd van (mannelijk)'},{he:'אוֹתָךְ',nl:'jou (vrouwelijk)'}]},
  {trans:'ani ayef', nl:'Ik ben moe (mannelijk)', categorie:'gevoelens',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'עָיֵף',nl:'moe (mannelijk)'}]},
  {trans:'ani sameach', nl:'Ik ben blij (mannelijk)', categorie:'gevoelens',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'שָׂמֵחַ',nl:'blij (mannelijk)'}]},
  {trans:'ani mitsta\'er', nl:'Het spijt me (mannelijk)', categorie:'gevoelens',
   woorden:[{he:'אֲנִי',nl:'ik'},{he:'מִצְטַעֵר',nl:'heb spijt (mannelijk)'}]},
  {trans:'toda al hakol', nl:'Bedankt voor alles', categorie:'gevoelens',
   woorden:[{he:'תּוֹדָה',nl:'dank'},{he:'עַל',nl:'voor / over'},{he:'הַכֹּל',nl:'alles'}]},
];

/* --------------------------------------------------------- STAMMEN (SHORESH) */

const ROOTS = [
  {letters:['כ','ת','ב'], betekenis:'schrijven', familie:[
    {he:'כָּתַב', trans:'katav', nl:'schreef (hij)', vorm:'verleden tijd'},
    {he:'כּוֹתֵב', trans:'kotev', nl:'schrijft / schrijver (m.)', vorm:'tegenwoordige tijd / zn.'},
    {he:'מִכְתָּב', trans:'michtav', nl:'brief', vorm:'zelfstandig naamwoord'},
    {he:'כְּתֹבֶת', trans:'ktovet', nl:'adres', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ל','מ','ד'], betekenis:'leren', familie:[
    {he:'לָמַד', trans:'lamad', nl:'leerde (hij)', vorm:'verleden tijd'},
    {he:'לוֹמֵד', trans:'lomed', nl:'leert / studeert (m.)', vorm:'tegenwoordige tijd'},
    {he:'תַּלְמִיד', trans:'talmid', nl:'leerling', vorm:'zelfstandig naamwoord'},
    {he:'לִמּוּד', trans:'limud', nl:'studie / vak', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ד','ב','ר'], betekenis:'spreken / een zaak', familie:[
    {he:'דִּבֵּר', trans:'diber', nl:'sprak (hij)', vorm:'verleden tijd'},
    {he:'מְדַבֵּר', trans:'medaber', nl:'spreekt (m.)', vorm:'tegenwoordige tijd'},
    {he:'דָּבָר', trans:'davar', nl:'ding / zaak / woord', vorm:'zelfstandig naamwoord'},
    {he:'דִּבּוּר', trans:'dibur', nl:'het spreken', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['א','כ','ל'], betekenis:'eten', familie:[
    {he:'אָכַל', trans:'achal', nl:'at (hij)', vorm:'verleden tijd'},
    {he:'אוֹכֵל', trans:'ochel', nl:'eet (m.)', vorm:'tegenwoordige tijd'},
    {he:'אֹכֶל', trans:'ochel', nl:'eten / voedsel', vorm:'zelfstandig naamwoord'},
    {he:'מַאֲכָל', trans:'ma\'achal', nl:'gerecht', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ש','מ','ר'], betekenis:'bewaken / behouden', familie:[
    {he:'שָׁמַר', trans:'shamar', nl:'bewaakte (hij)', vorm:'verleden tijd'},
    {he:'שׁוֹמֵר', trans:'shomer', nl:'bewaakt / bewaker (m.)', vorm:'tegenwoordige tijd / zn.'},
    {he:'מִשְׁמָר', trans:'mishmar', nl:'wacht', vorm:'zelfstandig naamwoord'},
    {he:'שְׁמִירָה', trans:'shmira', nl:'het bewaken', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ר','א','ה'], betekenis:'zien', familie:[
    {he:'רָאָה', trans:'ra\'a', nl:'zag (hij)', vorm:'verleden tijd'},
    {he:'רוֹאֶה', trans:'ro\'e', nl:'ziet (m.)', vorm:'tegenwoordige tijd'},
    {he:'מַרְאֶה', trans:'mar\'e', nl:'uiterlijk / aanblik', vorm:'zelfstandig naamwoord'},
    {he:'רְאִיָּה', trans:'re\'iya', nl:'het zien / visie', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['י','ד','ע'], betekenis:'weten', familie:[
    {he:'יָדַע', trans:'yada', nl:'wist (hij)', vorm:'verleden tijd'},
    {he:'יוֹדֵעַ', trans:'yodea', nl:'weet (m.)', vorm:'tegenwoordige tijd'},
    {he:'יְדִיעָה', trans:'yedi\'a', nl:'bericht / het weten', vorm:'zelfstandig naamwoord'},
    {he:'מוּדָע', trans:'muda', nl:'bewust', vorm:'bijvoeglijk naamwoord'},
  ]},
  {letters:['ג','ד','ל'], betekenis:'groeien / groot zijn', familie:[
    {he:'גָּדַל', trans:'gadal', nl:'groeide (hij)', vorm:'verleden tijd'},
    {he:'גָּדוֹל', trans:'gadol', nl:'groot', vorm:'bijvoeglijk naamwoord'},
    {he:'גִּדֵּל', trans:'gidel', nl:'voedde op / kweekte', vorm:'verleden tijd (ander patroon)'},
    {he:'גֹּדֶל', trans:'godel', nl:'grootte', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ע','ב','ד'], betekenis:'werken / dienen', familie:[
    {he:'עָבַד', trans:'avad', nl:'werkte (hij)', vorm:'verleden tijd'},
    {he:'עוֹבֵד', trans:'oved', nl:'werkt / werknemer (m.)', vorm:'tegenwoordige tijd / zn.'},
    {he:'עֲבוֹדָה', trans:'avoda', nl:'werk', vorm:'zelfstandig naamwoord'},
    {he:'עֶבֶד', trans:'eved', nl:'slaaf / dienaar', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ס','פ','ר'], betekenis:'vertellen / tellen', familie:[
    {he:'סִפֵּר', trans:'siper', nl:'vertelde (hij)', vorm:'verleden tijd'},
    {he:'מְסַפֵּר', trans:'mesaper', nl:'vertelt / verteller (m.)', vorm:'tegenwoordige tijd / zn.'},
    {he:'סֵפֶר', trans:'sefer', nl:'boek', vorm:'zelfstandig naamwoord'},
    {he:'סִפּוּר', trans:'sipur', nl:'verhaal', vorm:'zelfstandig naamwoord'},
    {he:'מִסְפָּר', trans:'mispar', nl:'getal / nummer', vorm:'zelfstandig naamwoord'},
  ]},
  {letters:['ש','א','ל'], betekenis:'vragen', familie:[
    {he:'שָׁאַל', trans:'sha\'al', nl:'vroeg (hij)', vorm:'verleden tijd'},
    {he:'שׁוֹאֵל', trans:'sho\'el', nl:'vraagt (m.)', vorm:'tegenwoordige tijd'},
    {he:'שְׁאֵלָה', trans:'she\'ela', nl:'vraag', vorm:'zelfstandig naamwoord'},
  ]},
];

return {
  LETTERS, SLOTLETTERS, NIKUD, DIAKRIETEN,
  CATEGORIE_LABELS, WOORDEN,
  ZIN_CATEGORIE_LABELS, ZINNEN,
  ROOTS
};

})();
