---
title: "Google App Engine: Service Discovery"
date: 2018-01-06T22:47:51Z
description: "It is possible to run multiple services within a single project on Google App Engine. In this post we explore how to implement rudimentary service discovery within your project. This eliminates the need to maintain separate service URLs during local development."
---

It is possible to run multiple services within a single project on Google App Engine. In this post we explore the use of `ModuleHostname` to implement rudimentary service discovery within a simple App Engine project.

![Which service?](/img/which-service.png)

`<tldr>` Use `hostname, err := appengine.ModuleHostname(ctx, svcName, "", "")` to return the URL based on a service name, `svcName`.

When developing a multi-service application using Google App Engine, I found myself having to change URLs for services as I moved back and forth between my local development instance and the live service. Additionally, the local instance of App Engine varies the URLs allocated to your service depending on the order they are started. Implementing basic service discovery has alleviated the need to maintain separate service URLs during local development and left me free to develop each service in isolation.

To demonstrate how this works, I’m going to take you through a simple greetings service, the requirements for which are outlined below:

1. As a user who has indicated my preferred language is English, I want to be greeted with the phrase “hello”.
2. As a user who has indicated my preferred language is Chinese, I want to be greeted with the phrase “你好”.

I’m going to create a simple project with three services, one that offers greetings in English, another that offers greetings in Chinese, and a default service that selects a greeting based on the language provided by the user. The project is laid out as follows.

```plain
├── README.md
├── greeting
│   ├── app.yaml
│   └── svc.go
├── hello
│   ├── app.yaml
│   └── svc.go
└── nihao
    ├── app.yaml
    └── svc.go
```

## Greeting Services (hello, nihao)

Our two greeting services are similar but I have chosen to run these as separate services for the purposes of illustrating service discovery.

Our first service, `hello` returns greetings in English.

```go
package hello

import (
	"fmt"
	"net/http"
)

func init() {
	http.HandleFunc("/", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello")
}
```

This listens for incoming HTTP requests and responds with the word ‘Hello’. Note, we use the `init()` method instead of `main()` because we are using the AppEngine runtime.

We create a simple application manifest file that tells AppEngine to use the Go runtime and to route all requests to our Go application. Of interest is the first line though. This is where we define our service name, in this case `hello`. This tells AppEngine to treat this application as an individual service.

```yaml
service: hello
runtime: go
api_version: go1

handlers:
- url: /.*
  script: _go_app
```

We  define our second service in a similar fashion, making sure to specify a different service name, in this case `nihao`.

```go
package nihao

import (
	"fmt"
	"net/http"
)

func init() {
	http.HandleFunc("/", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "你好")
}
```

```yaml
service: nihao
runtime: go
api_version: go1

handlers:
- url: /.*
  script: _go_app
```

Now that we have defined these two services, we can launch them using the development server.

```bash
dev_appserver.py hello/app.yaml nihao/app.yaml
```

Take a look at the start-up logs of the development server:

```plain
INFO     2017-12-27 15:34:41,595 devappserver2.py:105] Skipping SDK update check.
INFO     2017-12-27 15:34:41,755 api_server.py:308] Starting API server at: http://localhost:49251
INFO     2017-12-27 15:34:41,808 dispatcher.py:255] Starting module "hello" running at: http://localhost:8080
INFO     2017-12-27 15:34:41,852 dispatcher.py:255] Starting module "nihao" running at: http://localhost:8081
INFO     2017-12-27 15:34:41,866 admin_server.py:146] Starting admin server at: http://localhost:8000
WARNING  2017-12-27 15:34:41,866 devappserver2.py:176] No default module found. Ignoring.
```

We can see the URLs for our two distinct services as shown below. Ignore the warning due to the lack of the default module as we’ll address this later.

