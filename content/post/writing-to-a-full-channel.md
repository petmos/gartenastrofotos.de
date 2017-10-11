---
title: "Writing to a Full Channel in Go"
date: 2017-10-11T06:53:02+01:00
description: "Writing to a full channel in Go can quickly lead to deadlock in your code. To prevent deadlock, I explore three ways to avoid writing to a full channel."
---

When attempting a simple circuit-breaker package ([billglover/breaker](https://github.com/billglover/breaker)), I wanted to surface state changes to users. In the course of implementing this feature I tried three approaches.

1. Allow users to query the current state of the breaker
2. Allow users to provide a callback function
3. Provide users a channel for callers to receive notifications 

Whilst all three solutions are workable, using channels felt like the most idiomatic. During the implementation I learned two new tricks for preventing deadlock when writing to buffered channels. Before I share them, a quick bit of context to show users of the package subscribe to notifications.

Subscribing to state changes returns a channel on which users will receive `State` values.

```go
// Subscribing to state changes returns a channel 
// on which users will receive `State` values.
func (b *Breaker) Subscribe() chan State {
	c := make(chan State, 1)
	b.subscribers = append(b.subscribers, c)
	return c
}
```

As I didn’t want the breaker to block when writing to the channel I gave my channel a buffer a capacity of 1. There is no science behind this sizing and tuning may reveal that a slightly larger buffer is more efficient.

> Problem: I could not guarantee that there would be consumers draining the channel. I didn’t want the package code to deadlock just because a consumer had failed to drain the channel and allowed the buffer to fill up.

## Option 1 - drain the channel before writing
```go
func (b *Breaker) notify(state State) {
	for _, s := range b.subscribers {

	out:
		for {
			select {
			case <-s:
			default:
				break out
			}
		}
		s <- state
	}
}
```

This was my first solution and it works. There are a couple of things that left me thinking I could do better:

* the use of the `out:` label feels dirty, whilst legitimate it reminds me of [QuickBASIC](https://en.m.wikipedia.org/wiki/QuickBASIC).
* performance could degrade as our buffer capacity increases
* it isn’t immediately clear what this code is trying to do

## Option 2 - `select{}` on write - don’t write if full
```go
func (b *Breaker) notify(state State) {
	for _, s := range b.subscribers {
		select {
		case s <- state:
		default:
			// would be sensible to log failure to notify
		}
	}
}
```

Whilst I did know that `select` can be used when reading from channels, I hadn’t realised `select` can also be used when writing. This solution is far more elegant and has a couple of key advantages over my first approach:

* performance doesn’t degrade if readers don’t consume notifications
* it provides the option for logging the fact that readers are failing to consume notifications

## Option 3 - length vs capacity - don’t write if full
```go
func (b *Breaker) notify(state State) {
	for _, s := range b.subscribers {
		if len(s) < cap(s) {
			s <- state
		}
	}
}
```

The third approach was the option I settled on. The `len()` and `cap()` functions return useful information about buffered channels. The Go Programming Language Specification ([Length and Capacity](https://golang.org/ref/spec#Length_and_capacity)) offers the following definitions:

> `len(s)    chan T    number of elements queued in channel buffer`

and

> `cap(s)    chan T    channel buffer capacity`

By ensuring the number of queued elements in a buffered channel is less than the channel capacity, we can avoid writing to a full channel. It is this solution I find most readable, and the one I ended up using in my circuit breaker implementation ([billglover/breaker](https://github.com/billglover/breaker/blob/master/breaker.go#L200-L206)).