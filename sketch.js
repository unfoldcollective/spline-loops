var DEBUG = false;

function setup() {
    createCanvas(1200, 700);
    background(0);
    stroke(255);
    noFill();

    var interpolationSteps = 4;

    var teal = color('#0096AC');
    var pink = color('#FBD2CE');
    var purple = color('#796CAF');
    var green = color('#9CFCCF');
    var colorCombo1 = [teal, pink];
    var colorCombo2 = [purple, pink];
    var colorCombo3 = [teal, green];

    var interpolatedColors1 = recurseInterpolateColors(colorCombo1, interpolationSteps);
    var interpolatedColors2 = recurseInterpolateColors(colorCombo2, interpolationSteps);
    var interpolatedColors3 = recurseInterpolateColors(colorCombo3, interpolationSteps);

    var nPoints = 10;
    var origin = {
        x: 850,
        y: 350
    }
    var radius = 300;
    var distortFactor = 80;

    var points = getLoopPoints(nPoints, origin, radius);
    var points = distortPoints(points, distortFactor);
    var points2 = getLoopPoints(nPoints, distortPoint(origin, distortFactor), radius);
    var points2 = distortPoints(points2, distortFactor);
    
    var interpolatedSplines1 = recurseInterpolation([points, points2], interpolationSteps);
    for (var i = 0; i < interpolatedSplines1.length; i++) {
        stroke(interpolatedColors1[i]);
        drawSplineLoop(interpolatedSplines1[i]);
    }

    // loop 2
    var nPoints = 10;
    var origin = {
        x: 350,
        y: 400
    }
    var radius = 500;
    var distortFactor = 150;

    var points = getLoopPoints(nPoints, origin, radius);
    var points = distortPoints(points, distortFactor);
    var points2 = getLoopPoints(nPoints, distortPoint(origin, distortFactor), radius);
    var points2 = distortPoints(points2, distortFactor);
    
    var interpolatedSplines2 = recurseInterpolation([points, points2], interpolationSteps);
    for (var i = 0; i < interpolatedSplines2.length; i++) {
        stroke(interpolatedColors2[i]);
        drawSplineLoop(interpolatedSplines2[i]);
    }

    // loop 3
    var nPoints = 10;
    var origin = {
        x: 600,
        y: 200
    }
    var radius = 400;
    var distortFactor = 80;

    var points = getLoopPoints(nPoints, origin, radius);
    var points = distortPoints(points, distortFactor);
    var points2 = getLoopPoints(nPoints, distortPoint(origin, distortFactor), radius);
    var points2 = distortPoints(points2, distortFactor);
    
    var interpolatedSplines3 = recurseInterpolation([points, points2], interpolationSteps);
    for (var i = 0; i < interpolatedSplines3.length; i++) {
        stroke(interpolatedColors3[i]);
        drawSplineLoop(interpolatedSplines3[i]);
    }
}

function draw() {

}

function getLoopPoints(nPoints, origin, radius) {
    var points = [];
    for (var i = 0; i < nPoints; i++) {
        points.push({
         x: origin.x + cos((i/nPoints) * TWO_PI) * radius,
         y: origin.y + sin((i/nPoints) * TWO_PI) * radius
        })
    }
    return points
}

function drawSplineLoop(points) {
    beginShape();
        for (var i = 0; i < points.length; i++) {
            curveVertex(points[i].x, points[i].y);
        }   
        curveVertex(points[0].x, points[0].y);
        curveVertex(points[1].x, points[1].y);
        curveVertex(points[2].x, points[2].y);
    endShape();
}

function distortPoint(point, distortFactor) {
    return {
        x: point.x + random(-distortFactor,distortFactor),
        y: point.y + random(-distortFactor,distortFactor)
    };
}

function distortPoints(points, distortFactor) {
    var distortedPoints = [];
    for (var i = 0; i < points.length; i++) {
        distortedPoints.push(distortPoint(points[i], distortFactor));
    }
    return distortedPoints;
}

function interpolatePoints(points, points2) {
    if (points.length === points2.length) {
        colorMode(HSB, points.length);
        middles = [];
        for (var i = 0; i < points.length; i++) {
            if (DEBUG) {
                fill(i,points.length,points.length);
                ellipse(points[i].x, points[i].y, 5,5);
                ellipse(points2[i].x, points2[i].y, 5,5);
            }

            // calculate middle between points
            middles.push({
                x: points[i].x - (0.5 * (points[i].x - points2[i].x)),
                y: points[i].y - (0.5 * (points[i].y - points2[i].y))
            });
        }
        noFill();
        colorMode(RGB, 255);
        return middles;
    }
    else {
        return false;
    }
}

function recurseInterpolation(splineLoops, cycles) {
    if (cycles == 0) {
        if (DEBUG) {
            console.log("basecase");
        }
        return splineLoops;
    }
    else {
        var interpolatedSplines = []
        interpolatedSplines.push(splineLoops[0]);
        for (var i = 0; i < splineLoops.length; i++) {
            if (splineLoops[i+1]) {
                if (DEBUG) {
                    console.log(i);
                }
                interpolatedSplines.push(interpolatePoints(splineLoops[i], splineLoops[i+1]));
                interpolatedSplines.push(splineLoops[i+1]);
            }
        }
        return recurseInterpolation(interpolatedSplines, cycles - 1)
    }
}

function recurseInterpolateColors(colors, cycles) {
    if (cycles == 0) {
        if (DEBUG) {
            console.log('basecase colors');
        }
        return colors
    }
    else {
        var interpolatedColors = [];
        interpolatedColors.push(colors[0]);
        for (var i = 0; i < colors.length; i++) {
            if (colors[i+1]) {
                if (DEBUG) {
                    console.log(i);
                }
                interpolatedColors.push(lerpColor(colors[i], colors[i+1], 0.5));
                interpolatedColors.push(colors[i+1]);
            }
        }
        return recurseInterpolateColors(interpolatedColors, cycles - 1);
    }
}