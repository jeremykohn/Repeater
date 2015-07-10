// Copyright 2015 Jeremy Kohn. 
// License: MIT

// Version 0.1

var Repeater = (function(window, document, undefined) {

	// First, normalize timestamp function so it always returns the number of milliseconds since page/module loaded.
	// Use performance.now if available, otherwise use less precise and/or less accurate substitutes.	
	
	// Initial timestamp. Time when module initially loaded.
	var moduleLoadedAt = new Date().getTime();
	
	var timeNow;
	
	if (window.performance) {
		// IE 10+, Safari 8+, and all other modern browsers. https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
		timeNow = performance.now;
	} else if (performanceTiming) {
		// IE 9+, and older versions of other browsers except Safari. https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
		timeNow = function() {
			return new Date().getTime() - peformanceTiming.navigationStart;
		}
	} else {
		// IE 8 and lower. 
		// There's an offset, since moduleLoadedAt is slightly later than performanceTiming.navigationStart.
		// Though practically it won't make much difference if only dealing with relative times.
		timeNow = function() {
			return new Date().getTime() - moduleLoadedAt;
		}
	}
	
	// Other helper functions
	
	function addDefaults(params) {
		var newParams = {};
		
		newParams.normalDelay = params.normalDelay || 0;
		// etc.
		
		return newParams;
	}

	function validateParams(paramsObject) {
		var valid = true;
		
		if (paramsObject.functionToRepeat === undefined) {
			console.log('You must specify a function to repeat.');
			valid = false;
		} else if (typeof paramsObject.functionToRepeat === 'function') {
			console.log('functionToRepeat must be a function.');
			valid = false;
		}
		
		if (!isInteger(paramsObject.normalDelay)) {
			console.log('The delay (in milliseconds) must be an integer.');
			valid = false;
		}
		
		// Remember, the additional arguments are optional.
		if (additionalArguments !== undefined) {
			if (Array.isArray(additionalArguments) === false) {
				console.log('Additional arguments must be in the form of an array.');
			}
		}
		// That might never happen, though -- argumentsArrayToParams should already have made it an array.
		
		// etc.
		
		return valid;
	}
	
	function argumentsToParams(argumentsArray) {
		var params = {};
		if (typeof argumentsArray[0] === 'function') {
			// Syntax: createInterval(function[, delay[, list, of, additional, arguments]]);
			params.functionToRepeat = argumentsArray[0];
			if (argumentsArray.length >= 1) {
				params.normalDelay = argumentsArray[1];
			}
			if (argumentsArray.length >= 2){
				params.additionalArguments = argumentsArray.slice(2);
			}
		} else if (argumentsArray.length === 1 && typeof argumentsArray === 'object') {
			// Syntax: createInterval({functionToRepeat: myFunc, delay: 1000, additionalArguments: [list, of, additional, arguments});
			// With this syntax, createInterval takes only one argument -- an object that specifies all the parameters. 
			// So just copy that object.
			params = argumentsArray[0];
		} else {
          console.log('Need a function to start.');
          console.log('Right now the arguments array is ' + argumentsArray);
        }

        return params;
    }
	
		function simpleRepeat(functionToRepeat, delay) {
			functionToRepeat();	
			window.setTimeout(function(){simpleRepeat(functionToRepeat, delay);}, delay);
		}
		
		function repeatNumberOfTimes(functionToRepeat, delay, repeatsRemaining) {
			functionToRepeat();
			if (--repeatsRemaining > 0) {	
				window.setTimeout(function(){repeatNumberOfTimes(functionToRepeat, delay, repeatsRemaining);}, delay);
			}
		}
	
	
	////////////////
	
	// Main function to return. 
	// For now, just takes two parameters.
	// Final API for basic version will be createInterval(func, delay, other, arguments, for, function)
	// API for advanced version will be createInterval({functionToRepeat: func, normalDelay: delay, argumentsForFunction: [arguments, for, function]})
	// with other parameters as well.
	
	function createInterval(func, delay) {
		var intervalRunner = {};
		var functionToRepeat = func;
		var normalDelay = delay;
		
		var startTime;
		var nextScheduledTime;
		var adjustedDelay;
		
		var elapsedTime = 0;
		
		var running = false;
		
		console.log('Create interval.');
		
		function simpleRepeat() {
			console.log('Check if running.');
			if (running) {
				console.log('Still running.');
				functionToRepeat();
				console.log('Function repeated.');
				window.setTimeout(functionToRepeat, delay);
				// In more advanced repeat, adjust delay.
			}
		}
		
		function repeat() {
			if (running) {
				// Also if time limit hasn't passed (or won't be passed by elapsedTime += delay)
				// Also if max repeats aren't used up (or won't be sued up by elapsed repeats += 1)
				
				console.log('Repeat.');
				
				functionToRepeat();
				nextScheduledTime += normalDelay;
				// Check if nextScheduledTime > timeLimit
				adjustedDelay = nextScheduledTime - timeNow()
				
				window.setTimeout(repeat, adjustedDelay);
			}
		}
		
		
		function startRepeating() {
			console.log('Start.');
			running = true;
			console.log('Running. Running equals ' + running);
			startTime = timeNow();
			console.log('Start time is ' + startTime);
			window.setTimeout(simpleRepeat, normalDelay); // Change to repeat, adjustedDelay later
		}
		
		
		function reset() {
			console.log('Reset.');
			running = false;
			console.log('Not running. Running equals ' + running);
			startTime = undefined;
			nextScheduledTime = undefined;
			elapsedTime = 0;
			// Reset start time, elapsed time, etc.
		}
		
		return {
			start: startRepeating,
			reset: reset
			// Also getters for functionToRepeat, normalDelay, timeLimit, other params
			// Also startTime, nextScheduledTime, elapsedTime, etc.
			// Also setters / modifiers?
		}
		
	}
	
	
	function createTimeout(func, delay) {
		var timeoutRunner;
		var params = {};
		
		params.functionToRepeat = func;
		params.normalDelay = delay;
		// params.argumentsForFunction = (all arguments after the first two)

		params.maxRepeats = 1;
		
		timeoutRunner = createInterval(params);
		
		return timeoutRunner;
	}
	
	return {
		simpleRepeat: simpleRepeat,
		repeatNumberOfTimes: repeatNumberOfTimes,
		
		createInterval: createInterval,
		createTimeout: createTimeout
	}
	
}(window, document));