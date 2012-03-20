(function() {
  var $, isEmpty, shallowCopy, tc;

  isEmpty = function(object) {
    var k;
    if (object == null) return true;
    for (k in object) {
      return false;
    }
    return true;
  };

  shallowCopy = function(object) {
    var key, o, value;
    o = {};
    for (key in object) {
      value = object[key];
      o[key] = value;
    }
    return o;
  };

  window.TransitionCallbacks = (function() {
    var _this = this;

    TransitionCallbacks.VERSION = '1.0';

    TransitionCallbacks.timeout = 3000;

    TransitionCallbacks.clearAll = false;

    TransitionCallbacks.transition = (function() {
      var key, map, style, value;
      style = (document.body || document.documentElement).style;
      map = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        MsTransition: 'MSTransitionEnd',
        OTransition: 'oTransitionEnd',
        transition: 'TransitionEnd'
      };
      for (key in map) {
        value = map[key];
        if (key in style) {
          return {
            end: value
          };
        }
      }
      return false;
    })();

    TransitionCallbacks._transitionCallbacks = {};

    TransitionCallbacks.addCallback = function(element, options, callback) {
      var c, timeout, _base,
        _this = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options || (options = {});
      }
      if (typeof (element != null ? element.get : void 0) === 'function') {
        element = element.get(0);
      }
      if (!element) throw new TransitionCallbacks.NoElementGiven;
      if (!callback) throw new TransitionCallbacks.NoCallbackGiven;
      timeout = this._getTimeout(options);
      this._clearOldCallbacks(element, callback, options);
      (_base = this._transitionCallbacks)[element] || (_base[element] = {});
      c = this._transitionCallbacks[element][callback] = {};
      c.callback = function() {
        if (!(_this._transitionCallbacks[element][callback] != null) || c.cancelled) {
          return;
        }
        c.cancel();
        return callback.call(element);
      };
      c.cancel = function() {
        c.cancelled = true;
        delete _this._transitionCallbacks[element][callback];
        if (_this.transition) {
          if (typeof element.removeEventListener === "function") {
            element.removeEventListener(_this.transition.end, c, false);
          }
        }
        return clearTimeout(c.timeout);
      };
      if (this.transition && typeof element.addEventListener === 'function') {
        element.addEventListener(this.transition.end, c.callback, false);
        if (timeout !== false) c.timeout = setTimeout(c.callback, timeout);
      } else {
        c.callback();
      }
    };

    TransitionCallbacks._getTimeout = function(options) {
      if (options.timeout != null) {
        return options.timeout;
      } else if (this.timeout != null) {
        return this.timeout;
      } else {
        return TransitionCallbacks.timeout;
      }
    };

    TransitionCallbacks._clearOldCallbacks = function(element, callback, options) {
      var clearAll;
      clearAll = options.clearAll != null ? options.clearAll : this.clearAll != null ? this.clearAll : TransitionCallbacks.clearAll;
      if (clearAll) {
        return this.cancelCallback(element);
      } else {
        return this.cancelCallback(element, callback);
      }
    };

    TransitionCallbacks.cancelCallback = function(element, callback) {
      var callbacks, key, value;
      if (typeof (element != null ? element.get : void 0) === 'function') {
        element = element.get(0);
      }
      if (!this._transitionCallbacks[element]) return false;
      if (callback != null) {
        if (this._transitionCallbacks[element][callback]) {
          this._transitionCallbacks[element][callback].cancel();
        } else {
          return false;
        }
      } else {
        callbacks = shallowCopy(this._transitionCallbacks[element]);
        for (key in callbacks) {
          value = callbacks[key];
          value.cancel();
        }
      }
      return true;
    };

    TransitionCallbacks.cancelAllCallbacks = function() {
      var element, _results;
      _results = [];
      for (element in this._transitionCallbacks) {
        _results.push(this.cancelCallback(element));
      }
      return _results;
    };

    TransitionCallbacks.isCallbackPending = function(element, callback) {
      var c;
      if (!(c = this._transitionCallbacks[element])) return false;
      if (callback != null) {
        return callback in c;
      } else {
        return !isEmpty(c);
      }
    };

    function TransitionCallbacks(options) {
      if (options == null) options = {};
      if (options.timeout != null) this.timeout = options.timeout;
      if (options.clearAll != null) this.clearAll = options.clearAll;
      this._transitionCallbacks = {};
    }

    TransitionCallbacks.prototype.transition = TransitionCallbacks.transition;

    TransitionCallbacks.prototype.addCallback = TransitionCallbacks.addCallback;

    TransitionCallbacks.prototype._getTimeout = TransitionCallbacks._getTimeout;

    TransitionCallbacks.prototype._clearOldCallbacks = TransitionCallbacks._clearOldCallbacks;

    TransitionCallbacks.prototype.cancelCallback = TransitionCallbacks.cancelCallback;

    TransitionCallbacks.prototype.cancelAllCallbacks = TransitionCallbacks.cancelAllCallbacks;

    TransitionCallbacks.prototype.hasCallbackPending = TransitionCallbacks.hasCallbackPending;

    return TransitionCallbacks;

  }).call(this);

  TransitionCallbacks.NoCallbackGiven = (function() {

    NoCallbackGiven.prototype = Error.prototype;

    function NoCallbackGiven() {
      this.name = 'NoCallbackGiven';
    }

    return NoCallbackGiven;

  })();

  TransitionCallbacks.NoElementGiven = (function() {

    NoElementGiven.prototype = Error.prototype;

    function NoElementGiven() {
      this.name = 'NoElementGiven';
    }

    return NoElementGiven;

  })();

  if (($ = window.jQuery)) {
    $.support.transition = TransitionCallbacks.transition;
    tc = new TransitionCallbacks();
    $.fn.addTransitionCallback = function(options, callback) {
      if (this.length > 0) tc.addCallback(this.get(0), options, callback);
      return this;
    };
    $.fn.cancelTransitionCallback = function(callback) {
      var element, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        element = this[_i];
        tc.cancelCallback(element, callback);
      }
      return this;
    };
    $.fn.hasTransitionCallbackPending = function(callback) {
      var pending;
      pending = false;
      this.each(function(index, element) {
        pending && (pending = tc.hasCallbackPending(callback));
        return !pending;
      });
      return pending;
    };
    $.cancelAllTransitionCallbacks = function() {
      return tc.cancelAllCallbacks();
    };
  }

}).call(this);
