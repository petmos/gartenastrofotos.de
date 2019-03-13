---
title: "Learn Go: by Concatenating Strings"
date: 2019-03-13T13:02:49Z
description: "Joining strings is so common that many of us take it for granted. While working through the exercises in 'The Go Programming Language' book as part of the London Study Group, I wanted to understand the differences between the various approaches for joining strings. This is what I found."
---

Joining strings is so common that many of us take it for granted. While working through the exercises in 'The Go Programming Language' book as part of the London Study Group, I wanted to understand the differences between the various approaches for joining strings.

If you are looking to concatenate strings in Go, here is what I'd do:

* Outside a loop: use the `+` operator: e.g. `"a" + "b"
* Inside a loop: use `strings.Join([]string, string)`

If you want to know why read on. The notes that follow are primarily for my own understanding. They chart my attempt to explain the results of exercise 1.3 and explore different options for string concatenation.

## Benchmarks

The exercise looked at comparing the use of three common string concatenation approaches; `+`, `fmt.Sprintf()` and `strings.Join()`. Because I like to explore a little, I wrote my own version which I'm calling `Custom()`. This is a terrible name for a function.

```plain
$ go test -bench=. -benchmem -run=^
goos: darwin
goarch: amd64
pkg: ../ex1.3
BenchmarkFormat-8     200000      8959 ns/op    1952 B/op    102 allocs/op
BenchmarkConcat-8     200000      6053 ns/op   14912 B/op     99 allocs/op
BenchmarkJoin-8      2000000       875 ns/op     640 B/op      2 allocs/op
BenchmarkCustom-8    1000000      1500 ns/op     752 B/op      3 allocs/op
```

I expected that there would be some variation between these different approaches for string concatenation. I was also pleasantly surprised that I'd got so close to standard library performance with my custom function. However, I couldn't see any obvious ways to improve.

## Concatenation with `+`

The benchmarking set-up is shown below.

Function under test:
```go
// Concat takes a slice of strings and returns a string containing the space
// separated values. It uses the + operator to join the strings.
func concat(args []string) string {
	var s, sep string
	for _, arg := range args {
		s += sep + arg
		sep = " "
	}
	return s
}
```

Benchmarking:
```go
var args = generate(100)

func generate(n int) []string {
	s := make([]string, n)
	for i := range s {
		s[i] = strconv.Itoa(i)
	}
	return s
}

