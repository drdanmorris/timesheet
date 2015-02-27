Function.prototype.curry = function () {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function () {
        return fn.apply(this, args.concat(
          Array.prototype.slice.call(arguments)));
    };
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {

            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

if (!String.prototype.capitalise) {
    String.prototype.capitalise = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}
if (!String.prototype.capitalize) {
    String.prototype.capitalize = String.prototype.capitalise;
}
if (!String.prototype.capitaliseWords) {
    String.prototype.capitaliseWords = function () {
        var capitalised = '';
        _.each(this.replace(/\s+/g, ' ').split(' '), function(word){
            capitalised += word[0].toUpperCase() + word.slice(1) + ' ';
        });
        return capitalised.trim();
    }
}



function capitalise(s) {
                
            }

Math.log10 = Math.log10 || function log10(x) { return Math.log(x) / Math.LN10; };

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
    (function () {
        'use strict'; // needed to support `apply`/`call` with `undefined`/`null`        

        defineStringProperty("startsWith", function (search) {
            if (this == null) {
                throw TypeError();
            }
            var string = String(this);
            if (search && {}.toString.call(search) == '[object RegExp]') {
                throw TypeError();
            }
            var stringLength = string.length;
            var searchString = String(search);
            var searchLength = searchString.length;
            var position = arguments.length > 1 ? arguments[1] : undefined;
            // `ToInteger`
            var pos = position ? Number(position) : 0;
            if (pos != pos) { // better `isNaN`
                pos = 0;
            }
            var start = Math.min(Math.max(pos, 0), stringLength);
            // Avoid the `indexOf` call if no match is possible
            if (searchLength + start > stringLength) {
                return false;
            }
            var index = -1;
            while (++index < searchLength) {
                if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                    return false;
                }
            }
            return true;
        });
    }());
}

// 'the {0} brown fox'.format('quick')
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
};


// 'the {{name}} brown fox'.formatHandlebars({name: 'quick'})
if (!String.prototype.formatHandlebars) {
    String.prototype.formatHandlebars = function () {
        var ctx = arguments[0];
        return this.replace(/{{(\w+)}}/g, function (match, number) {
            match = match.replace(/[{}]/g, '');
            return typeof ctx[match] != 'undefined' ? ctx[match] : match;
        });
    };
}

function defineStringProperty(propertyName, fn) {
    if (!String.prototype[propertyName]) {
        var defineProperty = (function () {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch (error) { }
            return result;
        }());

        if (defineProperty) {
            defineProperty(String.prototype, propertyName, {
                'value': fn,
                'configurable': true,
                'writable': true
            });
        } else {
            String.prototype[propertyName] = fn;
        }
    }
}


// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
defineStringProperty('endsWith', function (searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
});

defineStringProperty('endWith', function (appendString) {
    if (!this.endsWith(appendString)) {
        return this + appendString;
    }
    return this;
});

if (!Function.prototype.inheritsFrom) {
    Function.prototype.inheritsFrom = function (parentClassOrObject) {
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype || parentClassOrObject;
        return this;
    }
}

if (!String.prototype.padRight) {
    String.prototype.padRight = function (requiredLength, c) {
        return this + Array(requiredLength - this.length + 1).join(c || ' ');
    }
}


// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && ! k in t) {
        k++; 
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}


// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some
// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}


if (!String.prototype.contains) {
  String.prototype.contains = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

