(function (window) {

    var Happy = window.Happy || {};
    window.Happy = window.Happy || Happy;

    Happy.MathUtil = {};

    //radians and degrees
    Happy.MathUtil.PI_180 = Math.PI / 180;
    Happy.MathUtil.ONE80_PI = 180 / Math.PI;

    //precalculations for values of radians
    Happy.MathUtil.PI2 = Math.PI * 2;
    Happy.MathUtil.HALF_PI = Math.PI / 2;


    //return number between 1 and 0
    Happy.MathUtil.normalize = function (value, minimum, maximum) {
        return (value - minimum) / (maximum - minimum);
    };

    //map normalized number to values
    Happy.MathUtil.interpolate = function (normValue, minimum, maximum) {
        return minimum + (maximum - minimum) * normValue;
    };

    //map value from one set to another
    Happy.MathUtil.map = function (value, min1, max1, min2, max2) {
        return Happy.MathUtil.interpolate(Happy.MathUtil.normalize(value, min1, max1), min2, max2);
    };

    Happy.MathUtil.getRandomNumberInRange = function (min, max) {
        return min + Math.random() * (max - min);
    };

    Happy.MathUtil.getRandomIntegerInRange = function (min, max) {
        return Math.round(Happy.MathUtil.getRandomNumberInRange(min, max));
    };


}(window));

