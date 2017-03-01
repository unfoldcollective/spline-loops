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
    var colorCombo1 = [pink, teal];
    var colorCombo2 = [green, teal];
    var colorCombo3 = [pink, purple];

    splineSettings1 = {
        nPoints: 10,
        origin: {
            x: 0.33 * width,
            y: 0.6 * height
        },
        radius: 450,
        distortFactor: 80,
        colors: colorCombo1,
        interpolationSteps: 4,
        moveFactor: 0.2
    }
    splineLoop1 = new SplineLoop(splineSettings1);

    splineSettings2 = {
        nPoints: 10,
        origin: {
            x: 0.66 * width,
            y: 0.6 * height
        },
        radius: 350,
        distortFactor: 80,
        colors: colorCombo2,
        interpolationSteps: 4,
        moveFactor: 0.2
    }
    splineLoop2 = new SplineLoop(splineSettings2);

    splineSettings3 = {
        nPoints: 10,
        origin: {
            x: 0.5 * width,
            y: 0.4 * height
        },
        radius: 400,
        distortFactor: 80,
        colors: colorCombo3,
        interpolationSteps: 4,
        moveFactor: 0.2
    }
    splineLoop3 = new SplineLoop(splineSettings3);
}

function draw() {
    background(0);
    splineLoop1.update();
    splineLoop1.drawSplines();

    splineLoop2.update();
    splineLoop2.drawSplines();

    splineLoop3.update();
    splineLoop3.drawSplines();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}