var AsciinemaPlayer = (function (exports) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
  }

  var runtime = {exports: {}};

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  (function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
      return this;
    });

    define(Gp, "toString", function() {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
  }(runtime));

  var regenerator = runtime.exports;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  const equalFn = (a, b) => a === b;
  const $PROXY = Symbol("solid-proxy");
  const signalOptions = {
    equals: equalFn
  };
  let runEffects = runQueue;
  const NOTPENDING = {};
  const STALE = 1;
  const PENDING = 2;
  const UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  let Transition = null;
  let Listener = null;
  let Pending = null;
  let Updates = null;
  let Effects = null;
  let ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    detachedOwner && (Owner = detachedOwner);
    const listener = Listener,
          owner = Owner,
          root = fn.length === 0 && !false ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: null,
      owner
    };
    Owner = root;
    Listener = null;
    let result;
    try {
      runUpdates(() => result = fn(() => cleanNode(root)), true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
    return result;
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      pending: NOTPENDING,
      comparator: options.equals || undefined
    };
    return [readSignal.bind(s), value => {
      if (typeof value === "function") {
        value = value(s.pending !== NOTPENDING ? s.pending : s.value);
      }
      return writeSignal(s, value);
    }];
  }
  function createRenderEffect(fn, value, options) {
    updateComputation(createComputation(fn, value, false, STALE));
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE);
    c.user = true;
    Effects && Effects.push(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.pending = NOTPENDING;
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || undefined;
    updateComputation(c);
    return readSignal.bind(c);
  }
  function batch(fn) {
    if (Pending) return fn();
    let result;
    const q = Pending = [];
    try {
      result = fn();
    } finally {
      Pending = null;
    }
    runUpdates(() => {
      for (let i = 0; i < q.length; i += 1) {
        const data = q[i];
        if (data.pending !== NOTPENDING) {
          const pending = data.pending;
          data.pending = NOTPENDING;
          writeSignal(data, pending);
        }
      }
    }, false);
    return result;
  }
  function untrack(fn) {
    let result,
        listener = Listener;
    Listener = null;
    result = fn();
    Listener = listener;
    return result;
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
    return fn;
  }
  function getListener() {
    return Listener;
  }
  function children(fn) {
    const children = createMemo(fn);
    return createMemo(() => resolveChildren(children()));
  }
  function readSignal() {
    if (this.state && this.sources) {
      const updates = Updates;
      Updates = null;
      this.state === STALE || Transition   ? updateComputation(this) : lookDownstream(this);
      Updates = updates;
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    if (node.comparator) {
      if (node.comparator(node.value, value)) return value;
    }
    if (Pending) {
      if (node.pending === NOTPENDING) Pending.push(node);
      node.pending = value;
      return value;
    }
    let TransitionRunning = false;
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (o.pure) Updates.push(o);else Effects.push(o);
          if (o.observers && (TransitionRunning && !o.tState || !TransitionRunning && !o.state)) markUpstream(o);
          if (TransitionRunning) ;else o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (false) ;
          throw new Error();
        }
      }, false);
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn) return;
    cleanNode(node);
    const owner = Owner,
          listener = Listener,
          time = ExecCount;
    Listener = Owner = node;
    runComputation(node, node.value, time);
    Listener = listener;
    Owner = owner;
  }
  function runComputation(node, value, time) {
    let nextValue;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      handleError(err);
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.observers && node.observers.length) {
        writeSignal(node, nextValue);
      } else node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state: state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: null,
      pure
    };
    if (Owner === null) ;else if (Owner !== UNOWNED) {
      {
        if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
      }
    }
    return c;
  }
  function runTop(node) {
    const runningTransition = Transition ;
    if (node.state !== STALE) return node.state = 0;
    if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (node.state || runningTransition ) ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (node.state === STALE || runningTransition ) {
        updateComputation(node);
      } else if (node.state === PENDING || runningTransition ) {
        const updates = Updates;
        Updates = null;
        lookDownstream(node);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates) return fn();
    let wait = false;
    if (!init) Updates = [];
    if (Effects) wait = true;else Effects = [];
    ExecCount++;
    try {
      fn();
    } catch (err) {
      handleError(err);
    } finally {
      completeUpdates(wait);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait) return;
    if (Effects.length) batch(() => {
      runEffects(Effects);
      Effects = null;
    });else {
      Effects = null;
    }
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++) runTop(queue[i]);
  }
  function runUserEffects(queue) {
    let i,
        userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user) runTop(e);else queue[userLength++] = e;
    }
    const resume = queue.length;
    for (i = 0; i < userLength; i++) runTop(queue[i]);
    for (i = resume; i < queue.length; i++) runTop(queue[i]);
  }
  function lookDownstream(node) {
    node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        if (source.state === STALE || Transition  ) runTop(source);else if (source.state === PENDING) lookDownstream(source);
      }
    }
  }
  function markUpstream(node) {
    const runningTransition = Transition ;
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (!o.state || runningTransition ) {
        o.state = PENDING;
        if (o.pure) Updates.push(o);else Effects.push(o);
        o.observers && markUpstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(),
              index = node.sourceSlots.pop(),
              obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(),
                s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (node.owned) {
      for (i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
      node.cleanups = null;
    }
    node.state = 0;
    node.context = null;
  }
  function handleError(err) {
    throw err;
  }
  function resolveChildren(children) {
    if (typeof children === "function" && !children.length) return resolveChildren(children());
    if (Array.isArray(children)) {
      const results = [];
      for (let i = 0; i < children.length; i++) {
        const result = resolveChildren(children[i]);
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
      }
      return results;
    }
    return children;
  }

  const FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++) d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [],
        mapped = [],
        disposers = [],
        len = 0,
        indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [],
          i,
          j;
      return untrack(() => {
        let newLen = newItems.length,
            newIndices,
            newIndicesNext,
            temp,
            tempdisposers,
            tempIndexes,
            start,
            end,
            newEnd,
            item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot(disposer => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        }
        else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === undefined ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== undefined && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  function indexArray(list, mapFn, options = {}) {
    let items = [],
        mapped = [],
        disposers = [],
        signals = [],
        len = 0,
        i;
    onCleanup(() => dispose(disposers));
    return () => {
      const newItems = list() || [];
      return untrack(() => {
        if (newItems.length === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            signals = [];
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot(disposer => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
          return mapped;
        }
        if (items[0] === FALLBACK) {
          disposers[0]();
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
        }
        for (i = 0; i < newItems.length; i++) {
          if (i < items.length && items[i] !== newItems[i]) {
            signals[i](() => newItems[i]);
          } else if (i >= items.length) {
            mapped[i] = createRoot(mapper);
          }
        }
        for (; i < items.length; i++) {
          disposers[i]();
        }
        len = signals.length = disposers.length = newItems.length;
        items = newItems.slice(0);
        return mapped = mapped.slice(0, len);
      });
      function mapper(disposer) {
        disposers[i] = disposer;
        const [s, set] = createSignal(newItems[i]);
        signals[i] = set;
        return mapFn(s, i);
      }
    };
  }

  function createComponent(Comp, props) {
    return untrack(() => Comp(props));
  }

  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback ? fallback : undefined));
  }
  function Index(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(indexArray(() => props.each, props.children, fallback ? fallback : undefined));
  }
  function Show(props) {
    let strictEqual = false;
    const condition = createMemo(() => props.when, undefined, {
      equals: (a, b) => strictEqual ? a === b : !a === !b
    });
    return createMemo(() => {
      const c = condition();
      if (c) {
        const child = props.children;
        return (strictEqual = typeof child === "function" && child.length > 0) ? untrack(() => child(c)) : child;
      }
      return props.fallback;
    });
  }
  function Switch(props) {
    let strictEqual = false;
    const conditions = children(() => props.children),
          evalConditions = createMemo(() => {
      let conds = conditions();
      if (!Array.isArray(conds)) conds = [conds];
      for (let i = 0; i < conds.length; i++) {
        const c = conds[i].when;
        if (c) return [i, c, conds[i]];
      }
      return [-1];
    }, undefined, {
      equals: (a, b) => a && a[0] === b[0] && (strictEqual ? a[1] === b[1] : !a[1] === !b[1]) && a[2] === b[2]
    });
    return createMemo(() => {
      const [index, when, cond] = evalConditions();
      if (index < 0) return props.fallback;
      const c = cond.children;
      return (strictEqual = typeof c === "function" && c.length > 0) ? untrack(() => c(when)) : c;
    });
  }
  function Match(props) {
    return props;
  }

  function memo(fn, equals) {
    return createMemo(fn, undefined, !equals ? {
      equals
    } : undefined);
  }

  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length,
        aEnd = a.length,
        bEnd = bLength,
        aStart = 0,
        bStart = 0,
        after = a[aEnd - 1].nextSibling,
        map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart])) parentNode.removeChild(a[aStart]);
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = new Map();
          let i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart,
                sequence = 1,
                t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence) break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index) parentNode.insertBefore(b[bStart++], node);
            } else parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else aStart++;
        } else parentNode.removeChild(a[aStart++]);
      }
    }
  }

  const $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init) {
    let disposer;
    createRoot(dispose => {
      disposer = dispose;
      insert(element, code(), element.firstChild ? null : undefined, init);
    });
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, check, isSVG) {
    const t = document.createElement("template");
    t.innerHTML = html;
    let node = t.content.firstChild;
    if (isSVG) node = node.firstChild;
    return node;
  }
  function delegateEvents(eventNames, document = window.document) {
    const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document.addEventListener(name, eventHandler);
      }
    }
  }
  function addEventListener(node, name, handler, delegate) {
    if (delegate) {
      if (Array.isArray(handler)) {
        node[`$$${name}`] = handler[0];
        node[`$$${name}Data`] = handler[1];
      } else node[`$$${name}`] = handler;
    } else if (Array.isArray(handler)) {
      node.addEventListener(name, e => handler[0](handler[1], e));
    } else node.addEventListener(name, handler);
  }
  function classList$1(node, value, prev = {}) {
    const classKeys = Object.keys(value || {}),
          prevKeys = Object.keys(prev);
    let i, len;
    for (i = 0, len = prevKeys.length; i < len; i++) {
      const key = prevKeys[i];
      if (!key || key === "undefined" || value[key]) continue;
      toggleClassKey(node, key, false);
      delete prev[key];
    }
    for (i = 0, len = classKeys.length; i < len; i++) {
      const key = classKeys[i],
            classValue = !!value[key];
      if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
      toggleClassKey(node, key, true);
      prev[key] = classValue;
    }
    return prev;
  }
  function style$1(node, value, prev = {}) {
    const nodeStyle = node.style;
    if (value == null || typeof value === "string") return nodeStyle.cssText = value;
    typeof prev === "string" && (prev = {});
    let v, s;
    for (s in prev) {
      value[s] == null && nodeStyle.removeProperty(s);
      delete prev[s];
    }
    for (s in value) {
      v = value[s];
      if (v !== prev[s]) {
        nodeStyle.setProperty(s, v);
        prev[s] = v;
      }
    }
    return prev;
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== undefined && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
  }
  function toggleClassKey(node, key, value) {
    const classNames = key.trim().split(/\s+/);
    for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node.classList.toggle(classNames[i], value);
  }
  function eventHandler(e) {
    const key = `$$${e.type}`;
    let node = e.composedPath && e.composedPath()[0] || e.target;
    if (e.target !== node) {
      Object.defineProperty(e, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node;
      }
    });
    while (node !== null) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== undefined ? handler(data, e) : handler(e);
        if (e.cancelBubble) return;
      }
      node = node.host && node.host !== node && node.host instanceof Node ? node.host : node.parentNode;
    }
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value,
          multi = marker !== undefined;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (t === "number") value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data = value;
        } else node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function") v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      if (normalizeIncomingArray(array, value, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi) return current;
      } else {
        if (Array.isArray(current)) {
          if (current.length === 0) {
            appendNodes(parent, array, marker);
          } else reconcileArrays(parent, current, array);
        } else if (current == null || current === "") {
          appendNodes(parent, array);
        } else {
          reconcileArrays(parent, multi && current || [parent.firstChild], array);
        }
      }
      current = array;
    } else if (value instanceof Node) {
      if (Array.isArray(current)) {
        if (multi) return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else parent.replaceChild(value, parent.firstChild);
      current = value;
    } else ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i],
          t;
      if (item instanceof Node) {
        normalized.push(item);
      } else if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item) || dynamic;
      } else if ((t = typeof item) === "string") {
        normalized.push(document.createTextNode(item));
      } else if (t === "function") {
        if (unwrap) {
          while (typeof item === "function") item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else normalized.push(document.createTextNode(item.toString()));
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker) {
    for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === undefined) return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && parent.removeChild(el);
        } else inserted = true;
      }
    } else parent.insertBefore(node, marker);
    return [node];
  }

  const $RAW = Symbol("store-raw"),
        $NODE = Symbol("store-node"),
        $NAME = Symbol("store-name");
  function wrap$1(value, name) {
    let p = value[$PROXY];
    if (!p) {
      Object.defineProperty(value, $PROXY, {
        value: p = new Proxy(value, proxyTraps$1)
      });
      const keys = Object.keys(value),
            desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          const get = desc[prop].get.bind(p);
          Object.defineProperty(value, prop, {
            get
          });
        }
      }
    }
    return p;
  }
  function isWrappable(obj) {
    return obj != null && typeof obj === "object" && (!obj.__proto__ || obj.__proto__ === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = new Set()) {
    let result, unwrapped, v, prop;
    if (result = item != null && item[$RAW]) return result;
    if (!isWrappable(item) || set.has(item)) return item;
    if (Array.isArray(item)) {
      if (Object.isFrozen(item)) item = item.slice(0);else set.add(item);
      for (let i = 0, l = item.length; i < l; i++) {
        v = item[i];
        if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
      }
    } else {
      if (Object.isFrozen(item)) item = Object.assign({}, item);else set.add(item);
      const keys = Object.keys(item),
            desc = Object.getOwnPropertyDescriptors(item);
      for (let i = 0, l = keys.length; i < l; i++) {
        prop = keys[i];
        if (desc[prop].get) continue;
        v = item[prop];
        if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
      }
    }
    return item;
  }
  function getDataNodes(target) {
    let nodes = target[$NODE];
    if (!nodes) Object.defineProperty(target, $NODE, {
      value: nodes = {}
    });
    return nodes;
  }
  function proxyDescriptor(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    if (!desc || desc.get || property === $PROXY || property === $NODE || property === $NAME) return desc;
    delete desc.value;
    delete desc.writable;
    desc.get = () => target[$PROXY][property];
    return desc;
  }
  function ownKeys$1(target) {
    if (getListener()) {
      const nodes = getDataNodes(target);
      (nodes._ || (nodes._ = createDataNode()))();
    }
    return Reflect.ownKeys(target);
  }
  function createDataNode() {
    const [s, set] = createSignal(undefined, {
      equals: false,
      internal: true
    });
    s.$ = set;
    return s;
  }
  const proxyTraps$1 = {
    get(target, property, receiver) {
      if (property === $RAW) return target;
      if (property === $PROXY) return receiver;
      const value = target[property];
      if (property === $NODE || property === "__proto__") return value;
      const wrappable = isWrappable(value);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property))) {
        let nodes, node;
        if (wrappable && (nodes = getDataNodes(value))) {
          node = nodes._ || (nodes._ = createDataNode());
          node();
        }
        nodes = getDataNodes(target);
        node = nodes[property] || (nodes[property] = createDataNode());
        node();
      }
      return wrappable ? wrap$1(value) : value;
    },
    set() {
      return true;
    },
    deleteProperty() {
      return true;
    },
    ownKeys: ownKeys$1,
    getOwnPropertyDescriptor: proxyDescriptor
  };
  function setProperty(state, property, value) {
    if (state[property] === value) return;
    const array = Array.isArray(state);
    const len = state.length;
    const isUndefined = value === undefined;
    const notify = array || isUndefined === property in state;
    if (isUndefined) {
      delete state[property];
    } else state[property] = value;
    let nodes = getDataNodes(state),
        node;
    (node = nodes[property]) && node.$();
    if (array && state.length !== len) (node = nodes.length) && node.$();
    notify && (node = nodes._) && node.$();
  }
  function mergeStoreNode(state, value) {
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      setProperty(state, key, value[key]);
    }
  }
  function updatePath(current, path, traversed = []) {
    let part,
        prev = current;
    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part,
            isArray = Array.isArray(current);
      if (Array.isArray(part)) {
        for (let i = 0; i < part.length; i++) {
          updatePath(current, [part[i]].concat(path), [part[i]].concat(traversed));
        }
        return;
      } else if (isArray && partType === "function") {
        for (let i = 0; i < current.length; i++) {
          if (part(current[i], i)) updatePath(current, [i].concat(path), [i].concat(traversed));
        }
        return;
      } else if (isArray && partType === "object") {
        const {
          from = 0,
          to = current.length - 1,
          by = 1
        } = part;
        for (let i = from; i <= to; i += by) {
          updatePath(current, [i].concat(path), [i].concat(traversed));
        }
        return;
      } else if (path.length > 1) {
        updatePath(current[part], path, [part].concat(traversed));
        return;
      }
      prev = current[part];
      traversed = [part].concat(traversed);
    }
    let value = path[0];
    if (typeof value === "function") {
      value = value(prev, traversed);
      if (value === prev) return;
    }
    if (part === undefined && value == undefined) return;
    value = unwrap(value);
    if (part === undefined || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
      mergeStoreNode(prev, value);
    } else setProperty(current, part, value);
  }
  function createStore(store, options) {
    const unwrappedStore = unwrap(store || {});
    const wrappedStore = wrap$1(unwrappedStore);
    function setStore(...args) {
      batch(() => updatePath(unwrappedStore, args));
    }
    return [wrappedStore, setStore];
  }

  function applyState(target, parent, property, merge, key) {
    const previous = parent[property];
    if (target === previous) return;
    if (!isWrappable(target) || !isWrappable(previous) || key && target[key] !== previous[key]) {
      target !== previous && setProperty(parent, property, target);
      return;
    }
    if (Array.isArray(target)) {
      if (target.length && previous.length && (!merge || key && target[0][key] != null)) {
        let i, j, start, end, newEnd, item, newIndicesNext, keyVal;
        for (start = 0, end = Math.min(previous.length, target.length); start < end && (previous[start] === target[start] || key && previous[start][key] === target[start][key]); start++) {
          applyState(target[start], previous, start, merge, key);
        }
        const temp = new Array(target.length),
              newIndices = new Map();
        for (end = previous.length - 1, newEnd = target.length - 1; end >= start && newEnd >= start && (previous[end] === target[newEnd] || key && previous[end][key] === target[newEnd][key]); end--, newEnd--) {
          temp[newEnd] = previous[end];
        }
        if (start > newEnd || start > end) {
          for (j = start; j <= newEnd; j++) setProperty(previous, j, target[j]);
          for (; j < target.length; j++) {
            setProperty(previous, j, temp[j]);
            applyState(target[j], previous, j, merge, key);
          }
          if (previous.length > target.length) setProperty(previous, "length", target.length);
          return;
        }
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = target[j];
          keyVal = key ? item[key] : item;
          i = newIndices.get(keyVal);
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(keyVal, j);
        }
        for (i = start; i <= end; i++) {
          item = previous[i];
          keyVal = key ? item[key] : item;
          j = newIndices.get(keyVal);
          if (j !== undefined && j !== -1) {
            temp[j] = previous[i];
            j = newIndicesNext[j];
            newIndices.set(keyVal, j);
          }
        }
        for (j = start; j < target.length; j++) {
          if (j in temp) {
            setProperty(previous, j, temp[j]);
            applyState(target[j], previous, j, merge, key);
          } else setProperty(previous, j, target[j]);
        }
      } else {
        for (let i = 0, len = target.length; i < len; i++) {
          applyState(target[i], previous, i, merge, key);
        }
      }
      if (previous.length > target.length) setProperty(previous, "length", target.length);
      return;
    }
    const targetKeys = Object.keys(target);
    for (let i = 0, len = targetKeys.length; i < len; i++) {
      applyState(target[targetKeys[i]], previous, targetKeys[i], merge, key);
    }
    const previousKeys = Object.keys(previous);
    for (let i = 0, len = previousKeys.length; i < len; i++) {
      if (target[previousKeys[i]] === undefined) setProperty(previous, previousKeys[i], undefined);
    }
  }
  function reconcile(value, options = {}) {
    const {
      merge,
      key = "id"
    } = options,
          v = unwrap(value);
    return s => {
      const state = s;
      if (!isWrappable(state) || !isWrappable(v)) return v;
      applyState(v, {
        state
      }, "state", merge, key);
      return state;
    };
  }

  var wasm;
  var heap = new Array(32).fill(undefined);
  heap.push(undefined, null, true, false);

  function getObject(idx) {
    return heap[idx];
  }

  var heap_next = heap.length;

  function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }

  function takeObject(idx) {
    var ret = getObject(idx);
    dropObject(idx);
    return ret;
  }

  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    var idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }

  var cachedTextDecoder = new TextDecoder('utf-8', {
    ignoreBOM: true,
    fatal: true
  });
  cachedTextDecoder.decode();
  var cachegetUint8Memory0 = null;

  function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
      cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }

    return cachegetUint8Memory0;
  }

  function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }

  function debugString(val) {
    // primitive types
    var type = _typeof(val);

    if (type == 'number' || type == 'boolean' || val == null) {
      return "".concat(val);
    }

    if (type == 'string') {
      return "\"".concat(val, "\"");
    }

    if (type == 'symbol') {
      var description = val.description;

      if (description == null) {
        return 'Symbol';
      } else {
        return "Symbol(".concat(description, ")");
      }
    }

    if (type == 'function') {
      var name = val.name;

      if (typeof name == 'string' && name.length > 0) {
        return "Function(".concat(name, ")");
      } else {
        return 'Function';
      }
    } // objects


    if (Array.isArray(val)) {
      var length = val.length;
      var debug = '[';

      if (length > 0) {
        debug += debugString(val[0]);
      }

      for (var i = 1; i < length; i++) {
        debug += ', ' + debugString(val[i]);
      }

      debug += ']';
      return debug;
    } // Test for built-in


    var builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    var className;

    if (builtInMatches.length > 1) {
      className = builtInMatches[1];
    } else {
      // Failed to match the standard '[object ClassName]'
      return toString.call(val);
    }

    if (className == 'Object') {
      // we're a user defined class or Object
      // JSON.stringify avoids problems with cycles, and is generally much
      // easier than looping through ownProperties of `val`.
      try {
        return 'Object(' + JSON.stringify(val) + ')';
      } catch (_) {
        return 'Object';
      }
    } // errors


    if (val instanceof Error) {
      return "".concat(val.name, ": ").concat(val.message, "\n").concat(val.stack);
    } // TODO we could test for more things here, like `Set`s and `Map`s.


    return className;
  }

  var WASM_VECTOR_LEN = 0;
  var cachedTextEncoder = new TextEncoder('utf-8');
  var encodeString = typeof cachedTextEncoder.encodeInto === 'function' ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
  } : function (arg, view) {
    var buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };

  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
      var buf = cachedTextEncoder.encode(arg);

      var _ptr = malloc(buf.length);

      getUint8Memory0().subarray(_ptr, _ptr + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return _ptr;
    }

    var len = arg.length;
    var ptr = malloc(len);
    var mem = getUint8Memory0();
    var offset = 0;

    for (; offset < len; offset++) {
      var code = arg.charCodeAt(offset);
      if (code > 0x7F) break;
      mem[ptr + offset] = code;
    }

    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }

      ptr = realloc(ptr, len, len = offset + arg.length * 3);
      var view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      var ret = encodeString(arg, view);
      offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
  }

  var cachegetInt32Memory0 = null;

  function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
      cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }

    return cachegetInt32Memory0;
  }
  /**
  * @param {number} w
  * @param {number} h
  * @returns {VtWrapper}
  */


  function create$1(w, h) {
    var ret = wasm.create(w, h);
    return VtWrapper.__wrap(ret);
  }
  var cachegetUint32Memory0 = null;

  function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
      cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }

    return cachegetUint32Memory0;
  }

  function getArrayU32FromWasm0(ptr, len) {
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
  }
  /**
  */


  var VtWrapper = /*#__PURE__*/function () {
    function VtWrapper() {
      _classCallCheck(this, VtWrapper);
    }

    _createClass(VtWrapper, [{
      key: "__destroy_into_raw",
      value: function __destroy_into_raw() {
        var ptr = this.ptr;
        this.ptr = 0;
        return ptr;
      }
    }, {
      key: "free",
      value: function free() {
        var ptr = this.__destroy_into_raw();

        wasm.__wbg_vtwrapper_free(ptr);
      }
      /**
      * @param {string} s
      * @returns {Uint32Array}
      */

    }, {
      key: "feed",
      value: function feed(s) {
        try {
          var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);

          var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          wasm.vtwrapper_feed(retptr, this.ptr, ptr0, len0);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v1 = getArrayU32FromWasm0(r0, r1).slice();

          wasm.__wbindgen_free(r0, r1 * 4);

          return v1;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * @returns {string}
      */

    }, {
      key: "inspect",
      value: function inspect() {
        try {
          var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);

          wasm.vtwrapper_inspect(retptr, this.ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          return getStringFromWasm0(r0, r1);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);

          wasm.__wbindgen_free(r0, r1);
        }
      }
      /**
      * @param {number} l
      * @returns {any}
      */

    }, {
      key: "get_line",
      value: function get_line(l) {
        var ret = wasm.vtwrapper_get_line(this.ptr, l);
        return takeObject(ret);
      }
      /**
      * @returns {any}
      */

    }, {
      key: "get_cursor",
      value: function get_cursor() {
        var ret = wasm.vtwrapper_get_cursor(this.ptr);
        return takeObject(ret);
      }
    }], [{
      key: "__wrap",
      value: function __wrap(ptr) {
        var obj = Object.create(VtWrapper.prototype);
        obj.ptr = ptr;
        return obj;
      }
    }]);

    return VtWrapper;
  }();

  function load(_x, _x2) {
    return _load.apply(this, arguments);
  }

  function _load() {
    _load = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(module, imports) {
      var bytes, instance;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(typeof Response === 'function' && module instanceof Response)) {
                _context.next = 23;
                break;
              }

              if (!(typeof WebAssembly.instantiateStreaming === 'function')) {
                _context.next = 15;
                break;
              }

              _context.prev = 2;
              _context.next = 5;
              return WebAssembly.instantiateStreaming(module, imports);

            case 5:
              return _context.abrupt("return", _context.sent);

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);

              if (!(module.headers.get('Content-Type') != 'application/wasm')) {
                _context.next = 14;
                break;
              }

              console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", _context.t0);
              _context.next = 15;
              break;

            case 14:
              throw _context.t0;

            case 15:
              _context.next = 17;
              return module.arrayBuffer();

            case 17:
              bytes = _context.sent;
              _context.next = 20;
              return WebAssembly.instantiate(bytes, imports);

            case 20:
              return _context.abrupt("return", _context.sent);

            case 23:
              _context.next = 25;
              return WebAssembly.instantiate(module, imports);

            case 25:
              instance = _context.sent;

              if (!(instance instanceof WebAssembly.Instance)) {
                _context.next = 30;
                break;
              }

              return _context.abrupt("return", {
                instance: instance,
                module: module
              });

            case 30:
              return _context.abrupt("return", instance);

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }));
    return _load.apply(this, arguments);
  }

  function init(_x3) {
    return _init.apply(this, arguments);
  }

  function _init() {
    _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(input) {
      var imports, _yield$load, instance, module;

      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (typeof input === 'undefined') {
                input = new URL('index_bg.wasm', '');
              }

              imports = {};
              imports.wbg = {};

              imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
                takeObject(arg0);
              };

              imports.wbg.__wbindgen_number_new = function (arg0) {
                var ret = arg0;
                return addHeapObject(ret);
              };

              imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
                var ret = getStringFromWasm0(arg0, arg1);
                return addHeapObject(ret);
              };

              imports.wbg.__wbg_set_f1a4ac8f3a605b11 = function (arg0, arg1, arg2) {
                getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
              };

              imports.wbg.__wbg_new_949bbc1147195c4e = function () {
                var ret = new Array();
                return addHeapObject(ret);
              };

              imports.wbg.__wbg_new_ac32179a660db4bb = function () {
                var ret = new Map();
                return addHeapObject(ret);
              };

              imports.wbg.__wbg_new_0b83d3df67ecb33e = function () {
                var ret = new Object();
                return addHeapObject(ret);
              };

              imports.wbg.__wbindgen_is_string = function (arg0) {
                var ret = typeof getObject(arg0) === 'string';
                return ret;
              };

              imports.wbg.__wbg_push_284486ca27c6aa8b = function (arg0, arg1) {
                var ret = getObject(arg0).push(getObject(arg1));
                return ret;
              };

              imports.wbg.__wbg_new_342a24ca698edd87 = function (arg0, arg1) {
                var ret = new Error(getStringFromWasm0(arg0, arg1));
                return addHeapObject(ret);
              };

              imports.wbg.__wbg_set_a46091b120cc63e9 = function (arg0, arg1, arg2) {
                var ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
                return addHeapObject(ret);
              };

              imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
                var ret = debugString(getObject(arg1));
                var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                var len0 = WASM_VECTOR_LEN;
                getInt32Memory0()[arg0 / 4 + 1] = len0;
                getInt32Memory0()[arg0 / 4 + 0] = ptr0;
              };

              imports.wbg.__wbindgen_throw = function (arg0, arg1) {
                throw new Error(getStringFromWasm0(arg0, arg1));
              };

              if (typeof input === 'string' || typeof Request === 'function' && input instanceof Request || typeof URL === 'function' && input instanceof URL) {
                input = fetch(input);
              }

              _context2.t0 = load;
              _context2.next = 20;
              return input;

            case 20:
              _context2.t1 = _context2.sent;
              _context2.t2 = imports;
              _context2.next = 24;
              return (0, _context2.t0)(_context2.t1, _context2.t2);

            case 24:
              _yield$load = _context2.sent;
              instance = _yield$load.instance;
              module = _yield$load.module;
              wasm = instance.exports;
              init.__wbindgen_wasm_module = module;
              return _context2.abrupt("return", wasm);

            case 30:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _init.apply(this, arguments);
  }

  var exports$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$1,
    VtWrapper: VtWrapper,
    'default': init
  });

  const base64codes = [62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

              function getBase64Code(charCode) {
                  return base64codes[charCode - 43];
              }

              function base64_decode(str) {
                  let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
                  let n = str.length;
                  let result = new Uint8Array(3 * (n / 4));
                  let buffer;

                  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
                      buffer =
                          getBase64Code(str.charCodeAt(i)) << 18 |
                          getBase64Code(str.charCodeAt(i + 1)) << 12 |
                          getBase64Code(str.charCodeAt(i + 2)) << 6 |
                          getBase64Code(str.charCodeAt(i + 3));
                      result[j] = buffer >> 16;
                      result[j + 1] = (buffer >> 8) & 0xFF;
                      result[j + 2] = buffer & 0xFF;
                  }

                  return result.subarray(0, result.length - missingOctets);
              }
          

                      const wasm_code = base64_decode("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IAAoAjxBAWogACgCHBA8IAAgACgCPCAAKAIcEJ0BDA0LIABBACAAKAIYIgIgACgCOEEBaiIBIAEgAksbEFEgAEEAIAAoAjwQPCAAQQAgACgCPEEBahCdAQwMCyAAQQAgACgCHBA8IABBACAAKAIcEJ0BDAsLIAAgACgCAEHQjcAAIAAoAggbLwEAIgBBASAAGxAzDAoLIAAoAgBB0I3AACAAKAIIGy8BACEBIABBADoApgEgACABQQEgARtBf2oiASAAKAIYIgBBf2ogACABSxs2AjgMCQsgACgCAEHQjcAAIAAoAggbLwEAIQIgAEEAOgCmASAAQQA2AjggACAAKAI8IgEgAkEBIAIbayICQQAgAkEAShsgAiAAKAJMIgAgAiAAShsgASAASRs2AjwMCAsgACAAKAIAQdCNwAAgACgCCBsvAQAiAUEBIAEbEIIBIABBADoApgEgAEEANgI4DAcLIAAoAjggACgCAEHQjcAAIAAoAggbLwEAIgFBASABG2siAkEATgRAIAIgACgCGCIBSQRAIABBADoApgEgACACNgI4DAgLIABBADoApgEgACABQX9qNgI4DAcLIABBADoApgEgAEEANgI4DAYLIAAoAjggACgCAEHQjcAAIAAoAggbLwEAIgFBASABG2oiAkEATgRAIAIgACgCGCIBSQRAIABBADoApgEgACACNgI4DAcLIABBADoApgEgACABQX9qNgI4DAYLIABBADoApgEgAEEANgI4DAULIAAgACgCAEHQjcAAIAAoAggbLwEAIgBBASAAGxCCAQwECyAAKAIAQdCNwAAgACgCCBsvAQAhAyAAQQA6AKYBIAAgACgCGEF/aiICIAAoAjgiASABIAJLGzYCOCAAIAAoAjwiASADQQEgAxtrIgJBACACQQBKGyACIAAoAkwiACACIABKGyABIABJGzYCPAwDCyAAKAIAQdCNwAAgACgCCBsvAQAhBiAAKAI4IQcgACgCGCECIAUgAEGZAWopAAA3ASYgBSAAKQCTATcDIAJAAkACQCAAQShqKAIAIgEgACgCPCIDSwRAIAAoAiAgA0EMbGoiASgCCCIDIAdJDQEgASgCACAHQRRsaiIBIAMgB2siBCACIAdrIgMgBkEBIAYbIgIgAyACSRsiAhDKASAEIAJJDQIgAgRAIAJBFGwgAWohAgNAIAFBIDYC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ucAANgIAQdi5wABBzLnAADYCAEHMucAAQcS5wAA2AgBB4LnAAEHUucAANgIAQdS5wABBzLnAADYCAEHoucAAQdy5wAA2AgBB3LnAAEHUucAANgIAQfC5wABB5LnAADYCAEHkucAAQdy5wAA2AgBB+LnAAEHsucAANgIAQey5wABB5LnAADYCAEGAusAAQfS5wAA2AgBB9LnAAEHsucAANgIAQYi6wABB/LnAADYCAEH8ucAAQfS5wAA2AgBBkLrAAEGEusAANgIAQYS6wABB/LnAADYCAEGMusAAQYS6wAA2AgBBmLrAAEGMusAANgIAQZS6wABBjLrAADYCAEGgusAAQZS6wAA2AgBBnLrAAEGUusAANgIAQai6wABBnLrAADYCAEGkusAAQZy6wAA2AgBBsLrAAEGkusAANgIAQay6wABBpLrAADYCAEG4usAAQay6wAA2AgBBtLrAAEGsusAANgIAQcC6wABBtLrAADYCAEG8usAAQbS6wAA2AgBByLrAAEG8usAANgIAQcS6wABBvLrAADYCAEHQusAAQcS6wAA2AgBB2LrAAEHMusAANgIAQcy6wABBxLrAADYCAEHgusAAQdS6wAA2AgBB1LrAAEHMusAANgIAQei6wABB3LrAADYCAEHcusAAQdS6wAA2AgBB8LrAAEHkusAANgIAQeS6wABB3LrAADYCAEH4usAAQey6wAA2AgBB7LrAAEHkusAANgIAQYC7wABB9LrAADYCAEH0usAAQey6wAA2AgBBiLvAAEH8usAANgIAQfy6wABB9LrAADYCAEGQu8AAQYS7wAA2AgBBhLvAAEH8usAANgIAQZi7wABBjLvAADYCAEGMu8AAQYS7wAA2AgBBoLvAAEGUu8AANgIAQZS7wABBjLvAADYCAEGou8AAQZy7wAA2AgBBnLvAAEGUu8AANgIAQbC7wABBpLvAADYCAEGku8AAQZy7wAA2AgBBuLvAAEGsu8AANgIAQay7wABBpLvAADYCAEHAu8AAQbS7wAA2AgBBtLvAAEGsu8AANgIAQci7wABBvLvAADYCAEG8u8AAQbS7wAA2AgBBxLvAAEG8u8AANgIAIAhBCGoiAEEHakF4cSAAayIBIAhqIQBB0LzAACAKQVhqIAFrIgE2AgBB2LzAACAANgIAIAAgAUEBcjYCBCAAIAFqQSg2AgRB9LzA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ACACLQAORw0BIARBG2otAAAgAi0AD0cNAQsgBEEcai0AACIFQQJHIAItABAiBkECR3MNAAJAIAVBAkYNACAGQQJGDQAgBSAGRw0BIAVBAUcEQCAEQR1qLQAAIAItABFGDQEMAgsgBEEdai0AACACLQARRw0BIARBHmotAAAgAi0AEkcNASAEQR9qLQAAIAItABNHDQELIARBIGotAABFIAItABRBAEdGDQAgBEEhai0AAEUgAi0AFUEAR0YNACAEQSJqLQAARSACLQAWQQBHRg0AIARBI2otAABFIAItABdBAEdGDQAgBEEkai0AAEUgAi0AGEEAR0YNACAEQSVqLQAARSACLQAZQQBHcw0BCyACQTBqIgNBGGoiBSACQRhqKAIANgIAIANBEGoiBiACQRBqKQMANwMAIANBCGoiDSACQQhqKQMANwMAIAIgAikDADcDMCACKAIkIAFGBEAgAkEgaiABEKoBIAIoAiAhByACKAIoIQELIAFBHGwgB2oiAyACKQMwNwIAIANBGGogBSgCADYCACADQRBqIAYpAwA3AgAgA0EIaiANKQMANwIAIAIgAUEBaiIBNgIoQQRBBBD4ASIDRQ0IIAMgBEEUaigCADYCACAJIAspAgA3AgAgCUEGaiALQQZqKQEANwEAIAIgAzYCACACQQE2AgRBAQwBCyAEQRRqKAIAIQQgAigCBCADRgRAIAIgAxCrASACKAIIIQMLIAIoAgAgA0ECdGogBDYCACACKAIIQQFqCyIDNgIIIAwgCkEUaiIKRw0ACwwBCwwECyACKAIkIQQgAkEwaiIDQRhqIAJBGGooAgA2AgAgA0EQaiACQRBqKQMANwMAIANBCGogAkEIaikDADcDACACIAIpAwA3AzAgASAERw0BCyACQSBqIAEQqgEgAigCICEHIAIoAighAQsgAUEcbCAHaiIEIAMpAgA3AgAgBEEYaiADQRhqKAIANgIAIARBEGogA0EQaikCADcCACAEQQhqIANBCGopAgA3AgAgAkEoaiABQQFqIgE2AgAgAEEIaiABNgIAIAAgAikDIDcCAAsgAkHQAGokAA8LQQRBBEGoucAAKAIAIgBB1AAgABsRAQAAC6oJAgt/BH4jAEGQAWsiBiQAAkAgAEUNACACRQ0AA0ACQAJAAkAgACACakEYTwRAIAIgACAAIAJLG0ELSQ0DIAAgAkkNASACQXRsIQogAkEMbCEHA0AgASAKaiEFQQAhAyAHQSBPBEBBACEEA0AgBCAFaiIDKQAAIQ4gAykACCEPIAMpABAhECADQRhqIggpAAAhESAIIAEgBGoiCEEYaiIJKQAANwAAIANBEGogCEEQaiILKQAANwAAIANBCGogCEEIaiIMKQAANwAAIAMgCCkAADcAACAJIBE3AAAgCyAQNwAAIAwgDzcAACAIIA43AAAgBEFAayAEQSBqIgMhBCAHTQ0ACwsgByADSwRAIAZBEGoiCCADIAVqIgkgByADayIEEMcBGiAJIAEgA2oiASAEEMcBGiABIAggBBDHARoLIAUhASAAIAJrIgAgAk8NAAsMAgsgBkEIaiIHQQAgAGsiCEEMbCABaiIDQQhqKAIANgIAIAYgAykCADcDACACQQxsIQogAiIBIQQDQCAEQQxsIANqIQUDQCAGQRhqIgkgBUEIaiILKAIANgIAIAYgBSkCADcDECAHKAIAIQwgBSAGKQMANwIAIAsgDDYCACAHIAkoAgA2AgAgBiAGKQMQNwMAIAQgAE9FBEAgBSAKaiEFIAIgBGohBAwBCwsgBCAIaiIEBEAgBCABIAQgAUkbIQEMAQUgBikDACEOIANBCGogBkEIaiIHKAIANgIAIAMgDjcCACABQQJJDQZBASEEA0AgBEEMbCADaiIIKQIAIQ4gByAIQQhqIgkoAgA2AgAgBiAONwMAIAIgBGohBQNAIAZBGGoiCyAFQQxsIANqIgpBCGoiDCgCADYCACAGIAopAgA3AxAgBygCACENIAogBikDADcCACAMIA02AgAgByALKAIANgIAIAYgBikDEDcDACAFIABJBEAgAiAFaiEFDAELIAUgAGsiBSAERw0ACyAGKQMAIQ4gCSAHKAIANgIAIAggDjcCACABIARBAWoiBEcNAAsMBgsACwALIABBdGwhCCAAQQxsIQdBACAAayEKA0BBACEDIAdBIE8EQCABIAhqIQlBACEEA0AgBCAJaiIFKQAAIQ4gBSkACCEPIAUpABAhECAFQRhqIgMpAAAhESADIAEgBGoiA0EYaiILKQAANwAAIAVBEGogA0EQaiIMKQAANwAAIAVBCGogA0EIaiINKQAANwAAIAUgAykAADcAACALIBE3AAAgDCAQNwAAIA0gDzcAACADIA43AAAgBEFA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AQALIANBogJBjKfAABCJAQALQbyewABBK0Gcp8AAELoBAAsgAiADQYynwAAQigEACyADQa8BQYynwAAQiQEAC0G8nsAAQStBnKfAABC6AQAL8QUBCX8jAEGAAWsiAyQAIAEtAAAiBEECRiEFIANB6ABqIAIgAS0ADSIGIAEtAAwiByABLQALIgggAS0ACiIJIAEtAAkiCiABLQAIIgsgBEECR0EBQQIgBRsgAS0ABCIEQQJGG2pqampqahCvASADKAJsIQICfwJAAkACQAJAAkAgAygCaEEBRwRAIANB3ABqIANB+ABqKQMANwIAIAMgA0HwAGopAwA3AlQgAyACNgJQIAVFBEAgAyABKAAANgJoIANByABqIANB0ABqQdOBwAAgA0HoAGoQmwEgAygCSA0CCyAEQQJHBEAgAyABKAAENgJoIANBQGsgA0HQAGpB1YHAACADQegAahCbASADKAJADQMLIAtFDQMgA0E4aiADQdAAakHXgcAAQQQQnAEgAygCOEUNAyADKAI8IQIMBAsMBAsgAygCTCECDAILIAMoAkQhAgwBCwJAIApFDQAgA0EwaiADQdAAakHcgcAAQQYQnAEgAygCMEUNACADKAI0IQIMAQsCQCAJRQ0AIANBKGogA0HQAGpB4oHAAEEJEJwBIAMoAihFDQAgAygCLCECDAELAkAgCEUNACADQSBqIANB0ABqQeuBwABBDRCcASADKAIgRQ0AIAMoAiQhAgwBCwJAIAdFDQAgA0EYaiADQdAAakH4gcAAQQUQnAEgAygCGEUNACADKAIcIQIMAQsCQCAGRQ0AIANBEGogA0HQAGpB/YHAAEEHEJwBIAMoAhBFDQAgAygCFCECDAELIANB6ABqIgFBEGogA0HQAGoiAkEQaigCADYCACABQQhqIAJBCGopAwA3AwAgAyADKQNQNwNoIANBCGogARDAASADKAIMIQIgAygCCAwCCwJAIAMoAlRFBEAgAygCWCIBQSRJDQEgARAADAELIAMoAlgiAUEkSQ0AIAEQAAsgAygCXEUNACADQeAAaigCACIBQSRJDQAgARAAC0EBCyEBIAAgAjYCBCAAIAE2AgAgA0GAAWokAAv2BQEBfyMAQRBrIgIkACACIAGtQoCAgIAQQgAgASgCGEHEkcAAQQIgAUEcaigCACgCDBECABuENwMAIAIgAEGQ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aiIEQSJBI0HbgcAALQAAGzYCBCAEQQA2AgAgAigCFCEEAkACQCACKAIQRQRAIAIgBDYCHCABKAIEQQFHBEAgAUEIaiACQRhqIAJBHGoQ9gEiAUEkTwRAIAEQAAsgAigCHCIBQSRPBEAgARAACyACKAIYIgFBJEkNAyABEAAMAwsgAkEIaiADEKYBIAIoAgwhAyACKAIIRQ0BEGUhBSADQSRPBEAgAxAACyAEQSRJDQQgBBAADAQLIAQhBSADQSRJDQMgAxAADAMLIAFBCGogAyAEEP0BC0EADAILQYCAwABBK0GQgcAAELoBAAtBAQshASAAIAU2AgQgACABNgIAIAJBIGokAAutAgIDfwF+IwBBIGsiAyQAIAEpAgwhBiABQQA2AgwCfwJAIAanBEAgAyAGQiCIpyIENgIYIANBEGogAiABKAIAEDogAygCFCECAkACQCADKAIQRQRAIAMgAjYCHCABKAIEQQFHBEAgAUEIaiADQRhqIANBHGoQ9gEiAUEkTwRAIAEQAAsgAygCHCIBQSRPBEAgARAACyADKAIYIgFBJEkNAyABEAAMAwsgA0EIaiAEEKYBIAMoAgwhBCADKAIIRQ0BEGUhBSAEQSRPBEAgBBAACyACQSRJDQQgAhAADAQLIAIhBSAEQSRJDQMgBBAADAMLIAFBCGogBCACEP0BC0EADAILQYCAwABBK0GQgcAAELoBAAtBAQshASAAIAU2AgQgACABNgIAIANBIGokAAu3AgEDfyMAQYABayIDJAACQAJAAkACQCABKAIAIgJBEHFFBEAgAkEgcQ0BIAA1AgAgARArIQAMBAsgACgCACECQQAhAANAIAAgA2pB/wBqIAJBD3EiBEEwciAEQdcAaiAEQQpJGzoAACAAQX9qIQAgAkEEdiICDQALIABBgAFqIgJBgQFPDQEgAUHsoMAAQQIgACADakGAAWpBACAAaxAXIQAMAwsgACgCACECQQAhAANAIAAgA2pB/wBqIAJBD3EiBEEwciAEQTdqIARBCkkbOgAAIABBf2ohACACQQR2IgINAAsgAEGAAWoiAkGBAU8NASABQeygwABBAiAAIANqQYABakEAIABrEBchAAwCCyACQYABQdygwAAQiwEACyACQYABQdygwAAQiwEACyADQYABaiQAIAALtgIBBX8gACgCGCEEAkACQCAAKAIMIABGBEBBFEEQIABBFGoiASgCACIDGyAAaigCACICDQFBACEBDAILIAAoAggiAiAAKAIMIgE2AgwgASACNgIIDAELIAEgAEEQaiADGyEDA0AgAyEFIAIiAUEUaiIDKAIAIgJFBEAgAUEQaiEDIAEoAhAhAgsgAg0ACyAFQQA2AgALAkAgBEUNAAJAIAAoAhxBAnRBzLvAAGoiAigCACAARwRAQRBBFCAEKAIQIABGGyAEaiABNgIAIAENAQwCCyACIAE2AgAgAQ0AQcC5wABBwLnAACgCAEF+IAAoAhx3cTYCAA8LIAEgBDYCGCAAKAIQIgIEQCABIAI2AhAgAiABNgIYCyAAQRRqKAIAIgBFDQAgAUEUaiAANgIAIAAgATYCGAsLmQIBC38jAEEQayIIIAAoAhgiCUF/aiIKNgIMIABByABqKAIAIQQgACgCQCEFAkACfyAFIAFBf2oiB0UNABogACgCOCELIARBAnQgBWohDEEBIQIgBSEBA0AgBkEBaiEGA0AgASIDIAxGBEBBACECDAQLIAJBAXEEQCADQQRqIQEgCyADKAIATw0BCwsgA0EEaiEBQQAhAiAGIAdHDQALIANBBGoLIQMgBEECdCAFaiEFIAAoAjghBiADIQEDQEEAIAMgASAFRiIEGyECIAQNASAHDQEgASgCACECIAFBBGoiBCEBIAYgAk8NAAsgBEF8aiECCyACIAhBDGogAhsoAgAhASAAQQA6AKYBIAAgASAKIAkgAUsbNgI4C6kCAQJ/IwBBEGsiAiQAIAAoAgAhAAJAAn8CQAJAIAFBgAFPBEAgAkEANgIMIAFBgBBJDQEgAUGAgARPDQIgAiABQT9xQYABcjoADiACIAFBDHZB4AFyOgAMIAIgAUEGdkE/cUGAAXI6AA1BAwwDCyAAKAIIIgMgACgCBEYEfyAAIANBARCpASAAKAIIBSADCyAAKAIAaiABOgAAIAAgACgCCEEBajYCCAwDCyACIAFBP3FBgAFyOgANIAIgAUEGdkHAAXI6AAxBAgwBCyACIAFBP3FBgAFyOgAPIAIgAUESdkHwAXI6AAwgAiABQQZ2QT9xQYABcjoADiACIAFBDHZBP3FBgAFyOgANQQQLIQEgACACQQxqIgAgACABahC3AQsgAkEQaiQAQQALxgICA38CfiMAQUBqIgMkACAAAn8gAC0ACARAIAAoAgQhBUEBDAELIAAoAgQhBSAAKAIAIgQtAABBBHFFBEBBASAEKAIYQbGgwABBu6DAACAFG0ECQQEgBRsgBEEcaigCACgCDBECAA0BGiABIAQgAigCDBEAAAwBCwJAIAUNACAEKAIYQbmgwABBAiAEQRxqKAIAKAIMEQIARQ0AQQAhBUEBDAELIANBAToAFyADQTRqQfCfwAA2AgAgAyAEKQIYNwMIIAMgA0EXajYCECAEKQIIIQYgBCkCECEHIAMgBC0AIDoAOCADIAc3AyggAyAGNwMgIAMgBCkCADcDGCADIANBCGo2AjBBASABIANBGGogAigCDBEAAA0AGiADKAIwQa+gwABBAiADKAI0KAIMEQIACzoACCAAIAVBAWo2AgQgA0FAayQAC7ECAQJ/IwBBQGoiAyQAIANBMGogAhDmAQJAAkACQAJ/AkAgAygCMEEBRwRAIAMgAykCNDcDKCADQSBqIgIgASgCCDYCBCACIAEoAgA2AgAgA0IANwI0IANB4IXAACgCADYCMCADQTBqIgIgAygCICIEIAMoAiRBAnQgBGoQvAEgA0EYaiADQShqIAIQZiADKAIYRQ0BIAMoAhwMAgsgAygCNCEBDAMLIANBEGogA0EoaiABQQxqEH4gAygCEEUNASADKAIUCyEBIANBMGoQ6QEgAygCLCICQSRJDQEgAhAADAELIAMoAigaIANBCGoiASADKAIsNgIEIAFBADYCACADKAIMIQEgAygCCCECIANBMGoQ6QEMAQtBASECCyAAIAE2AgQgACACNgIAIANBQGskAAu9AgIGfwF+IwBBMGsiAiQAIAFBBGohBAJAIAEoAgQEQEHAmcAAKAIAIQUMAQsgASgCACEDIAJCADcCDCACQcCZwAAoAgAiBTYCCCACIAJBCGoiBzYCFCACQRhqIgZBEGogA0EQaikCADcDACAGQQhqIANBCGopAgA3AwAgAiADKQIANwMYIAJBFGpB/JjAACAGEBsaIARBCGogB0EIaigCADYCACAEIAIpAwg3AgALIAJBIGoiAyAEQQhqKAIANgIAIAFBDGpBADYCACAEKQIAIQggAUEIakEANgIAIAEgBTYCBCACIAg3AxhBDEEEEPgBIgFFBEBBDEEEQai5wAAoAgAiAEHUACAAGxEBAAALIAEgAikDGDcCACABQQhqIAMoAgA2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QTAQkwIAC4MBAQN/IAEoAgQiAyACTwRAAkAgA0UNACABKAIAIQQCQAJAIAJFBEBBASEDIAQQFAwBCyAEIANBASACEOwBIgNFDQELIAEgAjYCBCABIAM2AgAMAQsgACACNgIEIABBCGpBATYCAEEBIQULIAAgBTYCAA8LQciYwABBJEHsmMAAELoBAAt9AQF/IwBBEGsiBCQAIARBCGogASgCACACIAMQ7QEgBCgCDCECAn8gBCgCCEUEQAJAIAEoAgxFDQAgAUEQaigCACIDQSRJDQAgAxAACyABQQE2AgwgAUEQaiACNgIAQQAMAQtBAQshASAAIAI2AgQgACABNgIAIARBEGokAAtTAQN/IwBBIGsiAiQAIAIgARCWASACQRBqIgNBCGoiBEEANgIAIAIgAikDADcDECADIAEQdCAAQQhqIAQoAgA2AgAgACACKQMQNwIAIAJBIGokAAt3AQV/IAEoAgAhAyABKAIEIQQDQCADIARHBEAgASADQQFqIgI2AgAgAy0AACABIAEoAggiBkEBajYCCCACIQNFDQEgACgCCCICIAAoAgRGBEAgACACEKsBCyAAIAJBAWo2AgggACgCACACQQJ0aiAGNgIADAELCwt9AQN/AkAgACgCUEEBaiICIAAoAkwiA08EQCAAQShqKAIAIgQgAkkNASACIANrIgQgASAEIAFJGyEBIAAoAiAgA0EMbGogBCABENMBIAAgAiABayACEDwgACADIAIQnQEPCyADIAJB1I3AABCKAQALIAIgBEHUjcAAEIkBAAt+AQF/AkAgAEEoaigCACIEIAJLBEAgACgCICACQQxsaiIAKAIIIgIgAU0NASAAKAIAIAFBFGxqIgAgAykCADcCACAAQRBqIANBEGooAgA2AgAgAEEIaiADQQhqKQIANwIADwsgAiAEQaCNwAAQiAEACyABIAJBoI3AABCIAQALdwEDfyAAKAIEIAAoAggiAmsgAUkEQCAAIAIgARCpASAAKAIIIQILIAAoAgAiBCACaiEDAkACQCABQQJPBEAgA0EBIAFBf2oiARDcASAEIAEgAmoiAmohAwwBCyABRQ0BCyADQQE6AAAgAkEBaiECCyAAIAI2AggLaAIBfwF+AkACQAJAIAGtQhR+IgNCIIinDQAgA6ciAUEASA0AIAFFDQEgAUEEEPgBIgINAiABQQRBqLnAACgCACIAQdQAIAAbEQEAAAsQgAIAC0EEIQILIAAgAjYCACAAIAFBFG42AgQLaAIBfwF+AkACQAJAIAGtQgx+IgNCIIinDQAgA6ciAUEASA0AIAFFDQEgAUEEEPgBIgINAiABQQRBqLnAACgCACIAQdQAIAAbEQEAAAsQgAIAC0EEIQILIAAgAjYCACAAIAFBDG42AgQLdAEDfyMAQSBrIgIkAAJAIAAgARAxRQRAIAFBHGooAgAhAyABKAIYIAJBHGpBADYCACACQbCewAA2AhggAkIBNwIMIAJBtJ7AADYCCCADIAJBCGoQG0UNAQsgAkEgaiQAQQEPCyAAQQRqIAEQMSACQSBqJAALcAEBfyMAQRBrIgMkACADIAIoAgAgASgCABA2IAMoAgQhAgJ/IAMoAgBFBEAgAyACNgIMIAFBBGogA0EMahD+ASADKAIMIgFBJE8EQCABEAALQQAMAQtBAQshASAAIAI2AgQgACABNgIAIANBEGokAAtwAQF/IwBBEGsiAyQAIAMgASgCACACNQIAEGkgAygCBCECAn8gAygCAEUEQCADIAI2AgwgAUEEaiADQQxqEP4BIAMoAgwiAUEkTwRAIAEQAAtBAAwBC0EBCyEBIAAgAjYCBCAAIAE2AgAgA0EQaiQAC18BAn8jAEGwAWsiASQAIAFBCGoiAiAAEKEBIAIQ1gEgAUEUahDVASABQShqIgAQxgEgABDYASABQTRqIgAQxgEgABDYASABQcgAahDVASABQYwBahDpASABQbABaiQAC3cBAn8jAEEgayICJAAgAkEQaiIDIAAgARDLASACQQA6ABwgAkEIaiACQRxqIAMQSCACKAIMIQAgAigCCARAIAIgADYCHEHwg8AAQSsgAkEcakGchMAAQcCEwAAQfQALIAJBEGoiARC/ASABELsBIAJBIGokACAAC3oBA38CQCAAKAJQQQFqIgIgACgCTCIETwRAIABBKGooAgAiAyACSQ0BIAIgBGsiAyABIAMgAUkbIQEgACgCICAEQQxsaiADIAEQzAEgAEEAIAEQPCAAQQAgAhCdAQ8LIAQgAkHkjcAAEIoBAAsgAiADQeSNwAAQiQEAC4ABAQF/IwBBQGoiBSQAIAUgATYCDCAFIAA2AgggBSADNgIUIAUgAjYCECAFQSxqQQI2AgAgBUE8akHqADYCACAFQgI3AhwgBUHAn8AANgIYIAVB5gA2AjQgBSAFQTBqNgIoIAUgBUEQajYCOCAFIAVBCGo2AjAgBUEYaiAEENoBAAttAQF/IwBBEGsiAyQAIAMgAiABKAIAEBkgAygCBCECAn8gAygCAEUEQCADIAI2AgwgAUEEaiADQQxqEP4BIAMoAgwiAUEkTwRAIAEQAAtBAAwBC0EBCyEBIAAgAjYCBCAAIAE2AgAgA0EQaiQACzcBAX9BBEEEEPgBIgFFBEBBBEEEQai5wAAoAgAiAEHUACAAGxEBAAALIAAgATYCACAAQQE2AgQLfAEBfyAALQAEIQEgAC0ABQRAIAFB/wFxIQEgAAJ/QQEgAQ0AGiAAKAIAIgEtAABBBHFFBEAgASgCGEG3oMAAQQIgAUEcaigCACgCDBECAAwBCyABKAIYQbagwABBASABQRxqKAIAKAIMEQIACyIBOgAECyABQf8BcUEARwtvAQF/IwBBIGsiAiQAIAJBADoAHyAAAn8gASgCAEEBRwRAIAJBEGpCgICAgIAENwMAIAIoAhQhASACKAIQDAELIAJBCGogAkEfaiABQQRqEEwgAigCDCEBIAIoAggLNgIAIAAgATYCBCACQSBqJAALbgECfwJ/IAAoAjwiAiAAKAJQIgNNBEAgASACaiIBIAMgAyABSxsMAQsgASACaiIBIAAoAhxBf2oiAiACIAFLGwshASAAQQA6AKYBIAAgATYCPCAAIAAoAhhBf2oiASAAKAI4IgAgACABSxs2AjgLZQACQCAAIAFrIAJJBEAgAUF/aiEBIABBf2ohAANAIAAgAmogASACai0AADoAACACQX9qIgINAAsMAQsgAkUNAANAIAAgAS0AADoAACABQQFqIQEgAEEBaiEAIAJBf2oiAg0ACwsLYQEBfwJAAkACQCABIAFqIgIgAUkNACACQQBIDQAgAkUNASACQQIQ+AEiAQ0CIAJBAkGoucAAKAIAIgBB1AAgABsRAQAACxCAAgALQQIhAQsgACABNgIAIAAgAkEBdjYCBAtoAgJ/AX4jAEEgayIDJAAgAyACEHUgAykDACEFIABBADYCCCAAIAU3AgAgA0EIaiIEQRBqIAFBEGooAgA2AgAgBEEIaiABQQhqKQIANwMAIAMgASkCADcDCCAAIAIgBBBNIANBIGokAAtyAQF/IwBBMGsiAiQAIAIgATYCBCACIAA2AgAgAkEcakECNgIAIAJBLGpB4QA2AgAgAkIDNwIMIAJBzJ3AADYCCCACQeEANgIkIAIgAkEgajYCGCACIAJBBGo2AiggAiACNgIgIAJBCGpB5J3AABDaAQALcgEBfyMAQTBrIgIkACACIAE2AgQgAiAANgIAIAJBHGpBAjYCACACQSxqQeEANgIAIAJCAzcCDCACQYiewAA2AgggAkHhADYCJCACIAJBIGo2AhggAiACQQRqNgIoIAIgAjYCICACQQhqQaCewAAQ2gEAC28BAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakHhADYCACADQgI3AgwgA0Gsn8AANgIIIANB4QA2AiQgAyADQSBqNgIYIAMgAzYCKCADIANBBGo2AiAgA0EIaiACENoBAAtvAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpB4QA2AgAgA0ICNwIMIANB4KPAADYCCCADQeEANgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhDaAQALbwEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQeEANgIAIANCAjcCDCADQZSkwAA2AgggA0HhADYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQ2gEAC28BAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakHhADYCACADQgI3AgwgA0HAo8AANgIIIANB4QA2AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACENoBAAtYAQN/IwBBIGsiAiQAIAFBHGooAgAhAyABKAIYIAJBCGoiAUEQaiAAQRBqKQIANwMAIAFBCGogAEEIaikCADcDACACIAApAgA3AwggAyABEBsgAkEgaiQAC1gBA38jAEEgayICJAAgAEEcaigCACEDIAAoAhggAkEIaiIAQRBqIAFBEGopAgA3AwAgAEEIaiABQQhqKQIANwMAIAIgASkCADcDCCADIAAQGyACQSBqJAALWgECfyAAKAIIIgMgAU8EQCADIAAoAgRGBEAgACADEKsBCyAAKAIAIAFBAnRqIgRBBGogBCADIAFrQQJ0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AygCAEEBRgRAIANBCGooAgAiAEUNASADKAIEIABBqLnAACgCACIAQdQAIAAbEQEAAAsgA0EQaiQADwsQgAIAC1kBAX8jAEEQayIDJAAgAyAAIAEgAhBLAkAgAygCAEEBRgRAIANBCGooAgAiAEUNASADKAIEIABBqLnAACgCACIAQdQAIAAbEQEAAAsgA0EQaiQADwsQgAIAC1cBAX8jAEEQayICJAAgAiAAIAEQPwJAIAIoAgBBAUYEQCACQQhqKAIAIgBFDQEgAigCBCAAQai5wAAoAgAiAEHUACAAGxEBAAALIAJBEGokAA8LEIACAAtXAQF/IwBBEGsiAiQAIAIgACABEEACQCACKAIAQQFGBEAgAkEIaigCACIARQ0BIAIoAgQgAEGoucAAKAIAIgBB1AAgABsRAQAACyACQRBqJAAPCxCAAgALWQEBfyMAQRBrIgMkACADIAAgASACED4CQCADKAIAQQFGBEAgA0EIaigCACIARQ0BIAMoAgQgAEGoucAAKAIAIgBB1AAgABsRAQAACyADQRBqJAAPCxCAAgALVwEBfyMAQRBrIgIkACACIAAgARBDAkAgAigCAEEBRgRAIAJBCGooAgAiAEUNASACKAIEIABBqLnAACgCACIAQdQAIAAbEQEAAAsgAkEQaiQADwsQgAIAC1cBAX8jAEEQayICJAAgAiAAIAEQTgJAIAIoAgBBAUYEQCACQQhqKAIAIgBFDQEgAigCBCAAQai5wAAoAgAiAEHUACAAGxEBAAALIAJBEGokAA8LEIACAAtIAQF/An8gAS0AAEUEQBAFDAELQQEhAxAGCyECIAAgATYCBCAAQQA2AgAgAEEQakEANgIAIABBDGogAjYCACAAQQhqIAM2AgALVwEBfyMAQRBrIgIkACACIAAgARBXAkAgAigCAEEBRgRAIAJBCGooAgAiAEUNASACKAIEIABBqLnAACgCACIAQdQAIAAbEQEAAAsgAkEQaiQADwsQgAIAC1cBAX8jAEEQayICJAAgAiAAIAEQbgJAIAIoAgBBAUYEQCACQQhqKAIAIgBFDQEgAigCBCAAQai5wAAoAgAiAEHUACAAGxEBAAALIAJBEGokAA8LEIACAAtLAAJAAn8gAUGAgMQARwRAQQEgACgCGCABIABBHGooAgAoAhARAAANARoLIAINAUEACw8LIAAoAhggAiADIABBHGooAgAoAgwRAgALQQEBfwJAIAAEQCAAKAIAIgJBf0YNASAAIAJBAWo2AgAgAEEEaiABEHsgACAAKAIAQX9qNgIADwsQlAIACxCVAgALRgEBfyAAQQA2AgggACgCBEUEQCAAQQAQrQEgACgCCCEBCyAAQRRqQQA2AgAgACABQQFqNgIIIAAoAgAgAUEBdGpBADsBAAtFAQF/IABBFGooAgAiAiAAQRBqKAIARgRAIABBDGogAhCrASAAKAIUIQILIAAgAkEBajYCFCAAKAIMIAJBAnRqIAE2AgALQAEBfwJAIAAEQCAAKAIAIgFBf0YNASAAIAFBAWo2AgAgAEEEahCfASAAIAAoAgBBf2o2AgAPCxCUAgALEJUCAAtGAQF/IAAoAgQgACgCCCIDayACIAFrIgJJBEAgACADIAIQqQEgACgCCCEDCyAAKAIAIANqIAEgAhDHARogACACIANqNgIIC0QBAX8jAEEQayICJAACQCAALQAAQQFHBEAgAiABQfmQwABBBxDRAQwBCyACIAFB8JDAAEEJENEBCyACEGcgAkEQaiQAC0QBAX8jAEEQayICJAACQCAALQAAQQFHBEAgAiABQe6QwABBAhDRAQwBCyACIAFB7JDAAEECENEBCyACEGcgAkEQaiQAC0gBAX8jAEEgayIDJAAgA0EUakEANgIAIANBsJ7AADYCECADQgE3AgQgAyABNgIcIAMgADYCGCADIANBGGo2AgAgAyACENoBAAs9AQF/IwBBEGsiASQAIAEgABDCAQJAIAEoAgAiAEUNACABKAIERQ0AIAFBCGooAgAaIAAQFAsgAUEQaiQAC0YBAn8jAEEQayIDJAAgA0EIaiIEIAI2AgQgBCABNgIAIAAgAygCDCIBIAMoAggiAmtBAnYQ5QEgAiABIAAQLSADQRBqJAALOwEBfyMAQRBrIgIkACACIAFB6IfAAEEFENEBIAIgADYCDCACIAJBDGpB8IfAABA1IAIQZyACQRBqJAALVgECfyABKAIEIQIgASgCACEDQQhBBBD4ASIBRQRAQQhBBEGoucAAKAIAIgBB1AAgABsRAQAACyABIAI2AgQgASADNgIAIABBvJrAADYCBCAAIAE2AgALNAEBfyAAKAIIIgEEQCAAKAIAIQAgAUEcbCEBA0AgABDVASAAQRxqIQAgAUFkaiIBDQALCws6AQF/IAFBCGooAgAhAgJAIAEoAgxFDQAgAUEQaigCACIBQSRJDQAgARAACyAAIAI2AgQgAEEANgIACzgBAX8gASgCBCICBEAgASgCACEBIABBCGpBBDYCACAAIAJBAnQ2AgQgACABNgIADwsgAEEANgIACzgBAX8gASgCBCICBEAgASgCACEBIABBCGpBBDYCACAAIAJBHGw2AgQgACABNgIADwsgAEEANgIACzkBAX8gAUEQdkAAIQIgAEEANgIIIABBACABQYCAfHEgAkF/RiIBGzYCBCAAQQAgAkEQdCABGzYCAAs0AQF/IwBB0AJrIgIkACACIAAgARAcIAJBqAFqIgAgAkGoARDHARogABDJASACQdACaiQAC14BA38jAEEQayIBJAAgACgCDCICRQRAQZSZwABBK0HkmcAAELoBAAsgACgCCCIDRQRAQZSZwABBK0H0mcAAELoBAAsgASACNgIIIAEgADYCBCABIAM2AgAgARDZAQALNAEBfyAAKAIIIgEEQCAAKAIAIQAgAUEMbCEBA0AgABDXASAAQQxqIQAgAUF0aiIBDQALCwszAQF/IAIEQCAAIQMDQCADIAEtAAA6AAAgAUEBaiEBIANBAWohAyACQX9qIgINAAsLIAALKwACQCAAQXxLDQAgAEUEQEEEDwsgACAAQX1JQQJ0EPgBIgBFDQAgAA8LAAtCAQF/QawBQQQQ+AEiAUUEQEGsAUEEQai5wAAoAgAiAEHUACAAGxEBAAALIAFBADYCACABQQRqIABBqAEQxwEaIAELLgAgASACTwRAIAEgAmsiASABQRRsIABqIAIQHg8LQbCKwABBIUHUisAAELoBAAswAQF/IAFBKGooAgAiAyACTQRAIAIgA0H0jcAAEIgBAAsgACABKAIgIAJBDGxqEA8LLgAgASACTwRAIAEgAmsiASABQQxsIABqIAIQEA8LQaCVwABBIUHElcAAELoBAAs8ACAAKAIAIQAgAS0AAEEQcUEEdkUEQCABLQAAQSBxQQV2RQRAIAAgARCCAg8LIAAgARBkDwsgACABEGMLPAECfyMAQRBrIgIkACACQQhqIgMgACgCCDYCBCADIAAoAgA2AgAgAigCCCACKAIMIAEQmAIgAkEQaiQACzwAIAAoAgAhACABLQAAQRBxQQR2RQRAIAEtAABBIHFBBXZFBEAgACABEIUCDwsgACABEGAPCyAAIAEQXws+ACAAKAIAIQAgAS0AAEEQcUEEdkUEQCABLQAAQSBxQQV2RQRAIAAzAQAgARArDwsgACABEGEPCyAAIAEQXgs0ACAAIAEoAhggAiADIAFBHGooAgAoAgwRAgA6AAggACABNgIAIAAgA0U6AAkgAEEANgIECywAIAEgAk8EQCACIAJBFGwgAGogASACaxAeDwtBsInAAEEjQaCKwAAQugEACywAIAEgAk8EQCACIAJBDGwgAGogASACaxAQDwtBoJTAAEEjQZCVwAAQugEACzIBAX8gACABKAIEIAEoAggiAksEfyABIAIQsQEgASgCCAUgAgs2AgQgACABKAIANgIACyABAX8CQCAAKAIEIgFFDQAgACgCACABQQJ0RQ0AEBQLCyABAX8CQCAAKAIEIgFFDQAgACgCACABQQF0RQ0AEBQLCyABAX8CQCAAKAIEIgFFDQAgACgCACABQRRsRQ0AEBQLCyABAX8CQCAAKAIEIgFFDQAgACgCACABQQxsRQ0AEBQLCywBAX8jAEEQayIBJAAgAUEIaiAAQQhqKAIANgIAIAEgACkCADcDACABEGgACzUBAX8jAEEQayICJAAgAiABNgIMIAIgADYCCCACQeiewAA2AgQgAkGwnsAANgIAIAIQxQEACzQAIABBAzoAICAAQoCAgICABDcCACAAIAE2AhggAEEANgIQIABBADYCCCAAQRxqIAI2AgALIQAgAgRAA0AgACABOgAAIABBAWohACACQX9qIgINAAsLCyABAX8CQCAAKAIAIgFFDQAgAEEEaigCAEUNACABEBQLCyABAX8CQCAAKAIEIgFFDQAgAEEIaigCAEUNACABEBQLCx8AAkAgAUF8TQRAIAAgAUEEIAIQ7AEiAA0BCwALIAALJQAgAEUEQEGAicAAQTAQkwIACyAAIAIgAyAEIAUgASgCDBELAAsjACAARQRAQYCJwABBMBCTAgALIAAgAiADIAQgASgCDBEFAAsjACAARQRAQYCJwABBMBCTAgALIAAgAiADIAQgASgCDBEJAAsjACAARQRAQYCJwABBMBCTAgALIAAgAiADIAQgASgCDBESAAsjACAARQRAQYCJwABBMBCTAgALIAAgAiADIAQgASgCDBERAAsgAQF/IAAoAgQgACgCCCICayABSQRAIAAgAiABEKkBCwsgAQF/EAQhAiAAIAE2AgQgAEEANgIAIABBCGogAjYCAAshACAARQRAQYCJwABBMBCTAgALIAAgAiADIAEoAgwRAwALHwAgAEUEQEGAicAAQTAQkwIACyAAIAIgASgCDBEAAAsRACAAKAIEBEAgACgCABAUCwscACABKAIYQcyywABBBSABQRxqKAIAKAIMEQIACxMAIAAoAgAiAEEkTwRAIAAQAAsLDAAgACABIAIgAxAWCxQAIAAgAiADEAI2AgQgAEEANgIACxYAIAAoAgAiACgCACAAKAIIIAEQmAELFgAgACgCACIAKAIAIAAoAgggARCZAQsWACAAKAIAIgAoAgAgACgCCCABEJoBCxYAIAAoAgAiACgCACAAKAIIIAEQowELFgAgACgCACIAKAIAIAAoAgggARCVAQsWACAAKAIAIgAoAgAgACgCCCABEJcBCwsAIAEEQCAAEBQLCxMAIAAoAgAgASABIAJqELcBQQALEwAgACgCACABKAIAIAIoAgAQCgsUACAAKAIAIAEgACgCBCgCDBEAAAsIACAAIAEQIgsOACAAIAEgASACahC3AQsTACAAQbyawAA2AgQgACABNgIACxAAIAEgACgCACAAKAIEEBULDQAgACABIAIQ+QFBAAsNACAAKAIAIAEgAhADCw8AIAAoAgAgASgCABAIGgsNACAAKAIAIAEQKEEACxIAQcicwABBEUHcnMAAELoBAAsOACAAKAIAGgNADAALAAsLACAANQIAIAEQKwsKACAAIAEgAhA5Cw0AIAAoAgAgASACECELCwAgADEAACABECsLCwAgACkDACABECsLCwAjACAAaiQAIwALBwAgABDpAQsMACAAKAIAIAEQhQILCwAgACgCACABEF0LCwAgACgCACABEFsLDAAgACgCACABEKQBCwwAIAAoAgAgARC4AQsLACAAKAIAIAEQVAsLACAAKAIAIAEQRgsLACAAKAIAIAEQOwsMACAAKAIAIAEQuQELDAAgACgCACABEKIBCwkAIAAgARAMAAsNAEH4lsAAQRsQkwIACw4AQZOXwABBzwAQkwIACwsAIAAoAgAgARAgCykAAn8gACgCAC0AAEUEQCABQdSiwABBBRAVDAELIAFB0KLAAEEEEBULCwoAIAIgACABEBULCAAgACABEAkLDABC79bjvZK52IxuCw0AQvT5nubuo6r5/gALDABCk72/j/7t1N8DCwMAAQsDAAELC4o5AQBBgIDAAAuAOWNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWUvVXNlcnMvYmdsb3Zlci8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9zZXJkZS13YXNtLWJpbmRnZW4tMC4zLjEvc3JjL3Nlci5ycwAAACsAEABiAAAAmwAAACgAAABNYXAga2V5IGlzIG5vdCBhIHN0cmluZyBhbmQgY2Fubm90IGJlIGFuIG9iamVjdCBrZXlmZ2JnYm9sZAFpdGFsaWN1bmRlcmxpbmVzdHJpa2V0aHJvdWdoYmxpbmtpbnZlcnNlcmdiKCwpAAAEARAABAAAAAgBEAABAAAACAEQAAEAAAAJARAAAQAAAAIAAAAMAAAABAAAAAMAAAAEAAAABQAAAGEgRGlzcGxheSBpbXBsZW1lbnRhdGlvbiByZXR1cm5lZCBhbiBlcnJvciB1bmV4cGVjdGVkbHkvcnVzdGMvYTE3OGQwMzIyY2UyMGUzM2VhYzEyNDc1OGU4MzdjYmQ4MGE2ZjYzMy9saWJyYXJ5L2FsbG9jL3NyYy9zdHJpbmcucnMAAHsBEABLAAAATwkAAA4AAAAGAAAAAAAAAAEAAAAHAAAAAQAAAAAAAABjYWxsZWQgYFJlc3VsdDo6dW53cmFwKClgIG9uIGFuIGBFcnJgIHZhbHVlAAkAAAAEAAAABAAAAAoAAAAsAhAAAAAAAHNyYy9saWIucnMAADQCEAAKAAAAIwAAAC0AAAA0AhAACgAAACgAAAAvAAAAVHJpZWQgdG8gc2hyaW5rIHRvIGEgbGFyZ2VyIGNhcGFjaXR5L3J1c3RjL2ExNzhkMDMyMmNlMjBlMzNlYWMxMjQ3NThlODM3Y2JkODBhNmY2MzMvbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5yc4QCEABMAAAA1AEAAAkAAAABAAAAAAAAACBjYW4ndCBiZSByZXByZXNlbnRlZCBhcyBhIEphdmFTY3JpcHQgbnVtYmVy6AIQAAAAAADoAhAALAAAAAwAAAAMAAAABAAAAA0AAAAOAAAABQAAAGEgRGlzcGxheSBpbXBsZW1lbnRhdGlvbiByZXR1cm5lZCBhbiBlcnJvciB1bmV4cGVjdGVkbHkvcnVzdGMvYTE3OGQwMzIyY2UyMGUzM2VhYzEyNDc1OGU4MzdjYmQ4MGE2ZjYzMy9saWJyYXJ5L2FsbG9jL3NyYy9zdHJpbmcucnMAAHMDEABLAAAATwkAAA4AAAAPAAAAAAAAAAEAAAAHAAAAAQAAAAAAAABFcnJvcgAAABAAAAAEAAAABAAAABEAAAAvcnVzdGMvYTE3OGQwMzIyY2UyMGUzM2VhYzEyNDc1OGU4MzdjYmQ4MGE2ZjYzMy9saWJyYXJ5L2FsbG9jL3NyYy9yYXdfdmVjLnJzVHJpZWQgdG8gc2hyaW5rIHRvIGEgbGFyZ2VyIGNhcGFjaXR5AAQQAEwAAADUAQAACQAAAGNsb3N1cmUgaW52b2tlZCByZWN1cnNpdmVseSBvciBkZXN0cm95ZWQgYWxyZWFkeWFzc2VydGlvbiBmYWlsZWQ6IG1pZCA8PSBzZWxmLmxlbigpL3J1c3RjL2ExNzhkMDMyMmNlMjBlMzNlYWMxMjQ3NThlODM3Y2JkODBhNmY2MzMvbGlicmFyeS9jb3JlL3NyYy9zbGljZS9tb2QucnPTBBAATQAAAAcLAAAJAAAAYXNzZXJ0aW9uIGZhaWxlZDogayA8PSBzZWxmLmxlbigpAAAA0wQQAE0AAAAyCwAACQAAAAQAAAAAAAAAAgAAAAAAAABmJgAAkiUAAAkkAAAMJAAADSQAAAokAACwAAAAsQAAACQkAAALJAAAGCUAABAlAAAMJQAAFCUAADwlAAC6IwAAuyMAAAAlAAC8IwAAvSMAABwlAAAkJQAANCUAACwlAAACJQAAZCIAAGUiAADAAwAAYCIAAKMAAADFIgAAdnQtcnMvc3JjL2xpYi5yc/AFEAAQAAAASwIAABEAAADwBRAAEAAAAG4CAAAaAAAA8AUQABAAAADsAgAAGgAAAPAFEAAQAAAA7wIAABoAAADwBRAAEAAAAFQDAAANAAAA8AUQABAAAABZAwAADQAAAPAFEAAQAAAAZQMAAA0AAADwBRAAEAAAAGoDAAANAAAA8AUQABAAAAB3AwAACQAAAPAFEAAQAAAAlwMAABgAAADwBRAAEAAAALAEAAAJAAAA8AUQABAAAADKBAAAGgAAAPAFEAAQAAAA0gQAABoAAAAAAAAA8AUQABAAAABpBQAACQAAAPAFEAAQAAAAcQUAAAkAAADwBRAAEAAAALUFAAAaAAAA8AUQABAAAADYBQAAFwAAAPAFEAAQAAAA3gUAAAkAAABTb3NQbUFwY1N0cmluZ09zY1N0cmluZ0Rjc0lnbm9yZURjc1Bhc3N0aHJvdWdoRGNzSW50ZXJtZWRpYXRlRGNzUGFyYW1EY3NFbnRyeUNzaUlnbm9yZUNzaUludGVybWVkaWF0ZUNzaVBhcmFtQ3NpRW50cnlFc2NhcGVJbnRlcm1lZGlhdGVFc2NhcGVHcm91bmRSR0IAACYAAAAEAAAABAAAACcAAABJbmRleGVkUGVuZm9yZWdyb3VuZCgAAAAEAAAABAAAACkAAABiYWNrZ3JvdW5kYm9sZAAAKgAAAAQAAAAEAAAAKwAAAGl0YWxpY3VuZGVybGluZXN0cmlrZXRocm91Z2hibGlua2ludmVyc2VDZWxsLAAAAAQAAAAEAAAALQAAAC4AAAAEAAAABAAAAC8AAAAwAAAABAAAAAQAAAAxAAAARzFHMEFsdGVybmF0ZVByaW1hcnlTYXZlZEN0eGN1cnNvcl94MgAAAAQAAAAEAAAAMwAAAGN1cnNvcl95cGVub3JpZ2luX21vZGVhdXRvX3dyYXBfbW9kZVZUc3RhdGUANAAAAAQAAAAEAAAANQAAAHBhcmFtcwAANgAAAAQAAAAEAAAANwAAAGludGVybWVkaWF0ZXNjb2x1bW5zcm93c2J1ZmZlcgAAOAAAAAQAAAAEAAAAOQAAAGFsdGVybmF0ZV9idWZmZXJhY3RpdmVfYnVmZmVyX3R5cGUAADoAAAAEAAAABAAAADsAAABjdXJzb3JfdmlzaWJsZWNoYXJzZXQAAAA8AAAABAAAAAQAAAA9AAAAdGFicz4AAAAEAAAABAAAAD8AAABpbnNlcnRfbW9kZW5ld19saW5lX21vZGVuZXh0X3ByaW50X3dyYXBzdG9wX21hcmdpbmJvdHRvbV9tYXJnaW5zYXZlZF9jdHhAAAAABAAAAAQAAABBAAAAYWx0ZXJuYXRlX3NhdmVkX2N0eGFmZmVjdGVkX2xpbmVzAAAAQgAAAAQAAAAEAAAAQwAAAGFzc2VydGlvbiBmYWlsZWQ6IG1pZCA8PSBzZWxmLmxlbigpL3J1c3RjL2ExNzhkMDMyMmNlMjBlMzNlYWMxMjQ3NThlODM3Y2JkODBhNmY2MzMvbGlicmFyeS9jb3JlL3NyYy9zbGljZS9tb2QucnNDChAATQAAAAcLAAAJAAAAYXNzZXJ0aW9uIGZhaWxlZDogayA8PSBzZWxmLmxlbigpAAAAQwoQAE0AAAAyCwAACQAAAAQAAAAAAAAARAAAAAQAAAAEAAAARQAAAEYAAAAEAAAABAAAAEcAAABIAAAABAAAAAQAAAAtAAAASQAAAAQAAAAEAAAAMwAAAEoAAAAEAAAABAAAACsAAABLAAAABAAAAAQAAABMAAAAU29tZU0AAAAEAAAABAAAAE4AAABOb25lSnNWYWx1ZSgpAAAAVAsQAAgAAABcCxAAAQAAAAQAAAAAAAAAbnVsbCBwb2ludGVyIHBhc3NlZCB0byBydXN0cmVjdXJzaXZlIHVzZSBvZiBhbiBvYmplY3QgZGV0ZWN0ZWQgd2hpY2ggd291bGQgbGVhZCB0byB1bnNhZmUgYWxpYXNpbmcgaW4gcnVzdAAAUAAAAAQAAAAEAAAAUQAAAFIAAABTAAAAL3J1c3RjL2ExNzhkMDMyMmNlMjBlMzNlYWMxMjQ3NThlODM3Y2JkODBhNmY2MzMvbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5yc1RyaWVkIHRvIHNocmluayB0byBhIGxhcmdlciBjYXBhY2l0efwLEABMAAAA1AEAAAkAAABVAAAABAAAAAQAAABWAAAAVwAAAFgAAABjYWxsZWQgYE9wdGlvbjo6dW53cmFwKClgIG9uIGEgYE5vbmVgIHZhbHVlAAEAAAAAAAAAbGlicmFyeS9zdGQvc3JjL3Bhbmlja2luZy5yc8gMEAAcAAAAAQIAAB8AAADIDBAAHAAAAAICAAAeAAAAWQAAABAAAAAEAAAAWgAAAFsAAABVAAAACAAAAAQAAABcAAAAXQAAAF4AAAAMAAAABAAAAF8AAABVAAAACAAAAAQAAABgAAAAYgAAAAQAAAAEAAAAYwAAAGQAAABlAAAAL3J1c3RjL2ExNzhkMDMyMmNlMjBlMzNlYWMxMjQ3NThlODM3Y2JkODBhNmY2MzMvbGlicmFyeS9jb3JlL3NyYy9mbXQvbW9kLnJzAGQNEABLAAAAcgEAABMAAABiAAAAAAAAAAEAAAAHAAAAYSBmb3JtYXR0aW5nIHRyYWl0IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9ybGlicmFyeS9hbGxvYy9zcmMvZm10LnJzAAMOEAAYAAAARwIAABwAAABsaWJyYXJ5L2FsbG9jL3NyYy9yYXdfdmVjLnJzY2FwYWNpdHkgb3ZlcmZsb3cAAAAsDhAAHAAAADACAAAFAAAAKSBzaG91bGQgYmUgPCBsZW4gKGlzIClsaWJyYXJ5L2FsbG9jL3NyYy92ZWMvbW9kLnJzaW5zZXJ0aW9uIGluZGV4IChpcyApIHNob3VsZCBiZSA8PSBsZW4gKGlzIAAAnw4QABQAAACzDhAAFwAAAIIOEAABAAAAgw4QABwAAAA5BQAADQAAAHJlbW92YWwgaW5kZXggKGlzIAAA9A4QABIAAABsDhAAFgAAAIIOEAABAAAAgw4QABwAAABpBQAADQAAAC4uAAAwDxAAAgAAAGNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWUAawAAAAAAAAABAAAAbAAAAGluZGV4IG91dCBvZiBib3VuZHM6IHRoZSBsZW4gaXMgIGJ1dCB0aGUgaW5kZXggaXMgAAB4DxAAIAAAAJgPEAASAAAAYDogADAPEAAAAAAAvQ8QAAIAAABsaWJyYXJ5L2NvcmUvc3JjL2ZtdC9idWlsZGVycy5yc2sAAAAMAAAABAAAAG0AAABuAAAAbwAAACAgICDQDxAAIAAAADIAAAAhAAAA0A8QACAAAAAzAAAAEgAAACB7CiwKLCAgeyB9IH0oCigsKQpbXWxpYnJhcnkvY29yZS9zcmMvZm10L251bS5yc0EQEAAbAAAAZQAAABQAAAAweDAwMDEwMjAzMDQwNTA2MDcwODA5MTAxMTEyMTMxNDE1MTYxNzE4MTkyMDIxMjIyMzI0MjUyNjI3MjgyOTMwMzEzMjMzMzQzNTM2MzczODM5NDA0MTQyNDM0NDQ1NDY0NzQ4NDk1MDUxNTI1MzU0NTU1NjU3NTg1OTYwNjE2MjYzNjQ2NTY2Njc2ODY5NzA3MTcyNzM3NDc1NzY3Nzc4Nzk4MDgxODI4Mzg0ODU4Njg3ODg4OTkwOTE5MjkzOTQ5NTk2OTc5ODk5AABrAAAABAAAAAQAAABwAAAAcQAAAHIAAAB0cnVlZmFs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");

                      var loadVt = async () => {
                          await init(wasm_code);
                          return exports$1;
                      };

  function parseNpt(time) {
    if (typeof time === 'number') {
      return time;
    } else if (typeof time === 'string') {
      return time.split(':').reverse().map(parseFloat).reduce(function (sum, n, i) {
        return sum + n * Math.pow(60, i);
      });
    } else {
      return undefined;
    }
  }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var vt = loadVt(); // trigger async loading of wasm

  var Core = /*#__PURE__*/function () {
    // public
    function Core(driverFn, opts) {
      var _opts$speed;

      _classCallCheck(this, Core);

      this.state = 'initial';
      this.driver = null;
      this.driverFn = driverFn;
      this.changedLines = new Set();
      this.cursor = undefined;
      this.duration = null;
      this.cols = opts.cols;
      this.rows = opts.rows;
      this.startTime = null;
      this.speed = (_opts$speed = opts.speed) !== null && _opts$speed !== void 0 ? _opts$speed : 1.0;
      this.loop = opts.loop;
      this.idleTimeLimit = opts.idleTimeLimit;
      this.preload = opts.preload;
      this.startAt = parseNpt(opts.startAt);
      this.poster = opts.poster;
      this.onSize = opts.onSize;
      this.onFinish = opts.onFinish;
      this.onTerminalUpdate = opts.onTerminalUpdate;
    }

    _createClass(Core, [{
      key: "init",
      value: function () {
        var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
          var _this = this,
              _this$cols,
              _this$rows;

          var playCount, feed, now, setTimeout, setInterval, reset, onFinish;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  playCount = 0;
                  feed = this.feed.bind(this);
                  now = this.now.bind(this);

                  setTimeout = function setTimeout(f, t) {
                    return window.setTimeout(f, t / _this.speed);
                  };

                  setInterval = function setInterval(f, t) {
                    return window.setInterval(f, t / _this.speed);
                  };

                  reset = function reset(cols, rows) {
                    _this.resetVt(cols, rows);
                  };

                  onFinish = function onFinish() {
                    playCount++;

                    if (_this.loop === true || typeof _this.loop === 'number' && playCount < _this.loop) {
                      _this.restart();
                    } else {
                      _this.state = 'finished';

                      if (typeof _this.onFinish === 'function') {
                        _this.onFinish();
                      }
                    }
                  };

                  _context.next = 9;
                  return vt;

                case 9:
                  this.wasm = _context.sent;
                  this.driver = this.driverFn({
                    feed: feed,
                    now: now,
                    setTimeout: setTimeout,
                    setInterval: setInterval,
                    onFinish: onFinish,
                    reset: reset
                  }, {
                    cols: this.cols,
                    rows: this.rows,
                    idleTimeLimit: this.idleTimeLimit,
                    startAt: this.startAt
                  });

                  if (typeof this.driver === 'function') {
                    this.driver = {
                      start: this.driver
                    };
                  }

                  this.duration = this.driver.duration;
                  this.cols = (_this$cols = this.cols) !== null && _this$cols !== void 0 ? _this$cols : this.driver.cols;
                  this.rows = (_this$rows = this.rows) !== null && _this$rows !== void 0 ? _this$rows : this.driver.rows;

                  if (this.preload) {
                    this.initializeDriver();
                  }

                  _context.t0 = !!this.driver.pauseOrResume;
                  _context.t1 = !!this.driver.seek;
                  _context.next = 20;
                  return this.renderPoster();

                case 20:
                  _context.t2 = _context.sent;
                  return _context.abrupt("return", {
                    isPausable: _context.t0,
                    isSeekable: _context.t1,
                    poster: _context.t2
                  });

                case 22:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function init() {
          return _init.apply(this, arguments);
        }

        return init;
      }()
    }, {
      key: "play",
      value: function () {
        var _play = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(this.state == 'initial')) {
                    _context2.next = 5;
                    break;
                  }

                  _context2.next = 3;
                  return this.start();

                case 3:
                  _context2.next = 6;
                  break;

                case 5:
                  if (this.state == 'paused') {
                    this.resume();
                  } else if (this.state == 'finished') {
                    this.restart();
                  }

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function play() {
          return _play.apply(this, arguments);
        }

        return play;
      }()
    }, {
      key: "pauseOrResume",
      value: function () {
        var _pauseOrResume = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(this.state == 'initial')) {
                    _context3.next = 5;
                    break;
                  }

                  _context3.next = 3;
                  return this.start();

                case 3:
                  _context3.next = 16;
                  break;

                case 5:
                  if (!(this.state == 'playing')) {
                    _context3.next = 9;
                    break;
                  }

                  this.pause();
                  _context3.next = 16;
                  break;

                case 9:
                  if (!(this.state == 'paused')) {
                    _context3.next = 13;
                    break;
                  }

                  this.resume();
                  _context3.next = 16;
                  break;

                case 13:
                  if (!(this.state == 'finished')) {
                    _context3.next = 16;
                    break;
                  }

                  _context3.next = 16;
                  return this.restart();

                case 16:
                  return _context3.abrupt("return", this.state == 'playing');

                case 17:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function pauseOrResume() {
          return _pauseOrResume.apply(this, arguments);
        }

        return pauseOrResume;
      }()
    }, {
      key: "stop",
      value: function stop() {
        if (typeof this.driver.stop === 'function') {
          this.driver.stop();
        }
      }
    }, {
      key: "seek",
      value: function () {
        var _seek = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(where) {
          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (!(typeof this.driver.seek === 'function')) {
                    _context4.next = 8;
                    break;
                  }

                  _context4.next = 3;
                  return this.initializeDriver();

                case 3:
                  if (this.state != 'playing') {
                    this.state = 'paused';
                  }

                  this.driver.seek(where);
                  return _context4.abrupt("return", true);

                case 8:
                  return _context4.abrupt("return", false);

                case 9:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function seek(_x) {
          return _seek.apply(this, arguments);
        }

        return seek;
      }()
    }, {
      key: "getChangedLines",
      value: function getChangedLines() {
        if (this.changedLines.size > 0) {
          var lines = new Map();

          var _iterator = _createForOfIteratorHelper(this.changedLines),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var i = _step.value;
              lines.set(i, {
                id: i,
                segments: this.vt.get_line(i)
              });
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          this.changedLines.clear();
          return lines;
        }
      }
    }, {
      key: "getCursor",
      value: function getCursor() {
        if (this.cursor === undefined && this.vt) {
          var _this$vt$get_cursor;

          this.cursor = (_this$vt$get_cursor = this.vt.get_cursor()) !== null && _this$vt$get_cursor !== void 0 ? _this$vt$get_cursor : false;
        }

        return this.cursor;
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        if (typeof this.driver.getCurrentTime === 'function') {
          return this.driver.getCurrentTime();
        } else if (this.startTime) {
          return (this.now() - this.startTime) / 1000;
        }
      }
    }, {
      key: "getRemainingTime",
      value: function getRemainingTime() {
        if (typeof this.duration === 'number') {
          return this.duration - Math.min(this.getCurrentTime(), this.duration);
        }
      }
    }, {
      key: "getProgress",
      value: function getProgress() {
        if (typeof this.duration === 'number') {
          return Math.min(this.getCurrentTime(), this.duration) / this.duration;
        }
      } // private

    }, {
      key: "start",
      value: function () {
        var _start = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
          var stop;
          return regenerator.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.initializeDriver();

                case 2:
                  this.onTerminalUpdate(); // clears the poster

                  _context5.next = 5;
                  return this.driver.start();

                case 5:
                  stop = _context5.sent;

                  if (typeof stop === 'function') {
                    this.driver.stop = stop;
                  }

                  this.startTime = this.now();
                  this.state = 'playing';

                case 9:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function start() {
          return _start.apply(this, arguments);
        }

        return start;
      }()
    }, {
      key: "pause",
      value: function pause() {
        if (typeof this.driver.pauseOrResume === 'function') {
          this.driver.pauseOrResume();
          this.state = 'paused';
        }
      }
    }, {
      key: "resume",
      value: function resume() {
        if (typeof this.driver.pauseOrResume === 'function') {
          this.state = 'playing';
          this.driver.pauseOrResume();
        }
      }
    }, {
      key: "restart",
      value: function () {
        var _restart = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
          return regenerator.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this.seek(0);

                case 2:
                  if (!_context6.sent) {
                    _context6.next = 4;
                    break;
                  }

                  this.resume();

                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function restart() {
          return _restart.apply(this, arguments);
        }

        return restart;
      }()
    }, {
      key: "feed",
      value: function feed(data) {
        var _this2 = this;

        var affectedLines = this.vt.feed(data);
        affectedLines.forEach(function (i) {
          return _this2.changedLines.add(i);
        });
        this.cursor = undefined;
        this.onTerminalUpdate();
      }
    }, {
      key: "now",
      value: function now() {
        return performance.now() * this.speed;
      }
    }, {
      key: "initializeDriver",
      value: function initializeDriver() {
        if (this.initializeDriverPromise === undefined) {
          this.initializeDriverPromise = this.doInitializeDriver();
        }

        return this.initializeDriverPromise;
      }
    }, {
      key: "doInitializeDriver",
      value: function () {
        var _doInitializeDriver = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7() {
          var _this$duration, _this$cols2, _this$rows2, meta;

          return regenerator.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  if (!(typeof this.driver.init === 'function')) {
                    _context7.next = 7;
                    break;
                  }

                  _context7.next = 3;
                  return this.driver.init();

                case 3:
                  meta = _context7.sent;
                  this.duration = (_this$duration = this.duration) !== null && _this$duration !== void 0 ? _this$duration : meta.duration;
                  this.cols = (_this$cols2 = this.cols) !== null && _this$cols2 !== void 0 ? _this$cols2 : meta.cols;
                  this.rows = (_this$rows2 = this.rows) !== null && _this$rows2 !== void 0 ? _this$rows2 : meta.rows;

                case 7:
                  this.ensureVt();

                case 8:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function doInitializeDriver() {
          return _doInitializeDriver.apply(this, arguments);
        }

        return doInitializeDriver;
      }()
    }, {
      key: "ensureVt",
      value: function ensureVt() {
        var _this$cols3, _this$rows3;

        var cols = (_this$cols3 = this.cols) !== null && _this$cols3 !== void 0 ? _this$cols3 : 80;
        var rows = (_this$rows3 = this.rows) !== null && _this$rows3 !== void 0 ? _this$rows3 : 24;

        if (this.vt !== undefined && this.vt.cols === cols && this.vt.rows === rows) {
          return;
        }

        this.initializeVt(cols, rows);
      }
    }, {
      key: "resetVt",
      value: function resetVt(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.initializeVt(cols, rows);
      }
    }, {
      key: "initializeVt",
      value: function initializeVt(cols, rows) {
        this.vt = this.wasm.create(cols, rows);
        this.vt.cols = cols;
        this.vt.rows = rows;
        this.changedLines.clear();

        for (var i = 0; i < rows; i++) {
          this.changedLines.add(i);
        }

        if (typeof this.onSize === 'function') {
          this.onSize(cols, rows);
        }
      }
    }, {
      key: "renderPoster",
      value: function () {
        var _renderPoster = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8() {
          var _this3 = this;

          var poster, cursor, lines, i;
          return regenerator.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (this.poster) {
                    _context8.next = 2;
                    break;
                  }

                  return _context8.abrupt("return");

                case 2:
                  this.ensureVt();
                  poster = [];

                  if (!(this.poster.substring(0, 16) == "data:text/plain,")) {
                    _context8.next = 8;
                    break;
                  }

                  poster = [this.poster.substring(16)];
                  _context8.next = 12;
                  break;

                case 8:
                  if (!(this.poster.substring(0, 4) == 'npt:' && typeof this.driver.getPoster === 'function')) {
                    _context8.next = 12;
                    break;
                  }

                  _context8.next = 11;
                  return this.initializeDriver();

                case 11:
                  poster = this.driver.getPoster(this.parseNptPoster(this.poster));

                case 12:
                  poster.forEach(function (text) {
                    return _this3.vt.feed(text);
                  });
                  cursor = this.getCursor();
                  lines = [];

                  for (i = 0; i < this.vt.rows; i++) {
                    lines.push({
                      id: i,
                      segments: this.vt.get_line(i)
                    });
                    this.changedLines.add(i);
                  }

                  this.vt.feed('\x1bc'); // reset vt

                  this.cursor = undefined;
                  return _context8.abrupt("return", {
                    cursor: cursor,
                    lines: lines
                  });

                case 19:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function renderPoster() {
          return _renderPoster.apply(this, arguments);
        }

        return renderPoster;
      }()
    }, {
      key: "parseNptPoster",
      value: function parseNptPoster(poster) {
        return parseNpt(poster.substring(4));
      }
    }]);

    return Core;
  }();

  const _tmpl$$6 = template(`<span></span>`);

  var Segment = (function (props) {
    return function () {
      var _el$ = _tmpl$$6.cloneNode(true);

      insert(_el$, function () {
        return props.text;
      });

      createRenderEffect(function (_p$) {
        var _v$ = className(props.attrs, props.extraClass),
            _v$2 = classList(props.attrs),
            _v$3 = style(props.attrs);

        _v$ !== _p$._v$ && (_el$.className = _p$._v$ = _v$);
        _p$._v$2 = classList$1(_el$, _v$2, _p$._v$2);
        _p$._v$3 = style$1(_el$, _v$3, _p$._v$3);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined
      });

      return _el$;
    }();
  });

  function className(attrs, extraClass) {
    var fg = attrs.get('inverse') ? attrs.has('bg') ? attrs.get('bg') : 'bg' : attrs.get('fg');
    var bg = attrs.get('inverse') ? attrs.has('fg') ? attrs.get('fg') : 'fg' : attrs.get('bg');
    var fgClass = colorClass(fg, attrs.get('bold'), 'fg-');
    var bgClass = colorClass(bg, attrs.get('blink'), 'bg-');
    var cls = extraClass !== null && extraClass !== void 0 ? extraClass : '';

    if (fgClass) {
      cls += ' ' + fgClass;
    }

    if (bgClass) {
      cls += ' ' + bgClass;
    }

    return cls;
  }

  function classList(attrs) {
    return {
      bright: attrs.has('bold'),
      italic: attrs.has('italic'),
      underline: attrs.has('underline'),
      blink: attrs.has('blink')
    };
  }

  function colorClass(color, intense, prefix) {
    if (typeof color === 'number') {
      if (intense && color < 8) {
        color += 8;
      }

      return "".concat(prefix).concat(color);
    } else if (color == 'fg' || color == 'bg') {
      return "".concat(prefix).concat(color);
    }
  }

  function style(attrs) {
    var fg = attrs.get('inverse') ? attrs.get('bg') : attrs.get('fg');
    var bg = attrs.get('inverse') ? attrs.get('fg') : attrs.get('bg');
    var style = {};

    if (typeof fg === 'string') {
      style['color'] = fg;
    }

    if (typeof bg === 'string') {
      style['background-color'] = bg;
    }

    return style;
  }

  const _tmpl$$5 = template(`<span class="line"></span>`);
  var Line = (function (props) {
    var segments = function segments() {
      if (typeof props.cursor === 'number') {
        var segs = [];
        var len = 0;
        var i = 0;

        while (i < props.segments.length && len + props.segments[i][0].length - 1 < props.cursor) {
          var seg = props.segments[i];
          segs.push(seg);
          len += seg[0].length;
          i++;
        }

        if (i < props.segments.length) {
          var _seg = props.segments[i];
          var cursorAttrsA = _seg[1];
          var cursorAttrsB = new Map(cursorAttrsA);
          cursorAttrsB.set('inverse', !cursorAttrsB.get('inverse'));
          var pos = props.cursor - len;

          if (pos > 0) {
            segs.push([_seg[0].substring(0, pos), _seg[1]]);
          }

          segs.push([_seg[0][pos], cursorAttrsA, ' cursor-a']);
          segs.push([_seg[0][pos], cursorAttrsB, ' cursor-b']);

          if (pos < _seg[0].length - 1) {
            segs.push([_seg[0].substring(pos + 1), _seg[1]]);
          }

          i++;

          while (i < props.segments.length) {
            var _seg2 = props.segments[i];
            segs.push(_seg2);
            i++;
          }
        }

        return segs;
      } else {
        return props.segments;
      }
    };

    return function () {
      var _el$ = _tmpl$$5.cloneNode(true);

      insert(_el$, createComponent(Index, {
        get each() {
          return segments();
        },

        children: function children(s) {
          return createComponent(Segment, {
            get text() {
              return s()[0];
            },

            get attrs() {
              return s()[1];
            },

            get extraClass() {
              return s()[2];
            }

          });
        }
      }));

      return _el$;
    }();
  });

  const _tmpl$$4 = template(`<pre class="asciinema-terminal"></pre>`);
  var Terminal = (function (props) {
    var terminalStyle = function terminalStyle() {
      return {
        width: "".concat(props.cols, "ch"),
        height: "".concat(1.3333333333 * props.rows, "em"),
        "font-size": "".concat((props.scale || 1.0) * 100, "%")
      };
    };

    var cursorCol = function cursorCol() {
      var _props$cursor;

      return (_props$cursor = props.cursor) === null || _props$cursor === void 0 ? void 0 : _props$cursor[0];
    };

    var cursorRow = function cursorRow() {
      var _props$cursor2;

      return (_props$cursor2 = props.cursor) === null || _props$cursor2 === void 0 ? void 0 : _props$cursor2[1];
    };

    return function () {
      var _el$ = _tmpl$$4.cloneNode(true);

      var _ref$ = props.ref;
      typeof _ref$ === "function" ? _ref$(_el$) : props.ref = _el$;

      insert(_el$, createComponent(For, {
        get each() {
          return props.lines;
        },

        children: function children(line, i) {
          return function () {
            var _c$ = memo(function () {
              return i() === cursorRow();
            }, true);

            return createComponent(Line, {
              get segments() {
                return line.segments;
              },

              get cursor() {
                return _c$() ? cursorCol() : null;
              }

            });
          }();
        }
      }));

      createRenderEffect(function (_p$) {
        var _v$ = props.blink || props.cursorHold,
            _v$2 = props.blink,
            _v$3 = terminalStyle();

        _v$ !== _p$._v$ && _el$.classList.toggle("cursor", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && _el$.classList.toggle("blink", _p$._v$2 = _v$2);
        _p$._v$3 = style$1(_el$, _v$3, _p$._v$3);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined
      });

      return _el$;
    }();
  });

  const _tmpl$$3 = template(`<svg version="1.1" viewBox="0 0 12 12" class="icon"><path d="M1,0 L4,0 L4,12 L1,12 Z"></path><path d="M8,0 L11,0 L11,12 L8,12 Z"></path></svg>`),
        _tmpl$2 = template(`<svg version="1.1" viewBox="0 0 12 12" class="icon"><path d="M1,0 L11,6 L1,12 Z"></path></svg>`),
        _tmpl$3 = template(`<span class="playback-button"></span>`),
        _tmpl$4 = template(`<span class="progressbar"><span class="bar"><span class="gutter"><span></span></span></span></span>`),
        _tmpl$5 = template(`<div class="control-bar"><span class="timer"><span class="time-elapsed"></span><span class="time-remaining"></span></span><span class="fullscreen-button" title="Toggle fullscreen mode"><svg version="1.1" viewBox="0 0 12 12" class="icon"><path d="M12,0 L7,0 L9,2 L7,4 L8,5 L10,3 L12,5 Z"></path><path d="M0,12 L0,7 L2,9 L4,7 L5,8 L3,10 L5,12 Z"></path></svg><svg version="1.1" viewBox="0 0 12 12" class="icon"><path d="M7,5 L7,0 L9,2 L11,0 L12,1 L10,3 L12,5 Z"></path><path d="M5,7 L0,7 L2,9 L0,11 L1,12 L3,10 L5,12 Z"></path></svg></span></div>`);

  function formatTime(seconds) {
    seconds = Math.floor(seconds);
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    var time = '';

    if (m < 10) {
      time += '0';
    }

    time += "".concat(m, ":");

    if (s < 10) {
      time += '0';
    }

    time += "".concat(s);
    return time;
  }

  var ControlBar = (function (props) {
    var e = function e(f) {
      return function (e) {
        e.preventDefault();
        f(e);
      };
    };

    var currentTime = function currentTime() {
      return typeof props.currentTime === 'number' ? formatTime(props.currentTime) : '--:--';
    };

    var remainingTime = function remainingTime() {
      return typeof props.remainingTime === 'number' ? '-' + formatTime(props.remainingTime) : currentTime();
    };

    var gutterBarStyle = function gutterBarStyle() {
      return {
        width: "100%",
        transform: "scaleX(".concat(props.progress || 0),
        "transform-origin": "left center"
      };
    };

    var onSeek = function onSeek(e) {
      if (e.altKey || e.shiftKey || e.metaKey || e.ctrlKey) {
        return;
      }

      var barWidth = e.currentTarget.offsetWidth;
      var rect = e.currentTarget.getBoundingClientRect();
      var mouseX = e.clientX - rect.left;
      var pos = mouseX / barWidth;
      return props.onSeekClick("".concat(pos * 100, "%"));
    };

    return function () {
      var _el$ = _tmpl$5.cloneNode(true),
          _el$5 = _el$.firstChild,
          _el$6 = _el$5.firstChild,
          _el$7 = _el$6.nextSibling,
          _el$8 = _el$5.nextSibling;

      insert(_el$, createComponent(Show, {
        get when() {
          return props.isPausable;
        },

        get children() {
          var _el$2 = _tmpl$3.cloneNode(true);

          addEventListener(_el$2, "click", e(props.onPlayClick), true);

          insert(_el$2, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return props.isPlaying;
                },

                get children() {
                  return _tmpl$$3.cloneNode(true);
                }

              }), createComponent(Match, {
                get when() {
                  return !props.isPlaying;
                },

                get children() {
                  return _tmpl$2.cloneNode(true);
                }

              })];
            }

          }));

          return _el$2;
        }

      }), _el$5);

      insert(_el$6, currentTime);

      insert(_el$7, remainingTime);

      addEventListener(_el$8, "click", e(props.onFullscreenClick), true);

      insert(_el$, createComponent(Show, {
        get when() {
          return typeof props.progress === 'number' || props.isSeekable;
        },

        get children() {
          var _el$9 = _tmpl$4.cloneNode(true),
              _el$10 = _el$9.firstChild,
              _el$11 = _el$10.firstChild,
              _el$12 = _el$11.firstChild;

          _el$10.$$mousedown = onSeek;

          createRenderEffect(function (_$p) {
            return style$1(_el$12, gutterBarStyle(), _$p);
          });

          return _el$9;
        }

      }), null);

      createRenderEffect(function () {
        return _el$.classList.toggle("seekable", props.isSeekable);
      });

      return _el$;
    }();
  });

  delegateEvents(["click", "mousedown"]);

  const _tmpl$$2 = template(`<div class="loading"><div class="loader"></div></div>`);

  var LoaderOverlay = (function (props) {
    return _tmpl$$2.cloneNode(true);
  });

  const _tmpl$$1 = template(`<div class="start-prompt"><div class="play-button"><div><span><svg version="1.1" viewBox="0 0 866.0254037844387 866.0254037844387" class="icon"><defs><mask id="small-triangle-mask"><rect width="100%" height="100%" fill="white"></rect><polygon points="508.01270189221935 433.01270189221935, 208.0127018922194 259.8076211353316, 208.01270189221927 606.217782649107" fill="black"></polygon></mask></defs><polygon points="808.0127018922194 433.01270189221935, 58.01270189221947 -1.1368683772161603e-13, 58.01270189221913 866.0254037844386" mask="url(#small-triangle-mask)" fill="white" class="play-btn-fill"></polygon><polyline points="481.2177826491071 333.0127018922194, 134.80762113533166 533.0127018922194" stroke="white" stroke-width="90" class="play-btn-stroke"></polyline></svg></span></div></div></div>`);

  var StartOverlay = (function (props) {
    var e = function e(f) {
      return function (e) {
        e.preventDefault();
        f(e);
      };
    };

    return function () {
      var _el$ = _tmpl$$1.cloneNode(true);

      addEventListener(_el$, "click", e(props.onClick), true);

      return _el$;
    }();
  });

  delegateEvents(["click"]);

  const _tmpl$ = template(`<div class="asciinema-player-wrapper" tabindex="-1"><div></div></div>`);
  var Player = (function (props) {
    var _props$autoPlay;

    var _createStore = createStore({
      state: 'initial',
      cols: props.cols,
      rows: props.rows,
      lines: [],
      cursor: undefined,
      charW: null,
      charH: null,
      bordersW: null,
      bordersH: null,
      containerW: null,
      containerH: null,
      showControls: false,
      isPausable: true,
      isSeekable: true,
      isFullscreen: false,
      currentTime: null,
      remainingTime: null,
      progress: null,
      blink: true,
      cursorHold: false
    }),
        _createStore2 = _slicedToArray(_createStore, 2),
        state = _createStore2[0],
        setState = _createStore2[1];

    var autoPlay = (_props$autoPlay = props.autoPlay) !== null && _props$autoPlay !== void 0 ? _props$autoPlay : props.autoplay;
    var frameRequestId;
    var userActivityTimeoutId;
    var timeUpdateIntervalId;
    var blinkIntervalId;
    var wrapperRef;
    var playerRef;
    var terminalRef;
    var resizeObserver;

    var terminalCols = function terminalCols() {
      return state.cols || 80;
    };

    var terminalRows = function terminalRows() {
      return state.rows || 24;
    };

    var core = new Core(props.driverFn, {
      cols: props.cols,
      rows: props.rows,
      loop: props.loop,
      speed: props.speed,
      preload: props.preload,
      startAt: props.startAt,
      poster: props.poster,
      idleTimeLimit: props.idleTimeLimit,
      onSize: function onSize(cols, rows) {
        if (rows < state.rows) {
          setState('lines', state.lines.slice(0, rows));
        }

        setState({
          cols: cols,
          rows: rows
        });
      },
      onTerminalUpdate: function onTerminalUpdate() {
        if (frameRequestId === undefined) {
          frameRequestId = requestAnimationFrame(updateTerminal);
        }
      },
      onFinish: function onFinish() {
        setState('state', 'paused');
      }
    });

    var measureDomElements = function measureDomElements() {
      setState({
        charW: terminalRef.clientWidth / terminalCols(),
        charH: terminalRef.clientHeight / terminalRows(),
        bordersW: terminalRef.offsetWidth - terminalRef.clientWidth,
        bordersH: terminalRef.offsetHeight - terminalRef.clientHeight,
        containerW: wrapperRef.offsetWidth,
        containerH: wrapperRef.offsetHeight
      });
    };

    var setupResizeObserver = function setupResizeObserver() {
      resizeObserver = new ResizeObserver(function (_entries) {
        setState({
          containerW: wrapperRef.offsetWidth,
          containerH: wrapperRef.offsetHeight
        });
        wrapperRef.dispatchEvent(new CustomEvent('resize', {
          detail: {
            el: playerRef
          }
        }));
      });
      resizeObserver.observe(wrapperRef);
    };

    onMount( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var _yield$core$init, isPausable, isSeekable, poster;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.debug('player mounted');
              measureDomElements();
              setupResizeObserver();
              _context.next = 5;
              return core.init();

            case 5:
              _yield$core$init = _context.sent;
              isPausable = _yield$core$init.isPausable;
              isSeekable = _yield$core$init.isSeekable;
              poster = _yield$core$init.poster;
              setState({
                isPausable: isPausable,
                isSeekable: isSeekable
              });

              if (poster !== undefined && !autoPlay) {
                setState({
                  lines: poster.lines,
                  cursor: poster.cursor
                });
              }

              if (autoPlay) {
                play();
              }

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    onCleanup(function () {
      core.stop();
      stopBlinking();
      stopTimeUpdates();
      resizeObserver.disconnect();
    });
    createEffect(function () {
      var s = state.state;

      if (s === 'playing') {
        startBlinking();
        startTimeUpdates();
      } else if (s === 'paused') {
        stopBlinking();
        stopTimeUpdates();
        updateTime();
      }
    });

    var play = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var timeoutId;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                setState('state', 'loading');
                timeoutId = setTimeout(function () {
                  setState('state', 'waiting');
                }, 1000);
                _context2.next = 4;
                return core.play();

              case 4:
                clearTimeout(timeoutId);
                setState('state', 'playing');

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function play() {
        return _ref2.apply(this, arguments);
      };
    }();

    var pauseOrResume = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var isPlaying;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return core.pauseOrResume();

              case 2:
                isPlaying = _context3.sent;
                setState('state', isPlaying ? 'playing' : 'paused');

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function pauseOrResume() {
        return _ref3.apply(this, arguments);
      };
    }();

    var seek = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(pos) {
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return core.seek(pos);

              case 2:
                if (!_context4.sent) {
                  _context4.next = 4;
                  break;
                }

                updateTime();

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function seek(_x) {
        return _ref4.apply(this, arguments);
      };
    }();

    var updateTerminal = function updateTerminal() {
      var changedLines = core.getChangedLines();

      if (changedLines) {
        changedLines.forEach(function (line, i) {
          setState('lines', i, reconcile(line));
        });
      }

      setState('cursor', reconcile(core.getCursor()));
      setState('cursorHold', true);
      frameRequestId = undefined;
    };

    var terminalSize = createMemo(function () {
      var _props$fit;

      if (!state.charW) {
        return;
      }

      console.debug("containerW = ".concat(state.containerW));
      var terminalW = state.charW * terminalCols() + state.bordersW;
      var terminalH = state.charH * terminalRows() + state.bordersH;
      var fit = (_props$fit = props.fit) !== null && _props$fit !== void 0 ? _props$fit : 'width';

      if (fit === 'both' || state.isFullscreen) {
        var containerRatio = state.containerW / state.containerH;
        var terminalRatio = terminalW / terminalH;

        if (containerRatio > terminalRatio) {
          fit = 'height';
        } else {
          fit = 'width';
        }
      }

      if (fit === false || fit === 'none') {
        return {};
      } else if (fit === 'width') {
        var scale = state.containerW / terminalW;
        return {
          scale: scale,
          width: state.containerW,
          height: terminalH * scale
        };
      } else if (fit === 'height') {
        var _scale = state.containerH / terminalH;

        return {
          scale: _scale,
          width: terminalW * _scale,
          height: state.containerH
        };
      } else {
        throw "unsupported fit mode: ".concat(fit);
      }
    });

    var onFullscreenChange = function onFullscreenChange() {
      var _document$fullscreenE;

      setState('isFullscreen', (_document$fullscreenE = document.fullscreenElement) !== null && _document$fullscreenE !== void 0 ? _document$fullscreenE : document.webkitFullscreenElement);
    };

    var toggleFullscreen = function toggleFullscreen() {
      if (state.isFullscreen) {
        var _ref5, _document$exitFullscr;

        ((_ref5 = (_document$exitFullscr = document.exitFullscreen) !== null && _document$exitFullscr !== void 0 ? _document$exitFullscr : document.webkitExitFullscreen) !== null && _ref5 !== void 0 ? _ref5 : function () {}).apply(document);
      } else {
        var _ref6, _wrapperRef$requestFu;

        ((_ref6 = (_wrapperRef$requestFu = wrapperRef.requestFullscreen) !== null && _wrapperRef$requestFu !== void 0 ? _wrapperRef$requestFu : wrapperRef.webkitRequestFullscreen) !== null && _ref6 !== void 0 ? _ref6 : function () {}).apply(wrapperRef);
      }
    };

    var onKeyPress = function onKeyPress(e) {
      if (e.altKey || e.metaKey || e.ctrlKey) {
        return;
      }

      if (e.shiftKey) {
        if (e.key == 'ArrowLeft') {
          seek('<<<');
        } else if (e.key == 'ArrowRight') {
          seek('>>>');
        } else {
          return;
        }

        e.preventDefault();
        return;
      }

      if (e.key == ' ') {
        pauseOrResume();
      } else if (e.key == 'f') {
        toggleFullscreen();
      } else if (e.key == 'ArrowLeft') {
        seek('<<');
      } else if (e.key == 'ArrowRight') {
        seek('>>');
      } else if (e.key.charCodeAt(0) >= 48 && e.key.charCodeAt(0) <= 57) {
        var pos = (e.key.charCodeAt(0) - 48) / 10;
        seek("".concat(pos * 100, "%"));
      } else {
        return;
      }

      e.preventDefault();
    };

    var wrapperOnMouseMove = function wrapperOnMouseMove() {
      if (state.isFullscreen) {
        showControls(true);
      }
    };

    var playerOnMouseLeave = function playerOnMouseLeave() {
      if (!state.isFullscreen) {
        showControls(false);
      }
    };

    var startTimeUpdates = function startTimeUpdates() {
      timeUpdateIntervalId = setInterval(updateTime, 100);
    };

    var stopTimeUpdates = function stopTimeUpdates() {
      clearInterval(timeUpdateIntervalId);
    };

    var updateTime = function updateTime() {
      var currentTime = core.getCurrentTime();
      var remainingTime = core.getRemainingTime();
      var progress = core.getProgress();
      setState({
        currentTime: currentTime,
        remainingTime: remainingTime,
        progress: progress
      });
    };

    var startBlinking = function startBlinking() {
      blinkIntervalId = setInterval(function () {
        setState(function (state) {
          var changes = {
            blink: !state.blink
          };

          if (changes.blink) {
            changes.cursorHold = false;
          }

          return changes;
        });
      }, 500);
    };

    var stopBlinking = function stopBlinking() {
      clearInterval(blinkIntervalId);
      setState('blink', true);
    };

    var showControls = function showControls(show) {
      clearTimeout(userActivityTimeoutId);

      if (show) {
        userActivityTimeoutId = setTimeout(function () {
          return showControls(false);
        }, 2000);
      }

      setState('showControls', show);
    };

    var playerStyle = function playerStyle() {
      var style = {};

      if ((props.fit === false || props.fit === 'none') && props.fontSize !== undefined) {
        if (props.fontSize === 'small') {
          style['font-size'] = '12px';
        } else if (props.fontSize === 'medium') {
          style['font-size'] = '18px';
        } else if (props.fontSize === 'big') {
          style['font-size'] = '24px';
        } else {
          style['font-size'] = props.fontSize;
        }
      }

      var size = terminalSize();

      if (size === undefined) {
        style['height'] = 0;
        return style;
      }

      if (size.width !== undefined) {
        style['width'] = "".concat(size.width, "px");
        style['height'] = "".concat(size.height, "px");
      }

      return style;
    };

    var playerClass = function playerClass() {
      var _props$theme;

      return "asciinema-player asciinema-theme-".concat((_props$theme = props.theme) !== null && _props$theme !== void 0 ? _props$theme : 'asciinema');
    };

    var terminalScale = function terminalScale() {
      var _terminalSize;

      return (_terminalSize = terminalSize()) === null || _terminalSize === void 0 ? void 0 : _terminalSize.scale;
    };

    return function () {
      var _el$ = _tmpl$.cloneNode(true),
          _el$2 = _el$.firstChild;

      var _ref$ = wrapperRef;
      typeof _ref$ === "function" ? _ref$(_el$) : wrapperRef = _el$;

      _el$.addEventListener("webkitfullscreenchange", onFullscreenChange);

      _el$.addEventListener("fullscreenchange", onFullscreenChange);

      _el$.$$mousemove = wrapperOnMouseMove;
      _el$.$$keydown = onKeyPress;

      _el$.addEventListener("keypress", onKeyPress);

      var _ref$2 = playerRef;
      typeof _ref$2 === "function" ? _ref$2(_el$2) : playerRef = _el$2;

      _el$2.$$mousemove = function () {
        return showControls(true);
      };

      _el$2.addEventListener("mouseleave", playerOnMouseLeave);

      insert(_el$2, createComponent(Terminal, {
        get cols() {
          return terminalCols();
        },

        get rows() {
          return terminalRows();
        },

        get scale() {
          return terminalScale();
        },

        get blink() {
          return state.blink;
        },

        get lines() {
          return state.lines;
        },

        get cursor() {
          return state.cursor;
        },

        get cursorHold() {
          return state.cursorHold;
        },

        ref: function ref(r$) {
          var _ref$3 = terminalRef;
          typeof _ref$3 === "function" ? _ref$3(r$) : terminalRef = r$;
        }
      }), null);

      insert(_el$2, createComponent(ControlBar, {
        get currentTime() {
          return state.currentTime;
        },

        get remainingTime() {
          return state.remainingTime;
        },

        get progress() {
          return state.progress;
        },

        get isPlaying() {
          return state.state == 'playing';
        },

        get isPausable() {
          return state.isPausable;
        },

        get isSeekable() {
          return state.isSeekable;
        },

        onPlayClick: pauseOrResume,
        onFullscreenClick: toggleFullscreen,
        onSeekClick: seek
      }), null);

      insert(_el$2, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return state.state == 'initial' && !autoPlay;
            },

            get children() {
              return createComponent(StartOverlay, {
                onClick: play
              });
            }

          }), createComponent(Match, {
            get when() {
              return state.state == 'waiting';
            },

            get children() {
              return createComponent(LoaderOverlay, {});
            }

          })];
        }

      }), null);

      createRenderEffect(function (_p$) {
        var _v$ = state.showControls,
            _v$2 = playerClass(),
            _v$3 = playerStyle();

        _v$ !== _p$._v$ && _el$.classList.toggle("hud", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && (_el$2.className = _p$._v$2 = _v$2);
        _p$._v$3 = style$1(_el$2, _v$3, _p$._v$3);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined
      });

      return _el$;
    }();
  });

  delegateEvents(["keydown", "mousemove"]);

  // Efficient array transformations without intermediate array objects.
  // Inspired by Clojure's transducers and Elixir's streams.
  var Stream = /*#__PURE__*/function (_Symbol$iterator) {
    function Stream(input, xfs) {
      _classCallCheck(this, Stream);

      this.input = input;
      this.xfs = xfs !== null && xfs !== void 0 ? xfs : [];
    }

    _createClass(Stream, [{
      key: "map",
      value: function map(f) {
        return this.transform(Map$1(f));
      }
    }, {
      key: "flatMap",
      value: function flatMap(f) {
        return this.transform(FlatMap(f));
      }
    }, {
      key: "filter",
      value: function filter(f) {
        return this.transform(Filter(f));
      }
    }, {
      key: "take",
      value: function take(n) {
        return this.transform(Take(n));
      }
    }, {
      key: "drop",
      value: function drop(n) {
        return this.transform(Drop(n));
      }
    }, {
      key: "transform",
      value: function transform(f) {
        return new Stream(this.input, this.xfs.concat([f]));
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return Array.from(this);
      }
    }, {
      key: _Symbol$iterator,
      value: function value() {
        var _this = this;

        var i = 0;
        var v = 0;
        var values = [];
        var flushed = false;
        var xf = compose(this.xfs, function (val) {
          return values.push(val);
        });
        return {
          next: function next() {
            if (v === values.length) {
              values = [];
              v = 0;
            }

            while (values.length === 0 && i < _this.input.length) {
              xf.step(_this.input[i++]);
            }

            if (values.length === 0 && !flushed) {
              xf.flush();
              flushed = true;
            }

            if (values.length > 0) {
              return {
                done: false,
                value: values[v++]
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
      }
    }]);

    return Stream;
  }(Symbol.iterator);

  function Map$1(f) {
    return function (emit) {
      return function (input) {
        emit(f(input));
      };
    };
  }

  function FlatMap(f) {
    return function (emit) {
      return function (input) {
        f(input).forEach(emit);
      };
    };
  }

  function Filter(f) {
    return function (emit) {
      return function (input) {
        if (f(input)) {
          emit(input);
        }
      };
    };
  }

  function Take(n) {
    var c = 0;
    return function (emit) {
      return function (input) {
        if (c < n) {
          emit(input);
        }

        c += 1;
      };
    };
  }

  function Drop(n) {
    var c = 0;
    return function (emit) {
      return function (input) {
        c += 1;

        if (c > n) {
          emit(input);
        }
      };
    };
  }

  function compose(xfs, push) {
    return xfs.reverse().reduce(function (next, curr) {
      var xf = toXf(curr(next.step));
      return {
        step: xf.step,
        flush: function flush() {
          xf.flush();
          next.flush();
        }
      };
    }, toXf(push));
  }

  function toXf(xf) {
    if (typeof xf === 'function') {
      return {
        step: xf,
        flush: function flush() {}
      };
    } else {
      return xf;
    }
  }

  function asciicast(_ref, _ref2, _ref3) {
    var url = _ref.url,
        _ref$fetchOpts = _ref.fetchOpts,
        fetchOpts = _ref$fetchOpts === void 0 ? {} : _ref$fetchOpts;
    var feed = _ref2.feed,
        now = _ref2.now,
        setTimeout = _ref2.setTimeout,
        onFinish = _ref2.onFinish;
    var idleTimeLimit = _ref3.idleTimeLimit,
        startAt = _ref3.startAt;
    var cols;
    var rows;
    var frames;
    var duration;
    var effectiveStartAt;
    var timeoutId;
    var nextFrameIndex = 0;
    var elapsedVirtualTime = 0;
    var startTime;
    var pauseElapsedTime;

    function load() {
      return _load.apply(this, arguments);
    }

    function _load() {
      _load = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var _idleTimeLimit, response, _asciicast, result;

        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (frames) {
                  _context3.next = 18;
                  break;
                }

                _context3.next = 3;
                return fetch(url, fetchOpts);

              case 3:
                response = _context3.sent;

                if (response.ok) {
                  _context3.next = 6;
                  break;
                }

                throw "failed fetching asciicast file: ".concat(response.statusText, " (").concat(response.status, ")");

              case 6:
                _context3.t0 = parseAsciicast;
                _context3.next = 9;
                return response.text();

              case 9:
                _context3.t1 = _context3.sent;
                _asciicast = (0, _context3.t0)(_context3.t1);
                cols = _asciicast.cols;
                rows = _asciicast.rows;
                idleTimeLimit = (_idleTimeLimit = idleTimeLimit) !== null && _idleTimeLimit !== void 0 ? _idleTimeLimit : _asciicast.idleTimeLimit;
                result = prepareFrames(_asciicast.frames, idleTimeLimit, startAt);
                frames = result.frames;
                effectiveStartAt = result.effectiveStartAt;
                duration = frames[frames.length - 1][0];

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _load.apply(this, arguments);
    }

    function scheduleNextFrame() {
      var nextFrame = frames[nextFrameIndex];

      if (nextFrame) {
        var t = nextFrame[0] * 1000;
        var elapsedWallTime = now() - startTime;
        var timeout = t - elapsedWallTime;

        if (timeout < 0) {
          timeout = 0;
        }

        timeoutId = setTimeout(runFrame, timeout);
      } else {
        timeoutId = null;
        pauseElapsedTime = duration * 1000;
        onFinish();
      }
    }

    function runFrame() {
      var frame = frames[nextFrameIndex];
      var elapsedWallTime;

      do {
        feed(frame[1]);
        elapsedVirtualTime = frame[0] * 1000;
        frame = frames[++nextFrameIndex];
        elapsedWallTime = now() - startTime;
      } while (frame && elapsedWallTime > frame[0] * 1000);

      scheduleNextFrame();
    }

    function pause() {
      clearTimeout(timeoutId);
      timeoutId = null;
      pauseElapsedTime = now() - startTime;
    }

    function resume() {
      startTime = now() - pauseElapsedTime;
      pauseElapsedTime = null;
      scheduleNextFrame();
    }

    function _seek(where) {
      var isPlaying = !!timeoutId;

      if (isPlaying) {
        pause();
      }

      if (typeof where === 'string') {
        var _pauseElapsedTime;

        var currentTime = ((_pauseElapsedTime = pauseElapsedTime) !== null && _pauseElapsedTime !== void 0 ? _pauseElapsedTime : 0) / 1000;

        if (where === '<<') {
          where = currentTime - 5;
        } else if (where === '>>') {
          where = currentTime + 5;
        } else if (where === '<<<') {
          where = currentTime - 0.1 * duration;
        } else if (where === '>>>') {
          where = currentTime + 0.1 * duration;
        } else if (where[where.length - 1] === '%') {
          where = parseFloat(where.substring(0, where.length - 1)) / 100 * duration;
        }
      }

      var targetTime = Math.min(Math.max(where, 0), duration) * 1000;

      if (targetTime < elapsedVirtualTime) {
        feed('\x1bc'); // reset terminal

        nextFrameIndex = 0;
        elapsedVirtualTime = 0;
      }

      var frame = frames[nextFrameIndex];

      while (frame && frame[0] * 1000 < targetTime) {
        feed(frame[1]);
        elapsedVirtualTime = frame[0] * 1000;
        frame = frames[++nextFrameIndex];
      }

      pauseElapsedTime = targetTime;

      if (isPlaying) {
        resume();
      }
    }

    function _getPoster(time) {
      var posterTime = time * 1000;
      var poster = [];
      var nextFrameIndex = 0;
      var frame = frames[0];

      while (frame && frame[0] * 1000 < posterTime) {
        poster.push(frame[1]);
        frame = frames[++nextFrameIndex];
      }

      return poster;
    }

    return {
      init: function () {
        var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return load();

                case 2:
                  return _context.abrupt("return", {
                    cols: cols,
                    rows: rows,
                    duration: duration
                  });

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function init() {
          return _init.apply(this, arguments);
        }

        return init;
      }(),
      start: function () {
        var _start = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return load();

                case 2:
                  _seek(effectiveStartAt);

                  resume();

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function start() {
          return _start.apply(this, arguments);
        }

        return start;
      }(),
      stop: function stop() {
        clearTimeout(timeoutId);
      },
      pauseOrResume: function pauseOrResume() {
        if (timeoutId) {
          pause();
          return false;
        } else {
          resume();
          return true;
        }
      },
      seek: function seek(where) {
        return _seek(where);
      },
      getPoster: function getPoster(t) {
        return _getPoster(t);
      },
      getCurrentTime: function getCurrentTime() {
        if (timeoutId) {
          return (now() - startTime) / 1000;
        } else {
          var _pauseElapsedTime2;

          return ((_pauseElapsedTime2 = pauseElapsedTime) !== null && _pauseElapsedTime2 !== void 0 ? _pauseElapsedTime2 : 0) / 1000;
        }
      }
    };
  }

  function parseAsciicast(json) {
    try {
      return parseAsciicastV2(json);
    } catch (_error) {
      // not a v2 format - let's try parsing as v1
      return parseAsciicastV1(json);
    }
  }

  function parseAsciicastV1(json) {
    var asciicast = JSON.parse(json);
    var time = 0;
    var frames = new Stream(asciicast.stdout).map(function (e) {
      time += e[0];
      return [time, e[1]];
    });
    return {
      cols: asciicast.width,
      rows: asciicast.height,
      frames: frames
    };
  }

  function parseAsciicastV2(jsonl) {
    var lines = jsonl.split('\n');
    var header = JSON.parse(lines[0]);

    if (header.version !== 2) {
      throw 'not asciicast v2 format';
    }

    var frames = new Stream(lines).drop(1).filter(function (l) {
      return l[0] === '[';
    }).map(function (l) {
      return JSON.parse(l);
    }).filter(function (e) {
      return e[1] === 'o';
    }).map(function (e) {
      return [e[0], e[2]];
    });
    return {
      cols: header.width,
      rows: header.height,
      idleTimeLimit: header.idle_time_limit,
      frames: frames
    };
  }

  function batchFrames(frames) {
    var maxFrameTime = 1.0 / 60;
    var prevFrame;
    return frames.transform(function (emit) {
      var ic = 0;
      var oc = 0;
      return {
        step: function step(frame) {
          ic++;

          if (prevFrame === undefined) {
            prevFrame = frame;
            return;
          }

          if (frame[0] - prevFrame[0] < maxFrameTime) {
            prevFrame[1] += frame[1];
          } else {
            emit(prevFrame);
            prevFrame = frame;
            oc++;
          }
        },
        flush: function flush() {
          if (prevFrame !== undefined) {
            emit(prevFrame);
            oc++;
          }

          console.debug("batched ".concat(ic, " frames to ").concat(oc, " frames"));
        }
      };
    });
  }

  function prepareFrames(frames) {
    var idleTimeLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
    var startAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var prevT = 0;
    var shift = 0;
    var effectiveStartAt = startAt;
    var fs = Array.from(batchFrames(frames).map(function (e) {
      var delay = e[0] - prevT;
      var delta = delay - idleTimeLimit;
      prevT = e[0];

      if (delta > 0) {
        shift += delta;

        if (e[0] < startAt) {
          effectiveStartAt -= delta;
        }
      }

      return [e[0] - shift, e[1]];
    }));
    return {
      frames: fs,
      effectiveStartAt: effectiveStartAt
    };
  }

  function test(_ref, callbacks, opts) {
    var kind = _ref.kind;

    if (kind == 'random') {
      return random(callbacks);
    } else if (kind == 'clock') {
      return clock(callbacks, opts);
    }
  }

  function random(_ref2) {
    var feed = _ref2.feed,
        setTimeout = _ref2.setTimeout;
    var base = ' '.charCodeAt(0);
    var range = '~'.charCodeAt(0) - base;
    var timeoutId;

    var schedule = function schedule() {
      var t = Math.pow(5, Math.random() * 4);
      timeoutId = setTimeout(print, t);
    };

    var print = function print() {
      schedule();
      var char = String.fromCharCode(base + Math.floor(Math.random() * range));
      feed(char);
    };

    return function () {
      schedule();
      return function () {
        return clearInterval(timeoutId);
      };
    };
  }

  function clock(_ref3, _ref4) {
    var feed = _ref3.feed;
    var _ref4$cols = _ref4.cols,
        cols = _ref4$cols === void 0 ? 5 : _ref4$cols,
        _ref4$rows = _ref4.rows,
        rows = _ref4$rows === void 0 ? 1 : _ref4$rows;
    var middleRow = Math.floor(rows / 2);
    var leftPad = Math.floor(cols / 2) - 2;
    var intervalId;
    return {
      cols: cols,
      rows: rows,
      duration: 24 * 60,
      start: function start() {
        setTimeout(function () {
          feed("\x1B[?25l\x1B[1m\x1B[".concat(middleRow, "B"));
        }, 0);
        intervalId = setInterval(function () {
          var d = new Date();
          var h = d.getHours();
          var m = d.getMinutes();
          feed('\r');

          for (var i = 0; i < leftPad; i++) {
            feed(' ');
          }

          feed('\x1b[32m');

          if (h < 10) {
            feed('0');
          }

          feed("".concat(h));
          feed('\x1b[39;5m:\x1b[25;35m');

          if (m < 10) {
            feed('0');
          }

          feed("".concat(m));
        }, 1000);
      },
      stop: function stop() {
        clearInterval(intervalId);
      },
      getCurrentTime: function getCurrentTime() {
        var d = new Date();
        return d.getHours() * 60 + d.getMinutes();
      }
    };
  }

  var Queue = /*#__PURE__*/function () {
    function Queue() {
      _classCallCheck(this, Queue);

      this.first = undefined;
      this.last = undefined;
      this.onPush = undefined;
    }

    _createClass(Queue, [{
      key: "push",
      value: function push(item) {
        var node = {
          item: item
        };

        if (this.last !== undefined) {
          this.last = this.last.next = node;
        } else {
          this.last = this.first = node;
        }

        if (this.onPush) {
          this.onPush(this.pop());
          this.onPush = undefined;
        }
      }
    }, {
      key: "pop",
      value: function pop() {
        var node = this.first;

        if (node !== undefined) {
          this.first = node.next;

          if (this.first === undefined) {
            this.last = undefined;
          }

          return node.item;
        } else {
          var thiz = this;
          return new Promise(function (resolve) {
            thiz.onPush = resolve;
          });
        }
      }
    }, {
      key: "forEach",
      value: function forEach(f) {
        var _this = this;

        var stop = false;

        var go = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
            var item;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    item = _this.pop();

                  case 1:
                    if (!(_typeof(item) !== 'object' || typeof item.then !== 'function')) {
                      _context.next = 9;
                      break;
                    }

                    if (!stop) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return");

                  case 4:
                    _context.next = 6;
                    return f(item);

                  case 6:
                    item = _this.pop();
                    _context.next = 1;
                    break;

                  case 9:
                    _context.next = 11;
                    return item;

                  case 11:
                    item = _context.sent;

                    if (!stop) {
                      _context.next = 14;
                      break;
                    }

                    return _context.abrupt("return");

                  case 14:
                    _context.next = 16;
                    return f(item);

                  case 16:
                    go();

                  case 17:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function go() {
            return _ref.apply(this, arguments);
          };
        }();

        setTimeout(go, 0);
        return function () {
          stop = true;
        };
      }
    }]);

    return Queue;
  }();

  function buffer(feed, bufferTime) {
    var events = new Queue();
    var startTime;
    var stopFeeding = events.forEach( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
        var elapsedWallTime, elapsedStreamTime;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                elapsedWallTime = now() - startTime;
                elapsedStreamTime = (event[0] + bufferTime) * 1000;

                if (!(elapsedStreamTime > elapsedWallTime)) {
                  _context.next = 5;
                  break;
                }

                _context.next = 5;
                return sleep(elapsedStreamTime - elapsedWallTime);

              case 5:
                feed(event[2]);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    return {
      pushEvent: function pushEvent(event) {
        if (startTime === undefined) {
          startTime = now();
        }

        if (event[1] != 'o') return;
        events.push(event);
      },
      pushText: function pushText(text) {
        if (startTime === undefined) {
          startTime = now();
        }

        var time = (now() - startTime) / 1000;
        events.push([time, 'o', text]);
      },
      stop: function stop() {
        stopFeeding();
      }
    };
  }

  function now() {
    return new Date().getTime();
  }

  function sleep(t) {
    return new Promise(function (resolve) {
      setTimeout(resolve, t);
    });
  }

  function websocket(_ref, _ref2) {
    var url = _ref.url,
        _ref$bufferTime = _ref.bufferTime,
        bufferTime = _ref$bufferTime === void 0 ? 0 : _ref$bufferTime;
    var feed = _ref2.feed,
        reset = _ref2.reset;
    var utfDecoder = new TextDecoder();
    var socket;
    var buf;
    var reconnectDelay = 250;
    var _stop = false;

    function initBuffer() {
      if (buf !== undefined) buf.stop();
      buf = buffer(feed, bufferTime);
    }

    function connect() {
      socket = new WebSocket(url);
      socket.binaryType = 'arraybuffer';

      socket.onopen = function () {
        console.debug('websocket: opened');
        initBuffer();
        reconnectDelay = 250;
      };

      socket.onmessage = function (event) {
        if (typeof event.data === 'string') {
          var e = JSON.parse(event.data);

          if (e.cols !== undefined || e.width !== undefined) {
            var _e$cols, _e$rows;

            initBuffer();
            reset((_e$cols = e.cols) !== null && _e$cols !== void 0 ? _e$cols : e.width, (_e$rows = e.rows) !== null && _e$rows !== void 0 ? _e$rows : e.height);
          } else {
            buf.pushEvent(e);
          }
        } else {
          buf.pushText(utfDecoder.decode(event.data));
        }
      };

      socket.onclose = function (event) {
        if (_stop || event.wasClean) {
          console.debug('websocket: closed');
        } else {
          console.debug("websocket: unclean close, reconnecting in ".concat(reconnectDelay, "..."));
          setTimeout(connect, reconnectDelay);
          reconnectDelay = Math.min(reconnectDelay * 2, 5000);
        }
      };
    }

    return {
      start: function start() {
        connect();
      },
      stop: function stop() {
        _stop = true;
        if (buf !== undefined) buf.stop();
        if (socket !== undefined) socket.close();
      }
    };
  }

  function eventsource(_ref, _ref2) {
    var url = _ref.url,
        _ref$bufferTime = _ref.bufferTime,
        bufferTime = _ref$bufferTime === void 0 ? 0 : _ref$bufferTime;
    var feed = _ref2.feed,
        reset = _ref2.reset;
    var es;
    var buf;

    function initBuffer() {
      if (buf !== undefined) buf.stop();
      buf = buffer(feed, bufferTime);
    }

    return {
      start: function start() {
        es = new EventSource(url);
        es.addEventListener('open', function () {
          console.debug('eventsource: opened');
          initBuffer();
        });
        es.addEventListener('message', function (event) {
          var e = JSON.parse(event.data);

          if (e.cols !== undefined || e.width !== undefined) {
            var _e$cols, _e$rows;

            initBuffer();
            reset((_e$cols = e.cols) !== null && _e$cols !== void 0 ? _e$cols : e.width, (_e$rows = e.rows) !== null && _e$rows !== void 0 ? _e$rows : e.height);
          } else {
            buf.pushEvent(e);
          }
        });
        es.addEventListener('done', function () {
          console.debug('eventsource: closed');
          es.close();
        });
      },
      stop: function stop() {
        if (buf !== undefined) buf.stop();
        if (es !== undefined) es.close();
      }
    };
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function create(src, elem) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var props = _objectSpread({
      driverFn: getDriver(src)
    }, opts);

    var el;
    var dispose = render(function () {
      el = createComponent(Player, props);
      return el;
    }, elem);
    return {
      el: el,
      dispose: dispose
    };
  }

  function getDriver(src) {
    if (typeof src === 'string') {
      if (src.substring(0, 5) == 'ws://' || src.substring(0, 6) == 'wss://') {
        src = {
          driver: 'websocket',
          url: src
        };
      } else if (src.substring(0, 7) == 'test://') {
        src = {
          driver: 'test',
          kind: src.substring(7)
        };
      } else {
        src = {
          driver: 'asciicast',
          url: src
        };
      }
    }

    if (src.driver === undefined) {
      src.driver = 'asciicast';
    }

    var drivers = new Map([['asciicast', asciicast], ['websocket', websocket], ['eventsource', eventsource], ['test', test]]);

    if (typeof src === 'function') {
      return src;
    } else if (drivers.has(src.driver)) {
      var driver = drivers.get(src.driver);
      return function (callbacks, opts) {
        return driver(src, callbacks, opts);
      };
    } else {
      throw "unsupported driver: ".concat(JSON.stringify(src));
    }
  }

  exports.create = create;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