(function (window) {

    var Happy = window.Happy || {};
    window.Happy = window.Happy || Happy;

    Happy.Geom = {};


    //Point
    Happy.Geom.Point = function (x, y) {
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    Happy.Geom.Point.prototype.clone = function () {
        return new Happy.Geom.Point(this.x, this.y);
    };

    Happy.Geom.Point.prototype.update = function (x, y) {
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    };

    Happy.Geom.Point.prototype.equals = function (point) {
        return this.x == point.x && this.y == point.y;
    };

    Happy.Geom.Point.prototype.toString = function () {
        return "{x:" + this.x + " , y:" + this.y + "}";
    };

    //rectangle  
    Happy.Geom.Rectangle = function (x, y, width, height) {
        this.update(x, y, width, height);
    };

    Happy.Geom.Rectangle.prototype.update = function (x, y, width, height) {
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
        this.width = isNaN(width) ? 0 : width;
        this.height = isNaN(height) ? 0 : height;
    };

    Happy.Geom.Rectangle.prototype.getRight = function () {
        return this.x + this.width;
    };

    Happy.Geom.Rectangle.prototype.getBottom = function () {
        return this.y + this.height;
    };

    Happy.Geom.Rectangle.prototype.getCenterX = function () {
        return this.x + this.width / 2;
    };

    Happy.Geom.Rectangle.prototype.getCenterY = function () {
        return this.y + this.height / 2;
    };

    Happy.Geom.Rectangle.prototype.containsPoint = function (x, y) {
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };

    Happy.Geom.Rectangle.prototype.clone = function () {
        return new Happy.Geom.Rectangle(this.x, this.y, this.width, this.height);
    };

    Happy.Geom.Rectangle.prototype.toString = function () {
        return "Rectangle{x:" + this.x + " , y:" + this.y + " , width:" + this.width + " , height:" + this.height + "}";
    };

}(window));

(function (window) {

    var Happy = window.Happy || {};
    window.Happy = window.Happy || Happy;

    Happy.CanvasTextUtil = {};

    //return the biggest font size
    Happy.CanvasTextUtil.getFontSizeForRect = function (string, fontProps, rect, canvas, fillStyle) {
        if (!canvas) {
            var canvas = document.createElement("canvas");
        }
        if (!fillStyle) {
            fillStyle = "#000000";
        }
        var context = canvas.getContext('2d');
        context.font = fontProps.getFontString();
        context.textBaseline = "top";

        var copy = fontProps.clone();
        context.font = copy.getFontString();
        var width = context.measureText(string).width;

        if (width < rect.width) {
            while (context.measureText(string).width < rect.width || copy.fontSize * 1.5 < rect.height) {
                copy.fontSize++;
                context.font = copy.getFontString();
            }
        } else if (width > rect.width) {
            while (context.measureText(string).width > rect.width || copy.fontSize * 1.5 > rect.height) {
                copy.fontSize--;
                context.font = copy.getFontString();
            }
        }
        return copy.fontSize;
    }

    //Canvas text properties
    Happy.CanvasTextProperties = function (fontWeight, fontStyle, fontSize, fontFace) {
        this.setFontWeight(fontWeight);
        this.setFontStyle(fontStyle);
        this.setFontSize(fontSize);
        this.fontFace = fontFace ? fontFace : "Comic Sans MS";
    };

    Happy.CanvasTextProperties.NORMAL = "normal";
    Happy.CanvasTextProperties.BOLD = "bold";
    Happy.CanvasTextProperties.BOLDER = "bolder";
    Happy.CanvasTextProperties.LIGHTER = "lighter";
    Happy.CanvasTextProperties.ITALIC = "italic";
    Happy.CanvasTextProperties.OBLIQUE = "oblique";

    Happy.CanvasTextProperties.prototype.setFontWeight = function (fontWeight) {
        switch (fontWeight) {
            case Happy.CanvasTextProperties.NORMAL:
            case Happy.CanvasTextProperties.BOLD:
            case Happy.CanvasTextProperties.BOLDER:
            case Happy.CanvasTextProperties.LIGHTER:
                this.fontWeight = fontWeight;
                break;
            default:
                this.fontWeight = Happy.CanvasTextProperties.NORMAL;
        }
    };

    Happy.CanvasTextProperties.prototype.setFontStyle = function (fontStyle) {
        switch (fontStyle) {
            case Happy.CanvasTextProperties.NORMAL:
            case Happy.CanvasTextProperties.ITALIC:
            case Happy.CanvasTextProperties.OBLIQUE:
                this.fontStyle = fontStyle;
                break;
            default:
                this.fontStyle = Happy.CanvasTextProperties.NORMAL;
        }
    };

    Happy.CanvasTextProperties.prototype.setFontSize = function (fontSize) {
        if (fontSize && fontSize.indexOf && fontSize.indexOf("px") > -1) {
            var size = fontSize.split("px")[0];
            fontProperites.fontSize = isNaN(size) ? 24 : size;//24 is just an arbitrary number
            return;
        }
        this.fontSize = isNaN(fontSize) ? 24 : fontSize;//24 is just an arbitrary number
    };

    Happy.CanvasTextProperties.prototype.clone = function () {
        return new Happy.CanvasTextProperties(this.fontWeight, this.fontStyle, this.fontSize, this.fontFace);
    };

    Happy.CanvasTextProperties.prototype.getFontString = function () {
        return this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px " + this.fontFace;
    };

}(window));

window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        return function (callback, element) {
            var lastTime = element.__lastTime;
            if (lastTime === undefined) {
                lastTime = 0;
            }
            var currTime = Date.now();
            var timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
        };
    })();

var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);

//set up general properties
var canvas;
var context;
var canvasContainer;
var htmlBounds;
var bounds;
var minimumStageWidth = 300;
var minimumStageHeight = 300;
var maxStageWidth = 800;
var maxStageHeight = 1100;
var resizeTimeoutId = -1;

function init() {
    canvasContainer = document.getElementById("canvasContainer");
    window.onresize = resizeHandler;
    window.addEventListener("keydown", keyUpEventHandler, false)
    commitResize();
}

function getWidth(element) { return Math.max(element.scrollWidth, element.offsetWidth, element.clientWidth); }
function getHeight(element) { return Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight); }

//when the browser window is being resized by dragging, avoid running resize scripts repeatedly
function resizeHandler() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearTimeout(resizeTimeoutId);
    clearTimeoutsAndIntervals();
    resizeTimeoutId = setTimeout(commitResize, 300);
}

