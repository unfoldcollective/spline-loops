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
    var colorCombo2 = [pink, purple];
    var colorCombo3 = [green, teal];

    splineSettings1 = {
        nPoints: 10,
        origin: {
            x: 0.5 * width,
            y: 0.5 * height
        },
        radius: 200,
        distortFactor: 80,
        colors: colorCombo1,
        interpolationSteps: 4,
        moveFactor: 0.4
    }
    splineLoop = new SplineLoop(splineSettings1);
}

function draw() {
    background(0);
    splineLoop.update();
    splineLoop.drawSplines();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}