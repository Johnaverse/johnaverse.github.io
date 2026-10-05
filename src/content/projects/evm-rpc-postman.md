---
title: "EVM JSON-RPC collection"
summary: "An inspectable Postman collection of RPC requests for exploring EVM node interfaces and debugging workflows."
primaryDomain: blockchain
relatedDomains: []
visibility: public
repositoryUrl: "https://github.com/Johnaverse/evm-json-rpc-postman"
attribution: original
status: completed
tags: [EVM, JSON-RPC, Postman, Node tooling]
order: 3
featured: false
published: true
evidence:
  - "https://github.com/Johnaverse/evm-json-rpc-postman"
---

## The problem

Working with a node often begins with a small question: which block is it at, what does a transaction contain, or what state is visible through its RPC interface? A reusable request collection makes these questions easier to explore and gives developers concrete examples to inspect.

## The approach

I organized EVM JSON-RPC requests in a Postman v2.1 collection. The public file includes methods for chain identity, block and transaction queries, balances, logs, gas estimates, and execution calls. It also contains debug and trace examples, along with network and client-information methods.

The collection format keeps each request visible. A developer can inspect the method and parameters, adapt the example to the client they are working with, and compare the resulting response.

## My contribution

I put the RPC examples into a portable developer-tool format. This is a small project, but it complements my work operating nodes and investigating blockchain behavior: the interface becomes easier to reason about when the request itself is accessible.

## Current scope

The collection captures a broad range of RPC examples, including historical methods. Support depends on the client, its version, and the interfaces it exposes. The public JSON file provides the concrete reference for this project’s contents.
