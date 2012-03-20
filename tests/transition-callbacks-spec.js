describe("TransitionCallbacks", function() {
  var transitionElement, oldElement, count, called

  beforeEach(function() {
    transitionElement = new TransitionElement()
    oldElement = {}
    count = 0
    called = false
    TransitionCallbacks.cancelAllCallbacks()
    TransitionCallbacks.timeout = 3000
  })

  function simpleCallback() {
    ++count;
    called = true;
  }

  function isPending() {
    return TransitionCallbacks.isCallbackPending(transitionElement)
  }

  function setupSimpleCallback(options) {
    TransitionCallbacks.addCallback(transitionElement, options, simpleCallback)
  }

  it("should call the callback", function() {
    setupSimpleCallback()
    transitionElement.triggerTransitionEnd()
    expect(called).toBe(true)
  })

  it("should not call the callback twice", function() {
    setupSimpleCallback()
    transitionElement.triggerTransitionEnd()
    transitionElement.triggerTransitionEnd()
    expect(count).toBe(1)
  })

  it("should not call the callback if cancelled", function() {
    setupSimpleCallback()
    TransitionCallbacks.cancelCallback(transitionElement)
    transitionElement.triggerTransitionEnd()
    expect(count).toBe(0)
  })

  it("should overwrite any previous callback with the same ID", function() {
    for(var i = 0; i < 10; ++i)
      setupSimpleCallback()
    transitionElement.triggerTransitionEnd()
    expect(count).toBe(1)
  })

  it("should allow multiple, different, callbacks", function() {
    var called1 = false, called2 = false
    TransitionCallbacks.addCallback(transitionElement, function() { called1 = true })
    TransitionCallbacks.addCallback(transitionElement, function() { called2 = true })
    transitionElement.triggerTransitionEnd()
    expect(called1).toBe(true)
    expect(called2).toBe(true)
  })

  it("should time out after the specified timeout", function() {
    runs(function() {
      var tc = new TransitionCallbacks()
      TransitionCallbacks.timeout = 300
      tc.timeout = 200
      setupSimpleCallback({timeout: 100})
    })

    waits(95) // Allow for bad timing

    runs(function() {
      expect(count).toBe(0)
    })

    waits(10) // Allow for bad timing

    runs(function() {
      expect(count).toBe(1)
    })
  })

  it('should use the default timeout if no timout is specified', function() {
    tc = new TransitionCallbacks({timeout: 50})

    runs(function() {
      tc.addCallback(transitionElement, simpleCallback)
    })

    waits(45) // Allow for bad timing

    runs(function() {
      expect(count).toBe(0)
    })

    waits(10) // Allow for bad timing

    runs(function() {
      expect(count).toBe(1)
    })
  })

  it("should call the callback directly on an old element", function() {
    TransitionCallbacks.addCallback(oldElement, simpleCallback)
    expect(count).toBe(1)
  })

  it("passing undefined as callback should cancel all callbacks", function() {
    var called1 = false, called2 = false
    TransitionCallbacks.addCallback(transitionElement, function() { called1 = true })
    TransitionCallbacks.addCallback(transitionElement, function() { called2 = true })
    TransitionCallbacks.cancelCallback(transitionElement)
    transitionElement.triggerTransitionEnd()
    expect(called1).toBe(false)
    expect(called2).toBe(false)
  })

  it("cancel should only cancel the specified callback", function() {
    var called1 = false, called2 = false

    var callback1 = function() { called1 = true }
    var callback2 = function() { called2 = true }

    TransitionCallbacks.addCallback(transitionElement, callback1)
    TransitionCallbacks.addCallback(transitionElement, callback2)

    TransitionCallbacks.cancelCallback(transitionElement, callback1)
    transitionElement.triggerTransitionEnd()

    expect(called1).toBe(false)
    expect(called2).toBe(true)
  })

  it('should raise an exception if no callback is provided', function() {
    var fn = function() {
      TransitionCallbacks.addCallback(transitionElement)
    }
    expect(fn).toThrow(new TransitionCallbacks.NoCallbackGiven)
  })

  it('should raise an exception if no element is provided', function() {
    var fn = function() {
      TransitionCallbacks.addCallback()
    }
    expect(fn).toThrow(new TransitionCallbacks.NoElementGiven)
  })

  it('should report there are pending callbacks if there are', function() {
    expect(isPending()).toBe(false)
    setupSimpleCallback()
    expect(isPending()).toBe(true)
  })

  it('should report there are no pending callbacks if they are cancelled', function() {
    setupSimpleCallback()
    expect(isPending()).toBe(true)
  })

  it('should change the default timeout of a custom object when the global timeout changes', function() {
    TransitionCallbacks.timeout = 3000
    var tc = new TransitionCallbacks()
    TransitionCallbacks.timeout = 100

    runs(function() {
      tc.addCallback(transitionElement, simpleCallback)
    })

    waits(105) // Allow for bad timing

    runs(function() {
      expect(count).toBe(1)
    })
  })

  it('should clear all callbacks on an element if clearAll is true', function() {
    var called1 = false, called2 = false

    var callback1 = function() { called1 = true }
    var callback2 = function() { called2 = true }

    TransitionCallbacks.addCallback(transitionElement, callback1)
    TransitionCallbacks.addCallback(transitionElement, {clearAll: true}, callback2)
    transitionElement.triggerTransitionEnd()

    expect(called1).toBe(false)
    expect(called2).toBe(true)
  })
})
