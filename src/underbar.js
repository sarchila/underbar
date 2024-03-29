/*jshint eqnull:true, expr:true*/

var _ = { };

(function() {

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    if(arguments.length==1){
      return array[0];
    } else {
      return array.slice(0,n);
    }
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if(arguments.length==1){
      return array[array.length-1];
    } else if (n > 0) {
      return array.slice(-n);
    } else {
      return [];
    }
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  _.each = function(collection, iterator) {
    // for both arrays and objects, Object.keys returns keys that can
    // be used to return paired values. For arrays, each key is simply
    // a string containing the index. -SA
    var keyArray = Object.keys(collection);
    var keyNum = keyArray.length;
    for(var i = 0 ; i < keyNum ; i++){
      iterator(collection[keyArray[i]],keyArray[i],collection);
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var matches = [];
    _.each(array,function(elem, ind){
      if (elem == target){
        matches.push(parseInt(ind));
      }
    });

    if (matches.length < 1){
      return -1;
    } else {
      return _.first(matches);
    }
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, iterator) {
    if (Array.isArray(collection)){
      var filtered = [];
      _.each(collection,function(element){
        if (iterator(element)){
          filtered.push(element);
        }
      })
      return filtered;
    }
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, iterator) {
    // TIP: see if you can re-use _.select() here, without simply
    // copying code in and modifying it
    var oppositeIterator = function(arg){
      return !iterator(arg);
    }
    return _.filter(collection,oppositeIterator);
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    if (Array.isArray(array)){
      var uniqueArray = [];
      _.each(array, function(elem){
        if(_.indexOf(uniqueArray,elem) === -1){
          uniqueArray.push(elem);
        }
      });
      return uniqueArray;
    }
  };


  // Return the results of applying an iterator to each element.
  _.map = function(array, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var outArray = [];
    _.each(array,function(elem){
      outArray.push(iterator(elem));
    });
    return outArray;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(array, propertyName) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(array, function(value){
      return value[propertyName];
    });
  };

  // Calls the method named by methodName on each value in the list.
  _.invoke = function(list, methodName, args) {
    
    var methodApplied = [];

    _.each(list, function(elem){
      if (typeof methodName === 'string'){
        methodApplied.push(elem[methodName](args));
      } else if (typeof methodName === 'function') {
        methodApplied.push(methodName.apply(elem, args));
      };
    });
    return methodApplied;
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  //
  // You can pass in an initialValue that is passed to the first iterator
  // call. Defaults to 0.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //
  _.reduce = function(collection, iterator, initialValue) {
    if (arguments.length <= 2){
      initialValue = 0;
    };
    var seed = initialValue;
    _.each(collection, function(elem){
      seed = iterator(seed, elem);
    });
    return seed;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if(wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
    var argNo = arguments.length;
    
    return _.reduce(collection,function(allMatch, item){
      if (!allMatch){
        return false;
      } else if (argNo<2){
        return Boolean(item);
      } else {
        return Boolean(iterator(item));
      }
    },true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    var isFalse = function(item){
      return !item;
    }
    var oppositeIterator = function(arg){
      return !iterator(arg);
    }
    if (arguments.length < 2){
      return !_.every(collection, isFalse);
    } else {
      return !_.every(collection, oppositeIterator);
    }
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    _.each(arguments,function(eachObj){
      _.each(eachObj,function(value,key){
        obj[key] = value;  
      });
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    _.each(arguments,function(eachObj){
      _.each(eachObj,function(value,key){
        if (!(key in obj)){
          obj[key] = value;
        }
      });
    });
    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;
    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function(){
      if(!alreadyCalled){
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // Memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var memo = {};
    var result;
    var argPrim;

    return function(){
      argPrim = _.first(arguments);
      if(argPrim in memo){
        result = memo[argPrim];
      } else {
        result = func.apply(this, arguments);
        memo[argPrim] = result;
      }
      return result;
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments,2);
    return setTimeout(function(){func.apply(this,args);},wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Shuffle an array.
  _.shuffle = function(array) {

    var unshuffledArray = array.slice();
    var shuffledArray = [];
    var randInd;
    
    for (var j = 0; j < array.length; j++){
      randInd = Math.floor(unshuffledArray.length*Math.random());
      shuffledArray.push(unshuffledArray[randInd]);
      unshuffledArray.splice(randInd, 1);
    }
    return shuffledArray;
  };


  /**
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */


  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    if (typeof iterator === 'string'){
      return collection.sort(function(a,b){
        if (b[iterator] === undefined || a[iterator] < b[iterator]){
          return -1;
        } else if (a[iterator] === undefined || b[iterator] < a[iterator]){
          return 1;
        } else {
          return 0;
        }
      });
    } else if (typeof iterator === 'function'){
      return collection.sort(function (a, b) {
        if (iterator(b) === undefined || iterator(a) < iterator(b)){
          return -1;
        } else if (iterator(a) === undefined || iterator(b) < iterator(a)){
          return 1;
        } else {
          return 0;
        }
      });
    }
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    // initializing multidimensional array, "result"
    var longestArrayLength = _.reduce(arguments, function(longestLength, arg){
      if (longestLength < arg.length){
        longestLength = arg.length;
      }
      return longestLength
    },0);
    var args = arguments;
    var result = new Array(longestArrayLength);

    // fill result array with values from the _.zip arguments
    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < args.length; j++) {
        result[i] = result[i] || [];
        result[i][j] = args[j][i];
      };
    };
    return result;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var result = result || [];

    if (Array.isArray(nestedArray)){
      _.each(nestedArray, function (elem){
        _.flatten(elem, result);
      });
    } else {
      result.push(nestedArray);
    }

    return result;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var result = [];
    var args = arguments;
    
    // No sense in traversing a gigantic array if one is passed in.
    // Save time/resources by finding the shortest argument first
    var shortestArg = _.reduce(arguments, function(shortest, arg){
      if (shortest.length > arg.length){
        shortest = arg;
      }
      return shortest;
    },arguments[0]);

    // function that returns true if every array
    // passed in contains the target element
    var everyContains = function (arrays, target){
      return _.every(arrays,function(elem){
        return _.contains(elem,target);
      });
    }

    // grabs each element from the shortest argument
    // array and checks if every array passed in
    // initially contains that element.  If so, it is
    // added to the result array
    _.each(shortestArg, function(elem){
      if(everyContains(args,elem)){
        result.push(elem);
      }
    });

    // looks like the native underscore intersection
    // method returns a sorted array, so I'm sorting it
    return result.sort(function(a,b){
      if (a < b){
        return -1;
      } else if (b < a){
        return 1;
      } else {
        return 0;
      }
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var result = [];
    var otherArgs = Array.prototype.slice.call(arguments, 1);

    var noneContain = function (arrays, target){
      return _.every(arrays,function(elem){
        return !_.contains(elem,target);
      });
    };

    _.each(array, function(elem){
      if(noneContain(otherArgs,elem)){
        result.push(elem);
      }
    });
    return result;
  };


  /**
   * MEGA EXTRA CREDIT
   * =================
   */

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See the Underbar readme for details.
  _.throttle = function(func, wait) {
    var timeAround = 0;
    var firstTimemsec;
    var result;

    return function(){
      var thisTimemsec = new Date().getTime();
      // console.log("gone around " + timeAround + " time(s) before");
      if (timeAround===0){
        firstTimemsec = thisTimemsec;
        // console.log("Went down firstTime branch.  Time between calls was " + (thisTimemsec - firstTimemsec) + " msec");
        result = func.apply(this, arguments);
        // console.log("function applied!  Now counter = " + result);
      } else if ((thisTimemsec - firstTimemsec) < wait && timeAround===1){
        var timeSinceFirst = (thisTimemsec - firstTimemsec);
        var timeLeft = wait - timeSinceFirst;
        // console.log("Went down secondTime branch.  Time between calls was " + timeSinceFirst + " msec");
        // console.log("   Time left is " + timeLeft + " msec");
        setTimeout(function(){
          var afterTimeoutmsec = new Date().getTime();
          result = func.apply(this, arguments);
          // console.log(".......((Time since first call is " + (afterTimeoutmsec - firstTimemsec) + " msec");
            firstTimemsec = afterTimeoutmsec;
          timeAround = 1;
          // console.log("function applied!  Now counter = " + result + "))");
          // console.log("----------------------------------------");
        },timeLeft);
      } else if ((thisTimemsec - firstTimemsec) >= wait) {
        // console.log("Went down third branch.  Time between calls was " + (thisTimemsec - firstTimemsec) + " msec");
        timeAround = 0;
        result = func.apply(this, arguments);
        // console.log("function applied!  Now counter = " + result);
      }
      // console.log("returned result is: " + result);
      timeAround++;
      // console.log("----------------------------------------");
      return result;
    };
  };

}).call(this);
