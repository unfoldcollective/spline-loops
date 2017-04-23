var hasMouseMoved, mouseTimeout;

document.addEventListener("DOMContentLoaded", function(){
    document.addEventListener('mousemove', function onFirstMouseMove() {
        hasMouseMoved = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(function () {
            hasMouseMoved = false;
        }, 5000);
    }, false);
});

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(30);
    smooth();
    noFill();

    var teal = color('#0096AC');
    var pink = color('#FBD2CE');
    var purple = color('#796CAF');
    var green = color('#9CFCCF');
    var colorCombo1 = [teal, pink];
    var colorCombo2 = [teal, green];
    var colorCombo3 = [purple, pink];

    splineSettings1 = {
        nPoints: 8,
        origin: {
            x: 0.6 * width,
            y: 0.4 * height
        },
        radius: 300,
        distortFactor: 100,
        colors: colorCombo1,
        interpolationSteps: 4,
        movement: {
            moveFactor: 0.5,    // 0 == no positional animation
            noiseFactor: 0,     // 0 == no noise
            easeFactor: 0.05,   // 1 == no easing
            tightnessFactor: 0  // 0 == no tightness animation 
        }
    }
    splineLoop1 = new SplineLoop(splineSettings1);
    splineLoop1.draw();

    var text = addText("Speaker Name")
}

function addText(string) {
    text = createDiv(string);
    text.class("text");
    return text;
}

function draw() {
    if (hasMouseMoved) {
        background(0);
        splineLoop1.update();
        splineLoop1.draw();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}