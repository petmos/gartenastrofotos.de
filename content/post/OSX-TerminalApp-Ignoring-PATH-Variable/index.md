---
title: "OSX Terminal.app Ignoring $PATH Variable"
date: 2019-11-15T09:06:51Z
description: "Over the last couple of days I lost the ability to copy and paste from Vim using the macOS system clipboard. I hadn't knowingly changed my Vim configuration and the only major change I'd made recently was to upgrade to macOS Catalina. This post points outlines how I resolved the issue and points the finger squarely and Full Disk Access on Catalina."
---

Over the last couple of days I lost the ability to copy and paste from Vim using the macOS system clipboard. I hadn't knowingly changed my Vim configuration and the only major change I'd made was to upgrade to macOS Catalina. This post points outlines how I resolved the issue and points the finger squarely and Full Disk Access on Catalina.

**TLDR:** Granting Full Disk Access to Terminal.app resolved the problem.

There are many posts on how to use the system clipboard with Vim. None of them indicate issues with Catalina so I was unsure of the connection between my recent upgrade and the behaviour I was seeing.

The standard advice to get things working is to add the following line to your `~/.vimrc` file. To narrow things down, I archived my existing `.vimrc` and created a new configuration file containing one entry.

```plain
set clipboard=unnamed
```

Even with this simple configuration, the problem persisted on all machines where I'd upgraded to Catalina. I looked to see if the upgrade had replaced my version of Vim.

```plain
~ ❯❯❯ which vim
/usr/bin/vim
```

This was unexpected. I have two versions of Vim installed:

* `/usr/bin/vim` - the macOS system version
* `/usr/local/bin/vim` - the Homebrew version

I was expecting to be using the Homebrew version of vim rather than the system version. The version of Vim that comes with macOS hasn't historically been compiled with support for the clipboard.

```plain
~ ❯❯❯ vim --version | grep clipboard
-clipboard         +jumplist          +persistent_undo   -vartabs
+eval              -mouse_gpm         +syntax            -xterm_clipboard
```

The `-clipboard` is the giveaway, no clipboard support is included.

To confirm that using the Homebrew version of Vim includes clipboard support, we can can explicitly reference the Homebrew installed version.

```plain
/usr/local/bin/vim --version | grep clipboard
+clipboard         +keymap            +printer           +vertsplit
+emacs_tags        -mouse_gpm         -sun_workshop      -xterm_clipboard
```

It looked as though the upgrade to Catalina had changed the version of Vim that was executing when I ran `vim`. But why?

To understand which version of an application gets run by default we need to dig into the `PATH` variable. When you run a command like `vim` the system searches through directories specified in the `PATH` variable from left to right (see [Wikipedia](https://en.wikipedia.org/wiki/PATH_(variable))). It runs the first instance of the executable it finds.

Looking at my `PATH` variable we can determine which version of Vim we would expect to execute.

```plain
~ ❯❯❯ echo $PATH
/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin
```

When I run the `vim` command, the system searches through the directories in the following order:

1. `/usr/local/bin` - Homebrew version of Vim installed here
2. `/usr/local/sbin`
3. `/usr/bin` - macOS system version of Vim installed here
4. `/bin`
5. `/usr/sbin`
6. `/sbin`
7. `/usr/local/go/bin`

Running `vim` should have picked the Homebrew version of Vim by default. This isn't what was happening.

```plain
~ ❯❯❯ which vim
/usr/bin/vim
```

Why would macOS be ignoring the `PATH` variable?

macOS Catalina included a number of Security & Privacy enhancements that prevent applications accessing certain areas on the disk by default. Apple hasn't given itself a pass and these restrictions also apply to the built in system applications like Terminal.app. This might explain why commands run in the terminal were unable to see certain locations on disk. If `/usr/local/bin` wasn't visible, then the version of Vim installed there wouldn't be found and the system would fall back to using the system version at `/usr/bin`.

![](Screenshot%202019-11-15%20at%2009.23.18.png)

I'd found a smoking gun! On both machines where I'd upgraded to Catalina, Terminal.app did not have full disk access.

![](Screenshot%202019-11-15%20at%2009.23.51.png)

When you grant full disk access to an application you need to quit and restart the application before the changes take effect.

```plain
~ ❯❯❯ which vim
/usr/local/bin/vim
```

Now when I run `vim`, the system finds the Homebrew installed version of Vim. Granting full disk access to Terminal has restored copy and paste using the system clipboard in Vim.

I suspect there are other side effects caused by not enabling full disk access to the Terminal. Most frustrating is the way this silently fails. There was no indication that Terminal.app was being denied access to parts of the disk. My `PATH` variable references locations that exist but were inaccessible. Instead of presenting an error, the system silently ignores the failure. If you've noticed odd behaviour since upgrading to Catalina, check to see that you've granted full disk access to Terminal.app.