---
title: "Go App Engine"
date: 2018-10-22T13:56:58+01:00
description: "Google recently announced an update to App Engine that brings support for the Go 1.11 runtime. This release also enables the deployment of standard Go applications on App Engine. In this post, I show you how."
---

Google recently announced an update to App Engine that brings support for the Go 1.11 runtime. This release also enables the deployment of standard Go applications on App Engine. In this post, I show you how.

## Our Application

The application we’ll be working through is  simple. It returns the IP address of the user, nothing more.

> **Requirement #1:** As someone who wants to allow others access to my home network, I need to know my external IP address.

## Pre-Requisites

If you want to deploy this application yourself, I'm going to make a couple of assumptions:

1. You have Go installed and know how to build/run a simple application ([start here](https://golang.org/doc/install)).
2. You have a Google Cloud account and created a project that allows you to deploy to App Engine ([start here](https://cloud.google.com/appengine/docs/standard/go111/quickstart)).
3. You have the latest version of the Google Cloud SDK installed, along with the beta components ([start here](https://cloud.google.com/appengine/downloads)).

If you don’t have these set-up, don’t worry. You should still be able to follow along. The ease of publishing to Google App Engine will encourage you to give it a try.

## Determining the IP address

Before we can write our application, I want to touch on how we can identify the user's IP address. The Go Standard Library provides the `RemoteAddr` property on [`http.Request`](https://golang.org/pkg/net/http/#Request).

```go
// RemoteAddr allows HTTP servers and other software to record
// the network address that sent the request, usually for
// logging. This field is not filled in by ReadRequest and
// has no defined format. The HTTP server in this package
// sets RemoteAddr to an "IP:port" address before invoking a
// handler.
// This field is ignored by the HTTP client.

RemoteAddr string
```

You might think we could use this property to determine the IP address of the user. Often you can, but if your application sits behind a load balancer or reverse proxy this doesn't work. When we deploy on App Engine, this is exactly the scenario we have. The [App Engine Architecture](https://cloud.google.com/solutions/architecture/webapp) shows that our application will sit behind the Google Load Balancer. As a result the `RemoteAddr` property is set to the address of the load balancer and not that of the requestor.

This is set-up is so common that load balancers often set a header to get round this. The [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) documentation describes this header header as follows.

> "The X-Forwarded-For (XFF) header is a de-facto standard header for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or a load balancer. When traffic is intercepted between clients and servers, server access logs contain the IP address of the proxy or load balancer only. To see the original IP address of the client, the X-Forwarded-For request header is used."

```plain
X-Forwarded-For: 109.148.211.158
```

We will be using the XFF header to identify the IP address of requestor and return it in the response.

***Note:*** If the request passes through more than one load balancer, the header may contain several addresses. In this example, I am going to assume that this is not the case and that we only have a single IP address as shown above.

## The Code

This is our `main.go` file.

```go
package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("environment variable PORT is required")
	}

	http.HandleFunc("/ip", handler)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handler(rw http.ResponseWriter, req *http.Request) {
	xff := req.Header.Get("X-Forwarded-For")
	ip := net.ParseIP(xff)

	if ip == nil {
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	fmt.Fprintln(rw, ip)
}
```

We can run the application on our local machine. But we'll need to set the `PORT` environment variable before execution.

```plain
PORT=8080 go run main.go
```

Test the service with cURL in a separate terminal window.

```plain
curl -i -H 'X-Forwarded-For: 127.0.0.1' http://localhost:8080/ip
HTTP/1.1 200 OK
Date: Mon, 22 Oct 2018 13:34:15 GMT
Content-Length: 10
Content-Type: text/plain; charset=utf-8

127.0.0.1
```

So far, this is a standard Go application that compiles to a single binary. We’ve done nothing to support the App Engine deployment target. In the previous edition of App Engine we would have had to do the following.

* Import `google.golang.org/appengine`
* Register our handlers in the `init()` method
* Leave out the `main()` function

Without the `main()` function, this would not compile to a standalone application. The code would be App Engine specific. 

There were further changes required if your application needed to make outbound requests. As we don’t make outbound requests from our application, I’m going to skip over these. An example of a project built for earlier App Engine releases is available here: [github.com/billglover/ae_greetings](https://github.com/billglover/ae_greetings/blob/master/greeting/svc.go).

## Deployment

The latest release of App Engine gets rid of these platform specifics. We are now able to write standard Go applications and deploy them to App Engine.

Create a file called `app.yaml` in the same folder as `main.go`.

```yaml
runtime: go111
```

You can now deploy your App with the following command.

```plain
gcloud app deploy
```

If you want to avoid having to respond to the prompt you can use the `--quiet` flag.

```plain
gcloud app deploy --quiet
```

When the deployment is complete, the client will display the URL to your application. You can  open it in your default browser with the following command.

```plain
gcloud app browse
```

If everything worked, you should see a browser tab open showing your external IP address.

That is all we need to do to deploy a standard Application to App Engine. There are further configuration options to control the behaviour of your application. None of these are essential, but I chose to limit the number of instances I run. Documentation for the full set of options is available here: [app.yaml Configuration File](https://cloud.google.com/appengine/docs/standard/go111/config/appref)

```yaml
runtime: go111

automatic_scaling:
  min_instances: 0
  max_instances: 1
```

## Summary

In this post we have covered the following:

* Created a Go application that displays the IP address of the requestor
* Ran the application on our local machine and tested it with cURL
* Deployed the application on App Engine
* Tested the public deployment by making a request in our browser

This example shows how to deploy a standard Go application to Google App Engine. It shows that this is possible without writing specific App Engine code. This is a significant improvement and makes the platform an attractive deployment option for Go services.

Full code is available on GitHub: [github.com/billglover/localname](https://github.com/billglover/localname/tree/0553ea4ffbd2fd116a2a222fa3c2e7c660ff61d1/cmd/server). Issues and Pull Requests are welcome.