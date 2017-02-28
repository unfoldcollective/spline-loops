var DEBUG = false;

function setup() {
    createCanvas(800, 800);
    background(0);
    stroke(255);
    noFill();
    var nPoints = 10;
    var origin = {
        x: 400,
        y: 400
    }
    var radius = 240;
    var distortFactor = 80;

    var points = getLoopPoints(nPoints, origin, radius);
    var points = distortPoints(points, distortFactor);
    
    var points2 = getLoopPoints(nPoints, distortPoint(origin, 80), radius);
    var points2 = distortPoints(points2, distortFactor);
    
    var interpolatedSplines = recurseInterpolation([points, points2], 4);
    console.log(interpolatedSplines);
    for (var i = 0; i < interpolatedSplines.length; i++) {
        drawSplineLoop(interpolatedSplines[i]);
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
        console.log("basecase");
        return splineLoops;
    }
    else {
        var interpolatedSplines = []
        interpolatedSplines.push(splineLoops[0]);
        for (var i = 0; i < splineLoops.length; i++) {
            if (splineLoops[i+1]) {
                console.log(i);
                interpolatedSplines.push(interpolatePoints(splineLoops[i], splineLoops[i+1]));
                interpolatedSplines.push(splineLoops[i+1]);
            }
        }
        return recurseInterpolation(interpolatedSplines, cycles - 1)
    }
}