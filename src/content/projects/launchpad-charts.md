---
title: "The Graph deployment tooling"
summary: "A credited GraphOps chart reference for the Kubernetes packaging behind Firehose and graph-node services."
primaryDomain: blockchain
relatedDomains: [cloud]
visibility: public
repositoryUrl: "https://github.com/Johnaverse/launchpad-charts"
attribution: integration
status: research
tags: [The Graph, GraphOps, Helm, Kubernetes, Firehose]
order: 4
featured: false
published: true
evidence:
  - "https://github.com/Johnaverse/launchpad-charts"
  - "https://github.com/graphops/launchpad-charts"
---

## The context

Blockchain data services depend on more than a node binary. Kubernetes packaging needs to describe the services and supporting resources that make the workload operable. This is a useful connection between my blockchain operations work and my experience with Kubernetes and GitOps.

My public fork of Launchpad Charts provides a reference to the GraphOps tooling in this ecosystem. The repository includes charts for Firehose Ethereum and graph-node, alongside other Web3 workloads.

## The approach

Helm charts package related Kubernetes resources together. They give an operator a structured starting point for reviewing how a workload is deployed and which supporting pieces belong with it.

For someone working with The Graph’s data infrastructure, these charts are a useful way to explore deployment packaging alongside the application itself. The chart sources also include graph-node dashboard material for indexing status and query performance.

## My contribution and attribution

Launchpad Charts is developed by GraphOps. This portfolio entry credits that upstream work and presents my public fork as an integration reference.

My experience in this area is operating blockchain data services and working on Kubernetes migration and FluxCD delivery at Pinax. The separate blockchain data operations overview describes that work; this entry points to the publicly inspectable chart tooling.

## Current scope

The public source illustrates the available packaging and its documentation. It offers a concrete technical reference for the intersection of blockchain infrastructure, Kubernetes, and operational visibility.
