---
title: "Go on ARM: why struct field alignemnt matters"
date: 2020-06-19T14:00:00Z
description: "I'd assumed the Go compiler provided a robust abstraction across CPU architectures. Code that ran on one CPU architecture would run on another. It turns out I was wrong. In this post, I provide a minimal example application that demonstrates the importance of field alignment when using `sync/atomic` and `64-bit` values."
category: go
---

I'd assumed the Go compiler provided a robust abstraction across CPU architectures. Code that ran on one CPU architecture would run on another. It turns out I was wrong. In this post, I provide a minimal example application that demonstrates the importance of field alignment when using `sync/atomic` and `64-bit` values.


```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, 世界")
}
```

We can build and run this program on our local machine (in my case a MacBook) with the following command.

```plain
go build -o app
./app
```

You should see the following output.

```plain
Hello, 世界
```

To run this on a different CPU architecture, you can instruct Go to cross-compile. This is what you would do to build the program for the Raspberry Pi.

```plain
GOOS=linux GOARCH=arm go build -o pi-app
```

Trying to run this on my MacBook produces the following error.

```plain
./pi-app
zsh: exec format error: ./pi-app
```

This is expected as we didn't build a Mac executable. On the Raspberry Pi, we see the expected output.

```plain
./pi-app
Hello, 世界
```


This is an example of cross compilation. It is worth pausing to think about what we didn't change in to make this program work on the ARM CPU. We didn't have to change our code at all. This is as it should be. The Go compiler handles the abstraction of operating system and architecture semantics.

But things aren't always this straightforward as this next example demonstrates.

```go
import (
	"fmt"
	"sync/atomic"
)

type T struct {
	a byte
	b int64
}

func main() {
	t := T{}

	fmt.Println("before:", t.b)
	atomic.AddInt64(&(t.b), 1)
	fmt.Println("after:", t.b)
}
```

This program adds one to a field on a struct. We've chosen to use the `sync/atomic` package here for demonstration purposes. It isn't needed if all you want to do is add `1` to a field of type `int64`.

Build and run on the MacBook as before.

```plain
go build -o app
./app
```

You should see the following output.

```plain
before: 0
after: 1
```

The program ran successfully. `0 + 1` is indeed `1`. Now lets see what happens when we build and run the same program for the Raspberry Pi.

```plain
GOOS=linux GOARCH=arm go build -o pi-app
./app
```

When you do this, you should see the following output.

```plain
before: 0
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x11c24]

goroutine 1 [running]:
runtime/internal/atomic.goXadd64(0x1812094, 0x1, 0x0, 0x2, 0x2)
	/usr/local/go/src/runtime/internal/atomic/atomic_arm.go:103 +0x1c
main.main()
	/home/pi/go-align/main.go:17 +0xb4
exit status 2
```

That's not what we expected. We aren't knowingly using pointers at all so something is up.

We've run into a [known bug](https://golang.org/pkg/sync/atomic/#pkg-note-BUG), documented as part of the `sync/atomic` package.

> On ARM, x86-32, and 32-bit MIPS, it is the caller's responsibility to arrange for 64-bit alignment of 64-bit words accessed atomically. The first word in a variable or in an allocated struct, array, or slice can be relied upon to be 64-bit aligned.

This is an example of where code that is written for one architecture doesn't always run on another. Occasionally the CPU specifics leak through the abstractions of the toolchain. Thankfully these are rare, but the reality is they can be difficult to spot.

```go
import (
	"fmt"
	"sync/atomic"
)

type T struct {
	b int64
	a byte
}

func main() {
	t := T{}

	fmt.Println("before:", t.b)
	atomic.AddInt64(&(t.b), 1)
	fmt.Println("after:", t.b)
}
```

Build and run this on the Raspberry Pi again.

```plain
GOOS=linux GOARCH=arm go build -o pi-app
./app
```

```plain
before: 0
after: 1
```

It works! In case you didn't spot the difference, take a look at the definition of the struct, `T`. Do you notice the order of the field definitions is now reversed? This was the fix.

The 64-bit word, in this case `b`, is now the first word in the struct and so can be relied upon to be 64-bit aligned. We've worked around the bug.

The chapter on [Memory Layout](https://go101.org/article/memory-layout.html) in the Go 101 book provides a good explanation of memory alignment in Go.

It is possible to use the `reflect` package to query the size and alignment of a [Type](https://golang.org/pkg/reflect/#Type). But with a complex struct this can be difficult to visualise. This utility by Chunhui Liu allows you to visualise the memory layout of a struct, [github.com/leeychee/mlayout](https://github.com/leeychee/mlayout).

This is what our struct looks like before the fix.

```plain
acsii image is: 
x_______  // <- first word is a 64-bit aligned byte
xxxxxxxx  // <- our 64-bit int is no longer 64-bit aligned
```

And this is after we've swapped the field order.

```plain
acsii image is: 
xxxxxxxx  // <- our 64-bit integer is now 64-bit aligned
x_______  // <- our byte is also 64-bit aligned
```

A rule of thumb is to ensure that you define all atomically accessed 64-bit values at the top of your struct definition. This will guarantee that they are 64-bit aligned.

## Conclusion

Go cross compilation is so robust that we often take portability for granted. It is cited as one of the main features of the Go toolchain and rightly so. But, as we've seen with this example, there are times when we need to take extra care to ensure things work as expected.

Although I've presented a contrived example here for simplicity. The challenge of writing portable code is real. My own foray into the world of memory alignment led to a fix for [issue #51](https://github.com/wavefrontHQ/wavefront-sdk-go/issues/51) in the Wavefront SDK for Go.

I highly recommend this talk by Michael Mundy at LondonGophers: [Portable Go, Michael Munday](https://youtu.be/WlW1CS6A_8o?t=1078) for an overview of writing portable Go.

### References

* [Portable Go, Michael Munday](https://youtu.be/WlW1CS6A_8o?t=1078) @LondonGophers
* [Go 101](https://go101.org/article/101.html), Tapir
* The [sync/atomic](https://golang.org/pkg/sync/atomic/#pkg-note-BUG) bugs
