---
title: "Code & contract security analysis"
summary: "Source-analysis tooling and attack-surface review, informed by my work on validator systems, bridges, minting, and smart contracts."
primaryDomain: cybersecurity
relatedDomains: [blockchain]
visibility: private
attribution: integration
status: active
tags: [Static analysis, Attack surface, Smart contracts, Go, Rust, Fuzzing]
order: 11
featured: false
published: true
evidence: []
---

## The challenge

A finding in source code needs context. Its significance depends on how the component is used, which inputs it accepts, and what trust boundaries surround it. My security work connects code analysis with that wider view of the system.

## My approach

I work on static source-analysis platforms and on source, contract, and attack-surface analysis. This builds on my experience at Crypto.com validating reported exploit proofs of concept and examining validator infrastructure, minting, bridges, and smart contracts.

That role also involved Go fuzzing for denial-of-service investigation and static and dynamic analysis of Go and Rust code. SonarScanner and Burp Suite were part of my toolkit, alongside operational checks and monitoring.

## My contribution

I bring the analyst’s investigation into the tooling workflow: understand the code path, examine the surrounding architecture, and assess the behavior a report describes. My infrastructure experience helps connect a code-level concern to the service that runs it.

## Current scope

My current project work continues this focus through source-analysis and security platforms. The emphasis remains on findings that an engineer can investigate and act on, with the relevant system context kept close to the analysis.
