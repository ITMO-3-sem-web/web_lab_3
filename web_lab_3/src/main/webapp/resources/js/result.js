const $ = window.$;

let x, y, r, ans;


// Canvas parameters
const rayLength = 160;

let canvasWidth = 400;
let canvasHeight = 400;

let centerX = canvasWidth/2;
let centerY = canvasHeight/2;

const maxXCoord = 5;
const stepX = 0.5;

const maxYCoord = 5;
const stepY = 1;

const pixelStep = 26;

let canvas;
let ctx; // context of Canvas
//----------------



$(document).ready(function(){


    initialize();

});

// Initializes the program.
function initialize() {

    preparePoint();

    initCanvas();

}


// Initializes the canvas : creates it's object, sets some settings and draws the coordinateSystem.
function initCanvas() {

    canvas = document.getElementById('canvass');

    if (canvas && canvas.getContext) {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        centerX = canvasWidth/2;
        centerY = canvasHeight/2;

        ctx = canvas.getContext('2d');
        ctx.translate(centerX, centerY);
        ctx.save();

        drawAll(r);

    }

}




// Draws a point on thw canvas.
function drawPoint(x, y, strokeColor= "gray", fillColor = "gray", fill= false) {

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(x * pixelStep,- y * pixelStep, 4, 0, 2 * Math.PI);
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }

    ctx.beginPath(); // Used to finish the path drawing

}


// Draw the area consisting of a square, triangle and semicircle on the canvas.
function drawArea(r) {

    if (! r ) {
        return ;
    }

    ctx.fillStyle = "rgba(95, 158, 160, 0.5)";

    //квадрат
    ctx.rotate(-Math.PI/2);
    ctx.fillRect(0, 0, r * pixelStep, r * pixelStep);

    //треугольник
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(- (r * pixelStep), 0);
    ctx.lineTo(0, r * pixelStep);
    ctx.fill();


    //полукруг
    ctx.beginPath();
    ctx.rotate(Math.PI/2);
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, (r * pixelStep)/2, Math.PI, Math.PI/2, true);
    ctx.lineTo(0, 0);
    ctx.fill();

    // Убираем прошлые Path, чтобы они не возникли на холсте потом
    ctx.beginPath();

}


// Clears the canvas and draws coordinateSystem, area and tablePoints on it in a proper way.
function drawAll(r) {

    drawArea(r);
    drawCoordinateSystem();

    if (ans === "YES") {
        drawPoint(x, y, "green", "green", true);
    } else {
        drawPoint(x, y, "red", "red", true);
    }
}




// Draws the coordinate system on the canvas.
function drawCoordinateSystem() {

    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 2;

    // Ray X
    ctx.moveTo(-rayLength,0);
    ctx.lineTo(rayLength,0);
    // Arrow end
    ctx.lineTo(rayLength-rayLength/15, rayLength/15);
    ctx.moveTo(rayLength,0);
    ctx.lineTo(rayLength-rayLength/15, -rayLength/15);


    // Ray Y
    ctx.moveTo(0, rayLength);
    ctx.lineTo(0, -rayLength);
    // Arrow end
    ctx.lineTo(rayLength/15, -rayLength+rayLength/15);
    ctx.moveTo(0, -rayLength);
    ctx.lineTo(-rayLength/15, -rayLength+rayLength/15);


    var pixelXCoord = -maxXCoord * pixelStep - 4;
    for(let j=-maxXCoord; j<=maxXCoord; j += stepX) {

        if (j % 1 === 0) {
            ctx.fillText(j,  pixelXCoord, -4);
        } else {
            ctx.fillText(j,  pixelXCoord, 10);
        }
        pixelXCoord += pixelStep * stepX;

    }



    var pixelYCoord = maxYCoord * pixelStep + 4;
    for(let j=-maxYCoord; j <= maxYCoord; j += stepY) {

        if ( j !== 0 ) {
            if (j % 1 === 0) {
                ctx.fillText(j,  4, pixelYCoord);
            } else {
                ctx.fillText(j,  -10, pixelYCoord);
            }
        }


        pixelYCoord -= pixelStep * stepY;
    }


    ctx.stroke();

}


// Fills the tablePoints array with the data from html result table.
function preparePoint() {

    let counter = 0;

    result = $("#result-table tbody tr td").each(function () {
        if (counter === 0) {
            x = $(this).html();
        } else if (counter === 1) {
            y = $(this).html();
        } else if (counter === 2) {
            r = $(this).html();
            console.log( "rrr" + r)
        } else if (counter === 3) {
            if ($(this).attr("class") === "server-answer-yes") {
                ans = "YES";
            } else {
                ans = "NO";
            }

        }
        counter++;
    });



}









