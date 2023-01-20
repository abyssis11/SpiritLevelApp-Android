import { startAccelerometerUpdates } from "nativescript-accelerometer";
import { Observable } from '@nativescript/core';

const context = new Observable();


function CalculateInclanation(data) {
    let inclanation = Math.atan2(data.y, data.x) * (180/Math.PI);
    if (inclanation < 0){
        inclanation = 360 + inclanation;
    }
    return inclanation
}

// funkcija koja azurira vrijednosti x, y, z i prikazujemo da je detektiran shake
function update(data) {
    let ykoordinata = (data.y.toFixed(2) * 50 + 50) + "*," + (100 - (data.y.toFixed(2) * 50 + 50)) + "*";
    let xkoordinata = (data.x.toFixed(2) * 50 + 50) + "*," + (100 - (data.x.toFixed(2) * 50 + 50)) + "*";
    
    context.set("x", xkoordinata);
    context.set("y", ykoordinata);
    context.set("z", data.z.toFixed(2));
    context.set("inclanation", CalculateInclanation(data));
}


startAccelerometerUpdates(update, { sensorDelay: "ui" });


