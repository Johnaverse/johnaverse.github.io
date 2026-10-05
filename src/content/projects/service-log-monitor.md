---
title: "Service recovery with Prometheus"
summary: "A focused Node.js utility that watches Linux service logs, applies a restart threshold, and exposes recovery metrics."
primaryDomain: blockchain
relatedDomains: [cloud]
visibility: public
repositoryUrl: "https://github.com/Johnaverse/nodejs-readlog-restart-services"
attribution: original
status: completed
tags: [Node.js, Linux, systemd, Prometheus, Recovery]
order: 2
featured: true
published: true
evidence:
  - "https://github.com/Johnaverse/nodejs-readlog-restart-services"
---

## The problem

A running service can still reach a state that needs intervention. In node operations, a recognizable error in the logs can be a useful signal, but repeatedly checking for it by hand is an awkward operational workflow.

I built a small utility around a specific recovery pattern: inspect recent service logs, count a configured phrase, and restart the service when the configured threshold is reached.

## The approach

The application runs in a Linux environment with systemd. Its configuration defines the service, the log window, the matching phrase, the threshold, and the check interval. Node.js coordinates the checks and invokes the relevant system commands.

Prometheus support makes the behavior visible. The utility exposes counters for matching log events and service restarts, allowing recovery activity to be monitored alongside the rest of a service’s health signals.

## My contribution

I connected detection, recovery, and observability in a compact tool. Keeping the rule configurable makes the recovery decision explicit: the operator chooses which signal matters and how much evidence should trigger an action.

The project reflects a recurring part of my infrastructure work. An operational automation should explain what it observed and leave a signal of what it did, so the engineer can still investigate the underlying issue.

## Current scope

This is a focused service-log utility. Its public source and README describe the configuration and the exposed metrics. It is a useful example of bringing a repeatable operational task into code while keeping the trigger and resulting activity inspectable.
