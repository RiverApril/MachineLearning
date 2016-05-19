

var NetworkVisualizer = function(context, nn, dx, dy, dw, dh){
  "use strict";
  
  this.fontH = 12;
  this.fontO = (this.fontH/2)-1;

  this.context = context;
  this.context.font = this.fontH+"px Verdana"

  this.network = nn;
  this.positions = [];
  
  for (var x = 0; x < nn.neurons.length; x++) {
    this.positions.push([]);
    for (var y = 0; y < nn.neurons[x].length; y++) {
      this.positions[x].push([]);
      this.positions[x][y] = {
        x:dx + (dw / nn.neurons.length * (x+1)) - (dw / nn.neurons.length / 2), 
        y:dy + (dh / nn.neurons[x].length * (y+1)) - (dh / nn.neurons[x].length / 2),
        w:[],
      };
      if(x > 0){
        for (var k = 0; k < nn.neurons[x][y].weights.length; k++) {
          var s = {
            x:(this.positions[x-1][k].x - this.positions[x][y].x),
            y:(this.positions[x-1][k].y - this.positions[x][y].y),
          };
          var len = Math.sqrt(s.x*s.x + s.y*s.y);
          s.x = (s.x/len*(this.fontH*(nn.neurons[x][y].weights.length+1)))+this.positions[x][y].x;
          s.y = (s.y/len*(this.fontH*(nn.neurons[x][y].weights.length+1)))+this.positions[x][y].y;
          this.positions[x][y].w.push(s);
        }
      }

    }
  }

  this.draw = function() {

    this.context.fillStyle = "#C0E0FF";
    this.context.strokeStyle = "#E0C0FF";

    for (var x = 0; x < this.network.neurons.length; x++) {
      for (var y = 0; y < this.network.neurons[x].length; y++) {
        this.context.beginPath();
        this.context.arc(this.positions[x][y].x, this.positions[x][y].y, this.fontH, 0, Math.PI * 2);
        this.context.fill();
        if(x > 0){
          this.context.beginPath();
          for (var k = 0; k < this.network.neurons[x][y].weights.length; k++) {
            this.context.moveTo(this.positions[x][y].x, this.positions[x][y].y);
            this.context.lineTo(this.positions[x-1][k].x, this.positions[x-1][k].y);
          }
          this.context.stroke();
        }
      }
    }


    this.context.strokeStyle = "#000000";

    for (var x = 0; x < this.network.neurons.length; x++) {
      for (var y = 0; y < this.network.neurons[x].length; y++) {
        if(x > 0){
          this.context.beginPath();
          for (var k = 0; k < this.network.neurons[x][y].weights.length; k++) {
            var str = this.network.neurons[x][y].weights[k].toFixed(2);
            var size = this.context.measureText(str);
            this.context.strokeText(str, this.positions[x][y].w[k].x - (size.width / 2), this.positions[x][y].w[k].y + this.fontO);
          }
          var str = this.network.neurons[x][y].bias.toFixed(2);
          var size = this.context.measureText(str);
          this.context.strokeText(str, this.positions[x][y].x - (size.width / 2), this.positions[x][y].y + this.fontO);
        }

      }
    }

  }

  
}