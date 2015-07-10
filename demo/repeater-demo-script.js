(function() { 
	'use strict';
	
	function selectedElements() {
		var elements = {};
		elements.start = document.getElementById('start-simple-repeat');
		elements.delay = document.getElementById('interval-length');
		elements.maxRepeats = document.getElementById('max-repeats');
		elements.randomField = document.getElementById('random-letter-field');		
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

	function runWhenLoaded() {
		alert('Loaded');
		
		var elements = selectedElements();
		
		function simpleRepeatTest() {
			console.log('Click');
			Repeater.simpleRepeat(displayRandomLetters, elements.delay.value);
		}
		
		function repeatNumberOfTimesTest() {
			console.log('Click');
			Repeater.repeatNumberOfTimes(displayRandomLetters, elements.delay.value, elements.maxRepeats.value);
		}
		
		
		
		

		elements.start.addEventListener('click', repeatNumberOfTimesTest);
		// elements.start.addEventListener('click', simpleRepeatTest);

	}

	document.addEventListener('DOMContentLoaded', runWhenLoaded);

}());