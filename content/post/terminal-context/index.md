---
title: "Conveying Context at the Terminal"
date: 2020-07-02T06:00:00Z
description: "I’ve run a few workshops recently that have involved streaming live terminal sessions to remote participants. During these workshops, we explore how different personas interact with Kubernetes. As we work through the topics, we switch between various personas. The terminal provides few visual clues as to the active persona. We can fix that."
category: go
---

{{< figure src="terminal_context.png" alt="A screenshot of the terminal showing a badge identifying the context">}}

I’ve run a few workshops recently that have involved streaming live terminal sessions to remote participants. During these workshops, we explore how different personas interact with Kubernetes.

* *The Infrastructure Admin* - provides compute and storage
* *The DevOps Engineer* - provides clusters and capabilities
* *The Application Developer* - builds applications

These workshops are good fun to run, but it is difficult to balance the narrative with typing into the terminal. As we work through the topics, we switch between various personas. Participants often try to relate what they see on screen to the role they perform at work?

During workshop planning, I do my best to structure the session so we minimise context switching. But some context switching is inevitable. It is here that the terminal environment presents a few challenges.

1. There are no visual cues to the active persona. This leaves people trying to remember who would perform the task.
2. Different personas use the same tools, but different authorisation results in subtle differences in behaviour.

I’ve been using a trick to make things a little clearer, both for me and the workshop participants. I use `direnv` ([direnv.net](https://direnv.net/)) to set-up directory specific configuration. This is how I lay out the base directory structure.

```plain
~/d/d/v7k8s ❯❯❯ tree -L 1 -a
.
├── .envrc    // 📝 workshop config, e.g. path
├── admin.    // 👨🏾‍💻 folder for the infrastructure admin
├── appdev.   // 👩🏾‍💻 folder for the application developer
├── bin.      // 💾 folder for workshop specific binaries
└── devops.   // 🧑🏾‍💻 folder for the devops engineer
```

I create one directory for each persona that I will be using. Within each directory I create an `.envrc` file. `direnv` uses this file to set-up the persona. An example of this structure from a recent workshop is below.

```plain
~/d/d/v7k8s ❯❯❯ tree -L 2 -a
.
├── .envrc
├── admin
│   ├── .envrc             // 📝 environment for Infra Admin
│   └── config             // 📝 kubeconfig for Infra Admin
├── appdev
│   ├── .envrc
│   └── config
├── bin                    // 📂 prepended to PATH
│   ├── kubectl            // 💾 kubectl
│   └── kubectl-vsphere    // 💾 plugin for kubectl
└── devops
    ├── .envrc             // 📝 environment for DevOps Eng
    ├── cluster.yaml
    ├── config             // 📝 kubeconfig for DevOps Eng
    ├── deployment.yaml
    └── service.yaml
```

The magic happens within the `.envrc` files nested within each directory. `direnv` uses these files to set environment configuration based on the current directory.

At the parent level, we pre-pend the `PATH` variable with a local `./bin` directory to allow me to use workshop specific versions of binaries. The purpose of the `printf` will become clear shortly.

```plain
PATH_add bin
printf "\e]1337;SetBadgeFormat=\a" 
```

Within each of the directories, a second `.envrc` file defines persona specific configuration.

```plain
source_up
export KUBECONFIG=config
printf "\e]1337;SetBadgeFormat=%s\a" $(echo -n "DevOps Engineer" | base64)
```

Here I have defined the following actions:

1. Load the parent level `.envrc` to set our path.
2. Set `KUBECONFIG` so that our contexts remain scoped to this persona.
3. Print an escape sequence that sets the console badge in iTerm2 (see documentation on [badges](https://iterm2.com/documentation-badges.html)).

The `printf` in the parent `.envrc` clears the badge whenever you navigate to the parent folder.

{{< figure src="terminal_context.gif" alt="Animated screenshot of the terminal showing how the badge changes when we switch personas">}}

With this set-up, I can switch between personas by changing directories. As I do, `direnv` updates the badge on the terminal to highlight the current persona.

One last thing to note is that, by default, `direnv` prints a summary of directory specific configuration when you change directories. Here I’ve disabled this by setting the `DIRENV_LOG_FORMAT` environment variable.

```plain
export DIRENV_LOG_FORMAT=
```

I find live streaming my work challenging. It is something I’m working on improving, and the current emphasis on remote work is giving me ample opportunity to practice. I’d be really interested in hearing any tips you may have for bringing clarity to a streamed work environment.

### Tech Used:
* [iTerm2](https://iterm2.com/) - a terminal emulator for Mac OS that does amazing things.
* [Nord theme](https://www.nordtheme.com/) - an arctic, north-bluish color palette.
* [direnv](https://direnv.net/) - unclutter your .profile.
* [zsh](https://www.zsh.org/) - a Unix shell