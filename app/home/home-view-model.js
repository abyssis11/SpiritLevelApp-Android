import { time } from "@nativescript/core/profiling";

const Parameters = {
    // nakon ovoliko shake-a ce se izvrsiti funkcija cb
    shakeCount: 2,

    // timeout izmedju dvije provjere shake-a u ms
    checkTimeout: 100,

    // razmak izmedju dva shakea u ms
    shakeTimeout: 1000,

    // timeout izmedju izvrsavanja cb funkcije u ms
    cbTimeout: 800,

    // koliki mora biti vektor sile da se smatra da je shake
    forceThreshold: 0.2
}

export class Shake {
    #shakeCount = 0;
    #lastShake = 0;
    #lastForce = 0;
    #lastTime = 0;
    #callbackFunction;

    constructor(callback) {
      // prosljedjenu funkciju spremamo u cb
      this.#callbackFunction = zonedCallback(callback);
    }


    onSensorData(data) {
      const now = time();
      if ((now - this.#lastForce) > Parameters.cbTimeout) {
          this.#shakeCount = 0;
      }

      const timeDelta = now - this.#lastTime;
      if (timeDelta > Parameters.checkTimeout) {
          // izracun za vektor sile
          const forceVector = Math.abs(Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)) - 1);
          // ako je vektor dovoljno "velik" onda se smatra ko shake
          if (forceVector > Parameters.forceThreshold) {
              this.#shakeCount++;
              // ako su detektirana 2 (Parameters.shakeCount) shaka i ako je proslo 1000 ms od proslog onda izvrsavamo cb
              if ((this.#shakeCount >= Parameters.shakeCount) && (now - this.#lastShake > Parameters.shakeTimeout)) {
                  this.#lastShake = now;
                  this.#shakeCount = 0;
                  
                  // izvrsavamo cb, to ce biti animacija teksta "Umirite se!"
                  this.#callbackFunction();
              }
              this.#lastForce = now;
          }

          this.#lastTime = now;
      }
  }
}
