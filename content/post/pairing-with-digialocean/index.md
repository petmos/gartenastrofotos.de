---
title: "Remote Pairing Made Easy"
date: 2020-12-09T15:37:00Z
description: "We have many options for remote pairing on code. I recently tried pairing using tmux. Whilst it sounds like this might be fiddly to set-up, my experience was the opposite. Delightfully simple, lightning fast pairing."
category: tech
---

We have many options for remote pairing on code. Each brings different trade-offs to the challenge of remote productivity.

* Screen Sharing (e.g. Zoom, [Whereby](https://whereby.com/user), etc.)
* Shared IDE (e.g. [VSCode Live Share](https://docs.microsoft.com/en-us/visualstudio/liveshare/use/vscode))
* Dedicated collaborative coding tools (e.g. [GitDuck](https://gitduck.com))
* The good old fashioned terminal

I'm not going to go into which of these is the best pairing option, each have their merits. COMBINE.. But the last of these, the terminal, is often overlooked. If considered, the perceived set-up costs often push us towards an alternative solution.

But how hard is it to set up a shared terminal environment? My recent experience of using [Digital Ocean](https://m.do.co/c/180ade3e9e88) to set-up a session was delightfully simple. I thought it worth sharing. You don't need to use Digital Ocean, but the ease with which you can create teams was a real bonus. If you frequently pair with the same people, I'd recommend giving this a try.

### Add People to a Digital Ocean Team

This step isn't required, but is recommended. Add everyone to a Digital Ocean team and get them to provide an SSH key. Doing so  simplifies the process for setting up your Droplet.

{{< figure src="ssh_keys.png" alt="Digital Ocean console showing multiple SSH keys">}}

In this example I've created two different team members with separate SSH keys. We can list these on the command line.

```
bg@mars do-pairing % doctl compute ssh-key list 
ID          Name       FingerPrint
29105588    bg-mb      1b:da:9e:53:ce:2d:f7:c3:da:09:31:01:72:cf:7e:d0
29105581    bg-iMac    88:87:b1:c4:8f:cd:97:9e:b4:a1:66:c3:89:41:94:80
```

### Create a Droplet

Unless you know you need something more, I'd go with the smallest Droplet on offer. You can do this through the UI or on the command line.

```
bg@mars do-pairing % doctl compute droplet create pair-station --region lon1 --size s-1vcpu-1gb --image ubuntu-20-04-x64 --ssh-keys 29105581,29105588
```

The key thing you need to do here, is to make sure you include the SSH key IDs for each of team members you'll be pairing with. This will allow them to access the droplet.

### Log in to the droplet.

```
ssh -i ./do_bg_mb root@134.209.22.160
```

Here I'm specifying which SSH key I want to use, `-i ./do_bg_mb`. You don't need to do this if you are using the default key.

### Start a `tmux` session

```
tmux new -s pairing
```

One of the team needs to start a `tmux` session. It doesn't really matter who. Keep things tidy by giving your session a name `-s pairing`.

### Connect to the session

```
tmux attach -t pairing
```

Everyone else who wants to join the session can do so using the session name.

{{< figure src="pairing_session.png" alt="Two views of the same tmux session">}}

You can now use the shared session as if you were using keyboards and monitors plugged in to the same machine. You'll get lightning fast response times and good resilience to network delays. Tmux even handles differences in window sizes. There is no scrolling or scaling here. Everyone shares the size of the smallest window.

In summary, this method of pairing may feel raw, and it does need you to be comfortable using the terminal. That said, it was delightfully simple to set up and would would be my pairing set-up of choice. If you want to give it a try, start with a $100 [Digital Ocean](https://m.do.co/c/180ade3e9e88) credit and create your first Team.

For a more in-depth look at pairing using tmux, I highly recommend [How to pair-program remotely and not lose the will to live](https://queenofdowntime.com/blog/remote-pair-programming) by Claudia Beresford.

## Improve your set-up

* Create a set-up that doesn't use the root user
* Create a shared tmux / vim config
* Should you do this with your local machine?