func BenchmarkConcat(b *testing.B) {
	for n := 0; n < b.N; n++ {
		concat(args)
	}
}
```

Benchmarking shows that there are 99 memory allocations when joining 100 strings. My working theory is that this is one memory allocation per concatenation operation. We can validate this by looking at the code.

```shell
go doc -all -u -src runtime.concatstrings
```

```go
// concatstrings implements a Go string concatenation x+y+z+...
// The operands are passed in the slice a.
// If buf != nil, the compiler has determined that the result does not
// escape the calling function, so the string data can be stored in buf
// if small enough.
func concatstrings(buf *tmpBuf, a []string) string {
	idx := 0
 	l := 0
	count := 0
  	for i, x := range a {
 		n := len(x)
 		if n == 0 {
 			continue
 		}
 		if l+n < l {
 			throw("string concatenation too long")
 		}
 		l += n
 		count++
 		idx = i
	}
 	if count == 0 {
 		return ""
 	}
 
 	// If there is just one string and either it is not on the stack
 	// or our result does not escape the calling frame (buf != nil),
 	// then we can return that string directly.
 	if count == 1 && (buf != nil || !stringDataOnStack(a[idx])) {
 		return a[idx]
 	}
 	s, b := rawstringtmp(buf, l)
 	for _, x := range a {
 		copy(b, x)
 		b = b[len(x):]
 	}
 	return s
}
```

There are two loops at play here. The first computes the length of the combined string. It includes a small optimisation and returns quickly if the resulting string is empty. It also checks that we don't overflow the length variable, `l`.

**Note:** I'm going to gloss over the check to see whether the data is on the stack as I don't fully understand this. If you can explain this, I'd love to hear from you.

In the second loop, `rawstringtmp(buf, l)` returns a `[]byte` slice and a string. This results in memory allocation and why we see one allocation per iteration of our concatenation function. Interestingly, the `[]byte` and `string` point to the same underlying memory. This allows the `concatstrings` function can operate directly on the underlying `[]byte` slice but return the string to the caller.

What stands out is that these loops are run once per call to `concatstrings`. When joining multiple strings the length and resulting memory allocation would be computed for each string join. We should be able to do this once for all strings.

**Conclusion:** Simple syntax, most efficient approach for joining two strings, inefficient inside a loop.

## Concatenation with `strings.Join`

Function under test:
```go
// Join takes a slice of strings and returns a string containing the space
// separated values. It uses strings.Join to join the strings.
func join(args []string) string {
	s := strings.Join(args, " ")
	return s
}
```

The same benchmark test was used and so it is not repeated here.

Using `strings.Join` to concatenate 100 strings is clearly faster than using the `+` operator. But why? Let's take a look at the source.

```shell
go doc -all -u -src strings.Join
```

```go
// Join concatenates the elements of a to create a single string. The separator string
// sep is placed between elements in the resulting string.
func Join(a []string, sep string) string {
	switch len(a) {
	case 0:
		return ""
	case 1:
		return a[0]
	case 2:
		// Special case for common small values.
		// Remove if golang.org/issue/6714 is fixed
		return a[0] + sep + a[1]
	case 3:
		// Special case for common small values.
		// Remove if golang.org/issue/6714 is fixed
		return a[0] + sep + a[1] + sep + a[2]
	}
	n := len(sep) * (len(a) - 1)
	for i := 0; i < len(a); i++ {
		n += len(a[i])
	}

	b := make([]byte, n)
	bp := copy(b, a[0])
	for _, s := range a[1:] {
		bp += copy(b[bp:], sep)
		bp += copy(b[bp:], s)
	}
	return string(b)
}
```

This performs two memory allocations, once when creating the `[]byte` slice and again when casting to `string` in the return statement. This explains the `2 allocs/op` that we see in the benchmark results.

```plain
$ go test -bench=. -benchmem -run=^
goos: darwin
goarch: amd64
pkg: ../ex1.3
BenchmarkConcat-8     200000      6053 ns/op   14912 B/op     99 allocs/op
BenchmarkJoin-8      2000000       875 ns/op     640 B/op      2 allocs/op
```

This function takes advantage of the fact that it is possible to pre-compute and allocate the required memory for the concatenation of all strings. This reduces the work that needs to be done within the loop. Interestingly, when joining a `[]string` slice with fewer than 4 elements, the function resorts to using the `+` operator to concatenate the strings.

**Conclusion:** Simple syntax but not quite as nice as `+` operator, most efficient approach for joining two strings, inefficient inside a loop.

## Custom Concatenation Function

`strings.Join` is pretty fast but I wanted to see how efficiently I could write a concatenation function myself. I did this before looking at the approach used in the standard library.

My working assumption was that memory writes are cheap and memory allocation is expensive. I wanted to avoid the pitfalls of the `+` operator by allocating memory once and then iterating through my slice of strings, adding each to my target string.

There is one gotcha. "In Go, a string is in effect a read-only slice of bytes ([src](https://blog.golang.org/strings))." Strings are immutable. To get around this, I used `[]byte` slice during concatenation and then cast to a `string` on return.

Here is my initial approach:

1. Compute the length of the final string
2. Create a `bytes.Buffer` long enough to hold the final string
3. Loop through the arguments and:
    - write the argument into the `bytes.Buffer`
    - write the separator into the `bytes.Buffer`
4. Read the contents of `bytes.Buffer` by using the `String()` method
5. Return the resulting string

```go
// Custom takes a slice of strings and returns a string containing the space
// separated values. It uses custom code to join the strings.
func custom(args []string, s string) string {
	var l int

	for i := range args {
		l += len(args[i])
	}
	l += len(s) * (len(args) - 1)

	b := bytes.Buffer{}
	b.Grow(l)

	for i := range args {
		b.WriteString(args[i])

		if i == len(args)-1 {
			break
		}

		b.WriteString(s)
	}

	return b.String()
}
```

My expectation was that this approach required a single memory allocation. Performance should be comparable to the functions in the standard library.

```plain
$ go test -bench=. -benchmem -run=^
goos: darwin
goarch: amd64
pkg: ../ex1.3
BenchmarkConcat-8     200000      6053 ns/op   14912 B/op     99 allocs/op
BenchmarkJoin-8      2000000       875 ns/op     640 B/op      2 allocs/op
BenchmarkCustom-8    1000000      1500 ns/op     752 B/op      3 allocs/op
```

This wasn't bad for a first attempt, but why was I seeing three allocations when I was expecting only one?

It turns out that what is happening behind the scenes is that `Buffer.String()` makes a copy of the underlying data and in the process performs another memory allocation.

* GitHub Issue: [#6714](https://github.com/golang/go/issues/6714)
* GitHub Issue: [#18990](https://github.com/golang/go/issues/18990)

These issues explain additional allocation and the introduction of the `strings.Builder` type to avoid this. Change List [74931](https://go-review.googlesource.com/c/go/+/74931/) was included in Go 1.10. For a more concise summary see [The State of Go](https://talks.godoc.org/github.com/campoy/gotalks/go1.10/talk.slide#29) by Francec Campoy.

The `strings.Builder` is intended to be a drop-in replacement for `bytes.Buffer`. A quick comparison between the `String()` method on both the `Buffer` and the `Builder` shows one of the key changes.

```go
// String returns the contents of the unread portion of the buffer
// as a string. If the Buffer is a nil pointer, it returns "<nil>".
//
// To build strings more efficiently, see the strings.Builder type.
func (b *Buffer) String() string {
	if b == nil {
		// Special case, useful in debugging.
		return "<nil>"
	}
	return string(b.buf[b.off:])
}
```

Compare this with the somewhat less readable, but more efficient approach taken for the `Builder`.

```go
func (b *Builder) String() string {
	return *(*string)(unsafe.Pointer(&b.buf))
}
```

This avoids the cast to `string` by utilising the fact that both `string` and `[]byte` have the same headers.

I modified my function to use this new `strings.Builder` type.

```go
// Custom takes a slice of strings and returns a string containing the space
// separated values. It uses custom code to join the strings.
func custom(args []string, s string) string {
	var l int

	for i := range args {
		l += len(args[i])
	}
	l += len(s) * (len(args) - 1)

	b := strings.Builder{}
	b.Grow(l)

	for i := range args {
		b.WriteString(args[i])

		if i == len(args)-1 {
			break
		}

		b.WriteString(s)
	}

	return b.String()
}
```

These new benchmarks show that we are now able to better the `strings.Join` function by 2% or so.

```plain
$ go test -bench=. -benchmem -run=^x
goos: darwin
goarch: amd64
pkg: github.com/go-london-user-group/study-group/workspaces/billglover/exercises/01_tutorial/ex1.3
BenchmarkFormat-8     200000     10866 ns/o     1952 B/op    102 allocs/op
BenchmarkConcat-8     200000      7421 ns/op   14912 B/op     99 allocs/op
BenchmarkJoin-8      2000000       985 ns/op     640 B/op      2 allocs/op
BenchmarkCustom-8    2000000       964 ns/op     320 B/op      1 allocs/op
```

My `Custom` function now outperformed the standard library.

## A Twist

Whilst writing this blog post, I realised that Go 1.12 included changes to the `strings` package. One of the included changes:

* Change List [132895](https://go-review.googlesource.com/c/go/+/132895) - simplify Join using Builder

The implementation is remarkably similar to my custom method. A couple of notable differences include the omission of error handling and the avoidance of a conditional within the loop.

Benchmarks with Go 1.12

```plain
$ go test -bench=. -benchmem -run=^x
goos: darwin
goarch: amd64
pkg: github.com/go-london-user-group/study-group/workspaces/billglover/exercises/01_tutorial/ex1.3
BenchmarkFormat-8      200000	  9458 ns/op     1952 B/op	 102 allocs/op
BenchmarkConcat-8      200000	  7085 ns/op    14912 B/op	  99 allocs/op
BenchmarkJoin-8       2000000	   923 ns/op      320 B/op	   1 allocs/op
BenchmarkCustom-8     2000000	   960 ns/op      320 B/op	   1 allocs/op
```

The standard library is back in front again... just.

## Conclusion

String concatenation with the `+` operator is simple and easy to understand. The familiar syntax means this is often the default approach when joining strings. If you are only joining a couple of strings, it is still the most efficient approach.

When joining strings within a loop or when joining a large slice of strings, use `strings.Join`. Recent changes in the standard library mean this more efficient than ever.
