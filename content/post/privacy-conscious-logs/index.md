---
title: "Privacy Conscious Web Logs"
date: 2020-03-31T20:16:35Z
description: "Anyone looking for statistics on their blog will find themselves pushed towards the big names in web analytics. In return for statistics, you are encouraged, if not required, to gather more information about your readers than strictly necessary. Even if you gather statistics from your server logs, you are almost certainly logging unnecessary information about visitors. It doesn't have to be this way."
category: tech
---

Anyone looking for statistics on their blog will find themselves pushed towards the big names in web analytics. In return for statistics, you are encouraged, if not required, to gather more information about your readers than strictly necessary. Even if you gather statistics from your server logs, you are almost certainly logging unnecessary information about visitors. It doesn't have to be this way.

I've been attempting to revive my blog recently and wanted some insight into the posts I've published. Inspired by Laura Kalbag's commitment not to track her readers (see "[I don't track you](https://laurakalbag.com/i-dont-track-you/)"), I wondered if I could achieve the same results with my Nginx hosted blog.

The statistics I hope to see are:

* Popular posts
* Popular referrers
* Requests for missing pages

This is a typical log entry for requests received by Nginx.

```plain
80.91.33.133 - - [17/May/2015:08:05:04 +0000] "GET /downloads/product_1 HTTP/1.1" 304 0 "-" "Debian APT-HTTP/1.3 (0.8.16~exp12ubuntu10.16)"
```

This sample log entry contains all the information I need to produce the statistics I'm after. Unfortunately, it contains information I don't need. I don't need your IP address or your browser User-Agent for example.

If I strip this back to only the information I need (and convert to JSON), I end up with the following. Gone is anything that might attribute this request to an individual.

```json
{
  "time_local":"31/Mar/2020:09:53:02 +0000",
  "server_protocol":"HTTP/1.1",
  "status":200,
  "http_referrer":"",
  "query_string":"",
  "request_method":"GET",
  "uri":"/2020/03/25/chinese-practice-sheets/index.html",
}
```

Implementing this in Nginx requires a custom log format. I define this in `nginx.conf`. On Ubuntu, this lives in `/etc/nginx/nginx.conf` by default.

```plain
log_format minimal_json escape=json
'{'
    '"time_local":"$time_local",'
    '"server_protocol":"$server_protocol",'
    '"status":$status,'
    '"http_referrer":"$http_referer",'
    '"query_string":"$query_string",'
    '"request_method":"$request_method",'
    '"uri":"$uri"'
'}';
```

The server configuration needs to be updated to use this log format for the `access_log`.

```plain
access_log /var/log/nginx/billglover.me.log minimal_json;
```

One downside to removing the IP address from your log messages is that you can no longer use popular log analytic packages such as GoAccess. These require the IP address to be present to compile their reports. Ultimately I built a log file analyser to aggregate the statics I want.

{{< figure src="report.png" title="Sample blog statistics" >}}

If you have a different approach to privacy-conscious web analytics, I'd love to hear from you. How do you draw the line between feedback and privacy?