function commitResize() {
    if (canvas) {
        canvasContainer.removeChild(canvas);
    }
    canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    htmlBounds = new Happy.Geom.Rectangle(0, 0, getWidth(canvasContainer), getHeight(canvasContainer));
    if (htmlBounds.width >= maxStageWidth) {
        canvas.width = maxStageWidth;
        canvas.style.left = htmlBounds.getCenterX() - (maxStageWidth / 2) + "px";
    } else {
        canvas.width = htmlBounds.width;
        canvas.style.left = "0px";
    }
    if (htmlBounds.height > maxStageHeight) {
        canvas.height = maxStageHeight;
        canvas.style.top = htmlBounds.getCenterY() - (maxStageHeight / 2) + "px";
    } else {
        canvas.height = htmlBounds.height;
        canvas.style.top = "0px";
    }
    bounds = new Happy.Geom.Rectangle(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (bounds.width < minimumStageWidth || bounds.height < minimumStageHeight) {
        stageTooSmallHandler();
        return;
    }
    startDemo();
}

function stageTooSmallHandler() {
    var warning = "Sorry, bigger screen required :(";
    context.font = "bold normal 24px Comic Sans MS";
    context.fillText(warning, bounds.getCenterX() - context.measureText(warning).width / 2, bounds.getCenterY() - 12);
}

//Demo specific properties
var HOME = 0;
var GAME = 1;
var GAME_OVER = 2;
var gameState;
var scrollSpeed = 3;
var score;
var fontProperties = new Happy.CanvasTextProperties(Happy.CanvasTextProperties.BOLD, null, 100);
var word = "HAPPY"; 

function startDemo() {
    canvas.addEventListener('touchstart', handleUserTap, false);
    canvas.addEventListener('mousedown', handleUserTap, false);

    var logoText = "FLAPPY WORDS";
    if (!logoCanvas) {
        logoCanvas = document.createElement("canvas");
        logoCanvasBG = document.createElement("canvas");
    }
    createLogo("FLAPPY WORDS", logoCanvas, logoCanvasBG);
    if (!gameOverCanvas) {
        gameOverCanvas = document.createElement("canvas");
        gameOverCanvasBG = document.createElement("canvas");
    }
    createLogo("GAME OVER", gameOverCanvas, gameOverCanvasBG);

    createGroundPattern();
    createLife();
    createTubes();
    createCityGraphic();
    score = 0;
    gameState = HOME;
    loop();
}

function loop() {
    switch (gameState) {
        case HOME:
            renderHome();
            break;
        case GAME:
            renderGame();
            break;
        case GAME_OVER:
            renderGameOver();
            break;
    }
}

function handleUserTap(event) {
    switch (gameState) {
        case HOME:
            gameState = GAME;
            break;
        case GAME:
            lifeYSpeed = -tapBoost;
            break;
        case GAME_OVER:
            commitResize();
            break;
    }
    if (event) {
        event.preventDefault();
    }
}

function keyUpEventHandler(event) {
    if (event.keyCode == 38) {
        handleUserTap(event);
    }
}

function renderHome() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderGroundPattern();
    renderLogo();
    renderInstructions();
    window.requestAnimationFrame(loop, canvas);
}

function renderGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateTubes();
    renderTubes();
    updateLife();
    if (!characters.length) {
        gameOverHandler();
        return;
    }
    renderLife();
    renderGroundPattern();
    updateScore();
    renderScore();
    window.requestAnimationFrame(loop, canvas);
}

function gameOverHandler() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameState = GAME_OVER;
    renderGameOver();
}

function renderGameOver() {

    //game over logo
    context.drawImage(gameOverCanvas, bounds.getCenterX() - logoCanvas.width / 2, canvas.height * .2);

    var instruction = "Click or tap to flap again.";
    context.font = "bold normal 24px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width / 2, canvas.height * .25 + gameOverCanvas.height);
    renderScore();
}

function renderLogo() {
    logoCurrentY += logoDirection;
    context.drawImage(logoCanvas, bounds.getCenterX() - logoCanvas.width / 2, logoCurrentY);
    if (logoCurrentY <= logoY || logoCurrentY >= logoMaxY) {
        logoDirection *= -1;
    }
}

