// wait for page to load
document.addEventListener('DOMContentLoaded', function () {
  var mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    pos_prev: { x: 0, y: 0 }
  };

  // retrieve canvas and create context
  var canvas = document.getElementById('base');
  var context = canvas.getContext('2d');

  // match canvas width to viewport width
  var width = window.innerWidth;
  var height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // connect to server
  var socket = io.connect();

  // register mouse event handlers
  canvas.onmousedown = function (e) {
    mouse.click = true;
  };
  canvas.onmouseup = function (e) {
    mouse.click = false;
  };

  canvas.onmousemove = function (e) {
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / height;
    mouse.move = true;
  };

  // draw line received from server
  socket.on('draw_line', function (data) {
    var line = data.line;
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });

  function mainLoop() {
    // check if client is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      // send line to server
      socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
      mouse.move = false;
    }
    // set store current position in pos_prev
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25);
  }

  mainLoop();
})
