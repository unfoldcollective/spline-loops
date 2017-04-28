var speakerNames = [
    "<div class='event-name semi-bold'>Welcome</div>",
    "<div class='event-name semi-bold'>Daniel Llugany | Domestic Data Streamers</div><span class='event-title extra-light'>New Data Languages 😍</span>",
    "<div class='event-name semi-bold'>Gene Kogan</div><span class='event-title extra-light'>Machine Learning for Artists</span>",
    "<div class='event-name semi-bold'>Break</div><span class='event-title extra-light'>13:00 - 14:00</span>",
    "<div class='event-name semi-bold'>Santi Vilanova | Playmodes</div><span class='event-title extra-light'>Immersive Experiences</span>",
    "<div class='event-name semi-bold'>Mario Klingemann</div><span class='event-title extra-light'>Artificial Intelligence</span>",
    "<div class='event-name semi-bold'>Panel Discussion</div><span class='event-title extra-light'>Vera-Maria Glahn, Mario Klingemann, Santi Vilanova &amp; Mlady Pes</span>",
    "<div class='event-name semi-bold'>Break</div><span class='event-title extra-light'>16:50 - 17:30</span>",
    "<div class='event-name semi-bold'>Mária Júdová</div><span class='event-title extra-light'>Dance Tech</span>",
    "<div class='event-name semi-bold'>Vera-Maria Glahn | FIELD</div><span class='event-title extra-light'>Generative Audio-visual Experiences</span>",
    "<div class='event-name semi-bold'></div><span class='event-title extra-light'></span>",
    "<div class='event-name semi-bold'>\
        <p>Thank you</p>\
        <ul>\
            <li><span class='semi-bold'>Barbora Janáková</span> - <span class='extra-light'>PR, marketing, production assistance, girl for everything and mental support</span></li>\
            <li><span class='semi-bold'>Nina Adamcová</span> - <span class='extra-light'>artworks coordination, production assistance</span></li>\
            <li><span class='semi-bold'>Štefánia Lovasová</span> - <span class='extra-light'>Instagram and poster guru</span></li>\
            <li><span class='semi-bold'>Dominik Hlinka</span> - <span class='extra-light'>technical support</span></li>\
            <li><span class='semi-bold'>Michal Čudrnák &amp; Lukáš Štepanovský</span> - <span class='extra-light'>general support and helpfulness</span></li>\
            <li><span class='semi-bold'>Matúš Solčány</span> - <span class='extra-light'>bringing logic and scissors</span></li>\
            <li><span class='semi-bold'>Michal Chrastina</span> - <span class='extra-light'>strong hands and mind</span></li>\
            <li><span class='semi-bold'>Anna Hunčíková</span> - <span class='extra-light'>welcome team</span></li>\
            <li><span class='semi-bold'>Dominika Dubačová</span> - <span class='extra-light'>welcome team and driving</span></li>\
            <li><span class='semi-bold'>Miri</span> - <span class='extra-light'>documentation</span></li>\
            <li><span class='semi-bold'>Lukrécia Tilandyová</span> - <span class='extra-light'>tastiness</span></li>\
            <li><span class='semi-bold'>Mad Drop</span> - <span class='extra-light'>energy</span></li>\
            <li><span class='semi-bold'>Róbert Bonko</span> - <span class='extra-light'>sound</span></li>\
            <li><span class='semi-bold'>Braňo Valter</span> - <span class='extra-light'>sound and picture</span></li>\
            <li><span class='semi-bold'>Ján Adášek</span> - <span class='extra-light'>atmosphere</span></li>\
            <li><span class='semi-bold'>Matej Fandl &amp; Lubica Drangová</span> - <span class='extra-light'>mental support and general helpfulness</span></li>\
            <li><span class='semi-bold'>Zuzana Beniacová &amp; Jana Binder</span> - <span class='extra-light'>going one step further than neccessary </span></li>\
        </ul>\
    </div>\
    <div class='mt4'>\
        <img title='FPU' class='mr4 ph2 dib w5' src='./img/partners/logo-fpu.jpg' alt='FPU'>\
        <img title='Studio 727' class='mh4 ph2 dib w4' src='./img/partners/logo-727.svg' alt='Studio 727'>\
        <img title='Nethemba' class='mh4 ph2 dib w4' src='./img/partners/logo-nethemba.png' alt='Nethemba'>\
    </div>",
];
var speakerIndex = 0;
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

    // setMouseMoveListener(document);

    var cursorIntervalID = window.setInterval(setRandomCursorPos, 5000);

    speakerText = addText(speakerNames[0]);

    // Create an Audio input
    mic = new p5.AudioIn();
    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();
}

function setRandomCursorPos() {
    var randX = getRandomInt(0, width);
    var randY = getRandomInt(0, height);
    splineLoop1.setCursor({x: randX, y: randY});
}

/*
 * set mousemove listener, extending obj with boolean attr obj.hasMouseMoved
 */
function setMouseMoveListener(obj) {
    obj.addEventListener('mousemove', function onFirstMouseMove() {
        obj.hasMouseMoved = true;
        if (typeof mouseTimeout !== 'undefined') {
            clearTimeout(mouseTimeout);
        }
        var mouseTimeout = setTimeout(function () {
            obj.hasMouseMoved = false;
        }, 5000);
    }, false);
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
    speakerIndex = index;
    console.log('setSpeakerText: ' + index);
    speakerText.elt.innerHTML = speakerNames[index];
}

function keyPressed() {
    // console.log(key)
    // console.log(keyCode)
    if (parseInt(key) > 0 && parseInt(key) <= speakerNames.length) {
        setSpeakerText(parseInt(key)-1);
        // set random spline colour combi
        var randomColorCombi = colorCombinations[getRandomInt(0, colorCombinations.length)];
        splineLoop1.setColors(randomColorCombi[0], randomColorCombi[1]);
        // set random spline shape
        splineLoop1.generateSplines();
    } else if (key === "C") {
        toggleCursor();
    } else if (key === "F") {
        toggleFullScreen();
    } else if (keyCode === LEFT_ARROW) {
        // set previous speaker
        if (speakerIndex > 0) {
            setSpeakerText(speakerIndex-1);
            // set random spline colour combi
            var randomColorCombi = colorCombinations[getRandomInt(0, colorCombinations.length)];
            splineLoop1.setColors(randomColorCombi[0], randomColorCombi[1]);
            // set random spline shape
            splineLoop1.generateSplines();
        }
    } else if (keyCode === RIGHT_ARROW) {
        // set next speaker
        if (speakerIndex < speakerNames.length - 1) {
            setSpeakerText(speakerIndex + 1);
            // set random spline colour combi
            var randomColorCombi = colorCombinations[getRandomInt(0, colorCombinations.length)];
            splineLoop1.setColors(randomColorCombi[0], randomColorCombi[1]);
            // set random spline shape
            splineLoop1.generateSplines();
        }
    }
    // uncomment to prevent any default behavior
    // return false;
}

function addText(string) {
    myText = createDiv(string);
    myText.class("text");
    return myText;
}

function mousePressed() {
}

function toggleFullScreen() {
    var fs = fullscreen();
    fullscreen(!fs);
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
    background(0);
    splineLoop1.update();
    splineLoop1.draw();

    // splineLoop1.setCursor({x: mouseX, y: mouseY});

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