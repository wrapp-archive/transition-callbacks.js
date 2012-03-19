var TransitionElement = function() {
  this.callbacks = {};
}

TransitionElement.prototype.addEventListener = function(eventName, callback) {
  if(this.callbacks[eventName] === undefined)
    this.callbacks[eventName] = [];

  this.callbacks[eventName].push(callback);
}

TransitionElement.prototype.removeEventListener = function(eventName, callback) {
  if(this.callbacks[eventName] === undefined)
    return;

  var l = this.callbacks[eventName];
  for(var i = 0; i < l.length; ++i) {
    if(l[i] === callback)
      l.splice(i--, 1);
  }
}

TransitionElement.prototype.trigger = function(eventName) {
  if(this.callbacks[eventName] === undefined)
    return;

  var l = this.callbacks[eventName].slice(0);
  for(i = 0; i < l.length; ++i)
    l[i]();
}

TransitionElement.prototype.triggerTransitionEnd = function() {
  return this.trigger(TransitionCallbacks.transition.end);
}

TransitionElement.prototype.hasCallbacks = function() {
  for(var ev in this.callbacks) {
    if(this.callbacks[ev].length > 0)
      return true;
  }
  return false;
}
