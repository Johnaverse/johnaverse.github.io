---
title: "AI development & end-to-end QA"
summary: "Agent workflows and QA platforms in my environment, supporting development with code review and behavioral checks."
primaryDomain: ai
relatedDomains: [cybersecurity, cloud]
visibility: private
attribution: integration
status: active
tags: [Codex, Claude, Hermes, OpenClaw, End-to-end QA, Argo Workflows, GitHub Actions]
order: 9
featured: false
published: true
evidence: []
---

## The challenge

AI tools can accelerate development, but the resulting changes still need to fit the application and behave as intended. I use agent workflows alongside review and end-to-end QA so that generating a change remains part of an engineering process.

## My approach

My environment includes Hermes, OpenClaw, Codex, and Claude workflows, together with AI-assisted end-to-end QA platforms. I use these tools for development and automation.

The surrounding delivery configuration has distinct responsibilities: GitHub Actions runs repository checks, Flux reconciles Kubernetes configuration, and Argo Workflows templates describe repeatable operational tasks. Keeping these responsibilities explicit makes it easier to follow a change from its source to the system that executes it.

The emphasis is on connecting the pieces: the task, the change, the review, and the application behavior. Different tools contribute at different stages, and the engineer remains responsible for assessing the result.

## My contribution

I integrate the tools and infrastructure that support my workflow. My security and operations background helps me consider generated code, its dependencies, and the system it will run in as part of the same change.

## Current scope

This is an evolving working environment for development and QA. I continue to refine how the agent tools and checks fit together as I use them on my projects.
