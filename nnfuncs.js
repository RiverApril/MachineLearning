

var InitalWeightFunctions = {}
var ActivationFunctions = {}
var ActivationDerivFunctions = {}

InitalWeightFunctions["Random -1 to 1"] = function () {
  return (Math.random()*2.0)-1.0;
}

ActivationFunctions["Sigmoid (0 to 1)"] = function (x) {
  return 1.0 / (1.0 + Math.exp(-x));
}
ActivationDerivFunctions["Sigmoid (0 to 1)"] = function (x) {
  return (Math.exp(x) / (Math.pow(Math.exp(x) + 1, 2)));
}

ActivationFunctions["Hyperbolic Tangent (-1 to 1)"] = function (x) {
  return (Math.exp(x*2) - 1) / (Math.exp(x*2) + 1)
}
ActivationDerivFunctions["Hyperbolic Tangent (-1 to 1)"] = function (x) {
  return (4 * (Math.exp(x*2))) / Math.pow(Math.exp(x*2)+1, 2)
}