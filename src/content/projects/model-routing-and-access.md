---
title: "Model routing & controlled access"
summary: "LiteLLM routing and Cloudflare Zero Trust around the model infrastructure used by my tools and AI workflows."
primaryDomain: ai
relatedDomains: [cloud, cybersecurity]
visibility: private
attribution: integration
status: active
tags: [LiteLLM, Cloudflare Zero Trust, Model routing, AI infrastructure]
order: 7
featured: true
published: true
evidence: []
---

## The challenge

AI tools can depend on different model services. Managing those services also means thinking about how tools reach them and which access boundaries belong around the infrastructure.

## My approach

I use LiteLLM for model routing and Cloudflare Zero Trust as part of the surrounding access infrastructure. The work connects model services to the development, research, and automation workflows in my environment.

I treat the model layer as a platform concern. A useful setup needs an operating model for the service and a clear way for the tools that depend on it to connect.

## My contribution

This is integration and infrastructure work using existing platforms. I bring the routing and access pieces together around my own workloads, drawing on the same deployment and operational practices I use elsewhere.

## Current scope

The infrastructure supports my ongoing AI experiments and working tools. My focus is making the surrounding system understandable and controllable as those workflows change.
