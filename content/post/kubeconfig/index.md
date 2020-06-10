---
title: "How I Manage Kubernetes Config"
date: 2020-06-12T06:00:00Z
description: "If you work with Kubernetes, you'll be aware of the config file that defines contexts. This config is what `kubectl` uses to gain access to a cluster. I work with a large number of ephemeral clusters and have found that this config is difficult to manage. This post shows how I've switched to using individual config files for each cluster."
category: tech
---

{{< figure src="kubeconfig.png" alt="Image showing a roll of toilet paper covered in kubeconfig YAML.">}}

If you work with Kubernetes, you'll be aware of the config file that defines contexts. This config is what `kubectl` uses to gain access to a cluster. I work with a large number of ephemeral clusters and have found that this config is difficult to manage. This post shows how I've switched to using individual config files for each cluster.

## Challenge

The structure of the config file provides flexibility. This flexibility makes it difficult to delete clusters, leading to stale config entries.

```yaml
apiVersion: v1
clusters:
- cluster:
    server: ""
  name: development
- cluster:
    server: ""
  name: scratch
contexts:
- context:
    cluster: "development"
    user: "developer"
  name: dev-frontend
- context:
    cluster: "development"
    user: "developer"
  name: dev-storage
- context:
    cluster: "scratch"
    user: "experimenter"
  name: exp-scratch
current-context: exp-scratch
kind: Config
preferences: {}
users:
- name: developer
  user: {}
- name: experimenter
  user: {}
```

Ignoring the metadata, there are three top level resources.

* Clusters - a definition of clusters
* Users - a definition of users
* Contexts - a mapping of users to clusters and namespaces

These three resources work together to enable cluster access. A user without a context doesn't get you very far. A context without a cluster  is equally unhelpful.

These three resources work together to enable cluster access. A user without a context doesn't get you very far. A context without a cluster is unhelpful.

Let's look at what happens when you remove a cluster from your config. We start with two clusters configured; `development` and `scratch`.

```plain
~/.kube ❯❯❯ kubectl config get-clusters
NAME
development
scratch
```

There are three configured contexts; two for `development`, and one for `scratch`.

```plain
~/.kube ❯❯❯ kubectl config get-contexts
CURRENT   NAME           CLUSTER       AUTHINFO       NAMESPACE
          dev-frontend   development   developer
          dev-storage    development   developer
*         exp-scratch    scratch       experimenter
```

If we no longer need the `development` cluster, we want to remove it from our local configuration.

```plain
~/.kube ❯❯❯ kubectl config delete-cluster development
deleted cluster development from /Users/bglover/.kube/config
```

Everything looks good so far. We no longer have a `development` cluster configured.

```plain
~/.kube ❯❯❯ kubectl config get-clusters
NAME
scratch
```

But configuration for our contexts remains untouched. We only removed the cluster entry from the config file.

```plain
~/.kube ❯❯❯ kubectl config get-contexts
CURRENT   NAME           CLUSTER       AUTHINFO       NAMESPACE
          dev-frontend   development   developer
          dev-storage    development   developer
*         exp-scratch    scratch       experimenter
```

We now have two stale contexts as their associated cluster no longer exists.


To remove these contexts from your `config` file, you need to break out your favourite YAML editor. This is straightforward for our example config, but is challenging with large config. The propensity to use familiar sounding context or cluster names (`development` anyone?) makes it likely you'll trip yourself up by deleting the wrong entry.

> 💡 Project Idea - Build a tool to tidy the `kubectl` `config` file. Focus on removing stale entries."

On more than one occasion I've resorted to deleting all config and starting from scratch. I wanted a better solution.

## Solution


Before I jump into the solution, a small story.

> I went to support someone who was having difficulty using an early version of Microsoft Word. As we talked through the problem, It dawned on me that they were using a single file to store all their documents. When they needed to create a new document, they'd scroll to the end and start a new page. This was a system that worked for them. Everything was in one place and it was searchable. Printing individual documents involved selecting the appropriate page range. Needless to say, this model didn't work for me at all.

