# Content evidence and attribution

This document is an internal maintenance reference for the portfolio copy. It is not site content.

## Source rules

- Employment titles, periods, and domain-specific responsibilities come from the two owner-supplied CVs. The experience data records `source: 'CV'`; this is provenance, not independent verification.
- Private project overviews use the owner's authorized descriptions. Inspected source also supports the architectural descriptions of OCI provisioning, Fleet/Flux reconciliation, Docker Terraform roots, and Argo Workflows templates. Their evidence arrays are empty and they have no repository URLs.
- The published content excludes personal contact and immigration details from the CVs, private repository links, endpoints, infrastructure identifiers, credentials, raw configuration, unsupported scale or ranking claims, and historical certification claims presented as current.
- Diagrams describe conceptual workflows, not the topology of a deployed environment.
- Argo Workflows is identified from inspected repository definitions, including WorkflowTemplate resources and Argo Workflows configuration. It is not inferred solely from the ambiguous technology spelling supplied during planning.

## Public project evidence

| Entry | Public evidence | Attribution and claim boundary |
| --- | --- | --- |
| Chains API | <https://github.com/Johnaverse/chains-api> | Standalone owner project. Source supports registry aggregation, indexing, RPC monitoring, REST/MCP, assistant tooling, tests, and Docker packaging. Copy makes no traffic, uptime, performance, or coverage-percentage claims. |
| Service recovery monitor | <https://github.com/Johnaverse/nodejs-readlog-restart-services> | Standalone owner project. README/source support systemd log checks, a configurable restart trigger, and Prometheus event/restart metrics. Copy does not claim production recovery rates. |
| EVM JSON-RPC collection | <https://github.com/Johnaverse/evm-json-rpc-postman> | Standalone owner collection. The public v2.1 JSON contains chain, block, transaction, log, gas, call, debug, trace, network, and client-information methods, including historical methods. No claim of compatibility with every current client. |
| The Graph deployment tooling | <https://github.com/Johnaverse/launchpad-charts> and <https://github.com/graphops/launchpad-charts> | Explicit GraphOps upstream attribution. Public fork/tree contains Firehose Ethereum and graph-node charts and graph-node dashboard material. Presented as a deployment/integration reference, without asserting original chart authorship or a particular deployed setup. |

## Private project scope

The overview entries cover OCI/Cloudflare Terraform, Johnaverse Fleet and Docker Terraform, LiteLLM/Zero Trust integration, ops-ui agent guardrails, AI development and end-to-end QA, CA Security Center, source and contract analysis, blockchain data operations, NFT deployment work, and backup/monitoring/update policies.

Only the ops-ui guardrail work is explicitly described as self-developed security controls. Entries built around existing platforms use integration attribution. Terraform and fleet configuration are described as owner-developed infrastructure work. These descriptions must remain architectural unless the owner authorizes more specific details.

## Maintenance notes

- Keep current role dates aligned with owner updates. Do not derive a job title or tenure from the partly visible LinkedIn profile.
- Chains API documentation references SonarQube and container-image publishing. The public workflow inspected during the audit contained linting/test/coverage checks; the portfolio does not claim that every documented pipeline feature is currently enforced.
- No runtime tests of the public reference repositories were performed during the source audit. The portfolio describes included tests and visible implementations, without asserting that the audit ran those suites.
- CA Security Center and NFT deployment entries are authorized owner descriptions. Do not add guessed source/demo links, collection identifiers, transaction references, or platform features.
- Review `status` values with the owner as projects change. Completed public examples remain useful references and should not imply active maintenance.
