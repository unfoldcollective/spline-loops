function setup() {
    createCanvas(500, 500);
    background(0);
    stroke(255);
    noFill();
    var nPoints = 20;
    var points = getLoopPoints(nPoints, {x: 250, y: 250}, 200);
    
    var points = distortPoints(points, 10);
    drawSplineLoop(points);
    
    var points = distortPoints(points, 10);
    drawSplineLoop(points);
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

function distortPoints(points, distortFactor) {
    var distortedPoints = [];
    for (var i = 0; i < points.length; i++) {
        distortedPoints.push({
            x: points[i].x + random(-distortFactor,distortFactor),
            y: points[i].y + random(-distortFactor,distortFactor)
        }) 
    }
    return distortedPoints;
}