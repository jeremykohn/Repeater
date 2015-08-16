// Copyright 2015 Jeremy Kohn. 
// License: MIT
// Version 0.5
var Repeater = (function(window, document, undefined) {

    // First, define timestamp function.
    // Use performance.now if available, otherwise use less precise and/or less accurate substitutes.    
    // What matters here is relative differences, not absolute times,
    // so 'time since page load' and 'time since 1970' work equally well.
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

    // Default parameters, in case user doesn't specify them.
    // Put in closure so they can't be changed elsewhere in module.
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



    // Basic functions, just to test.

    function simpleRepeat(functionToRepeat, delay) {
        functionToRepeat();
        window.setTimeout(function() {
            simpleRepeat(functionToRepeat, delay);
        }, delay);
    }

    function repeatNumberOfTimes(functionToRepeat, delay, repeatsRemaining) {
        functionToRepeat();
        if (--repeatsRemaining > 0) {
            window.setTimeout(function() {
                repeatNumberOfTimes(functionToRepeat, delay, repeatsRemaining);
            }, delay);
        }
    }


    ////////////////

    // Main function to return. 

    // Rewrite this with params.
    // Also with single object to keep track of state?

    function createRepeater(func, delay) {
        // var intervalRunner = {};
        var functionToRepeat = func;
        var normalDelay = parseFloat(delay);
        console.log('Delay is ' + delay + ' and its type is ' + typeof delay);
        console.log('Normal delay is ' + normalDelay + ' and its type is ' + typeof normalDelay);

        var startTime, nextScheduledTime, adjustedDelay, timeUntilNext, pausedAt;
        var totalPausedTime = 0;
        var runningState = 'stopped';

        console.log('Create interval.');

        var timeNow = defineTimeNow();

        function getElapsedTime() {
            if (runningState === 'running') {
                return timeNow() - startTime - totalPausedTime;
            } else if (runningState === 'paused') {
                return pausedAt - startTime - totalPausedTime;
            } else {
                return 0;
            }
        }

        function getTotalPausedTime() {
            return totalPausedTime || 0;
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


                console.log(normalDelay);
                console.log('It is now ' + timeNow());

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
                pausedAt = timeNow();
                console.log("Paused at " + pausedAt);
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
                totalPausedTime += now - pausedAt;
                pausedAt = null;
                console.log("Total paused time is " + totalPausedTime);
                nextScheduledTime = now + adjustedDelay;
                runningState = 'running';
                window.setTimeout(repeat, adjustedDelay);
            } else {
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
                totalPausedTime = 0;
            } else {
                console.log("Not running or paused, so can't be reset.");
            }
        }

        return {
            start: startRepeating,
            pause: pauseRepeating,
            resume: resumeRepeating,
            reset: reset,
            elapsedTime: getElapsedTime,
            totalPausedTime: getTotalPausedTime

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

        createRepeater: createRepeater,
        setRepeater: setRepeater
    };
    // Also subroutines just for testing?

}(window, document));