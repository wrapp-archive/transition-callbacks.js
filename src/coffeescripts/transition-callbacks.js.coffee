isEmpty = (object) ->
  return true unless object?
  return false for k of object
  return true

shallowCopy = (object) ->
  o = {}
  o[key] = value for key, value of object
  return o

class window.TransitionCallbacks
  @VERSION: '0.1'
  @timeout: 3000
  @clearAll: false

  @transition: (=>
    style = (document.body or document.documentElement).style

    map =
      WebkitTransition: 'webkitTransitionEnd'
      MozTransition: 'transitionend'
      MsTransition: 'MSTransitionEnd'
      OTransition: 'oTransitionEnd'
      transition: 'TransitionEnd'

    return { end: value} for key, value of map when key of style
    return false)()

  @_transitionCallbacks: {}

  @addCallback: (element, options, callback) ->
    if typeof options is 'function'
      callback = options
      options = {}
    else
      options ||= {}

    # For jQuery elements
    element = element.get(0) if typeof element?.get is 'function'
    throw new TransitionCallbacks.NoElementGiven unless element

    throw new TransitionCallbacks.NoCallbackGiven unless callback

    timeout = @_getTimeout(options)
    @_clearOldCallbacks(element, callback, options)

    @_transitionCallbacks[element] ||= {}

    c = @_transitionCallbacks[element][callback] = {}

    c.callback = =>
      return if not @_transitionCallbacks[element][callback]? or c.cancelled
      c.cancel()
      callback.call(element)

    c.cancel = =>
      c.cancelled = true
      delete @_transitionCallbacks[element][callback]
      element.removeEventListener?(@transition.end, c, false) if @transition
      clearTimeout(c.timeout)

    if @transition and typeof element.addEventListener is 'function'
      element.addEventListener(@transition.end, c.callback, false)
      c.timeout = setTimeout(c.callback, timeout) if timeout isnt false
    else
      c.callback()

    return

  @_getTimeout: (options) ->
    if options.timeout?
      options.timeout
    else if @timeout?
      @timeout
    else
      TransitionCallbacks.timeout

  @_clearOldCallbacks: (element, callback, options) ->
    clearAll = if options.clearAll?
      options.clearAll
    else if @clearAll?
      @clearAll
    else
      TransitionCallbacks.clearAll

    if clearAll
      @cancelCallback(element)
    else
      @cancelCallback(element, callback)

  @cancelCallback: (element, callback) ->
    element = element.get(0) if typeof element?.get is 'function'
    return false unless @_transitionCallbacks[element]

    if callback?
      if @_transitionCallbacks[element][callback]
        @_transitionCallbacks[element][callback].cancel()
      else
        return false
    else
      callbacks = shallowCopy(@_transitionCallbacks[element])
      value.cancel() for key, value of callbacks

    return true

  @cancelAllCallbacks: ->
    @cancelCallback(element) for element of @_transitionCallbacks

  @isCallbackPending: (element, callback) ->
    return false unless c = @_transitionCallbacks[element]
    if callback?
      callback of c
    else
      !isEmpty(c)

  constructor: (options={}) ->
    @timeout = options.timeout if options.timeout?
    @clearAll = options.clearAll if options.clearAll?
    @_transitionCallbacks = {}

  transition: @transition
  addCallback: @addCallback
  _getTimeout: @_getTimeout
  _clearOldCallbacks: @_clearOldCallbacks
  cancelCallback: @cancelCallback
  cancelAllCallbacks: @cancelAllCallbacks
  hasCallbackPending: @hasCallbackPending

class TransitionCallbacks.NoCallbackGiven
  @prototype = Error.prototype
  constructor: -> @name = 'NoCallbackGiven'

class TransitionCallbacks.NoElementGiven
  @prototype = Error.prototype
  constructor: -> @name = 'NoElementGiven'

# Add transition support to jQuery if it's used
if ($ = window.jQuery)
  $.support.transition = TransitionCallbacks.transition

  tc = new TransitionCallbacks()

  $.fn.addTransitionCallback = (options, callback) ->
    tc.addCallback(@.get(0), options, callback) if @length > 0
    return this

  $.fn.cancelTransitionCallback = (callback) ->
    tc.cancelCallback(element, callback) for element in this
    return this

  $.fn.hasTransitionCallbackPending = (callback) ->
    pending = false
    @each (index, element) ->
      pending &&= tc.hasCallbackPending(callback)
      return not pending # Cancel if found
    return pending

  $.cancelAllTransitionCallbacks = ->
    tc.cancelAllCallbacks()