function renderInstructions() {
    var instruction = "Click or tap to flap :)";
    context.font = "bold normal 24px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width / 2, canvas.height * .2);
}

function renderScore() {
    context.font = fontProperties.getFontString();
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    var x = bounds.getCenterX() - context.measureText(score).width / 2;
    var y = bounds.height * .2;
    context.fillText(score, x, y);
    context.strokeText(score, x, y);
}

//LOGO
var logoCanvas;
var logoCanvasBG;

var gameOverCanvas;
var gameOverCanvasBG;

var logoY;
var logoCurrentY;
var logoMaxY;
var logoDirection;

function createLogo(logoText, logoCanvas, logoCanvassBG) {
    logoCanvas.width = logoCanvasBG.width = canvas.width;
    logoCanvas.height = logoCanvasBG.height = canvas.height / 4;
    logoCurrentY = logoY = canvas.height * .25;
    logoMaxY = canvas.height * .35;
    logoDirection = 1;
    var logoContext = logoCanvas.getContext("2d");
    logoContext.textBaseline = "top";
    var textRect = new Happy.Geom.Rectangle(0, 0, logoCanvas.width * .8, logoCanvas.height);
    var logoFontProps = fontProperties.clone();
    logoFontProps.fontSize = Happy.CanvasTextUtil.getFontSizeForRect(logoText, fontProperties, textRect);


    var logoBGContext = logoCanvasBG.getContext("2d");
    logoBGContext.fillStyle = "#f5eea6";
    logoBGContext.fillRect(0, 0, logoCanvasBG.width, logoCanvasBG.height);
    logoBGContext.fillStyle = "#9ce399";
    logoBGContext.fillRect(0, logoFontProps.fontSize / 2, logoCanvasBG.width, logoCanvasBG.height);

    logoContext.font = logoFontProps.getFontString();
    logoContext.fillStyle = logoContext.createPattern(logoCanvasBG, "repeat-x");
    logoContext.strokeStyle = "#000550";
    logoContext.lineWidth = 3;
    var x = logoCanvas.width / 2 - logoContext.measureText(logoText).width / 2;
    var y = logoFontProps.fontSize / 2;
    logoContext.fillText(logoText, x, 0);
    logoContext.strokeText(logoText, x, 0);
}

//life
var lifeCanvas;
var lifeYSpeed = 0;
var gravity = 1;
var tapBoost = 12;
var lifeSize = 60;

function updateLife() {
    characters[0].y += lifeYSpeed;
    lifeYSpeed += gravity;

    //floor
    if (characters[0].y >= groundGraphicRect.y - lifeCanvas.height) {
        characters[0].y = groundGraphicRect.y - lifeCanvas.height;
        lifeYSpeed = 0;
    }
    //celing
    if (characters[0].y <= 0) {
        characters[0].y = 1;
        lifeYSpeed = 0;
    }
    //tube collision
    if (!isHit && checkTubesCollision()) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        removeCharacter();
        isHit = true;
    }
}

var currentTube;
var isHit = false;
var ffScoreBugFix = 0;

function updateScore() {
    if (ffScoreBugFix > 10 && currentTube.topRect.getRight() < characters[0].x) {
        if (!isHit) {
            score++;
        }
        isHit = false;
        var index = tubes.indexOf(currentTube) + 1;
        index %= tubes.length;
        currentTube = tubes[index];
        ffScoreBugFix = 0;
    }
    ffScoreBugFix++;
}

function renderLife() {
    context.drawImage(characters[0].image, characters[0].x, characters[0].y);
    for (var i = 1; i < characters.length; i++) {
        characters[i].y = characters[i - 1].y - (characters[i - 1].y - characters[i].y) * .9;
        context.drawImage(characters[i].image, characters[i].x, characters[i].y);
    }
}

function removeCharacter() {
    if (characters.length == 1) {
        //game over
        gameState = GAME_OVER;
    }
    for (var i = 0; i < characters.length - 1; i++) {
        characters[i].image = characters[i + 1].image;
    }
    characters.pop();
}

