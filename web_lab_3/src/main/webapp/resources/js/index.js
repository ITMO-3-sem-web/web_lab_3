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
const stepX = 0.5;

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

        // Handle submit-button clicked action to check the form inputs' values   .
        $("#submit-button").click(function() {
            clearAndHideMessage();
            isValidData();
        });


        // Handles form confirmation action to check the form inputs' values.
        $("#form").on("submit", function(e) {
            e.preventDefault();
            console.log("form prevented from submitting");
            // main();

        });


        // Handles the checkboxes for the "R" value.
        $(".checkbox-values.r input").on('change', function() {

            r = $(this).val();

            if ( ! $(this).is(" :checked") ) {
                r = undefined;
            }


            if ( ! r ) { // The box is UNchecked
                rIsChosen = false;
                drawAll(0);

            } else {
                rIsChosen = true;
                drawAll(r);

            }

            $(this).siblings().prop('checked', false);

        });


        // Handles the buttons for the "X" value
        $('.checkbox-values.x input').click( function () {
            x = $(this).val();
            $(this).css({color: "white", backgroundColor :  "cadetblue"});
            $(this).siblings().css({color: "cadetblue", backgroundColor :  "transparent"});

        });


        // Removes the positive message after the form started editing again.
        $("form :input").change(function() {
            if (messageContentIsPositive) {
                clearAndHideMessage();
            }
        });

    }


    // Stets all the form's inputs the default (empty) values.
    function resetForm() {

        $("#form").trigger("reset");
        $('.checkbox-values.x input').css({color: "cadetblue", backgroundColor :  "transparent"});

        x = undefined;
        y = undefined;
        r = undefined;
        rIsChosen = false;

        makeMessageNegative();

        drawAll(0);

    }


    // Makes request to PHP-server and handles it's response. If response if positive,
    // this function changes the table.
    function main() {

        clearAndHideMessage();

        if ( isValidData() ){

            sendRequest(x, y, r);

            resetForm();

        }
    }


    function sendRequest(x, y, r) {

        let request = "x=" + x + "&y=" + y + "&r=" + r; // todo

        console.log("request= " + request);

        window.location.href = '/web_lab_2-1.0/?' + request;

    }


    // Checks whether all the form's inputs have valid data (input).
    function isValidData() {

        return  (validateX() & validateY() & validateR()) ;

    }


    // Checks whether the 'X' value is valid and sets it to the global "X" if true.
    function validateX() {

        let tmpX = getX();

        console.log("x = " + x);
        if (x === undefined) {
            makeMessageNegative();
            showAddMessage("Выберете значение X .<br>");
            return false;

        } else {
            x = tmpX;
            return true;
        }

    }


    // Checks whether the 'Y' value is valid and sets it to the global "Y" if true.
    function validateY() {

        let tmpY = getY().replace(",", ".");

        console.log("y = " + y);

        if ( ! $.isNumeric(tmpY)) {
            console.log("y is NOT numeric")
            makeMessageNegative();
            showAddMessage("Введите значение Y в диапазоне от -3 до 3. В Качестве дробного разделителя используйте точку или запятую.<br>");
            return false;
        }


        tmpY = parseFloat(tmpY);

        if ( ( tmpY > -3) && ( tmpY < 3)  ) {
            console.log("Y = " + y);
            y = tmpY;
            return true;

        } else {
            makeMessageNegative();
            showAddMessage("Введите значение Y в диапазоне от -3 до 3. В Качестве дробного разделителя используйте точку или запятую.<br>");
            return false;
        }
    }


    // Checks whether the 'R' value is valid and sets it to the global "R" if true.
    function validateR() {

        let tmpR = getR();

        console.log("R = " + r);

        if (tmpR === undefined) {
            makeMessageNegative();
            showAddMessage("Выберете значение R .<br>");
            return false;

        } else {
            r = tmpR;
            return true;
        }

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


           canvas.addEventListener('click', function() {

               if ( rIsChosen ) {
                   hideMessage();
                   sendRequest(xCoord,  yCoord, r);
               } else {
                   showMessage("Выберете R перед тем как указать точку на графике.");
               }

           });

       }

    }


    // Returns true if a cursor leaves the canvas.
    // Адекватно этот метод не захотел работать ( если курсор покидает канвас слишком быстро, то последняя фиксируемая его координата находится слишком далеко от границы)
    function cursorLeavesCanvas(canvasX, canvasY) {

        const delta = 3;

        return (
               ( (canvasX + delta) > canvasWidth )
            || ( (canvasY + delta) > canvasHeight )

            || ( (canvasX - delta) < 0 )
            || ( (canvasY - delta) < 0 )
        )

    }


    // Returns the "X" value taken from the "X" input.
    function getX() {

        return x;

    }


    // Returns the "Y" value taken from the "Y" input.
    function getY() {

        return tmpY = $(".checkbox-values.y").val();

    }


    // Returns the "R" value taken from the "R" input.
    function getR() {

        return r;

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

        if (x > 2) {
            closestX = 2
        } else if (x < -2) {
            closestX = -2;
        } else {
            closestX = Math.round(x * 2) / 2;
        }

        return closestX;

    }


    // Returns the closest valid "Y" value for the specified one.
    function findClosestY(y) {

        let closestY = y;

        if (y >= 3) {
            closestY = 2.999999999999;
        } else if (y <= -3) {
            closestY = -2.999999999999;
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
    function drawTablePoints() {

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
    function prepareTablePoints() {

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


    // Inserts 'text' below content in message-box.
    function showAddMessage(text) {

        let oldContent = $(".message-box .message-box-content").html();

        if (oldContent.indexOf(text) === -1) {
            showMessage(oldContent + text);
        }

    }


    // Sets text to message-box and makes the last one visible.
    function showMessage(text) {

        messageBoxIsShown = true;
        $(".message-box").css("display", "block");
        $(".message-box .message-box-content").html(text);

    }


    // Hides the message-box.
    function hideMessage() {
        messageBoxIsShown = false;
        $(".message-box").css("display", "none");
    }


    // Clears the content inside message-box and hides the last one.
    function clearAndHideMessage() {
        clearMessage();
        hideMessage();
    }


    // Clears the message-box content.
    function clearMessage() {

        $(".message-box .message-box-content").html("");

    }


    // Changes message-box css to 'positive' style.
    function makeMessagePositive() {

        messageContentIsPositive = true;
        $(".message-box").css("background-color", "rgba(115, 230, 0, .6)");
        $(".message-box").css("border", "solid rgb(0, 179, 0)");

    };


    // Changes message-box css to 'negative' style.
    function makeMessageNegative() {

        messageContentIsPositive = false;
        $(".message-box").css("background-color", "rgba(255, 77, 140, .6)");
        $(".message-box").css("border", "solid rgb(255, 77, 140)");

    }







