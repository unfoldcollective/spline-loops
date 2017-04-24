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

var speakerNames = [
    "<div class='event-name'>Daniel Llugany | Domestic Data Streamers</div><span class='event-title extra-light'>New Data Languages 😍</span>",
    "<div class='event-name'>Gene Kogan</div><span class='event-title extra-light'>Machine Learning for Artists</span>",
    "<div class='event-name'>Santi Vilanova | Playmodes</div><span class='event-title extra-light'>Immersive Experiences</span>",
    "<div class='event-name'>Mario Klingemann</div><span class='event-title extra-light'>Artificial Intelligence</ispan",
    "<div class='event-name'>Panel Discussion</div><span class='event-title extra-light'>Vera-Maria Glahn, Mario Klingemann, Santi Vilanova &amp; Mlady Pes</span>",
    "<div class='event-name'>Mária Júdová</div><span class='event-title extra-light'>Dance Tech</ispan",
    "<div class='event-name'>Vera-Maria Glahn | FIELD</div><span class='event-title extra-light'>Generative Audio-visual Experiences</span>"
];
var speakerText;
var showCursor = true;
var colorCombinations;

var mic;

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
    
    var colors = [teal, pink, purple, green];
    colorCombinations = combine(colors);

    splineSettings1 = {
        nPoints: 8,
        origin: {
            x: 0.6 * width,
            y: 0.4 * height
        },
        radius: 300,
        distortFactor: 150,
        colors: [teal, pink],
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

    speakerText = addText(speakerNames[0])

    // Create an Audio input
    mic = new p5.AudioIn();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();
}

function combine(colors) {
    var combinations = []
    for (var i = colors.length - 1; i >= 0; i--) {
        for (var j = colors.length - 1; j >= 0; j--) {
            if (colors[i] !== colors[j]) {
                combinations.push([colors[i], colors[j]])
            }
        }
    }
    return combinations
}

function includes(array, item) {
    return array.indexOf(item) > -1
}

function setSpeakerText(index) {
    console.log('setSpeakerText: ' + index);
    speakerText.elt.innerHTML = speakerNames[index];
}

function keyTyped() {
    if (parseInt(key) > 0 && parseInt(key) <= speakerNames.length) {
        setSpeakerText(parseInt(key)-1);
        var randomColorCombi = colorCombinations[getRandomInt(0, colorCombinations.length)];
        splineLoop1.setColors(randomColorCombi[0], randomColorCombi[1]);
    } else if (key === "c") {
        toggleCursor();
    }
    // uncomment to prevent any default behavior
    // return false;
}

function addText(string) {
    myText = createDiv(string);
    myText.class("text");
    return myText;
}

function mouseClicked() {
}

function toggleCursor() {
    if (showCursor) {
        noCursor();
    } else {
        cursor(ARROW);
    }
    showCursor = !showCursor;
}

function draw() {
    if (hasMouseMoved) {
        background(0);
        splineLoop1.update();
        splineLoop1.draw();
    }
    // Get the overall volume (between 0 and 1.0)
    var vol = mic.getLevel();
    splineLoop1.setVertexFactor(1+vol);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}