function checkTubesCollision() {
    for (var i = 0; i < tubes.length; i++) {
        if (checkTubeCollision(tubes[i])) {
            return true;
        }
    }
    return false;
}

var collisionPoint = new Happy.Geom.Point();
var lifePoints = [];

function checkTubeCollision(tube) {
    lifePoints[0] = characters[0].x;
    lifePoints[1] = characters[0].y;
    lifePoints[2] = characters[0].x + lifeSize;
    lifePoints[3] = characters[0].y;
    lifePoints[4] = characters[0].x + lifeSize;
    lifePoints[5] = characters[0].y + lifeSize;
    lifePoints[6] = characters[0].x;
    lifePoints[7] = characters[0].y + lifeSize;
    for (var i = 0; i < 8; i += 2) {
        collisionPoint.x = lifePoints[i];
        collisionPoint.y = lifePoints[i + 1];
        if (tube.topRect.containsPoint(collisionPoint.x, collisionPoint.y) || tube.bottomRect.containsPoint(collisionPoint.x, collisionPoint.y)) {
            return true;
        }
    }
    return false;
}

var characters;
var lifeFontProperties = new Happy.CanvasTextProperties(Happy.CanvasTextProperties.BOLD, null, 50);

function createLife() {

    if (!lifeCanvas) {
        lifeCanvas = document.createElement("canvas");
    }
    lifeCanvas.width = lifeSize;
    lifeCanvas.height = lifeSize;

    characters = [];
    characters[0] = {}
    characters[0].x = canvas.width / 3;
    characters[0].y = groundGraphicRect.y / 2;
    characters[0].image = createCharacterImage(word.charAt(word.length - 1));

    var x = characters[0].x - (lifeCanvas.width + lifeCanvas.width * .2);
    for (var i = 1; i < word.length; i++) {
        characters[i] = {};
        characters[i].x = x;
        characters[i].y = characters[0].y;
        x -= (lifeCanvas.width + lifeCanvas.width * .2);
        characters[i].image = createCharacterImage(word.charAt(word.length - i - 1));
    }
}

function createCharacterImage(character) {
    var lifeContext = lifeCanvas.getContext("2d");
    lifeContext.textBaseline = "top";
    lifeContext.font = lifeFontProperties.getFontString();
    lifeContext.fillStyle = "#d5bb22";
    lifeContext.fillRect(0, 0, lifeSize, lifeSize);
    lifeContext.fillStyle = "#e8fcd6";
    lifeContext.fillText(character, lifeSize / 2 - lifeContext.measureText(character).width / 2, 0);
    lifeContext.strokeText(character, lifeSize / 2 - lifeContext.measureText(character).width / 2, 0);

    var image = new Image();
    image.width = lifeSize;
    image.height = lifeSize;
    image.src = lifeCanvas.toDataURL();
    return image;
}

//tubes
var tubeGapHeight = 230;
var tubesGapWidth;
var tubes;
var tubeWidth = 100;
var minTubeHeight = 50;

function updateTubes() {
    for (var i = 0; i < tubes.length; i++) {
        updateTube(tubes[i]);
    }
}

function updateTube(tube) {
    tube.topRect.x -= scrollSpeed;
    tube.bottomRect.x = tube.topRect.x;
    if (tube.topRect.x <= -tubeWidth) {
        tube.topRect.x = tube.bottomRect.x = canvas.width;
        renderTube(tube);
    }
}


function renderTubes() {
    for (var i = 0; i < tubes.length; i++) {
        context.drawImage(tubes[i].canvas, tubes[i].bottomRect.x, 0);
    }
}

function createTubes() {
    tubes = [];
    var totalTubes = 2;
    tubesGapWidth = Math.floor(canvas.width / totalTubes);

    for (var i = 0; i < totalTubes; i++) {
        tubes[i] = {};
        tubes[i].canvas = document.createElement("canvas");
        tubes[i].topRect = new Happy.Geom.Rectangle(canvas.width + (i * tubesGapWidth));
        tubes[i].bottomRect = new Happy.Geom.Rectangle(canvas.width + (i * tubesGapWidth));
        renderTube(tubes[i]);
    }
    currentTube = tubes[0];
}