I'm reminded of this anecdote every time I open my default config file. Using a single file to store unrelated cluster configuration wasn't working for me. I wanted to give each cluster its own configuration file.

Here are some requirements:

1. Keep the ability to continue to use `kubectx` and `kubens` to switch the active context.
2. Creating a config file for a new cluster makes it available for use.
3. Deleting the config file for a cluster removes all the associated configuration.

## Implementation

`kubectl` decides where to look for configuration based on three parameters.

1. A single configuration file specified using the `--kubeconfig` flag
2. An ordered list of config files pecified in the `KUBECONFIG` environment variable (envar).
3. A named config file in the home directory, `~/.kube/config`

The `KUBECONFIG` envar is the option that allows us to specify many config files. `kubectl` reads these files in order and, in the case of conflict, the first file to set a value wins. Note that `KUBECONFIG` needs to point to a colon separated list of files. You can't pass it a folder.

```plain
~/.kube ❯❯❯ echo $KUBECONFIG
/Users/bglover/.kube/custom-contexts/scratch.yaml:/Users/bglover/.kube/custom-contexts/development.yaml:/Users/bglover/.kube/config
```


Note that `KUBECONFIG` needs to point to a colon separated list of files. You can't pass it a folder.I needed a way to set `KUBECONFIG` based on the contents of a folder.

I store all my configuration files in a folder, `$HOME/.kube/custom-contexts`. A script runs on each new shell. It scans this folder for config files and constructs the appropriate `KUBECONFIG` definition.

```bash
#!/bin/sh
DEFAULT_CONTEXTS="$HOME/.kube/config"
if test -f "${DEFAULT_CONTEXTS}"
then
    export KUBECONFIG="$DEFAULT_CONTEXTS"
fi

CUSTOM_CONTEXTS="$HOME/.kube/custom-contexts"
mkdir -p "${CUSTOM_CONTEXTS}"

OIFS="$IFS"
IFS=$'\n'
for file in `find "${CUSTOM_CONTEXTS}" -type f -name "*.yml" -or -name "*.yaml"`
do
        export KUBECONFIG="$file:$KUBECONFIG"
done
IFS="$OIFS"
```

This script ([set-kubeconfig.sh](https://gist.github.com/billglover/b1b47a458673ceebd0e1d95bcb33ad11)) performs the following actions:

* adds the default config file location to `KUBECONFIG` if it exists
* creates the `~/.kube/custom-contexts` folder if it doesn't exist
* add each file in the `custom-contexts` folder to the `KUBECONFIG` variable

The `IFS` variable, this defines the Internal Field Separator. This is the string bash uses to separate fields, in this case a new line. See this [Stack Overflow](https://unix.stackexchange.com/a/184867) answer for a full explanation.

Now you can store cluster config in separate YAML files.

```plain
~ ❯❯❯ tree .kube
.kube
├── config
├── custom-contexts
│   ├── development.yaml
│   └── scratch.yaml
```

`kubectl config get-clusters` now shows a combined cluster list across all config files.

```plain
~/.kube ❯❯❯ kubectl config get-clusters
NAME
development
scratch
```

Whenever you want to use a new cluster, create a config file and drop it in the `~/.kube/custom-contexts/` folder. To remove the configuration for a cluster, delete the file.

### Bonus Tip

Some cluster lifecycle management tools assume you want to store all config in a common file. I've often found myself adding config to the default file without realising it. If this happens, the following trick helps extract all config for a context into a single file.

```plain
kubectl --context dev-frontend config view --minify --flatten
```

There will always be a degree of friction when working with many Kubernetes clusters. Keeping cluster configuration in dedicate config files has improved my workflow. If you find yourself in a similar position, try out these tips. That said, if you've found a different way to manage cluster configuration, I'd love to hear about it.