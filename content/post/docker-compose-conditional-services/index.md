---
title: "Docker Compose: Conditional Services"
date: 2020-02-21T06:16:35Z
description: "Docker Compose provides a succinct way to define services that make up an application. However it doesn’t allow services to be marked as optional so everything is started by default. In this post I outline a use-case for optional service and show how I defined service dependencies to provide a solution."
---

I recently added a `docker-compose` definition of services to make it easier for people to contribute to the new [CodeBuddies](https://codebuddies.org) back-end. This addresses some of the pain new contributors were feeling with setting up a local development environment. The CodeBuddies backend is an API built using the Django REST Framework. PostgreSQL provides the data store. Everything is fronted by an Nginx reverse proxy. This is often referred to as a [three-tier architecture](https://en.wikipedia.org/wiki/Multitier_architecture#Three-tier_architecture).

In addition to these three core services (web, app, and db) we include two supporting applications to make local development easier; Adminer - a front-end to allow people to explore the database, and Mailhog - a dummy mail server for testing outbound email.

Assuming Docker is installed, contributors are able to start a local development environment by running the following command.

```plain
docker-compose up -d
```

The set-up works really well and we've had great feedback from contributors on Windows, Linux and Mac OS. For the curious, the `docker-compose.yaml` file can be found at [github.com/codebuddies/backend](https://github.com/codebuddies/backend/blob/master/docker-compose.yaml).

We use the same approach to stand up an environment for testing using [GitHub Actions](https://github.com/codebuddies/backend/blob/master/.github/workflows/test.yml). This ensures consistency between tests run by contributors on their local machines and the tests that get run on all pull requests.

When running tests using GitHub Actions, one of the things we aim to do is to give fast feedback to contributors. We don't want to leave them hanging around to find out if the tests have passed. One of the ways we can speed things up is to avoid downloading or starting unnecessary services (Mailhog and Adminer). Unfortunately, the default `docker-compose` behaviour is to start all of the defined services. I wanted a way to only start the services I needed.

## Optional Services

A Docker Compose [proposal to make services optional](https://github.com/docker/compose/issues/1896) was rejected and so this leaves us with a couple of options:

* Use two `docker-compose.yaml` files, one for essential the other for optional service definitions.
* Start services individually with `docker-compose up [service]`.

Using a second `docker-compose.yaml` file to start supporting services would detract from the simplicity of the initial set-up. There is something nice about having a single command to get everything up and running.

```plain
docker-compose -f core.yaml up
docker-compose -f optional.yaml up
```

The alternative suffers the same challenge as each service would need to be started separately.

```plain
docker-compose up db
docker-compose up app
docker-compose up web
```

## Dependency Trees

The `docker-compose` format allows us to [specify dependencies](https://docs.docker.com/compose/compose-file/#depends_on) between services. A logical definition of service dependencies has the added side effect of making it easier to start just the services we need.

{{< figure src="dependency-tree.png" title="Application running in a Pod with sidecar" >}}

/Untitled_Artwork 2.png

By starting the service at the top of a dependency tree, `docker-compose` will also start all the required dependencies. In our scenario we have three required services: `web`, `app`, `db`. We also have two supporting services. To bring up just the services required for testing we start the `web` service.

```plain
docker-compose up web
```

All dependent services are started automatically. Local developers still get the advantages of having everything start with a single command.

```plain
docker-compose up
```

## Summary

Docker Compose provides a succinct way to define services that make up an application. It doesn’t allow services to be marked as optional so everything is started by default. In the event that we only need a sub-set of services to be started, we can use the dependencies between services to start only a subset of the services defined in the `docker-compose.yaml`.

If you have any questions or would like to suggest alternative approaches, you can find me on [Mastodon](https://social.glvr.io/@bill) or [Twitter](https://twitter.com/billglover).
