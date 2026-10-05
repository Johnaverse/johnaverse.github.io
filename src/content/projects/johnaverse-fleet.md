---
title: "Johnaverse Fleet & Docker Terraform"
summary: "Flux-based GitOps for my Kubernetes fleet, alongside independent Terraform roots for Docker services."
primaryDomain: cloud
relatedDomains: [ai]
visibility: private
attribution: original
status: active
tags: [Johnaverse Fleet, FluxCD, Docker, Terraform]
order: 6
featured: false
published: true
evidence: []
---

## The challenge

Cloud resources and containers are only part of an environment. The machines running them also need a manageable approach to configuration and updates. I work on Johnaverse Fleet and johnaverse-docker-tf to bring those concerns into my infrastructure workflow.

## My approach

Johnaverse Fleet keeps Kubernetes configuration in Git. Flux reconciles each environment from its own configuration path, so a change has a defined destination rather than being applied indiscriminately across the fleet. Some workloads use image automation that proposes image-tag changes through review branches.

johnaverse-docker-tf manages Docker services through independent Terraform roots. Shared networks are configured before the services that depend on them, and each service has its own initialization, validation, and plan workflow. Terraform is the current source of truth for this repository; the earlier Compose-based deployment model has been retired.

These projects use different control loops. Flux reconciles Kubernetes configuration from Git; the Docker workflow uses explicit Terraform plans and applies. The common goal is to make the intended state and the scope of a change understandable before it reaches a workload.

## My contribution

I maintain the environment configuration, workload definitions, and service dependencies around my own fleet and container environment. For stateful Docker changes, the documented workflow calls for a recoverable backup and rollback path before applying the plan, followed by service verification.

## Current scope

The fleet and Docker work sits alongside my cloud Terraform projects, model infrastructure, and backup and monitoring setup. Update policies are chosen according to the workload, including the distinction between controlled fleet changes and automatic container updates.
