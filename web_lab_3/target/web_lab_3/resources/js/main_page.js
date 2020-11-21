const $ = window.$;

let x, y, r, rIsChosen;
let messageContentIsPositive, messageBoxIsShown;

rIsChosen = false;


// Canvas parameters
const rayLength = 160;

let canvasWidth = 400;
let canvasHeight = 400;

let centerX = canvasWidth/2;
let centerY = canvasHeight/2;

const maxXCoord = 5;
const stepX = 1;

const maxYCoord = 5;
const stepY = 1;

const pixelStep = 26;

let canvas;
let ctx; // context of Canvas
//----------------

let tablePoints = [];


$(document).ready(function(){


    initialize();

});

    // Initializes the program.
    function initialize() {

        prepareTablePoints();

        initCanvas();

        resetForm();


        $(".button-submit").on("click", (e) => {
            main(e);
        })


        // Handles form confirmation action to check the form inputs' values.
        $("#form").on("submit", function(e) { // todo
            main(e);
        });


        $(".button-clear-form").on("click", () => {
            resetForm();
            $("#form").trigger("reset");

        })


        // Handles the checkboxes for the "R" value.
        $(".checkbox-values.r input").on('change', function() {

            r = parseInt( $(this).find("+ label").text() );
            console.log("r = " + r)

            if ( ! $(this).is(" :checked") ) {
                r = undefined;
            }


            if ( ! r ) { // The box is UNchecked

                drawAll(0);

            } else {
                console.log("*************** Redrawing canvas. _ R = " + r);
                drawAll(r);

            }

            $(this).siblings().prop('checked', false);

        });


    }


    function main(e) {

        if ( ! isValidData() ) {
            e.preventDefault();
            console.log("form prevented from submitting");

            if ( ! validateR() ) {
                $(".input-error-message.r-input-error-message").addClass('visible');
                console.log("chooose r ");
            }

        } else {
            resetForm();
            console.log("form submitted");
        }
    }


    // Stets all the form's inputs the default (empty) values.
    function resetForm() {


        $(".input-error-message.r-input-error-message").removeClass('visible');

        x = undefined;
        y = undefined;
        r = undefined;

        drawAll(0);

        // $("#form").trigger("reset");
    }


    // Makes request to PHP-server and handles it's response. If response if positive,
    // this function changes the table.
    // function main() {
    //
    //     // clearAndHideMessage();
    //
    //     if ( isValidData() ){
    //
    //         $(".x-hidden").val(x);
    //         $(".y-hidden").val(y);
    //         $(".r-hidden").val(r);
    //         $(".hidden-form").submit();
    //
    //         resetForm();
    //
    //     }
    // }


    // function sendRequest(x, y, r) {
    //
    //     let request = "x=" + x + "&y=" + y + "&r=" + r; // todo
    //
    //     console.log("request= " + request);
    //
    //     window.location.href = '/web_lab_2-1.0/?' + request;
    //
    // }


    // Checks whether all the form's inputs have valid data (input).
    function isValidData() {
        return  (validateX() & validateY() & validateR()) ;
    }


    // Checks whether the 'X' value is valid and sets it to the global "X" if true.
    function validateX() {
        return true;
    }


    // Checks whether the 'Y' value is valid and sets it to the global "Y" if true.
    function validateY() {
        return true;
    }


    // Checks whether the 'R' value is valid and sets it to the global "R" if true.
    function validateR() {
        return rIsSet();
    }


    // Initializes the canvas : creates it's object, sets some settings and draws the coordinateSystem.
    function initCanvas() {

       let xCoord;
       let yCoord;
       let cRect;
       let canvasX;
       let canvasY;

       canvas = document.getElementById('canvass');

       if (canvas && canvas.getContext) {
           canvasWidth = canvas.width;
           canvasHeight = canvas.height;

           centerX = canvasWidth/2;
           centerY = canvasHeight/2;

           ctx = canvas.getContext('2d');
           ctx.translate(centerX, centerY);
           ctx.save();

           drawAll(0);

            // Draws a point under the cursor on the canvas.
           canvas.addEventListener("mousemove", function (e) {
               cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
               canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
               canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make
               xCoord = (canvasX - centerX) / pixelStep;
               yCoord = (centerY - canvasY) / pixelStep;

               xCoord = findClosestX(xCoord);
               yCoord = findClosestY(yCoord);

               drawAll(r);
               drawPoint(xCoord, yCoord, "salmon", "indigo", false);

               setCoordinatesView(xCoord, Math.round( yCoord * 1000 ) / 1000 );

           });


           canvas.addEventListener('click', function() { // todo

               if ( rIsSet() ) {
                   // hideMessage();
                   $(".input-error-message.r-input-error-message").removeClass('visible');
                   $(".x-hidden").val(xCoord);
                   $(".y-hidden").val(yCoord);
                   $(".r-hidden").val( getR() );
                   $(".button-submit-hidden").click();

                   resetForm();
                   console.log("canvas dots are sent");
               } else {
                   $(".input-error-message.r-input-error-message").addClass('visible');
                   console.log("chooose r ");

               }

           });
       }
    }


    // Returns the "X" value taken from the "X" input.
    function getX() { // todo
        return $(".slider-value").text();
    }


    // Returns the "Y" value taken from the "Y" input.
    function getY() {
        return $(".checkbox-values.y").val();
    }


    // Returns the "R" value taken from the "R" input.
    function getR() {
        return $(".checkbox-values.r input:checked + label").text();
    }


    function rIsSet() {
        return getR() !== "";
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


    // Returns the closest valid "X" value for the specified one.
    function findClosestX(x) {

        let closestX = x;

        if (x > 4) {
            closestX = 4
        } else if (x < -4) {
            closestX = -4;
        } else {
            closestX = Math.round(x);
        }

        return closestX;

    }


    // Returns the closest valid "Y" value for the specified one.
    function findClosestY(y) {

        let closestY = y;

        if (y >= 5) {
            closestY = 4.999;
        } else if (y <= -5) {
            closestY = -4.999;
        }

        return closestY;

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

        clearCanvas();
        drawArea(r);
        drawCoordinateSystem();
        drawTablePoints();

    }


    // Clears the canvas (removes all the graphics).
    function clearCanvas() {

       ctx.clearRect(-canvasWidth/2, -canvasHeight/2, canvas.width, canvas.height);

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


    // Add points from tablePoints array to the canvas.
    function drawTablePoints() { // todo Redo this methoD.

        let point;
        let x;
        let y;
        for (let i = 0; i < tablePoints.length; i++) {
            point = tablePoints[i];
            x = point["x"];
            y = point["y"];

            drawPoint(x, y, "gray", "gray", true);

        }
    }


    // Fills the tablePoints array with the data from html result table.
    function prepareTablePoints() { // todo Redo this methoD.

        let x;
        let y;
        let ans;
        let counter;

        $("#result-table tbody tr ").each( function() {

            // $(this).find("td")
            counter = 0;
            $(this).find("td").each(function() {
                if (counter === 0) {
                    x = $(this).html();
                } else if (counter === 1) {
                    y = $(this).html();
                } else if (counter === 3) {
                    ans = $(this).html();
                }
                counter++;
            })

            tablePoints.push({
                "x" : x,
                "y" : y,
                "ans" : ans,
            });
        });
    }


    // Sets the specified coordinates to "X : " and "Y : " fields nearby canvas.
    function setCoordinatesView(x, y) {
        $(".coordinates-view .x").html(x);
        $(".coordinates-view .y").html(y);
    }
