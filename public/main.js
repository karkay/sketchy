
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =
    (h) + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);

}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');


var radius=10;
var dragging=false;
var erase=false;

canvas.width = document.getElementById('canvas').clientWidth;
canvas.height = document.getElementById('canvas').clientHeight;

context.lineWidth = radius*2;

var putPoint = function(e){
	if (dragging){
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    context.beginPath();
    context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
	}
}

var putEraser = function(e){
	if (dragging){
    context.lineTo(e.offsetX, e.offsetY);
    context.clearRect(e.offsetX, e.offsetY,2*radius,2*radius)
    context.beginPath();
    context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
	}
}

var engage = function(e){
	dragging=true;
    putPoint(e);
}
var disengage = function(){
	dragging=false;
    context.beginPath();
}

//drawing
canvas.addEventListener('mousedown',engage);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup',disengage);
canvas.addEventListener('mouseleave',disengage);



var clearButton = document.getElementById('clear');
clearButton.addEventListener('click',clearImage);

function clearImage(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var eraserButton = document.getElementById('eraser');
eraserButton.addEventListener('click',eraseImage);

function eraseImage(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}