* `hello` is at [http://localhost:8080](http://localhost:8080)
* `nihao` is at [http://localhost:8081](http://localhost:8081)

We can now test our `hello` service:

```bash
curl -i http://localhost:8080
```

We should see a response similar to the following:

```plain
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Content-Length: 5
Server: Development/2.0
Date: Wed, 27 Dec 2017 15:46:26 GMT

Hello
```

Our `nihao` service responds similarly:

```bash
curl -i http://localhost:8081
```

```plain
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Content-Length: 6
Server: Development/2.0
Date: Wed, 27 Dec 2017 15:54:24 GMT

你好
```

The development server has started our two services on different ports and they are responding as we’d expect.

Things are a little different when we come to run these services on App Engine proper.

```bash
gcloud app deploy hello/app.yaml nihao/app.yaml
```

At this stage you don’t actually need to run the deployment (you can if you want). We are interested in the summary which should look something like the below.

```plain
Services to deploy:

descriptor:      [./hello/app.yaml]
source:          [./hello]
target project:  [billglover-golang]
target service:  [hello]
target version:  [20171227t161239]
target url:      [https://hello-dot-billglover-golang.appspot.com]


descriptor:      [./nihao/app.yaml]
source:          [./nihao]
target project:  [billglover-golang]
target service:  [nihao]
target version:  [20171227t161239]
target url:      [https://nihao-dot-billglover-golang.appspot.com]


Do you want to continue (Y/n)?
```

Instead of listening on different ports, each of our services is given a unique URL.

* `hello` is at [https://hello-dot-billglover-golang.appspot.com](https://hello-dot-billglover-golang.appspot.com)
* `nihao` is at [https://nihao-dot-billglover-golang.appspot.com](https://nihao-dot-billglover-golang.appspot.com)

We can use these URLs to uniquely address each of our two greetings services.

## Default Service

Now that we have our individual greeting services up and running, we can look to implementing a common service that handles all user requests and returns the appropriate greeting by calling our individual greetings services. We are going to make this our default service for the application.

Every App Engine project has a default service. There are no hard and fast rules dictating how you should use this service, but it is common practice to use this to provision the entry point into the application and this is what we are going to do here.

When implemented, we should have a service that behaves as follows.

* [https://our-service/en/](https://our-service/en/) should respond with the greeting provided by the `hello` service.
* [https://our-service/zn/](https://our-service/zn/) should respond with the greeting provided by the `nihao` service.

Our default service needs to determine the user’s chosen language and then call the appropriate service to get the corresponding greeting. Let’s simulate these responses for now, just to get things up and running.

```go
package greeting

import (
	"fmt"
	"net/http"
)

func init() {
	http.HandleFunc("/en/", handlerEN)
	http.HandleFunc("/zn/", handlerZN)
}

func handlerEN(w http.ResponseWriter, r *http.Request) {
	// TODO: call hello service
	fmt.Fprint(w, "How should we greet you?")
}

func handlerZN(w http.ResponseWriter, r *http.Request) {
	// TODO: call nihao service
	fmt.Fprint(w, "我们应该怎么给你打招呼？")
}
```

Our corresponding application manifest file looks similar to before but with one key difference, the default service doesn’t have a service definition.

```yaml
runtime: go
api_version: go1

handlers:
- url: /.*
  script: _go_app
```

When re-starting the development server, be sure to include the application manifest for the default service.

```bash
dev_appserver.py greeting/app.yaml hello/app.yaml nihao/app.yaml
```

Take a look at the start-up logs of the development server:

```plain
INFO     2017-12-27 16:49:37,490 devappserver2.py:105] Skipping SDK update check.
INFO     2017-12-27 16:49:37,792 api_server.py:308] Starting API server at: http://localhost:49705
INFO     2017-12-27 16:49:37,848 dispatcher.py:255] Starting module "default" running at: http://localhost:8080
INFO     2017-12-27 16:49:37,918 dispatcher.py:255] Starting module "hello" running at: http://localhost:8081
INFO     2017-12-27 16:49:37,989 dispatcher.py:255] Starting module "nihao" running at: http://localhost:8082
INFO     2017-12-27 16:49:38,014 admin_server.py:146] Starting admin server at: http://localhost:8000
```

This time we can see that the warning about the missing service has been replaced with URLs to all three of our services.

* `default` is at [http://localhost:8080](http://localhost:8080)
* `hello` is at [http://localhost:8081](http://localhost:8081)
* `nihao` is at [http://localhost:8082](http://localhost:8081)

We can test our `default` service responds in English:

```bash
curl -i http://localhost:8080/en/
```

```plain
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Content-Length: 24
Server: Development/2.0
Date: Wed, 27 Dec 2017 16:58:50 GMT

How should we greet you?
```

Next we test that it responds in Chinese:

```bash
curl -i http://localhost:8080/zn/
```

```plain
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Content-Length: 36
Server: Development/2.0
Date: Wed, 27 Dec 2017 16:58:55 GMT

我们应该怎么给你打招呼？
```

This dummy response shows us that our `default` service is responding to requests, but before we integrate our `default` service with our `hello` and `nihao` services we should check what the corresponding URLs will be on AppEngine proper.

```bash
gcloud app deploy greeting/app.yaml hello/app.yaml nihao/app.yaml
```

```plain
Services to deploy:

descriptor:      [./greeting/app.yaml]
source:          [./greeting]
target project:  [billglover-golang]
target service:  [default]
target version:  [20171227t171049]
target url:      [https://billglover-golang.appspot.com]


descriptor:      [./hello/app.yaml]
source:          [./hello]
target project:  [billglover-golang]
target service:  [hello]
target version:  [20171227t171049]
target url:      [https://hello-dot-billglover-golang.appspot.com]


descriptor:      [./nihao/app.yaml]
source:          [./nihao]
target project:  [billglover-golang]
target service:  [nihao]
target version:  [20171227t171049]
target url:      [https://nihao-dot-billglover-golang.appspot.com]


Do you want to continue (Y/n)?
```

## Integration

![Which greeting?](/img/which-greeting.png)

Now that we have our three services up and running, we need to integrate them. To do so we need to modify our `default` service so that it queries our `hello` and `nihao` services to determine the appropriate greetings instead of just replying with our canned responses.

```go
package greeting

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

var enSvcURL string
var znSvcURL string

func init() {
	http.HandleFunc("/en/", handlerEN)
	http.HandleFunc("/zn/", handlerZN)

	enSvcURL = "http://localhost:8081/"
	znSvcURL = "http://localhost:8082/"
}

func handlerEN(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	g, err := getGreeting(ctx, enSvcURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Write(g)
}

func handlerZN(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	g, err := getGreeting(ctx, znSvcURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Write(g)
}

func getGreeting(ctx context.Context, url string) ([]byte, error) {
	client := urlfetch.Client(ctx)

	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("unable to query internal service")
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("unable to read response from internal service")
	}

	return body, nil
}
```

We define a new `getGreeting` function  that takes a URL and queries the corresponding service to get the greeting. If the request is successful, it returns the greeting to the caller.

This should now work as expected in English:

```bash
curl -i http://localhost:8080/en/
```

```plain
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Content-Length: 5
Server: Development/2.0
Date: Wed, 27 Dec 2017 18:52:01 GMT

Hello
```

And also in Chinese:

```bash
curl -i http://localhost:8080/zn/
```

```plain
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Content-Length: 6
Server: Development/2.0
Date: Wed, 27 Dec 2017 18:51:59 GMT

你好
```

This appears to be working locally, but it should be obvious that this won’t work if we deploy to the live App Engine environment. The local URLs being passed to the `getGreeting` function will fail once deployed outside of our local environment. We need a mechanism for discovering the correct URLs for these services at run time.

## Service Discovery

Hard coding service end points can result in a number of issues. What happens when we deploy to production? What happens if our development server allocates ports to these services in a different order?  If you don’t believe me, try launching your development server with the following command and see what happens. Do you still get the expected responses to your requests?

```bash
dev_appserver.py greeting/app.yaml nihao/app.yaml hello/app.yaml
```

To fix this, we need a way to discover our service endpoints at runtime. Fortunately for us, App Engine provides the ability to look-up the hostname for a service.

```go
func ModuleHostname(c context.Context, module, version, instance string) (string, error)
```

The `ModuleHostname` function allows you to query the hostname for a service. And so, rather than hard-coding our URLs, we look them up based on the service name. Modifying our code to make use of this function gives us the following.

```go
package greeting

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func init() {
	http.HandleFunc("/en/", handlerEN)
	http.HandleFunc("/zn/", handlerZN)
}

func handlerEN(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	g, err := getGreeting(ctx, "hello")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(g)
}

func handlerZN(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	g, err := getGreeting(ctx, "nihao")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(g)
}

func getGreeting(ctx context.Context, svcName string) ([]byte, error) {
	client := urlfetch.Client(ctx)

	hostname, err := appengine.ModuleHostname(ctx, svcName, "", "")
	if err != nil {
		return nil, fmt.Errorf("unable to find service %s", svcName)
	}

	scheme := "https"
	if appengine.IsDevAppServer() {
		scheme = "http"
	}

	req, _ := http.NewRequest("GET", scheme+"://"+hostname, nil)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("unable to query internal service")
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("unable to read response from internal service")
	}

	return body, nil
}
```

We define a new helper function that takes a context and a service name, looks up the corresponding service hostname and then queries it, returning the greeting to the caller. Now the order you start your services is irrelevant, all requests are routed to the correct service endpoint. No more hard-coded URLs also means this now works as expected to App Engine proper.

## Summary

Rather than hardcoding service URLs in you Google App Engine projects, use the `ModuleHostname` function to query the runtime values of your service URLs based on service name. This ensures you are always using the correct URLs as discovered at runtime.

**Documentation:** [appengine package](https://cloud.google.com/appengine/docs/standard/go/reference#ModuleHostname)  
**Source code:** [billglover/ae-greetings](https://github.com/billglover/ae_greetings)