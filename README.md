#hr-accumulator

A helper library for tracking accumulated times using hrtime.

##Methods

###resetAll()

Removes all registered timers

###reset(name)

Resets the referenced timer to 0 seconds.

###start(name)

Starts a timer to start tracking time.

###stop(name)

Stops the referenced timer, and stop tracking time.

###toString(name)

Pretty print the current accumulated time of the referenced timer in the format `(name): (seconds)s (milliseconds)ms (microseconds)μs (nanoseconds)ns`

###log(name)

Print the referenced timer to console.log.

###stats(magnitude)

List out various statistics for all registered timers, takes the following magnitude strings to change stats magnitude:

* 's' or 'seconds'
* 'ms' or 'milliseconds' (default)
* 'µs' or 'microseconds'
* 'ns' or 'nanoseconds'
