// Copyright 2015 Jeremy Kohn. 
// License: MIT

// Version 0.2

var Repeater = (function(window, document, undefined) {

	// First, normalize timestamp function so it always returns the number of milliseconds since page/module loaded.
	// Use performance.now if available, otherwise use less precise and/or less accurate substitutes.	
	
	// Initial timestamp. Time when module initially loaded.
	var moduleLoadedAt = new Date().getTime();
	
	var timeNow = function() {
		return performance.now();
	};
	// Or new Date().getTime() if performance isn't available
	
	
	/* 
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
	
	*/
	
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
		// var intervalRunner = {};
		var functionToRepeat = func;
		var normalDelay = parseFloat(delay);
		console.log('Delay is ' + delay + ' and its type is ' + typeof delay);
		console.log('Normal delay is ' + normalDelay + ' and its type is ' + typeof normalDelay);
		
		var startTime, timeLastUpdated, nextScheduledTime, adjustedDelay, timeUntilNext;
		
		var elapsedTime = 0;
		var running = false;
		
		console.log('Create interval.');
		
		function updateElapsedTime() {
			var now = timeNow();
			elapsedTime += now - timeLastUpdated;
			timeLastUpdated = now;
			// Though when paused, set timeLastUpdated to resume-time, not pause-time.
		}
		
		function getElapsedTime() {
			updateElapsedTime();
			return elapsedTime;
		}
		
		
		function justRepeat() {
			console.log('Check if running.');
			if (running) {
				console.log('Still running.');
				functionToRepeat();
				console.log('Function repeated.');
				window.setTimeout(justRepeat, delay);
				// In more advanced repeat, adjust delay.
			}
		}
		
		function repeat() {
			console.log("Still running?");
			if (running) {
				console.log('Still running. Repeat.');

				// Later, stop if maxRepeats are already reached				
				// Later, check if nextScheduledTime > timeLimit
				
				functionToRepeat();
				
				nextScheduledTime += normalDelay; // Next, replace with 'calculate next scheduled time' function

				adjustedDelay = nextScheduledTime - timeNow();
				updateElapsedTime();

				console.log(normalDelay);
				console.log('It is now ' + timeNow());				
				console.log('Elapsed time so far is ' + elapsedTime);
				console.log('Next scheduled time is ' + nextScheduledTime);
				console.log('Adjusted delay is ' + adjustedDelay);
				
				window.setTimeout(repeat, adjustedDelay);
			} else {
				console.log('No.');
			}
		}
		
		
		function startRepeating() {
			console.log('Start.');
			running = true;
			console.log('Running. Running equals ' + running);
			startTime = timeNow();
			timeLastUpdated = startTime;
			nextScheduledTime = startTime + normalDelay;
			console.log('Start time is ' + startTime);
			window.setTimeout(repeat, normalDelay); // Change to repeat, adjustedDelay later
		}
		
		
		function pauseRepeating() {
			console.log('Pause.');
			running = false;
			updateElapsedTime();
			console.log('Elapsed time = ' + elapsedTime);
			adjustedDelay = nextScheduledTime - timeNow();
			console.log('Adjusted delay after resume will be ' + adjustedDelay);
		}
		
		function resumeRepeating() {
			// if status === 'paused'
			console.log('Resume.');
			var now = timeNow();
			timeLastUpdated = now;
			console.log('Last updated at ' + timeLastUpdated);
			console.log('Elapsed time is ' + elapsedTime + ', should be the same as earlier.');
			nextScheduledTime = now + adjustedDelay;
			running = true;
			window.setTimeout(repeat, adjustedDelay);
			
			// else, 'The repeater can't be resumed because it isn't paused.'

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
			pause: pauseRepeating,
			resume: resumeRepeating,
			reset: reset,
			elapsedTime: elapsedTime
			
			// Also getters for functionToRepeat, normalDelay, timeLimit, other params
			// Also startTime, nextScheduledTime, elapsedTime, etc.
			// Also setters / modifiers?
		};
		
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
	};
	
}(window, document));