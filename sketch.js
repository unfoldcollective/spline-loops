function setup() {
    createCanvas(500, 500);
    background(0);
    stroke(255);
    noFill();
    var nPoints = 10;
    var origin = {
        x: 250,
        y: 250
    }
    var radius = 160;
    var distortFactor = 40;
    var points = getLoopPoints(nPoints, origin, radius);
    var points = distortPoints(points, distortFactor);
    drawSplineLoop(points);
    
    var points2 = getLoopPoints(nPoints, distortPoint(origin, 40), radius);
    var points2 = distortPoints(points2, distortFactor);
    drawSplineLoop(points2);

    // interpolation 1
    var pointsInterpolated = interpolatePoints(points, points2);
    drawSplineLoop(pointsInterpolated);

    // interpolation 2
    var pointsInterpolated2 = interpolatePoints(points, pointsInterpolated);
    drawSplineLoop(pointsInterpolated2);

    var pointsInterpolated3 = interpolatePoints(points2, pointsInterpolated);
    drawSplineLoop(pointsInterpolated3);

    // interpolation 3
    var pointsInterpolated4 = interpolatePoints(points, pointsInterpolated2);
    drawSplineLoop(pointsInterpolated4);
    
    var pointsInterpolated5 = interpolatePoints(pointsInterpolated2, pointsInterpolated);
    drawSplineLoop(pointsInterpolated5);

    var pointsInterpolated6 = interpolatePoints(pointsInterpolated, pointsInterpolated3);
    drawSplineLoop(pointsInterpolated6);
    
    var pointsInterpolated7 = interpolatePoints(pointsInterpolated3, points2);
    drawSplineLoop(pointsInterpolated7);
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
            fill(i,points.length,points.length);
            ellipse(points[i].x, points[i].y, 5,5);
            ellipse(points2[i].x, points2[i].y, 5,5);

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