---
layout:	post
categories:	dev
date: 2015-05-25 08:45:00
title:	My First Extension
---

In Swift, extensions allow you to extend an existing class, struct, or type to provide additional functionality. Nice in theory, but when would you actually use them? On reading the documentation, the syntax and behaviour are obvious, but I struggled to think of a use case for extensions. If you need the functionality, build it into your classes from the get-go as first class functions or properties.

In YAPT, I make use of `NSTimeInterval` to keep track of the remaining time in a session. I expected `NSTimeInterval` to allow me to access the component parts of a time interval. `.hours`, `.minutes`, `.seconds` etc. But I couldn't find anything like this.

The [Foundation Framework Reference](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Miscellaneous/Foundation_DataTypes/index.html#//apple_ref/c/tdef/NSTimeInterval "Foundation Data Types Reference") reveals why in the definition of `NSTimeInterval`.

{% highlight swift %}
// definition
typealias NSTimeInterval = Double

// Discussion: NSTimeInterval is always specified in seconds;
// it yields sub-millisecond precision over a range of 10,000 years.
{% endhighlight %}

This explains everything. There is no magic at all to `NSTimeInterval` it is a typealias for a Double. This feels like a missed oportunity to provide some helper properties to provide the component parts of a time interval.

{% gist billglover/6db7c3bda303cc25cfb4/3f427e82e1d1ead57feaecce1940bbf37ab50c6e %}

But this is messy and isn't as flexible as we could be. We can do better.

{% gist billglover/6db7c3bda303cc25cfb4/255de6f4ef8635c4a343632c9ea1df1973c4fd21 %}

This extension enables us to use a `NSTimeInterval` by converting to an alternative unit.

{% highlight swift %}
println("\(timeInterval.inHours)")
println("\(timeInterval.inMinutes)")
println("\((timeInterval.inSeconds)")
{% endhighlight %}

Or we can access it as a combination of all three.
{% highlight swift %}
println("\(timeInterval.inMinutesSeconds.minutes):\(timeInterval.inMinutesSeconds.minutes)")
{% endhighlight %}

In an application like YAPT where the display of time is common, this has helped me keep the code a little more readable. You can see how this has been worked into the YAPT source code over on GitHub ([d6902a8](https://github.com/billglover/YAPT_Swift/commit/d6902a83d9aa25efde041cfec47c76360922084b "GitHub commit")).