var tubeOutlineColor = "#534130";
var tubeMainColor = "#75be2f";
var tubeCapHeight = 40;

function renderTube(tube) {
    tube.canvas.width = tubeWidth;
    tube.canvas.height = groundGraphicRect.y;

    tube.bottomRect.width = tube.topRect.width = tubeWidth;
    tube.topRect.y = 0;
    tube.topRect.height = minTubeHeight + Math.round(Math.random() * (groundGraphicRect.y - tubeGapHeight - minTubeHeight * 2));

    tube.bottomRect.y = tube.topRect.getBottom() + tubeGapHeight;
    tube.bottomRect.height = groundGraphicRect.y - tube.bottomRect.y - 1;//minus one for stroke

    var tubeContext = tube.canvas.getContext("2d");
    tubeContext.lineWidth = 2;
    //top tube
    renderTubeElement(tubeContext, 3, 0, tubeWidth - 6, tube.topRect.height);
    renderTubeElement(tubeContext, 1, tube.topRect.getBottom() - tubeCapHeight, tubeWidth - 2, tubeCapHeight);

    //bottom tube
    renderTubeElement(tubeContext, 3, tube.bottomRect.y, tubeWidth - 6, tube.bottomRect.height);
    renderTubeElement(tubeContext, 1, tube.bottomRect.y, tubeWidth - 2, tubeCapHeight);
}

function renderTubeElement(ctx, x, y, width, height) {
    ctx.fillStyle = tubeMainColor;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#9de85a";
    ctx.fillRect(x, y, width * .25, height);

    ctx.fillStyle = "#d9f881";
    ctx.fillRect(x + width * .05, y, width * .05, height);

    ctx.fillStyle = "#547e25";
    ctx.fillRect(x + width - width * .1, y, width * .1, height);
    ctx.fillRect(x + width - width * .2, y, width * .05, height);

    ctx.strokeRect(x, y, width, height);
}

//City Background
var cityGraphicCanvas;

