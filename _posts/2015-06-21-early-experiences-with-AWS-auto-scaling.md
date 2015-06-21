---
layout: post
date: 2015-06-21 15:00:00
title: Early Experiences with AWS Auto-Scaling
comments: true
---

I recently attended an Architecting on Amazon Web Services course in London. The course itself was a mixture of theory, discussion and hands on labs. Often these courses tend to be overly prescriptive when it comes to the labs. The instructions were more detailed than many of the early Lego kits I used to play with growing up. And, whilst it works for some, I've never found that following the instructions is an effective way to learn.

The idea behind one of the labs was that we would use an auto-scaling group to expand and contract our EC2 instances in response to changes in the load on the system. I added a little monitoring to better observe what was going on as we ran through the lab.

![AWS Auto Scaling](/assets/AWS_AutoScalingGroups.png "Figure 1: auto-scaling groups in action")

My interpretation of system behaviour follows, but feel free to leave a comment below if you believe I've misinterpreted what I'm seeing.

 1. The auto-scaling group expands to our minimum number of instances.
 2. Load increases above our upper bound (60% CPU Utilisation).
 3. 
   a. Two additional instances spin up to handle the increased load.
   b. The load reduces until it falls within our normal operating range.
 4. The load increases again causing two further instances to be created.
 5. The load drops briefly below our lower bound (40% CPU Utilisation) but it doesn't stay below this threshold long enough to begin reducing the number of running instances.
 6. The load again increases above our upper bound but we are already at the maximum number of instances and so no further instances are created.
 7. 
   a. The load again drops below our lower bound but this time for long enough to take action.
   b. Two instances are shut down leaving four instances to handle the remaining load.
   c. As a result of reducing the number of instances, the load again increases above upper bound.
   d. This causes two new instances to be created to handle the load.
 8. The cycle repeats as reducing the number of instances available increases the load on remaining instances which in turn triggers new instances to be created.

 I believe the intent of the lab, was that it would finish at step 7c after we had successfully demonstrated the contracting auto-scaling group. I'm glad I let it run on as it has highlighted an aspect of auto-scaling that wasn't covered by the course in any great detail: system osciliations.

## System Oscilation

The behaviour we see here is undesirable as for small changes in input load we see large changes in the system behaviour: In this case, the unnecessary spinning up and shutting down of EC2 instances. At the very least this behaviour drives up the costs of using AWS but in the worse case, may make overall system behaviour worse.

There are a couple of tools we have at our disposal to try and prevent this scenario but, in general, we need to approach performance testing, monitoring and operations a little differently to the more traditional scenario where infrastructure and capacity is more rigid.

Unfortunately there was only so much experimentation I could do in the laboritory environment. I'd love to be involved in a larger scale system under more realistic load conditions to explore this a little further. The course most definitely piqued my interest.