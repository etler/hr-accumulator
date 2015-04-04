#hr-accumulator

A helper library for tracking accumulated times using hrtime.

##Methods

###reset(name)

Resets the referenced timer to 0 seconds.

###start(name)

Starts a timer to start tracking time.

###stop(name)

Stops the referenced timer, and stop tracking time.

###log(name)

Pretty print the current accumulated time of the referenced timer in the format `(name): (seconds)s (milliseconds)ms (microseconds)μs (nanoseconds)ns`
