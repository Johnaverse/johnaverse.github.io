---
title: "Johnaverse Fleet & Docker Terraform"
summary: "My infrastructure projects for managing fleet changes and expressing container resources through Terraform."
primaryDomain: cloud
relatedDomains: [ai]
visibility: private
attribution: original
status: active
tags: [Johnaverse Fleet, Docker, Terraform, Configuration management]
order: 6
featured: false
published: true
evidence: []
---

## The challenge

Cloud resources and containers are only part of an environment. The machines running them also need a manageable approach to configuration and updates. I work on Johnaverse Fleet and johnaverse-docker-tf to bring those concerns into my infrastructure workflow.

## My approach

Johnaverse Fleet is the fleet-management part of this work. I use it for deliberate changes to my environment, with attention to when updates happen and how they fit the workloads involved.

johnaverse-docker-tf applies infrastructure-as-code ideas to Docker resources. Together, the projects let me work on host and container concerns without treating each change as an isolated manual task.

## My contribution

I build and maintain the configuration and automation around my own fleet and container environment. My focus is practical: understandable changes, a repeatable process, and a system I can continue to operate as the projects evolve.

## Current scope

The fleet and Docker work sits alongside my cloud Terraform projects, model infrastructure, and backup and monitoring setup. Update policies are chosen according to the workload, including the distinction between controlled fleet changes and automatic container updates.
