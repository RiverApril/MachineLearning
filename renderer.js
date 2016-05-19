
var fontH = 12;
var fontO = (fontH/2)-1;

var network;
var positions;

function initalizeRenderer(canvasID, nn){
  
  canvas = document.getElementById(canvasID);
  context = canvas.getContext("2d");

  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  context.font = fontH+"px Verdana"
  
  network = nn;
      
  positions = [];
  for(var p = 0; p < teaching.length; p++){
    positions.push([]);
    var h = context.canvas.height / (teaching.length);
    for (var x = 0; x < nn.neurons.length; x++) {
      positions[p].push([]);
      for (var y = 0; y < nn.neurons[x].length; y++) {
        positions[p][x].push([]);
        positions[p][x][y] = {
          x:(context.canvas.width / nn.neurons.length * (x+1)) - (context.canvas.width / nn.neurons.length / 2), 
          y:(h / nn.neurons[x].length * (y+1)) + (p * h) - (h / nn.neurons[x].length / 2),
          w:[],
        };
        if(x > 0){
          for (var k = 0; k < nn.neurons[x][y].weights.length; k++) {
            var s = {
              x:(positions[p][x-1][k].x - positions[p][x][y].x),
              y:(positions[p][x-1][k].y - positions[p][x][y].y),
            };
            var angle = Math.atan2(s.y, s.x);
            var d = Math.sqrt((s.x*s.x) + (s.y*s.y)) / 4;
            var xx = positions[p][x][y].x + (Math.cos(angle) * d);
            var yy = positions[p][x][y].y + (Math.sin(angle) * d);
            positions[p][x][y].w.push({x:xx, y:yy});
          }
        }

      }
    }
  }
  
}

function drawNetwork(set) {

  context.fillStyle = "#C0E0FF";
  context.strokeStyle = "#E0C0FF";

  for (var x = 0; x < network.neurons.length; x++) {
    for (var y = 0; y < network.neurons[x].length; y++) {
      context.beginPath();
      context.arc(positions[set][x][y].x, positions[set][x][y].y, fontH, 0, Math.PI * 2);
      context.fill();
      if(x > 0){
        context.beginPath();
        for (var k = 0; k < network.neurons[x][y].weights.length; k++) {
          context.moveTo(positions[set][x][y].x, positions[set][x][y].y);
          context.lineTo(positions[set][x-1][k].x, positions[set][x-1][k].y);
        }
        context.stroke();
      }
    }
  }


  context.strokeStyle = "#000000";

  for (var x = 0; x < network.neurons.length; x++) {
    for (var y = 0; y < network.neurons[x].length; y++) {
      if(x > 0){
        context.beginPath();
        for (var k = 0; k < network.neurons[x][y].weights.length; k++) {
          var str = network.neurons[x][y].weights[k].toFixed(2);
          var size = context.measureText(str);
          context.strokeText(str, positions[set][x][y].w[k].x - (size.width / 2), positions[set][x][y].w[k].y + fontO);
        }
      }
      var str = network.neurons[x][y].data.output.toFixed(2);
      var size = context.measureText(str);
      context.strokeText(str, positions[set][x][y].x - (size.width / 2), positions[set][x][y].y + fontO);
    }
  }

}
