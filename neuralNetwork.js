
function assert(b){
  "use strict";
  
  if(b !== true){
    console.error("Error");
  }
}

var Network = function (topology, trialQty) {
  "use strict";
  
  this.trialQty = trialQty;
  
  this.randomWeight = function () {
    return (Math.random()*2.0-1.0) * (1.0 / Math.sqrt(this.trialQty));
  }
  
  this.neurons = [];
  for(var x = 0; x < topology.length; x++){
    this.neurons.push([]);
    for(var y = 0; y < topology[x]; y++){
      this.neurons[x].push(new Neuron(this, x, y));
    }
  }
  
  this.calculate = function (inputs) {
    for (var x = 0; x < this.neurons.length; x++) {
      var outputs = [];
      for (var y = 0; y < this.neurons[x].length; y++) {
        outputs.push(this.neurons[x][y].calculate(inputs));
      }
      inputs = outputs;
    }
    return inputs;
  }
  
  this.learn = function (targetOutput, learningRate) {
    for (var x = this.neurons.length - 1; x >= 0; x--) {
      for (var y = 0; y < this.neurons[x].length; y++) {
        if(x === this.neurons.length - 1){
          this.neurons[x][y].calculateError(targetOutput[y]);
        }else{
          this.neurons[x][y].calculateError();
        }
      }
    }
    for (var x = 0; x < this.neurons.length; x++) {
      for (var y = 0; y < this.neurons[x].length; y++) {
        this.neurons[x][y].updateWeights(learningRate);
      }
    }
  }
  
  this.activation = function (x) {
    return 1.0 / (1.0 + Math.exp(-x))
  }
  
  this.activationDeriv = function (x) {
    return this.activation(x) * (1.0 - this.activation(x));
  }
  
}

var Neuron = function (network, x, y) {
  "use strict";
  
  this.network = network;
  this.x = x;
  this.y = y;
  
  this.data = {};
  
  
  if (this.x > 0) { //is not an input neuron
    this.weights = [];
    for (var i = 0; i < this.network.neurons[this.x-1].length; i++){
      this.weights.push(this.network.randomWeight());
    }
    this.bias = this.network.randomWeight();
  }
  
  
  this.calculate = function (inputs) {
    if (this.x > 0){ //is not an input neuron
      assert(this.network.neurons[this.x-1].length === this.weights.length);
      var sum = 0;
      for (var i = 0; i < inputs.length; i++) {
        sum += inputs[i] * this.weights[i];
      }
      sum += this.bias;
      this.data.net = sum;
      this.data.output = this.network.activation(this.data.net);
    } else {
      this.data.net = inputs[this.y];
      this.data.output = this.data.net;
    }
    return this.data.output;
  }
  
  this.calculateError = function (target) {
    if(this.x === network.neurons.length - 1){
      this.data.error = this.network.activationDeriv(this.data.net) * (target  - this.data.output);
    } else if (this.x > 0){
      assert(target === undefined)
      var sum = 0;
      for (var y = 0; y < this.network.neurons[this.x+1].length; y++) {
        sum += (this.network.neurons[this.x+1][y].data.error * this.network.neurons[this.x+1][y].weights[this.y])
      }
      this.data.error = this.network.activationDeriv(this.data.net) * sum;
    }
    return this.data.error;
  }
  
  this.updateWeights = function (learningRate) {
    if(this.x > 0){
      for (var y = 0; y < this.weights.length; y++) {
        this.weights[y] += learningRate * this.network.neurons[this.x - 1][y].data.output * this.data.error;
      }
      this.bias += learningRate * this.network.activation(this.bias) * this.data.error;
    }
  }
  
};
