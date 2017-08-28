var socket;
var lineThickness;
var lineColor;

//first step is to listen for new sessions or namespaces

function setup() {

    //create a new canvas
    var new_width = 0.98*windowWidth;
    var new_height = 0.80*windowHeight; //used to be .748 >> .88 >> .8
    var canv = createCanvas(new_width, new_height);
    canv.parent('canvas-holder');
    background(255,255,255);

    //create a clear button
    var clear_button = createButton("Clear");
    clear_button.parent('controls');
    clear_button.mousePressed(resetSketch);
    //function that clears sketch server then client side
    function resetSketch(){
        socket.emit('clearCanvas');
        clear();
    }
   
    //randomly select a color
    lineColor = [random(1,255), random(1,255), random(1,255)];
    //socket = io();
    //create a rgb and thickness slider
    rSlider = createSlider(0, 255, lineColor[0]);
    rSlider.parent('red');
    gSlider = createSlider(0, 255, lineColor[1]);
    gSlider.parent('green');
    bSlider = createSlider(0, 255, lineColor[2]);
    bSlider.parent('blue');
    tSlider = createSlider(5, 40, 20);
    tSlider.parent('thickness');

    //prompt user for room name and checks for null and empty input
    socket = io();
    var room = prompt("Please enter a room name :)");
    while(room==null || room==''){
     room = prompt("Please enter a room name :)");  
    }

    socket.emit('sessionID',room);

    socket.on('mouse', newDrawing);

    socket.on('userJoin',function(){

        $('.row').html('<div class="alert alert-success col-md-2 col-md-offset-2" align="center">New User Joined!</div>')
        setTimeout(function(){
            $("div.alert").remove();
        },  3000);
    });


    //server sends message to client telling it to clear the canvas locally
    socket.on('serverClear',function(){
        clear()
    });




}
//server drawing on client
function newDrawing(data) {
	
    strokeWeight(data.thickness);
    stroke(data.color[0],data.color[1],data.color[2]);
    line(data.x, data.y, data.pX, data.pY); //maybe try switching
    
    	/*
    	drawingContext.beginPath();
    	drawingContext.moveTo(data.pX,data.pY);
    	drawingContext.lineTo(data.x,data.y);
    	drawingContext.strokeStyle = 'rgb('+data.color[0]+','+data.color[1]+','+data.color[2]')';
    	drawingContext.lineWidth = data.thickness;
    	drawingContext.stroke();
    	drawingContext.closePath(); 
    	*/
		
  
}

//client drawing to server
function mouseDragged() {

	
    	var data = {
        	x: mouseX,
        	y: mouseY,
        	pX: pmouseX,
        	pY: pmouseY,
        	color: lineColor,
        	thickness: lineThickness,
    	};

    	socket.emit('mouse', data);

    	lineThickness = tSlider.value();
    	lineColor = [rSlider.value(), gSlider.value(), bSlider.value()]; //original

    	//lineColor = [random(1,255), random(1,255), random(1,255)];//random rainbow
    	
    	strokeWeight(lineThickness);
    	stroke(lineColor[0],lineColor[1],lineColor[2]);
    	line(mouseX,mouseY,pmouseX,pmouseY);

    	//new drawing algorithm
    	/*
    	drawingContext.beginPath();
    	drawingContext.moveTo(pmouseX,pmouseY);
    	drawingContext.lineTo(mouseX,mouseY);
    	drawingContext.strokeStyle = 'rgb('+lineColor[0]+','+lineColor[1]+','+lineColor[2]')';
    	drawingContext.lineWidth = lineThickness;
    	drawingContext.stroke();
    	drawingContext.closePath();
    	*/
}

function draw() {
	
    document.getElementById("swatch").style.backgroundColor = "rgb("+lineColor[0]+","+lineColor[1]+","+lineColor[2]+")";
    if (mouseIsPressed) {
        mouseDragged();
    }
}

var clearButton = document.getElementById('clear');
clearButton.addEventListener('click',clear());


