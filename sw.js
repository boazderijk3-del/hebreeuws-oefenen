/* Offline-cache. Bewust "netwerk eerst": een update op GitHub landt dan
   meteen op de telefoon. Pas als er geen verbinding is, komt de cache eraan
   te pas. Andersom (cache eerst) zou betekenen dat nieuw materiaal soms
   dagen niet doorkomt, en dat is precies wat we niet willen. */

const CACHE = 'hebreeuws-v1';
const BESTANDEN = [
  './',
  './index.html',
  './materiaal.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(BESTANDEN))
      .then(()=>self.skipWaiting())
      .catch(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(namen=>Promise.all(namen.filter(n=>n!==CACHE).map(n=>caches.delete(n))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const verzoek = e.request;
  if(verzoek.method !== 'GET') return;

  const eigenBestand = new URL(verzoek.url).origin === location.origin;

  if(eigenBestand){
    e.respondWith(
      fetch(verzoek)
        .then(antwoord=>{
          const kopie = antwoord.clone();
          caches.open(CACHE).then(c=>c.put(verzoek, kopie)).catch(()=>{});
          return antwoord;
        })
        .catch(()=> caches.match(verzoek).then(r=> r || caches.match('./index.html')))
    );
  }else{
    // lettertypen van Google: die veranderen niet, dus cache eerst
    e.respondWith(
      caches.match(verzoek).then(r=>{
        if(r) return r;
        return fetch(verzoek).then(antwoord=>{
          const kopie = antwoord.clone();
          caches.open(CACHE).then(c=>c.put(verzoek, kopie)).catch(()=>{});
          return antwoord;
        });
      })
    );
  }
});
