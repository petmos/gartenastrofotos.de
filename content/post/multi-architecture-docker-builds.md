---
title: "Multi Architecture Docker Builds"
date: 2018-10-30T00:02:59Z
description: "Docker has had the ability to build multi-architecture images for a while. I’ve never had cause to use it, until now. In this post I’ll walk through building a docker image that should work on your laptop and a Raspberry Pi."
---

Docker has had the ability to build multi-architecture images for a while. I’ve never had cause to use it, until now. In this post I’ll walk through building a docker image that should work on your laptop and a Raspberry Pi.

We'll cover the following:

1. A simple test application
2. Building docker images for each architecture
3. Wrapping images in a multi-architecture manifest
4. A small gotcha
5. Testing our images

## The Application

Before we can begin building our containers, we need an application to package. We'll use this small Go program. When executed, it displays the operating system and CPU architecture it. In this example, we expect to see `arm` (Raspberry Pi) or `amd64`  (MacBook). In both cases we'll be running on Linux.

```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("Hello, 世界!")
	fmt.Println("GOOS:", runtime.GOOS)
	fmt.Println("GOARCH", runtime.GOARCH)
}
```

```plain
$ go run main.go
Hello, 世界!
GOOS: darwin
GOARCH amd64
```

## Building Docker Containers

Although we promise "multi-architecture" builds, we start by building two architecture specific images.

Create the following Dockerfile. I've named it `Dockerfile-amd64` as it builds an `amd64` version of our application (note the `GOARCH=amd64`).

```plain
FROM golang:1.11.1-alpine as build

RUN apk add --update --no-cache ca-certificates git
RUN mkdir /app
WORKDIR /app
COPY . .

RUN GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -ldflags="-w -s" -o /go/bin/app

FROM scratch
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /go/bin/app /go/bin/app
ENTRYPOINT ["/go/bin/app"]
```

Build and tag the image.

```plain
$ docker build -f Dockerfile-amd64 -t billglover/hello-arch:amd64 .
```

Run the container to test things are working as expected.

```plain
$ docker run billglover/hello-arch:amd64
Hello, 世界!
GOOS: linux
GOARCH amd64
```

Next we want to build the `arm` version of our application (note the `GOARCH=arm`). I've named this file `Dockerfile-arm`.


```plain
FROM golang:1.11.1-alpine as build

RUN apk add --update --no-cache ca-certificates git
RUN mkdir /app
WORKDIR /app
COPY . .

RUN GOOS=linux GOARCH=arm go build -a -installsuffix cgo -ldflags="-w -s" -o /go/bin/app

FROM scratch
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /go/bin/app /go/bin/app
ENTRYPOINT ["/go/bin/app"]
```

Build and tag the image.

```plain
$ docker build -f Dockerfile-arm -t billglover/hello-arch:arm .
```

## Multi-Architecture Manifest

We need to push these images to the repository before creating the combined manifest. It isn't clear why we need to do this, but I ran into issues if I didn't.

```plain
$ docker push billglover/hello-arch:amd64
$ docker push billglover/hello-arch:arm
```

Create the multi-architecture manifest.

```plain
$ docker manifest create billglover/hello-arch billglover/hello-arch:amd64 billglover/hello-arch:arm
Created manifest list docker.io/billglover/hello-arch:latest
```

The syntax of this command may not be obvious. The first argument, `billglover/hello-arch` is the name of our multi-architecture manifest. The remaining arguments are the images we want to include.

In theory this should be all we need to do. If we were using architecture specific base images then everything would be fine. We are using the `scratch` image which is architecture agnostic. Take a look inside the multi-architecture image to see why this is a problem.

```plain
$ docker manifest inspect billglover/hello-arch
```

```json
{
   "schemaVersion": 2,
   "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
   "manifests": [
      {
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "size": 737,
         "digest": "sha256:c604e3508da0da4ba367c3a55dab35f8f45f71111e267b967e0a2680cd0e858a",
         "platform": {
            "architecture": "amd64",
            "os": "linux"
         }
      },
      {
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "size": 737,
         "digest": "sha256:3a651a5dca947eac3dbbdd24f7897c67623c040d37491d67b1e86e26b2bb687e",
         "platform": {
            "architecture": "amd64",
            "os": "linux"
         }
      }
   ]
}
```

The architecture of both images inside our manifest is `amd64`. We need to fix this.

```plain
$ docker manifest annotate --arch arm billglover/hello-arch billglover/hello-arch:arm
```

This corrects the architecture in our manifest list.

```json
{
   "schemaVersion": 2,
   "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
   "manifests": [
      {
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "size": 737,
         "digest": "sha256:c604e3508da0da4ba367c3a55dab35f8f45f71111e267b967e0a2680cd0e858a",
         "platform": {
            "architecture": "amd64",
            "os": "linux"
         }
      },
      {
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "size": 737,
         "digest": "sha256:3a651a5dca947eac3dbbdd24f7897c67623c040d37491d67b1e86e26b2bb687e",
         "platform": {
            "architecture": "arm",
            "os": "linux"
         }
      }
   ]
}
```

Push the multi-architecture manifest.

```plain
$ docker manifest push billglover/hello-arch
sha256:1039beac1f79e22b882200788b82cb8b8b195c352eab50e30e8e418527a47561
```

## Testing

Running the multi-architecture image locally (`amd64`):

```plain
$ docker run billglover/hello-arch
Hello, 世界!
GOOS: linux
GOARCH amd64
```

Running the multi-architecture image on a Raspberry Pi (`arm`):

```plain
pi@node-01:~ $ docker run billglover/hello-arch
Hello, 世界!
GOOS: linux
GOARCH arm
```

## Summary

It is possible you will never need to work with more than one CPU architecture. If you do, it is reassuring to know that Docker has you covered. The solution is a manifest list, containing two or more architecture specific images. Docker will select the correct image at runtime.
