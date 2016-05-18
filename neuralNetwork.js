function dot(a, b) {
  'use strict';
  
  if (a.length !== b.length) {
    console.error("Dot product inputs not equal!");
    return undefined;
  }
  var sum = 0;
  for (var i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}


var InputNeuron = function () {
  'use strict';
  
  this.lastInput = undefined;
  this.lastOutput = undefined;
  
  this.outputNeurons = undefined;
  
  this.setup = function (input) {
    this.lastInput = input;
  }
  
  this.evaluate = function () {
    this.lastOutput = this.lastInput;
  }
  
};

var Neuron = function () {
  'use strict';
  
  this.lastInputs = undefined;
  this.lastOutput = undefined;
  this.weights = undefined;
  this.bias = undefined;
  
  this.lastError = undefined;
  
  this.inputNeurons = undefined;
  
  this.outputNeurons = undefined;
  this.targetOutput = undefined;
  
  this.evaluate = function () {
    this.lastInputs = [];
    for (var i = 0; i < this.inputNeurons.length; i++) {
      this.lastInputs.push(this.inputNeurons[i].lastOutput);
    }
    this.lastOutput = this.activation(dot(this.lastInputs, this.weights) + this.bias);
  }
    
  this.calcError = function () {
    if(this.outputNeurons != undefined){
      var s = 0;
      var i, j;
      var w = -1;
      for (i = 0; i < this.outputNeurons.length; i += 1) {
        for(j = 0; j < this.outputNeurons[i].inputNeurons.length; j += 1){
          if(this.outputNeurons[i].inputNeurons[j] === this){
            w = i;
            break;
          }
        }
        if(w != -1){
          break;
        }
      }
      for (i = 0; i < this.outputNeurons.length; i += 1) {
        s += this.outputNeurons[i].lastError * this.outputNeurons[i].weights[w];
      }
      this.lastError = this.activationDeriv(this.lastOutput) * s;
    } else if (this.targetOutput != undefined){
      this.lastError = this.activationDeriv(this.lastOutput) * (this.targetOutput - this.lastOutput);
    } else { 
      console.log("Both outputNeurons and targetOutput are undefined!");
    }
  }
  
  this.updateWeights = function (learningRate) {
    var i;
    for (i = 0; i < this.weights.length; i += 1) {
      this.weights[i] += learningRate * this.lastInputs[i] * this.lastError;
    }
    this.bias += learningRate * this.activation(this.bias) * this.lastError;
  }
  
  this.activation = function (x) {
    return 1.0 / (1.0 + Math.exp(-x));
  }
  
  this.activationDeriv = function (x) {
    return this.activation(x) * (1.0 - this.activation(x))
  }
};

var Network = function (topology) {
  'use strict';
  
  this.layers = [];
  
  var i, j, k;
  
  //Input Layer
  this.layers.push([]);
  for (i = 0; i < topology[0]; i += 1) {
    this.layers[0].push(new InputNeuron());
  }
  
  //Hidden Layers
  for (i = 1; i < topology.length - 1; i += 1) {
    this.layers.push([]);
    for (j = 0; j < topology[i]; j += 1) {
      this.layers[i].push(new Neuron());
    }
  }
  
  //Output Layer
  this.layers.push([]);
  for (i = 0; i < topology[topology.length - 1]; i += 1) {
    this.layers[topology.length - 1].push(new Neuron());
  }
  
  //set in neurons
  for (i = 1; i < this.layers.length; i += 1) {
    for (j = 0; j < this.layers[i].length; j += 1) {
      this.layers[i][j].inputNeurons = this.layers[i - 1];
    }
  }
  
  //set out neurons
  for (i = 0; i < this.layers.length - 1; i += 1) {
    for (j = 0; j < this.layers[i].length; j += 1) {
      this.layers[i][j].outputNeurons = this.layers[i + 1];
    }
  }
  
  for (i = 1; i < this.layers.length; i += 1) {
    for (j = 0; j < this.layers[i].length; j += 1) {
      this.layers[i][j].weights = [];
      for (k = 0; k < this.layers[i][j].inputNeurons.length; k += 1) {
        this.layers[i][j].weights.push(Math.random());
      }
      this.layers[i][j].bias = Math.random();
    }
  }
  
  this.evaluate = function (inputs) {
    var i, j;
    for (i = 0; i < this.layers[0].length; i += 1) {
      this.layers[0][i].setup(inputs[i]);
    }
    for (i = 0; i < this.layers.length; i += 1) {
      for (j = 0; j < this.layers[i].length; j += 1) {
        this.layers[i][j].evaluate();
      }
    }
    var outputs = [];
    for (j = 0; j < this.layers[this.layers.length - 1].length; j += 1) {
      outputs.push(this.layers[this.layers.length - 1][j].lastOutput);
    }
    return outputs;
  }
  
  this.learn = function (targets, learningRate) {
    var i, j;
    for (j = 0; j < targets.length; j += 1) {
      this.layers[this.layers.length - 1][j].targetOutput = targets[j];
    }
    for (i = this.layers.length - 1; i > 0; i -= 1) {
      for (j = 0; j < this.layers[i].length; j += 1) {
        this.layers[i][j].calcError();
      }
    }
    for (i = this.layers.length - 1; i > 0; i -= 1) {
      for (j = 0; j < this.layers[i].length; j += 1) {
        this.layers[i][j].updateWeights(learningRate);
      }
    }
  }
  
};