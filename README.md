# Spirit level app (Libela app)

Zadatak ovog seminarskog rada i projekta bio je razviti mobilnu aplikaciju koja koristi senzore mobilnog uređaja. Prilikom razvoja koristio sam razvojni okvir **NativeScript** s JavaScript programskim jezikom. 

Aplikacija koju sam razvio koristi akcelerometar senzor na uređaju u svrhu prikaza položaja uređaja u prostoru, odnosno koristi će se kao mjerni istrument Libela.

Libela je mjerni instrument koji služi za postavljanje osi u vertikalni ili horizontalni položaj. 

(možda slika)

---

## Nativescript

**Nativescript** je razvojni okvir otvorenog koda za razvoj mobilnih aplikacija za više platformi. Pomoću njega moguće je stvoriti aplikacije za iOS i Android operacijske sustave iz jedne baze koda. Zajedno s NativeScriptom moguće je koristiti popularne web razvojne jezike i okvire kao što su JavaScript, Angular i Vue.js. U ovom slučaju korišten je **JavaScript**. 

NativeScript je također odabran zbog jednostavnog pristupa API nativne platforme, kao što su kamera ili u našem slučaju senzori. 

Početne datoteke aplikacije možemo stvoriti pomoću sljedeće naredbe:

```
$ ns create SpiritLevelApp --template @nativescript/template-blank
```

SpiritLevelApp je naziv aplikacije, a nakon --tamplate argumenta naveden je početni predložak, u ovom slučaju to je prazni predložak.


Zatim je potrebno dodati platformu za koju razvijamo, u ovom slučaju to će biti samo Android platforma:
```
$ ns platform add android
```

---

## Akcelerometar

Za ovu aplikaciju potrebni dobiti očitanja akcelometra na uređaju. Kako bi mogli na jednostavan način pristupiti tim podatcima dodajemo plugin *nativescript-accelerometer* pomoću sljedeće naredbe:

```
$ tns plugin add nativescript-accelerometer
```
 
 No pošto je ovaj plugin namjenjen za verziju 3.x NativeScripta, a u ovom projektu je korištena verzija 8.x, bilo je potrebno napraviti par izmjena u datoteci plugin-a. 

 Datoteke plugin-a mogu se pronaći u node_modules direktoriju. U ovom direktoriju u repozitoriju se nalazi samo ovaj plugin, no prilikom kloniranja repozitorija i pokretanja aplikacije dodati će se i ostali potrebni moduli.

./node_modules/nativescript-accelerometer/index.android.js:

```js
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@nativescript/core"); // updated
var messages_1 = require("./messages");
var baseAcceleration = -9.81;
var sensorListener;
var sensorManager;
var accelerometerSensor;
function getNativeDelay(options) {
    if (!options || !options.sensorDelay) {
        return android.hardware.SensorManager.SENSOR_DELAY_NORMAL;
    }
    switch (options.sensorDelay) {
        case "normal":
            return android.hardware.SensorManager.SENSOR_DELAY_NORMAL;
        case "game":
            return android.hardware.SensorManager.SENSOR_DELAY_GAME;
        case "ui":
            return android.hardware.SensorManager.SENSOR_DELAY_UI;
        case "fastest":
            return android.hardware.SensorManager.SENSOR_DELAY_FASTEST;
    }
}
function startAccelerometerUpdates(callback, options) {
    if (isListening()) {
        console.log(messages_1.startButNotStopped);
        stopAccelerometerUpdates();
    }
    var wrappedCallback = zonedCallback(callback);
    // updated
    var context = utils_1.Utils.ad.getApplicationContext();
    if (!context) {
        throw Error("Could not get Android application context.");
    }

...
```

Ažurirane u dvije linije koda kod kojih piše "updated" komentar. U prvoj je zamijenjen modul s *tns-core-modules/utils/utils* na *@nativescript/core*, dok je u drugoj dodan *.Utils.ad* kako bi funkcija getApplicationContext() ispravno funkcionirala.

---

## Aplikacija

Sve dodateke bitne za funkcionalnost aplikacije nalaze se u direktoriju ./app, a u njemu možemo naći sljedeću strukturu:
```
$ tree ./app
./app
├── app.css
├── app.js
├── app-root.xml
└── home
    ├── home-page.js
    ├── home-page.xml
    └── home-view-model.js

1 directory, 6 files
```

Datoteka app.js predstavlja ulaznu točku aplikacije, u njoj specificiramo početnu točku pomoću funkcije **Application.run()**. Ova funkcija se pokreće pri pokretanju aplikacije i vodi nas na sljedeću datoteku "app-root.xml".

```js
import { Application } from '@nativescript/core'

Application.run({ moduleName: 'app-root' })
```

U home 
