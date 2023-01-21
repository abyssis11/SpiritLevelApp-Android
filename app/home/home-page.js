import { View } from '@nativescript/core';
import { startAccelerometerUpdates, stopAccelerometerUpdates, isListening } from "nativescript-accelerometer";
import { Observable } from '@nativescript/core';
import { Shake } from './home-view-model';

const context = new Observable();
let shakeView = new View;
const shakeDetector = new Shake(() => {
    // ovo ce se izvrsiti pri pozivu onSensorData() funkcije (ako su zadovoljeni uvjeti)
    shakeView.opacity = 1;
    shakeView.scaleX = 2;
    shakeView.scaleY = 2;
    shakeView.animate({
        duration: 1000,
        opacity: 0,
        curve: "easeOut"
    });
});

function CalculateInclanation(data) {
    function deg(inc){
        if(inc < 0){
            inc = 360+inc;
        }
        return inc
    }
    let inclanation = {
        roll: Math.abs(Math.atan2(data.y, data.z) * (180/Math.PI) - 180),
        pitch: deg(Math.atan2(-data.x, Math.sqrt(Math.pow(data.y, 2) + Math.pow(data.z, 2))) * (180/Math.PI))
    }
    return inclanation
}

// funkcija koja azurira vrijednosti x, y i prikazujemo da je detektiran shake
function update(data) {
    let ykoordinata = (data.y.toFixed(2) * 50 + 50) + "*," + (100 - (data.y.toFixed(2) * 50 + 50)) + "*";
    let xkoordinata = (data.x.toFixed(2) * 50 + 50) + "*," + (100 - (data.x.toFixed(2) * 50 + 50)) + "*";

    context.set("x", xkoordinata);
    context.set("y", ykoordinata);
    context.set("z", data.z.toFixed(2));
    context.set("roll", CalculateInclanation(data).roll.toFixed(2));
    context.set("pitch", CalculateInclanation(data).pitch.toFixed(2));

    shakeDetector.onSensorData(data);
}

// Event handler za "navigatingTo" event u home-page.xml
export function navigatingTo(args) {
    let page = args.object;
    page.bindingContext = context;
    shakeView = page.getViewById("shake-view");
    context.set("button", "button-zaustavi");
    try {
        startAccelerometerUpdates(update, { sensorDelay: "ui" });
    } catch (e) {
        alert("Error: " + e.message);
    }

    context.set("isListening", isListening());
}

// funkcija za gumb
export function toggleUpdates() {
    if (isListening()) {
        stopAccelerometerUpdates();
        context.set("button", "button-pokreni");
    } else {
        try {
            startAccelerometerUpdates(update, { sensorDelay: "ui" });
            context.set("button", "button-zaustavi");
        } catch (e) {
            alert("Error: " + e.message);
        }
    }

    context.set("isListening", isListening());
}


