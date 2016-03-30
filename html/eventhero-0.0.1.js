var EventHero = ((new function() {
    var self = this;

    /**
     * Handlers instance collection.
     * @type {{}}
     */
    self.handlers = {};

    /**
     * Define class HandlerParam
     * @constructor
     */
    var HandlerParam = function() {
        var hp = this;
        hp.isSet = false;

        /**
         * Setter.
         * @param value
         */
        hp.setValue = function(value) {
            hp.currentValue = value;
            hp.isSet = true;
        };

        /**
         * Getter
         * @returns {*}
         */
        hp.getValue = function() {
            return hp.currentValue;
        };
    };

    /**
     * Define class GeneralListener.
     * @param handler {Handler}
     * @param handlerParams {[HandlerParams1, HandlerParams2, HandlerParams3 ...]}
     * @constructor
     */
    var GeneralListener = function(handler, handlerParams) {
        handlerParams = handlerParams || [];
        var l = this;

        l.subEmitter = function() {
            return function() {
                for(var i in arguments) {
                    if(handlerParams[i]) {
                        handlerParams[i].setValue(arguments[i]);
                    }
                }

                handler.emitSubCallbackCalled();
            }
        };
    };

    /**
     * Defined class Handler.
     * @param define {function}
     * @param Listener {Listener}
     */
    var Handler = function(define, Listener) {
        var h = this;
        h.params = {};
        h.originHandler = define;

        /**
         * Initialize params.
         */
        (function initParams(def) {
            var args = self.getParamNames(def);
            for(var i in args) {
                h.params[args[i]] = new HandlerParam(args[i]);
            }
        }(define));

        /**
         * Initialize Listener.
         */
        (function initEmitter() {
            Listener = Listener || self.listener("general");
        }());

        /**
         * Create a handler listener
         * @param {[, params1, params2, params3...]} Handler params.
         */
        h.listen = function() {
            var listener = new Listener(h, arguments);
            return listener.subEmitter();
        };

        /**
         * params getter.
         * @returns {{}}
         */
        h.getParams = function() {
            return h.params;
        };

        /**
         * Emitting current handler called event.
         */
        h.emitCalledCallback = function() {
            var args = [];
            var params = h.getParams();

            for(var i in params) {
                args.push(params[i].getValue());
            }

            h.originHandler.apply(h, args);
        };

        /**
         * Emitting sub callback called event.
         */
        h.emitSubCallbackCalled = function() {
            var params = h.getParams();
            var isShouldEmit = true;

            for(var name in params) {
                isShouldEmit = isShouldEmit && params[name].isSet;
            }

            if(isShouldEmit) {
                h.emitCalledCallback();
            }
        };
    };

    /**
     * Helper
     * @param func {function}
     * @returns {Array|{index: number, input: string}}
     */
    self.getParamNames = function(func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;

        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null)
            result = [];
        return result;
    };

    /**
     * Factory method for event handler object.
     * @param name {string} name of handler.
     * @param define {function} Original handler function define.
     */
    self.create = function(name, define) {
        var handler = new Handler(define);
        self.handlers[name] = handler;
        return handler;
    };

    /**
     * Listener class factory.
     * @param name {string} Name of listener class.
     */
    self.listener = function(name) {
        return GeneralListener;
    };

}()));