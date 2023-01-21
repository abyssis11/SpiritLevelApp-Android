import { time } from "@nativescript/core/profiling";

// koliki mora biti vektor sile da se smatra da je shake
const FORCE_THRESHOLD = 0.2;

// timeout izmedju dvije privjere shake-a u ms
const TIME_THRESHOLD = 100;

// timeout izmedju izvrsavanja cb funkcije u ms
const SHAKE_TIMEOUT = 800;

//razmak izmedju dva shakea u ms
const SHAKE_THROTTLE = 1000;

// nakon ovoliko shake-a ce se izvrsiti funkcija cb
const SHAKE_COUNT = 2;

export class Shake {
    #lastTime = 0;
    #lastShake = 0;
    #lastForce = 0;
    #shakeCount = 0;
    #cb;

    constructor(callback) {
      // prosljedjenu funkciju spremamo u cb
      this.#cb = zonedCallback(callback);
    }


    onSensorData(data) {
      const now = time();
      if ((now - this.#lastForce) > SHAKE_TIMEOUT) {
          this.#shakeCount = 0;
      }

      const timeDelta = now - this.#lastTime;
      if (timeDelta > TIME_THRESHOLD) {
          // izracun za vektor sile
          const forceVector = Math.abs(Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)) - 1);
          // ako je vektor dovoljno "velik" onda se smatra ko shake
          if (forceVector > FORCE_THRESHOLD) {
              this.#shakeCount++;
              // ako su detektirana 2 (SHAKE_COUNT) shaka i ako je proslo 1000 ms od proslog onda izvrsavamo cb
              if ((this.#shakeCount >= SHAKE_COUNT) && (now - this.#lastShake > SHAKE_THROTTLE)) {
                  this.#lastShake = now;
                  this.#shakeCount = 0;
                  
                  // izvrsavamo cb, to ce biti animacija teksta "Umirite se!"
                  this.#cb();
              }
              this.#lastForce = now;
          }

          this.#lastTime = now;
      }
  }
}
