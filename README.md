transition-callbacks.js
========
transition-callbacks is a small library for handling transition callbacks.

A typical scenario is that you want to animate an element and do something when the transition is done.
This is easily done using the [transition end event](https://developer.mozilla.org/en/CSS/CSS_transitions#Detecting_the_completion_of_a_transition)
but it gets harder when you want to have a more error resistant site.

For instance, what happens if the event never fires, maybe an element will obscure the page making other elements unclickable.
A solution for this is to have a fallback timer which gets trickier since this timer
has to be cleared before the next animation or you might get unwanted results.

This library provides an easy way of making sure the callback gets call no matter if
the browser supports transitions or not.

Features
========
* No dependencies
* Supports Safari, Google Chrome, Firefox and Internet Explorer
* Simple and easy to use
* jQuery is supported but not required
* Small JS footprint (< 1K gzipped, ≈1.8K uncompressed)
* MIT License

Building
========
You can skip this if you just want the latest stable version.
The master branch always has up to date builds.

### Prerequisites
* [Rake](http://rake.rubyforge.org/)
* [Bundler](http://gembundler.com/)

### Running the build
- `bundle install`
- `rake build` or just `rake`

### Cleaning
There is a `rake clean` command which simply removes the build directory.

Installation
============
If you want the coffeescript the source is in the `src/coffeescripts` directory.

Otherwise just take the `build/javascripts/transition-callbacks-min.js` (or the non minified version) and include it in your application.

Usage
=====
Please see the examples directory for a few examples.

Documentation
=============
Functions
---------
### addCallback(element, [options], callback)
Adds a new callback.

If the element doesn't support transitions the callback will be fired without any
delay.

* `element` - The element that will be transitioned. Can be either a raw DOM object
  or a jQuery object.

* `options` - An object containing any options. This is argument is optional.

    * `timeout` - A timeout in milliseconds for the transition that will override the default value.
      This should be slightly higher than the animation duration+delay.
      If `false` is passed no timeout is set.
      Default is 3 seconds.

    * `clearAll` - A flag indicating whether *all* old callbacks on the element
      should be cleared before adding the new one.

* `callback` - The callback to be called when the transition stops (or times out).
  The context (this) will be the element itself.

### cancelCallback(element, [callback])
Cancels the specified callback.
The callback won't get called after this method is called.

If no callback is specified all callbacks on that element are cancelled.

### cancelAllCallbacks()
Cancels all callbacks on all objects.

### hasCallbackPending(element, [callback])
Check if the specified element has the specified callback pending.

If no callback is specified it will check if the element has any callbacks pending.

Static variables
----------------
### timeout
The default timeout in milliseconds. Default is `3000`.

### clearAll
A default value to specify if all callbacks on an element should be cancelled when
a new callback is added. Default is `false`.

### transition
This variable can either be `false` or and object containing the key `end`.
Attached to this key is the transition end event name.

This can be used to determine if transitions are possible. Here is an example:

    if(TransitionCallbacks.transition) {
      // Transitions are supported and TransitionCallbacks.transition.end is set
    }
    else {
      // Transitions are not supported.
    }

This variables is cloned to `$.support.transition` if jQuery is included.

Creating new objects
--------------------
You can also create new `TransitionCallbacks` objects.
This is done by simple creating a new object:

    new TransitionCallbacks();

After the object is created you may call `addCallback`, `cancelAllCallbacks` or `cancelCallback` on that
object. It will have its own list of callbacks so there will be no cross-over between
that and the global object.

The object will also have its own `clearAll` and `timeout` attributes.

The constructor takes the following options:

* `timeout` - A default timeout that will override (for this object) the global default timeout.

* `clearAll` - A flag indicating whether this object should clear all other callbacks on an element when a new one is added.

Examples
--------
See the examples directory or the [examples site](http://wrapp.github.com/transition-callbacks.js/).

jQuery functions
----------------
### jQueryElements.addTransitionCallback([options], callback)
### jQueryElements.cancelTransitionCallback([callback])
### jQueryElements.hasTransitionCallbackPending([callback])
### jQuery.cancelAllTransitionCallbacks()

Contact
=======
To report any problems or suggestions please use the [GitHub issue tracker](https://github.com/ansman/transition-callbacks.js/issues).

License
=======
This project is licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).

Changelist
==========
### 1.0.1
* Fix a broken example.

### 1.0
* Initial release.
