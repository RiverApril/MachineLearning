var NeuralNetwork = function(inputCount, outputCount, hiddenLayerCount, neuronsPerHiddenLayer){
  
  this.inputCount = inputCount;
  this.outputCount = outputCount;
  this.hiddenLayerCount = hiddenLayerCount;
  this.neuronsPerHiddenLayer = neuronsPerHiddenLayer;
  
  this.layers = [];
  
  this.layers.push(new NeuronLayer(this.neuronsPerHiddenLayer, this.inputCount));
  
  for(var i=1;i<hiddenLayerCount;i++){
    this.layers.push(new NeuronLayer(this.neuronsPerHiddenLayer, this.neuronsPerHiddenLayer));
  }
  
  this.layers.push(new NeuronLayer(this.outputCount, this.neuronsPerHiddenLayer));
  
  this.evaluate = function(inputs){
    var outputs = [];
    
    if(inputCount != inputs.length){
      alert("inputCount != inputs.length", inputCount, inputs);
      return [];
    }
    
    for(var i=0;i<this.hiddenLayerCount+1;i++){
      if(i > 0){
        inputs = outputs.slice();
      }
      outputs = [];
      for(var j=0;j<this.layers[i].neuronCount;j++){
        var netInput = 0;
        
        for(var k=0;k<this.layers[i].neurons[j].inputCount;k++){
          netInput += this.layers[i].neurons[j].weights[k] * inputs[k];
        }
        
        netInput += this.layers[i].neurons[j].weights[this.layers[i].neurons[j].inputCount];
        
        outputs.push(sigmoid(netInput));
        
      }
    }
    
    
    
    return outputs;
  }
  
  
}

var NeuronLayer = function(neuronCount, inputsPerNeuron){
  this.neuronCount = neuronCount;
  
  this.neurons = [];
  
  for(var i=0;i<neuronCount;i++){
    this.neurons.push(new Neuron(inputsPerNeuron));
  }
  
}

var Neuron = function(inputCount){
  
  this.inputCount = inputCount;
  
  this.weights = [];
  
  for(var i=0;i<inputCount+1;i++){//extra for output weight
    this.weights.push(Math.random()*2-1);
  }
  
}

function sigmoid(a){
  return 1.0 / (1.0+Math.pow(Math.E, -a));
}