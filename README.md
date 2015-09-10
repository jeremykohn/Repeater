# Repeater

Introducing Repeater, an advanced version of setInterval in JavaScript. 

It adds features such as pause-and-resume, while improving reliability and maintaining accuracy.

Repeater is now in beta and more features are coming, so check back here soon!

## Usage

Set a function (`func`) to repeat at a specified interval in milliseconds (`delay`):

`var r = Repeater.set(func, delay);`

To pause the repetitions:

`r.pause();`

Then, to resume where it left off:

`r.resume()`;

To stop or cancel the repetitions:

`r.reset()`

## Why Repeater?

JavaScript's native setInterval function has a reputation for being [harmful](http://zetafleet.com/blog/why-i-consider-setinterval-harmful) and [evil](www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval). Repeater avoids the problems with setInterval by recursively calling the setTimeout function instead. This ensures that functions execute in the right order. Repeater also auto-corrects the timing to maintain an accurate interval, even over long periods of time.

I've found Repeater useful. Hopefully you will too!

Version: 0.5

License: MIT