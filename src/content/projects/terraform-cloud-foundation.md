---
title: "Terraform cloud foundations"
summary: "Infrastructure as code for my OCI and Cloudflare environment, with resources and changes kept understandable in Git."
primaryDomain: cloud
relatedDomains: [cybersecurity]
visibility: private
attribution: original
status: active
tags: [Terraform, OCI, Cloudflare, Nginx, Infrastructure as code]
order: 5
featured: true
published: true
evidence: []
---

## The challenge

As a computing environment grows, manually managed cloud resources become harder to understand and reproduce. I use Terraform to keep the infrastructure behind my projects expressed in code, with a clearer record of what exists and how it changes.

## My approach

This work brings OCI and Cloudflare resources into my infrastructure-as-code workflow. My OCI project describes a paired reverse-proxy design using Nginx, with health checks and failover managed through Keepalived. The configuration and deployment documentation also address certificate renewal and synchronization between the proxy instances.

The useful part is the operating model as much as the provisioning tool. Configuration in Git gives me something to review, compare, and revisit when a workload’s needs change. Cloudflare networking and access controls connect the cloud resources to the services they support.

The repository documents both automated provisioning and follow-up operational steps. That distinction matters: a provisioned instance and a fully verified service are different stages of the same deployment.

## My contribution

I develop and maintain the Terraform configuration for my own environment. It draws on my earlier cloud support and deployment work, and on my current experience with Kubernetes and GitOps.

## Current scope

This is ongoing platform work supporting my personal projects. The configuration evolves alongside the workloads I run, with resource definitions kept close to the applications and services they support.
