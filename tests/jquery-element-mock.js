var jQueryElement = function() {
  this.elements = Array.prototype.slice(arguments);
}

jQueryElement.prototype.get = function(index) {
  return this.elements[index];
}
