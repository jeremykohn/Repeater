// Copyright 2015 Jeremy Kohn. 
// License: MIT

// Version 0.3

var Repeater = (function(window, document, undefined) {

	// First, normalize timestamp function so it always returns the number of milliseconds since page/module loaded.
	// Use performance.now if available, otherwise use less precise and/or less accurate substitutes.	
	
	function defineTimeNow() {
		var timeNowFunction;

		if (window.performance && window.performance.now) {
			timeNowFunction = function() {
				return window.performance.now();
				// Or, create an alias for performance.now, so don't need to define a new function?
			};
		} else if (Date.now) {
			timeNowFunction = function timeNowFunction() {
				return Date.now();
			};
		} else {
			timeNowFunction = function timeNowFunction() {
				return new Date().getTime();
			};
		}

		return timeNowFunction;
	}
	
	
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
	
	// Default parameters, in case user doesn't specify them.
	// Put in closure so they can't be changed elsewhere in module.

	// (Allow user to override default params?)

	function defaultParams() {
		var defaultFunction = function defaultFunction() {
			console.log("Repeater.js error: No function specified.");
		};
		
		var defaults = {
			functionToRepeat: defaultFunction,
			delay: 0,
			argsArray: [],
			maxRepeats: null,
			timeLimit: null,
			runFirst: false
		};
		
		return defaults;
	}
	// Test.
	// console.log(defaultParams());

	function addDefaults(params, defaults) {
		console.log(defaults);
		console.log(params);
		var keys = Object.keys(defaults);
		console.log("Keys are " + keys);
		keys.forEach(function(key) {
			console.log("Key is " + key);
			if (typeof params[key] === 'undefined') {
				params[key] = defaults[key];
			}
			console.log(defaults[key]);
			console.log(params[key]);
		});
		return params;
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
	// Rewrite this with params.
	// Also with single object to keep track of state?
	function createInterval(func, delay) {
		// var intervalRunner = {};
		var functionToRepeat = func;
		var normalDelay = parseFloat(delay);
		console.log('Delay is ' + delay + ' and its type is ' + typeof delay);
		console.log('Normal delay is ' + normalDelay + ' and its type is ' + typeof normalDelay);
		
		var startTime, timeLastUpdated, nextScheduledTime, adjustedDelay, timeUntilNext;
		
		var elapsedTime = 0;
		var runningState = 'stopped';
		
		console.log('Create interval.');


		var timeNow = defineTimeNow();
		// Either performance.now, Date.now, or new Date().getTime() depending on what's available.
		// Or, var timeNow = performance.now if available, otherwise polyfill?

		
		function updateElapsedTime() {
			var now = timeNow();
			elapsedTime += now - timeLastUpdated; // Change to 'now - startTime - totalPausedTime'
			timeLastUpdated = now;
			// Though when paused, set timeLastUpdated to resume-time, not pause-time.
		}
		
		function getElapsedTime() {
			updateElapsedTime();
			return elapsedTime;
		}
		
		function repeat() {
			console.log("Still running?");
			if (runningState === 'running') {
				console.log('Yes. Repeat.');

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
				console.log('No. Stop repeating.');
			}
		}
		
		
		function startRepeating() {
			if (runningState === 'stopped') {
				console.log('Start.');
				runningState = 'running';
				console.log('Running. Running state equals ' + runningState);
				startTime = timeNow();
				timeLastUpdated = startTime;
				nextScheduledTime = startTime + normalDelay;
				console.log('Start time is ' + startTime);
				console.log('Next scheduled time is ' + nextScheduledTime);
				window.setTimeout(repeat, nextScheduledTime - startTime); // Change to repeat, adjustedDelay later
			} else {
				console.log("Not ready to start.");
			}
		}
		
		
		function pauseRepeating() {
			if (runningState === 'running') {
				console.log('Pause.');
				runningState = 'paused';
				updateElapsedTime();
				console.log('Elapsed time = ' + elapsedTime);
				adjustedDelay = nextScheduledTime - timeNow();
				console.log('Adjusted delay after resume will be ' + adjustedDelay);
			} else {
				console.log("Not running, so can't be paused.");
			}
			
		}
		
		function resumeRepeating() {
			if (runningState === 'paused') {
				console.log('Resume.');
				var now = timeNow();
				timeLastUpdated = now;
				console.log('Last updated at ' + timeLastUpdated);
				console.log('Elapsed time is ' + elapsedTime + ', should be the same as earlier.');
				nextScheduledTime = now + adjustedDelay;
				runningState = 'running';
				window.setTimeout(repeat, adjustedDelay);
			} else{
				console.log('Not paused, so cannot be resumed.');
			}
			// else, 'The repeater can't be resumed because it isn't paused.'

		}
		
		function reset() {
			if (runningState === 'running' || runningState === 'paused') {
				console.log('Reset.');
				runningState = 'stopped';
				console.log('Running state equals ' + runningState);
				startTime = undefined;
				nextScheduledTime = undefined;
				elapsedTime = 0;
			} else {
				console.log("Not running or paused, so can't be reset.");
			}
		}
		
		return {
			start: startRepeating,
			pause: pauseRepeating,
			resume: resumeRepeating,
			reset: reset,
			elapsedTime: getElapsedTime
			
			// Also getters for functionToRepeat, normalDelay, timeLimit, other params
			// Also startTime, nextScheduledTime, elapsedTime, etc.
			// Also setters / modifiers?
		};
		
	}



	// Simple replacement for setInterval.
	function setRepeater(functionToRepeat, delay) {

		var params = {};
		params.functionToRepeat = functionToRepeat;
		params.delay = delay;

		if (arguments.length > 2) {
			params.argsArray = [];
			for (var i = 0; i < argsArrayLength; i += 1) {
				params.argsArray[i] = argumentsObject[i + 2];
			}
		}

		var newRepeater = createRepeater(params);
		newRepeater.start();
	}


	// Module API.
	return {
		simpleRepeat: simpleRepeat,
		repeatNumberOfTimes: repeatNumberOfTimes,
		
		createInterval: createInterval,
		setRepeater: setRepeater
	};
	// Also subroutines just for testing?
	
}(window, document));