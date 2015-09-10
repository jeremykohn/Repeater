(function() { 
	'use strict';
	
	function selectedElements() {
		var elements = {};
		elements.startSimple = document.getElementById('start-simple-repeat');
		elements.delay = document.getElementById('interval-length');
		elements.maxRepeats = document.getElementById('max-repeats');
		elements.randomField = document.getElementById('random-letter-field');	
		elements.start = document.getElementById('start');
		elements.pause = document.getElementById('pause');
		elements.resume = document.getElementById('resume');
		elements.reset = document.getElementById('reset');
		elements.timeElapsedField = document.getElementById('time-elapsed');
		elements.timePausedField = document.getElementById('time-paused');
		return elements;
	}

	function randomNumber() {
		var randNumber = Math.floor(Math.random() * 26);
		return randNumber;
	}
	
	function randomLetter() {
		var letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
		return letters[randomNumber()];
	}

	function displayRandomLetters() {
		var elements = selectedElements();
		var randomLetters = '';
		for (var i = 0; i < 2; i += 1) {
			randomLetters += randomLetter();
		}
		elements.randomField.value = randomLetters;
	}

	function updateColor() {
		var colorField = document.getElementById('color-field');
	    colorField.style.background = chance.color({grayscale: true, format: 'hex'});
	}
	
	function repeatThis(repeater) {
		displayRandomLetters();
		updateColor();
		// updateTimeElapsed(repeater);
	}



	function runWhenLoaded() {
		// alert('Loaded');
		
		var elements = selectedElements();
		var repeaterOne = Repeater.createRepeater(repeatThis, elements.delay.value);
		var timeElapsedField = document.getElementById('time-elapsed');
		
		function simpleRepeatTest() {
			console.log('Click');
			Repeater.simpleRepeat(repeatThis, elements.delay.value);
		}
		
		function repeatNumberOfTimesTest() {
			console.log('Click');
			Repeater.repeatNumberOfTimes(repeatThis, elements.delay.value, elements.maxRepeats.value);
		}
		
		
	
		elements.startSimple.addEventListener('click', repeatNumberOfTimesTest);
		// elements.start.addEventListener('click', simpleRepeatTest);
		
		
		elements.start.addEventListener('click', repeaterOne.start);
		elements.pause.addEventListener('click', repeaterOne.pause);
		elements.resume.addEventListener('click', repeaterOne.resume);
		elements.reset.addEventListener('click', repeaterOne.reset);

		
		
		function animFrame(repeater) {
			elements.timeElapsedField.textContent = repeaterOne.elapsedTime();
			elements.timePausedField.textContent = repeaterOne.totalPausedTime();
			window.requestAnimationFrame(animFrame);
		}

		window.requestAnimationFrame(animFrame);
		

	}

	document.addEventListener('DOMContentLoaded', runWhenLoaded);

}());