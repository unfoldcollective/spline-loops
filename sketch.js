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

function SplineLoop(settings) {
    // extend default settings
    var defaultSettings = {
        nPoints: 10,
        origin: {
            x: 250,
            y: 250
        },
        radius: 200,
        distortFactor: 60,
        colors: [color('#0096AC'), color('#FBD2CE')],
        interpolationSteps: 4,
        moveFactor: 0.4
    };
    defaultSettings.distortFactor = defaultSettings.radius / 5;
    this.settings = merge_options(defaultSettings, settings);

    this.DEBUG = false;

    this.update = function () {
        this.moveSpline(this.spline1, this.orginalSpline1, 1);
        this.moveSpline(this.spline2, this.orginalSpline2, -1);
        this.interpolateSplines();
    }

    this.moveSpline = function (spline, baseSpline, sign) {
        for (var i = 0; i < spline.length; i++) {
            var mouseDiffX = sign * (mouseX - this.settings.origin.x);
            var mouseDiffY = sign * (mouseY - this.settings.origin.y);
            spline[i].x = baseSpline[i].x + this.settings.moveFactor * mouseDiffX;
            spline[i].y = baseSpline[i].y + this.settings.moveFactor * mouseDiffY;
        }
    }

    this.getLoopPoints = function(nPoints, origin, radius) {
        var points = [];
        for (var i = 0; i < nPoints; i++) {
            points.push({
             x: origin.x + cos((i/nPoints) * TWO_PI) * radius,
             y: origin.y + sin((i/nPoints) * TWO_PI) * radius
            })
        }
        return points
    };

    this.generateSplines = function () {
        this.spline1 = this.getLoopPoints(this.settings.nPoints, this.settings.origin, this.settings.radius);
        this.spline1 = this.distortPoints(this.spline1, this.settings.distortFactor);
        // save deep copy (not by reference)
        this.orginalSpline1 = JSON.parse(JSON.stringify(this.spline1));

        this.spline2 = this.getLoopPoints(this.settings.nPoints, this.settings.origin, this.settings.radius);
        this.spline2 = this.distortPoints(this.spline2, this.settings.distortFactor);
        // save deep copy (not by reference)
        this.orginalSpline2 = JSON.parse(JSON.stringify(this.spline2));
    };

    this.interpolateSplines = function () {
        this.interpolatedSplines = this.recurseInterpolation([this.spline1, this.spline2], this.settings.interpolationSteps);
    };

    this.interpolateColors = function () {
        this.interpolatedColors = this.recurseInterpolateColors(this.settings.colors, this.settings.interpolationSteps);
    };

    this.drawSplineLoop = function (points) {
        beginShape();
            for (var i = 0; i < points.length; i++) {
                curveVertex(points[i].x, points[i].y);
            }   
            curveVertex(points[0].x, points[0].y);
            curveVertex(points[1].x, points[1].y);
            curveVertex(points[2].x, points[2].y);
        endShape();
    }
    
    this.drawSplines = function () {
        for (var i = 0; i < this.interpolatedSplines.length; i++) {
            if (this.interpolatedColors) {
                stroke(this.interpolatedColors[i]);
            }
            this.drawSplineLoop(this.interpolatedSplines[i]);
        }
    };

    this.distortPoint = function (point, distortFactor) {
        return {
            x: point.x + random(-distortFactor,distortFactor),
            y: point.y + random(-distortFactor,distortFactor)
        };
    };

    this.distortPoints = function (points, distortFactor) {
        var distortedPoints = [];
        for (var i = 0; i < points.length; i++) {
            distortedPoints.push(this.distortPoint(points[i], distortFactor));
        }
        return distortedPoints;
    };

    this.interpolatePoints = function (points, points2) {
        if (points.length === points2.length) {
            colorMode(HSB, points.length);
            middles = [];
            for (var i = 0; i < points.length; i++) {
                if (this.DEBUG) {
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
    };

    this.recurseInterpolation = function (splineLoops, cycles) {
        if (cycles == 0) {
            return splineLoops;
        }
        else {
            var interpolatedSplines = []
            interpolatedSplines.push(splineLoops[0]);
            for (var i = 0; i < splineLoops.length; i++) {
                if (splineLoops[i+1]) {
                    interpolatedSplines.push(this.interpolatePoints(splineLoops[i], splineLoops[i+1]));
                    interpolatedSplines.push(splineLoops[i+1]);
                }
            }
            return this.recurseInterpolation(interpolatedSplines, cycles - 1)
        }
    };

    this.recurseInterpolateColors = function (colors, cycles) {
        if (cycles == 0) {
            return colors
        }
        else {
            var interpolatedColors = [];
            interpolatedColors.push(colors[0]);
            for (var i = 0; i < colors.length; i++) {
                if (colors[i+1]) {
                    interpolatedColors.push(lerpColor(colors[i], colors[i+1], 0.5));
                    interpolatedColors.push(colors[i+1]);
                }
            }
            return this.recurseInterpolateColors(interpolatedColors, cycles - 1);
        }
    };

    this.generateSplines();
    this.interpolateSplines();
    this.interpolateColors();

}

/***********/
/* Helpers */
/***********/

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}