---
title: "How Expensive Is a Go Function Call?"
date: 2018-09-17T14:30:00+01:00
description: "I noticed that the recursive implementation of an algorithm performed slightly worse than its inline equivalent. I didn't know whether I could attribute this overhead to the cost of the additional function calls needed in a recursive implementation. I set out to see if I could see behind the scenes of a Go function call."
---

I was recently benchmarking various implementations of an algorithm and noticed that the recursive implementation of an algorithm performed worse than its inline equivalent. I didn't know if it made sense to attribute this overhead to the cost of the additional function calls in the recursive implementation. I set out to see if I could see behind the scenes of a Go function call and determine just how expensive each function call is.

> TLDR: The cost of a function call? I still don't know. The best I can offer is that it depends, well that and an exploration of Go assembler.

In this post, I take you through the analysis I did and highlight what I learned along the way.

## A simple program

Rather than use a complex algorithm, I sought to use the simplest possible program that demonstrated the behaviour I wanted to investigate. This Go program takes an `int`, in this case `1000`, and increments it by `1` inside a loop that executes `1000` iterations. The result, `2000`, is printed to the screen.

```go
package main

func main() {
	n := inc(1000)
	println(n)
}

func inc(n int) int {
	for i := 0; i < 1000; i++ {
		n = n + 1
	}
	return n
}
```

```plain
$ go run inline.go
2000
```

I included the loop to slow down the function and allow me to measure benchmarks. Without the loop, benchmark results are in the low single digit nanoseconds which fall within the margin of error of simple benchmarks.

```plain
$ go test -run=X -bench=.
goos: darwin
goarch: amd64
pkg: github.com/billglover/recursion/inline
BenchmarkInc-8           5000000               331 ns/op
PASS
ok      github.com/billglover/recursion/inline  1.971s
```

## Adding function calls

Now that I had a baseline, I wanted to see how the addition of a single function call would change the benchmark. I modified the `inc(n int) int` function as show below.

```go
package main

func main() {
	n := inc(1000)
	println(n)
}

func inc(n int) int {
	for i := 0; i < 1000; i++ {
		n = add(n)
	}
	return n
}

func add(n int) int {
	return n + 1
}
```

Instead of increment it the value of `n` directly, we do so via an additional function call to `add()`. With the additional function call, I expected to see an increase in execution time. The benchmark comparison between the approaches can be seen below.

```plain
$ go test -run=X -bench=. ./... | grep -i bench
BenchmarkIncFunction-8			5000000               289 ns/op
BenchmarkIncInline-8			5000000               289 ns/op
```

I ran the benchmark again several more times and results were consistent to within a couple of nanoseconds. Given the differences in recursive function performance I'd been seeing, I was expecting the additional function call to result in a noticeable change in performance. In these examples it appeared to make no difference at all. It was time to dig deeper.

## Behind the scenes

I had a suspicion that the compiler was performing some optimisation on my example code and the resulting code was similar if not identical between the two examples. Luckily, the Go toolchain provides an easy way to view the output of the compiler.

```plain
$ go tool compile -S inline.go
```
***Note:*** *this results in an intermediary assembler and is not the code that actually ends up running on the CPU. I ignored this technicality as I continued to explore.*

Looking at the assembly output for the first example, it was fairly easy to trace through the function execution. Helpfully, the assembler output includes references back to the file and line number for the original Go sourcecode.

```plain
0x0000 00000 (inline.go:8)      TEXT    "".inc(SB), NOSPLIT, $0-16
0x0000 00000 (inline.go:8)      FUNCDATA        $0, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
0x0000 00000 (inline.go:8)      FUNCDATA        $1, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
0x0000 00000 (inline.go:8)      FUNCDATA        $3, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
0x0000 00000 (inline.go:9)      PCDATA  $2, $0
0x0000 00000 (inline.go:9)      PCDATA  $0, $0
0x0000 00000 (inline.go:9)      MOVQ    "".n+8(SP), AX
0x0005 00005 (inline.go:9)      XORL    CX, CX
0x0007 00007 (inline.go:9)      JMP     15
0x0009 00009 (inline.go:9)      INCQ    CX
0x000c 00012 (inline.go:10)     INCQ    AX
0x000f 00015 (inline.go:9)      CMPQ    CX, $1000
0x0016 00022 (inline.go:9)      JLT     9
0x0018 00024 (inline.go:12)     MOVQ    AX, "".~r1+16(SP)
0x001d 00029 (inline.go:12)     RET
```

