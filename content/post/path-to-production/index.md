---
title: "Your Path to Production"
date: 2020-06-04T06:30:00Z
description: "So you've done the Kubernetes thing, you have micro-services, and use all the frameworks. You've rolled out one or more continuous thing doers and have more metrics than you know how to dashboard. Despite all this, you are struggling to release products as fast as the business would like. It might be time to explore your path to production."
category: tech
---

{{< figure src="Path_To_Prod.png" title="A simplified path to production">}}

So you've done the Kubernetes thing, you have micro-services, and use all the frameworks. You've rolled out one or more continuous thing doers and have more metrics than you know how to dashboard. Despite all this, you are struggling to release products as fast as the business would like.

For many organisations, the path to production is more complex than you may realise. Approvals, compliance controls, and standards boards, are some of the things you'll encounter.

> Do I build a thing? Or do I build a thing to make building things easier?

In various engineering leadership roles, I've toyed with balancing a key question. Should we invest in delivering new features or should we invest in the ability to deliver? The answer is, of course, both, but how do you strike a balance? Since joining Pivotal (now part of VMware), I've begun to re-think how I would approach this. I'd start with my path to production.

One of the most enjoyable things I get to do with customers is to help them explore their path to production. We do this because we can help customers build better software faster. I enjoy these workshops because we always leave learning something new. Customers leave with a visual representation of their path to production.

## Who participates?

We try to involve people from a cross section of the organisation;

* Product Owner
* Engineering teams
* Infrastructure or Operations specialists
* Quality or Test teams
* Support teams
* Shared Services teams
* Management or Executive team

This often comes as a surprise. Customers tend to assume that the path to production is an engineering concern. When we involve all teams, we find the resulting conversation to be far more fruitful. Teams are generally pretty good at optimising processes within their control. It's the parts where teams need to communicate that we find the greatest challenges.

## Do I have a problem?

To give you an example, in my last engineering team, we took great pride in our ability to ship 20-30 new services a day. This didn't happen overnight and took some significant effort to get to this point. Despite this, a common complaint from our users was that it was taking too long to build services. We were too slow to incorporate change. How can both be true?

When looking at our ability to ship code, we were doing quite well. Regular code deployments to production saw to that. It wasn't until we looked at the path from idea to production that we realised we'd optimised for the wrong thing. We aren't the only ones to have missed optimisations in what can be a complex process.

We don't start these workshops on the premise that a customer is doing something wrong. Many organisations have made significant progress in optimising their path to production. We tend to run these as exploratory workshops centred on a key question: "What can we learn about our path to production?". This approach helps to encourage participation in the workshop.

## The Path to Production

The typical path to production for an enterprise will include the following steps.

1. Idea - gain sponsorship for an idea
2. Approval - get architectural, business or financial approvals
3. Design - understand the idea and shape solution
4. Engineer - turn the solution into a product
5. Test - confirm the product does what it should 
6. Deploy - push the code
7. Release - let users have access
8. Maintain - repeat the above

{{< figure src="Path_To_Prod 2.png" title="A simplified path to production with agile loop">}}

The path to production is remarkably similar across organisations. This similarity means we often begin a workshop with a template.

"But that looks very waterfall," I hear you cry. "We are Agile!" It's true, many organisations have made significant investments in agility. What we tend to find is that this move towards agility happens within a subset of process. Zoom out enough, and the waterfall structure starts to re-emerge. That said, we aren't wedded to the template. We can always change the template to fit a the customer's operating model.

## Areas of Interest

During the workshop, we  ask participants to add steps, pain points, and people to the template. We try to help by asking probing questions. It doesn't take long before patterns start to emerge. People get passionate about certain areas of pain. Suggestions for improvement begin to flow.

Whilst customer challenges are always unique, common themes begin to emerge. As you read through the list below, I'd encourage you to think about your path to production. Are there any similarities?

* **It starts with an idea** - but many ideas die before they even get discussed. It is often unclear how individuals get sponsorship or support to take an idea forward. In the cases where an idea garners interest, securing backing can take time. Any friction here saps energy at a time when passion is at its greatest.

* **The approvals processes** - often stall because they need information that is not known at the time. Requests for approval  often go through several iterations before it gets the go-ahead. In looking for certainty at a point where much remains unknown, these early stage approvals often introduce risk.

* **Up-front design** - often involves more that a few wireframes. The design phase is often where an idea first encounters standards boards and governance procedures. It is common for new ideas to deviate from existing standards. This further delays things as standards are updated or exceptions made.

* **Testing and test environments** - often introduce hidden dependencies. Many organisations mandate the use of a shared test environment. These shared test environments, often used for regression testing, are notoriously unstable. Test data is often a challenge when working with legacy systems. Time in the test environments is often a scarce resource.

* **Transition points between teams** - often yield hidden pain. The transition of artefacts between teams is rarely a pain point. The transition of context is another story altogether. Design decisions, edge cases, scope boundaries, etc. all make context transition challenging. These transitions tend to get worse, the closer to production you get.

* **Risk mitigation steps** - although well intentioned, are notoriously frustrating for engineering teams. These take the form or release boards, readiness checklists, or change management processes. They aim to ensure quality, and avoid taking risky products into production. They are usually found at the end of the path to production and act as the final arbiters before a product is released. These controls tend to focus on the application of known solutions and have long since lost sight of the risks they hoped to mitigate.

* **External asks or dependencies** - often lead to delays. It takes time to provision machines or clusters. Firewall ports need opening (but never closing). Specialist tests need scheduling to confirm security or performance. The complexity increases as these requests often span contractual boundaries. I've seen it take longer to deliver these dependencies than it takes to deliver the product. Encounter any of these on your path to production and you'll come to a grinding halt.

## Conclusion

So why do we do these workshops? Customers benefit, with a consolidated view of their path to production. Various 'aha' moments translate into immediate action. The real value in these workshops is that customers start to change how they invest in engineering.

We tend to think of the path to production as a technical challenge. But the challenges are often far less technical than we may think. Try this yourself. As you explore your own path to production, make a note of how long each step takes. Do the results highlight any areas for investment?

When you've done this, let me know the craziest step or process you uncover.