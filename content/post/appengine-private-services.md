---
title: "Google App Engine: Private Services"
date: 2018-01-24T22:16:51Z
description: "Google App Engine projects can contain multiple services. By default all services are exposed publicly. In this post we explore ways to restrict access to certain services to ensure that they can only be called internally within our project."
---

Google App Engine projects can contain multiple services. By default all services are exposed publicly. In this post we explore ways to restrict access to certain services to ensure that they can only be called internally within our project.

![Which greeting?](/img/which-greeting.png)

Consider the three services used in my previous post on [Service Discovery](https://billglover.me/). We want to ensure that all of our users request their greetings from the default service and directly from either the `hello` or `nihao` services.

With our existing project, all three services are publicly accessible at the following URLs.

* https://billglover-greetings.appspot.com
* https://hello-dot-billglover-greetings.appspot.com
* https://nihao-dot-billglover-greetings.appspot.com

We can test this by calling the  `default` and the underlying `hello` services respectively.

```plain
curl https://billglover-greetings.appspot.com/en/
Hello

curl https://hello-dot-billglover-greetings.appspot.com
Hello
```

Both services are currently accessible to external users.

![All services accessible by default](/img/gae_private_02.png)

We want to restrict access to the `hello` and `nihao` services. There are two ways of doing this:

* login restrictions specified in the manifest
* source request verification headers

## Login Restriction

We can add the login restriction to the manifest file as follows.

```yaml
service: hello
runtime: go
api_version: go1

handlers:
- url: /.*
  script: _go_app
    login: required
  auth_fail_action: unauthorized
```

This requires the user to have logged on before being able to query the service. This prevents us from accessing the pages but isn’t quite what we wanted.

```plain
curl -I https://billglover-greetings.appspot.com/en/
HTTP/1.1 200 OK
content-length: 28
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Date: Sat, 20 Jan 2018 15:54:25 GMT

curl -I https://hello-dot-billglover-greetings.appspot.com
HTTP/1.1 401 Not authorized
Content-Type: text/html
Cache-Control: no-cache
Connection: close
Date: Sat, 20 Jan 2018 15:53:49 GMT
```

This configuration requires users to log in to access our internal service (`HTTP 401` response) which is a step forward. It also doesn’t restrict access to our external service (`HTTP 200` response). Things are looking good so far. But further inspection shows that the call from our external service to our internal greeting service is also failing authorisation. Our internal service is rejecting all requests, not just those that originate externally.

```plain
curl https://billglover-greetings.appspot.com/en/
Login required to view page.
```

![All services accessible by default](/img/gae_private_03.png)

This makes sense as our `default` service doesn’t provide any credentials  to our `hello` service. We need a way to authenticate our internal service calls. Here the App Engine [documentation](https://cloud.google.com/appengine/docs/standard/go/config/appref#handlers_element) describes a special case for the `admin` requirement that looks like it may offer a solution.

> “Note: the admin login restriction is also satisfied for internal requests for which App Engine sets appropriate `X-Appengine` special headers.”

This sounded promising but testing shows that requests originating from our `default` service don’t meet this requirement and using the `admin` login restriction does not alter the behaviour we have seen so far.

## Source Request Verification

App Engine sets the `X-Appengine-Inbound-Appid` on requests made by the URLFetch service ([docs](https://cloud.google.com/appengine/docs/standard/go/appidentity/#asserting_identity_to_other_app_engine_apps)).

> “In your application handler, you can check the incoming ID by reading the X-Appengine-Inbound-Appid header and comparing it to a list of IDs allowed to make requests.”

We can make use of the fact that all services running within the same project will have the same AppID and compare the AppID specified in an inbound request to the AppID of the service handling the request.

```go
source := r.Header.Get("X-Appengine-Inbound-Appid")
target := appengine.AppID(ctx)

if source != target {
    http.Error(w, "forbidden", http.StatusForbidden)
    return
}
```

It is not possible to spoof this header as App Engine strips the header on all inbound external requests.

```plain
curl -I https://billglover-greetings.appspot.com/en/
HTTP/1.1 200 OK
content-length: 28
content-type: text/plain; charset=utf-8
Cache-Control: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
Date: Sat, 20 Jan 2018 15:54:25 GMT

Hello

curl -I https://hello-dot-billglover-greetings.appspot.com
HTTP/1.1 401 Not authorized
Content-Type: text/html
Cache-Control: no-cache
Connection: close
Date: Sat, 20 Jan 2018 15:53:49 GMT

Login required to view page.
```

This is exactly what we want as our default service is accessible to anyone, but our internal services can only be called from within our App Engine project.

![Only default service accessible](/img/gae_private_03.png)

One final thing to note is that this check doesn’t work in the development server and so we need to modify our code slightly to ignore this check in development. I don’t like this hack, but haven’t yet found a way to mark services as internal in development.

```go
source := r.Header.Get("X-Appengine-Inbound-Appid")
target := appengine.AppID(ctx)

if source != target && appengine.IsDevAppServer() == false {
    http.Error(w, "forbidden", http.StatusForbidden)
    return
}
```

If you have an alternate way for limiting access to services in Google App Engine I’d love [to hear](https://twitter.com/billglover) it.