function createCityGraphic() {

    if (cityGraphicCanvas) {
        canvasContainer.removeChild(cityGraphicCanvas);
    }
    cityGraphicCanvas = document.createElement("canvas");
    cityGraphicCanvas.style.position = "absolute";
    cityGraphicCanvas.style.left = canvas.style.left;
    cityGraphicCanvas.style.top = canvas.style.top;
    cityGraphicCanvas.width = canvas.width;
    cityGraphicCanvas.height = canvas.height;
    var cgContext = cityGraphicCanvas.getContext("2d");
    var cityGraphicHeight = canvas.height * .25;

    //fill with blue sky
    cgContext.fillStyle = "#006666";
    cgContext.fillRect(0, 0, canvas.width, canvas.height);

    cgContext.fillStyle = "#004444";

    cgContext.save();
    cgContext.translate(0, groundGraphicRect.y - cityGraphicHeight);

    //clouds
    var maxCloudRadius = cityGraphicHeight * .4;
    var minCloudRadius = maxCloudRadius * .5;

    for (iterator = 0; iterator < canvas.width; iterator += minCloudRadius) {
        cgContext.beginPath();
        cgContext.arc(iterator, maxCloudRadius, Happy.MathUtil.getRandomNumberInRange(minCloudRadius, maxCloudRadius), 0, Happy.MathUtil.PI2);
        cgContext.closePath();
        cgContext.fill();
    }

    cgContext.fillRect(0, maxCloudRadius, canvas.width, cityGraphicHeight);

    //houses
    var houseWidth;
    var houseHeight;
    cgContext.fillStyle = "#D9E30A";
    for (iterator = 0; iterator < canvas.width; iterator += (houseWidth + 8)) {
        houseWidth = 20 + Math.floor(Math.random() * 30);
        houseHeight = Happy.MathUtil.getRandomNumberInRange(cityGraphicHeight * .5, cityGraphicHeight - maxCloudRadius * .8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    cgContext.fillStyle = "#4D3834";
    cgContext.strokeStyle = "#B58F88";
    cgContext.lineWidth = 3;
    for (iterator = 0; iterator < canvas.width; iterator += (houseWidth + 8)) {
        houseWidth = 20 + Math.floor(Math.random() * 30);
        houseHeight = Happy.MathUtil.getRandomNumberInRange(cityGraphicHeight * .5, cityGraphicHeight - maxCloudRadius * .8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
        cgContext.strokeRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    //trees
    var maxTreeRadius = cityGraphicHeight * .3;
    var minTreeRadius = maxTreeRadius * .5;
    var radius;
    var strokeStartRadian = Math.PI + Math.PI / 4;
    var strokeEndRadian = Math.PI + Math.PI / 4;
    cgContext.fillStyle = "#81e18b";
    cgContext.strokeStyle = "#72c887";
    for (iterator = 0; iterator < canvas.width; iterator += minTreeRadius) {
        cgContext.beginPath();
        radius = Happy.MathUtil.getRandomNumberInRange(minCloudRadius, maxCloudRadius)
        cgContext.arc(iterator, cityGraphicHeight, radius, 0, Happy.MathUtil.PI2);
        cgContext.closePath();
        cgContext.fill();

        cgContext.beginPath();
        cgContext.arc(iterator, cityGraphicHeight, radius, strokeStartRadian, strokeEndRadian);
        cgContext.closePath();
        cgContext.stroke();
    }

    cgContext.restore();
    //sand
    cgContext.fillStyle = sand;
    cgContext.fillRect(0, groundGraphicRect.y, canvas.width, canvas.height);
    canvasContainer.insertBefore(cityGraphicCanvas, canvasContainer.firstChild);
}

//ground
var groundX = 0;
function renderGroundPattern() {
    context.drawImage(groundPatternCanvas, groundX, groundGraphicRect.y);
    groundX -= scrollSpeed;
    groundX %= 16;
}

//colors
var groundLight = "#97eDD6";
var groundDark = "#73bDD9";
var groundDarker = "#4b7e19";
var groundShadow = "#d1a009";
var groundBorder = "#4c3f48";
var sand = "#dcd795";
var groundGraphicRect = new Happy.Geom.Rectangle();
var groundPatternCanvas;

function createGroundPattern() {
    groundGraphicRect.y = canvas.height * .85;
    if (!groundPatternCanvas) {
        groundPatternCanvas = document.createElement("canvas");
    }
    groundPatternCanvas.width = 16;
    groundPatternCanvas.height = 16;
    var groundContext = groundPatternCanvas.getContext("2d");
    groundContext.fillStyle = groundLight;
    groundContext.fillRect(0, 0, 16, 16);

    //diagonal graphic
    groundContext.fillStyle = groundDark;
    groundContext.beginPath();
    groundContext.moveTo(8, 3);
    groundContext.lineTo(16, 3);
    groundContext.lineTo(8, 13);
    groundContext.lineTo(0, 13);
    groundContext.closePath();
    groundContext.fill();

    //top border
    groundContext.fillStyle = groundBorder;
    groundContext.globalAlpha = .2;
    groundContext.fillRect(0, 0, 16, 1);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0, 1, 16, 1);
    groundContext.globalAlpha = .6;
    groundContext.fillRect(0, 2, 16, 1);

    //hilite
    groundContext.fillStyle = "#FFFFFF";
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0, 3, 16, 2);

    //bottom border
    groundContext.fillStyle = groundDarker;
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0, 10, 16, 3);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0, 11, 16, 1);

    //shadow
    groundContext.fillStyle = groundShadow;
    groundContext.fillRect(0, 13, 16, 3);

    var groundPattern = context.createPattern(groundPatternCanvas, "repeat-x");

    groundPatternCanvas.width = canvas.width + 16;
    groundPatternCanvas.height = 16;

    groundContext.fillStyle = groundPattern;
    groundContext.fillRect(0, 0, groundPatternCanvas.width, 16);
}

function clearTimeoutsAndIntervals() {
    gameState = -1;
}