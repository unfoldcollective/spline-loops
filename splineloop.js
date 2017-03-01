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
        movement: {
            moveFactor: 0.2,    // 0 == no positional animation
            noiseFactor: 0,     // 0 == no noise
            easeFactor: 1,      // 1 == no easing
            tightnessFactor: 0  // 0 == no tightness animation 
        }
    };
    defaultSettings.distortFactor = defaultSettings.radius / 5;
    this.settings = merge_options(defaultSettings, settings);

    this.DEBUG = false;

    this.noise = 1 - random(this.settings.movement.noiseFactor);
    console.log(this.noise);

    // set initial mouse pos to middle of screen to ensure neutral perspective on load
    mouseX = 0.5 * width;
    mouseY = 0.5 * height;

    this.update = function () {
        
        // eased perspective shift based on mouse position
        this.easeSplinePos(this.spline1, 1);
        this.easeSplinePos(this.spline2, -1);

        // shift tightness of curves
        this.shiftTightness();

        this.interpolateSplines();
    };

    this.easeSplinePos = function (spline, sign) {
        var mouseDiffX = mouseX - this.settings.origin.x;
        var mouseDiffY = mouseY - this.settings.origin.y;
        var targetX = this.settings.origin.x + mouseDiffX * sign * this.settings.movement.moveFactor * this.noise;
        var targetY = this.settings.origin.y + mouseDiffY * sign * this.settings.movement.moveFactor * this.noise;
        var dX = (targetX - getCentroid(spline).x);
        var dY = (targetY - getCentroid(spline).y);
        
        for (var i = 0; i < spline.length; i++) {
            // move points closer to target
            spline[i].x += this.settings.movement.easeFactor * dX;
            spline[i].y += this.settings.movement.easeFactor * dY;
        }
    };

    /* DEPRECATED 
     * equivalent behaviour achieved via easeSplinePost with easeFactor == 1 
     */
    this.shiftSplinePos = function (spline, baseSpline, sign) {
        var mouseDiffX = mouseX - this.settings.origin.x;
        var mouseDiffY = mouseY - this.settings.origin.y;
        for (var i = 0; i < spline.length; i++) {
            spline[i].x = baseSpline[i].x + mouseDiffX * sign * this.settings.movement.moveFactor * this.noise;
            spline[i].y = baseSpline[i].y + mouseDiffY * sign * this.settings.movement.moveFactor * this.noise;
        }
    };
    
    this.shiftTightness = function () {
        var t = map(mouseX, 0, width, 0, -5);
        curveTightness(t * this.settings.movement.tightnessFactor);
    };

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
        this.interpolatedSplines = this.recurseInterpolateSplines([this.spline1, this.spline2], this.settings.interpolationSteps);
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
            middles = [];
            for (var i = 0; i < points.length; i++) {
                if (this.DEBUG) {
                    colorMode(HSB, points.length);
                    noStroke();
                    fill(i,points.length,points.length);
                    ellipse(points[i].x, points[i].y, 5,5);
                    ellipse(points2[i].x, points2[i].y, 5,5);
                    noFill();
                    colorMode(RGB, 255);
                }

                // calculate middle between points
                middles.push({
                    x: points[i].x - (0.5 * (points[i].x - points2[i].x)),
                    y: points[i].y - (0.5 * (points[i].y - points2[i].y))
                });
            }
            return middles;
        }
        else {
            return false;
        }
    };

    this.recurseInterpolateSplines = function (splineLoops, cycles) {
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
            return this.recurseInterpolateSplines(interpolatedSplines, cycles - 1)
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

function getCentroid(points) {
    total = {x: 0, y: 0};
    for (var i = 0; i < points.length; i++) {
        total.x += points[i].x;
        total.y += points[i].y;
    }
    centroid = {
        x: total.x / points.length,
        y: total.y / points.length
    }
    return centroid;
}