The `FUNCDATA` and `PCDATA` instructions [relate to garbage collection](https://golang.org/doc/asm#introduction) and are inserted by the compiler. I've removed these from the following (and future) listings to aid readability. The `TEXT` directives define the function names and indicate the stack allocation required for the function to execute. This one line took the most time to analyse. I've broken out an explanation for each of the components below.

```nasm
00000	TEXT	"".inc(SB), NOSPLIT, $0-16
```

* `""` is a placeholder that will be filled in later by the linker.
* `incInline` is a symbol used to reference the function location in memory.
* `NOSPLIT` I don't understand this fully, but I think this means that some stack management code can be left out.
* `$0` indicates that no additional space on the stack is required for this function.
* `$16` indicates that 16-bytes are required for the function parameters and return values (in this case; one 64-bit integer parameter, and one 64-bit integer return value).

A simplified view of the assembly language version of our first example is shown below.

```nasm
; inc(n int) int
00000	TEXT	"".inc(SB), NOSPLIT, $0-16	; function definition
00000	MOVQ	"".n+8(SP), AX				; move parameter from stack to AX
00005	XORL    CX, CX						; zero out register CX
00007	JMP     15							; go to line 15
00009	INCQ    CX							; increment register CX
00012	INCQ    AX							; increment register AX
00015	CMPQ    CX, $1000					; compare register CX with 1000
00022	JLT     9							; go to line 9
00024	MOVQ    AX, "".~r1+16(SP)			; move AX to stack return value
00029	RET									; return from function
```

A quick glance at the documentation ([X86 Architecture](https://en.wikibooks.org/wiki/X86_Assembly/X86_Architecture)) for Intel CPUs tells us a little more about the registers being used here.

* `AX`: Accumulator register (AX) – used in arithmetic operations.
* `CX`: Counter register (CX) – used in shift/rotate instructions and loops.

The Go documentation ([A Quick Guide to Go's Assembler](https://golang.org/doc/asm)) defines the following psuedo-registers. These aren't hardware registers but are virtual registers maintained by the Go tool chain. I'll treat them as if they were hardware registers for this investigation.

* `SB`: Static base pointer – used to reference global symbols.
* `SP`: Stack pointer – used to reference the top of stack.

This shows that register `CX` is being used to hold the value of our loop variable `i`. And register `AX` is being used to hold the value of our local variable `n`.

Now that I understood the inline version of our programme, I took a look at the output of the compiler for our second example. Again, I've removed the `FUNCDATA` and `PCDATA` instructions and added comments to each line.

```nasm
; inc(n int) int
00000	TEXT	"".inc(SB), NOSPLIT, $0-16	; function definition
00000	MOVQ	"".n+8(SP), AX				; move parameter from stack to AX
00005	XORL    CX, CX						; zero out register CX
00007	JMP     15							; go to line 15
00009	INCQ    CX							; increment register CX
00012	INCQ    AX							; increment register AX
00015	CMPQ    CX, $1000					; compare register CX with 1000
00022	JLT     9							; go to line 9
00024	MOVQ    AX, "".~r1+16(SP)			; move AX to stack return value
00029	RET									; return from function

; add(n int) int
00000	TEXT	"".add(SB), NOSPLIT, $0-16	; function definition
00000	MOVQ	"".n+8(SP), AX				; move parameter from stack to AX
00005	INCQ	AX							; increment register AX
00008	MOVQ	AX, "".~r1+16(SP)			; move AX to stack return value
00013	RET									; return from function
```

In this listing we can clearly see the two function definitions. I'll leave you to walk through the implementation of the `add(n int) int` function. Far more interesting is that the listing for the `inc(n int) int` is identical to the listing in our first example. Although we have defined a new function, this function is never called. The end result is that the code path followed in the two examples is identical. This explains the benchmark comparisons seen earlier.

The compiler has determined that it can move the function `add()` inline and save on a function call. This is known as "inlining" and is a common compiler trick used to improve performance at the expense of binary size (see [Wikipedia](https://en.wikipedia.org/wiki/Inline_expansion)). This explains why I was seeing identical benchmarks for both approaches, but not why my recursive functions were seeing slower performance than inline counterparts.

It turns out that the compiler doesn't move functionality like this inline for all cases. One example where it is unable to do so is recursion as it doesn't know at compile time how many times the recursive function is going to be called.

I was now convinced that these function calls would demonstrate a performance overhead (otherwise why would they be optimised out), but I was no closer to being able to measure what that overhead was. I needed a way to view the cost of function calls without the compiler optimising them away.

After some digging, I discovered a little known Go pragma directive to disable inlining for particular functions. This should never be used in normal code, but is very useful here for demonstrating the cost of function calls.

```go
package main

func main() {
	n := inc(1000)
	println(n)
}

func inc(n int) int {
	for i := 0; i < 1000; i++ {
		n = add(n)
	}
	return n
}

//go:noinline
func add(n int) int {
	return n + 1
}
```

With the addition of the `noinline` pragma directive, I re-ran the benchmark.

```plain
$ go test -run=X -bench=. -benchmem ./... | grep -i bench
BenchmarkIncFunction-8           1000000              2289 ns/op
BenchmarkIncInline-8		     5000000               286 ns/op
```

This now shows the inline call is ten times faster than the approach using function calls. But, before you panic and start avoiding function calls altogether, remember I'm making 1,000 function calls during each benchmark operation. The overhead of any individual function call is tiny.

Now that I was able to reproduce the overhead associated with function calls, I went back to the assembly to see what was going on behind the scenes.

```nasm
; inc(n int) int
00000	TEXT	"".inc(SB), $32-16			; function definition
00000	MOVQ	(TLS), CX					; move TLS to register CX
00009	CMPQ	SP, 16(CX)					; compare SP with part of CX
00013	JLS		88							; go to line 88 if 'less than'
00015	SUBQ	$32, SP						; increase stack size by 32-bytes
00019	MOVQ	BP, 24(SP)					; move BP to the stack
00024	LEAQ	24(SP), BP					; update BP to new location
;		---		---
00029	XORL	AX, AX						; zero out register AX
00031	MOVQ	"".n+40(SP), CX				; move parameter from stack to CX
00036	JMP		65							; go to line 65
00038	MOVQ	AX, "".i+16(SP)				; move AX to the stack
00043	MOVQ	CX, (SP)					; move CX to the stack
00047	CALL	"".add(SB)					; call the add(int) function
00052	MOVQ	"".i+16(SP), AX				; move stack value to AX
00057	INCQ	AX							; increment AX
00060	MOVQ	8(SP), CX					; move stack value to CX
00065	CMPQ	AX, $1000					; compare register AX with 1000
00071	JLT		38							; go to line 38
00073	MOVQ	CX, "".~r1+48(SP)			; move CX to stack return value
00078	MOVQ	24(SP), BP					; restore BP from the stack
00083	ADDQ	$32, SP						; reduce stack size by 32-bytes
00087	RET									; return from function
;		---		---
00088	NOP									; do nothing
00088	CALL	runtime.morestack_noctxt(SB); ask runtime for more stack
00093	JMP		0							; go to line 0

; add(n int) int
00000	TEXT	"".add(SB), NOSPLIT, $0-16	; function definition
00000	MOVQ	"".n+8(SP), AX				; move parameter from stack to AX
00005	INCQ	AX							; increment register AX
00008	MOVQ	AX, "".~r1+16(SP)			; move AX to stack return value
00013	RET									; return from function
```

The good news is that the `inc()` function now makes a call to `add()` on line 47. However I was not expecting the additional complexity before and after the main function body. There appears to be a lot more going on than a simple `CALL` to `add()`. Much of this additional complexity comes from managing the values on the stack and it was becoming increasingly difficult to trace how values were moving between registers as the functions were called. I turned to pen and paper to work this through.

![Stack Animation](/img/func_cost_StackView.gif)

If you want to follow this through yourself, grab a large mug of your favourite brew and several sheets of paper, it'll take a while.

I traced through the execution of the programme and learned the following:

* Values are passed to functions via the stack.
* Values are returned from functions via the stack.
* Calling functions are responsible for reserving the required stack space.
* Function calls increase the stack size by one to accommodate the return address.
* Functions make calls to the runtime to grow the stack as necessary.

I now understood a little more about why function calls incur a cost. Allocating stack space and passing parameter and return values around all costs CPU cycles. But I still wasn't able to articulate how big that cost was.

## So how expensive is a function call

Comparing our two approaches through benchmarking we can see that our solution involving a function call took 2289 ns/op whereas our inline solution took only 286 ns/op. You could make the argument that adding the function call takes an additional 2003 ns/op. For 1,000 function calls in each benchmarking operation, this equates to 2 ns/function call.

An alternate way of looking at it would be to look at the increase in the number of instructions executed to make our function call. Our inline method requires 10 lines of assembler. Our method involving a function call requires the execution of an additional 20 instructions. Figuring out how long each instruction takes to execute is non-trivial and so I decided to stop digging further. If you have any thoughts on how I might be able to approximate this I'd love to hear from you.

## In conclusion

Whilst I can't definitively articulate the cost of a function call in Go, I do have a better understanding of why it incurs a cost. To some, this may be obvious, but the journey above thought me a lot more about the Go, the associated toolchain, and general programme execution.

I'm still of the opinion that the best way to determine the difference between two approaches is to benchmark them. If you find yourself questioning the results of your benchmarks, it's time to dig further. The Go toolchain provides a number of options for further investigation.