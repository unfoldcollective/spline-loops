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

    speakerText = addText(speakerNames[0])
}

function includes(array, item) {
    return array.indexOf(item) > -1
}

function setSpeakerText(index) {
    console.log('setSpeakerText')
    console.log(index);
    speakerText.elt.innerHTML = speakerNames[index];
}

function keyTyped() {
    if (parseInt(key) > 0 && parseInt(key) <= speakerNames.length) {
        setSpeakerText(parseInt(key)-1)
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
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}