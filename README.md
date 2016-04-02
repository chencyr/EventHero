# EventHero
Advanced event handler tool for javascript.

# Install

## For browser
```
<script src="/src/eventhero.js"></script>
```

## For nodeJs
```
var EventHero = require('./src/eventhero');
```

# Quickstart

```
// Create a event handler.
var handler = EventHero.create(function(e1, e2, e3) {
    console.log('hanlder(e1=' + e1 + ', e2=' + e2 + ', e3=' + e3 + ')');
});

var params = handler.getParams();

// Forward params e1, e3 by listener after 1s.
setTimeout(function() {

    var listener = handler.listen(params.e1, params.e3);
    var e1 = 10;
    var e3 = 30;

    listener(e1, e3);

}, 1000);


// Forward params e2 by listener after 2s.
setTimeout(function() {

    var listener = handler.listen(params.e2);
    var e2 = 20;

    listener(e2);

}, 2000);

// Show message handler(10, 20, 30) on console after 2s.

```

# Classes

## EventHero

### create(define<function>[, customerSettings<object>]) :: Handler

    define
        The original handle function.
    customerSettings
        For customer requirements.

### customerSettings.emitter<Emitter>

    Extend and implement your Emitter class.

### customerSettings.onApplyOrigin<function> :: boolean

    Define hook function for original handler called. And decide clear params all not.

```
    var customerSettings = {
        /**
         * Hook for original handler called.
         * @param allParams All of the handler's params.
         * @returns {boolean} Return true to clear all params.
         */
        onApplyOrigin : function(allParams) {
            // Clear params after original handler called.
            // Default is return true.
            return true;
        }
    }

    var handler = EventHero.create(function(e1, e2, e3, e4, e5) {
            // Some process.
    }, customerSettings);

```

### customerSettings.onReceivedParams<function> :: boolean

    Define hook function for each params received from emitter's listener.

```
    var customerSettings = {
        /**
         * Hook for received new param value by listener.
         * @param allParams All of the handler's params.
         * @param newParams The new params of received.
         * @param srcEmitter Source emitter of params.
         * @returns {boolean}
         */
        onReceivedParams : function(allParams, newParams, srcEmitter) {
            // Some your rules.

            // Return true if should emit original handler.
            return true;
        }
    }

    var handler = EventHero.create(function(e1, e2, e3, e4, e5) {
            // Some process.
    }, customerSettings);

```



