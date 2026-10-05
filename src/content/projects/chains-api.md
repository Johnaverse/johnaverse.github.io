---
title: "Chains API"
summary: "A blockchain registry service that brings network metadata, endpoint health, REST queries, and MCP tools into one interface."
primaryDomain: blockchain
relatedDomains: [ai, cloud]
visibility: public
repositoryUrl: "https://github.com/Johnaverse/chains-api"
attribution: original
status: active
tags: [Node.js, Fastify, MCP, RPC, Docker]
order: 1
featured: true
published: true
evidence:
  - "https://github.com/Johnaverse/chains-api"
---

## The problem

Useful blockchain metadata lives across several registries. Network names, chain identifiers, relationships, and available endpoints can differ between sources. I wanted a common interface that makes this information easier to query and gives developers more context about the endpoints they find.

## The approach

Chains API combines data from The Graph Networks Registry, Chainlist, Chain ID Network, and SLIP-0044. The service indexes records for lookup and search, preserves relationships such as mainnet/testnet and L1/L2, and includes validation for inconsistencies between sources.

Background RPC checks add endpoint-health information. A Fastify REST API exposes the registry to conventional clients, while MCP tools make the same structured information available to AI assistants. The repository also includes an optional assistant that can use tools to answer questions about the registry.

## My contribution

I brought the aggregation, indexing, endpoint monitoring, and query interfaces together as a reusable service. The interesting engineering work is at those boundaries: matching records from different sources, representing their relationships, and providing useful responses through both developer and agent interfaces.

This is also where my infrastructure and AI interests meet. A tool-connected assistant benefits from a well-defined data service, and the underlying API remains useful to other applications.

## Validation and current scope

The public repository contains tests for service behavior and validation, alongside linting and test checks in GitHub Actions. Docker packaging provides a way to run the service in a container environment.

The project’s visible output is the registry, its query interfaces, and the monitoring information exposed by the service. The public source is the best place to explore its current implementation and supported operations.
