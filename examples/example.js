(console = console || {}).log = function(text) {
  $("#messages").prepend(text + '<br>');
}

$(function() {
  $('li').each(function(index, element) {
    var exampleName = $(element).data('example');
    $('button', element).click(window[exampleName]);
  });
});

function animateBlock() {
  console.log('------------------');
  console.log('Starting animation');

  // Start the animation
  return $('#block').toggleClass('animate');
}


function basicExample() {
  TransitionCallbacks.addCallback(animateBlock(), function() {
    console.log('Transition finished');
  });
}


function cancellingExample() {
  var element = animateBlock()
  TransitionCallbacks.addCallback(element, function() {
    console.log('Oops, something went wrong :(');
  });

  console.log('Cancelling the callback');
  TransitionCallbacks.cancelCallback(element);
}

function copiedObjectExample() {
  var element = animateBlock();
  var callback = function() {
    console.log('Transition finished');
  }

  tm = new TransitionCallbacks();
  console.log('Created new TransitionCallbacks object');

  tm.addCallback(element, callback);
  console.log("Created a callback on the custom object");

  // Now to the same with the global object
  TransitionCallbacks.addCallback(element, callback);
  console.log("Created a callback on the global object");

  // Cancel the callback with the global object
  console.log("Cancel the callback with the global object");
  TransitionCallbacks.cancelCallback(element);
}


function timeoutExample() {
  console.log('------------------');

  TransitionCallbacks.addCallback($("#block"), {timeout: 100}, function() {
    console.log('Callback called after timeout');
  });

  console.log('Starting the animation of the block');
  $('#block').toggleClass('animate');
}

function duplicatesExample() {
  var callback = function() {
    console.log('Transition finished')
  }

  var element = animateBlock()

  TransitionCallbacks.addCallback(element, callback);
  TransitionCallbacks.addCallback(element, callback);
  TransitionCallbacks.addCallback(element, callback);
  TransitionCallbacks.addCallback(element, callback);
  TransitionCallbacks.addCallback(element, callback);
}

function jQueryExample() {
  animateBlock().addTransitionCallback(function() {
    console.log('Transition finished')
  });
}
