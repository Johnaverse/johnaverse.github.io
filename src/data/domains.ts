export type DomainId = 'cloud' | 'ai' | 'blockchain' | 'cybersecurity';

export type Domain = {
  id: DomainId;
  index: string;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  intro: string;
  accent: 'cyan' | 'violet' | 'amber' | 'emerald';
  tags: string[];
  capabilities: { title: string; description: string; tools: string[] }[];
  diagram: { title: string; subtitle: string }[];
  experienceIds: string[];
};

export const domains: Domain[] = [
  {
    id: 'cloud',
    index: '01',
    name: 'Cloud & Infrastructure',
    shortName: 'Cloud',
    headline: 'Infrastructure I can build, observe, and recover.',
    description: 'Cloud platforms, infrastructure as code, and the day-to-day discipline of keeping systems useful.',
    intro: 'My infrastructure work spans Azure Stack support, AWS deployments, and Kubernetes operations. Today, I bring that experience into Terraform, GitOps, and my own computing environment. I care about the full lifecycle: how a system is provisioned, how changes reach it, how a failure becomes visible, and how it is recovered.',
    accent: 'cyan',
    tags: ['Terraform', 'Kubernetes', 'FluxCD', 'OCI', 'Cloudflare', 'Observability'],
    capabilities: [
      {
        title: 'Infrastructure as code',
        description: 'I use Terraform to make cloud resources and container infrastructure easier to understand, reproduce, and change deliberately.',
        tools: ['Terraform', 'OCI', 'Cloudflare', 'Docker'],
      },
      {
        title: 'Kubernetes & delivery',
        description: 'I work with Kubernetes migrations and GitOps workflows, connecting configuration in Git to the systems it operates.',
        tools: ['Kubernetes', 'FluxCD', 'GitHub Actions', 'Helm'],
      },
      {
        title: 'Monitoring & recovery',
        description: 'I connect service health, logs, and metrics to practical operational decisions, with backup and recovery considered alongside deployment.',
        tools: ['Grafana', 'Prometheus', 'Linux', 'Synology'],
      },
      {
        title: 'Controlled operations',
        description: 'I choose update and access policies around a workload’s needs, from deliberate fleet changes to automatic container updates.',
        tools: ['Johnaverse Fleet', 'Watchtower', 'Cloudflare Zero Trust', 'PowerShell'],
      },
    ],
    diagram: [
      { title: 'Define', subtitle: 'Resources and policy in code' },
      { title: 'Deliver', subtitle: 'Reviewable configuration changes' },
      { title: 'Observe', subtitle: 'Health, logs, and metrics' },
      { title: 'Recover', subtitle: 'Backups and operational response' },
    ],
    experienceIds: ['pinax', 'crypto-com', 'astri', 'hkt'],
  },
  {
    id: 'ai',
    index: '02',
    name: 'AI & Automation',
    shortName: 'AI',
    headline: 'Useful AI workflows, with controls around them.',
    description: 'Model infrastructure, agent integrations, and development workflows that keep the engineer involved.',
    intro: 'I use AI to support research, runbooks, monitoring, and software development. My focus is the surrounding system: giving an agent the right tools, controlling what it can do, and checking the result. That includes MCP interfaces, model routing, access controls, and end-to-end QA workflows in my own environment.',
    accent: 'violet',
    tags: ['MCP', 'LiteLLM', 'Agent workflows', 'Ollama', 'QA automation', 'Guardrails'],
    capabilities: [
      {
        title: 'Models & access',
        description: 'I combine model routing with infrastructure and access controls so different tools can use the model services they need.',
        tools: ['LiteLLM', 'Ollama', 'Cloudflare Zero Trust'],
      },
      {
        title: 'Tool-connected agents',
        description: 'I build and integrate workflows that connect AI assistants to structured data, operational knowledge, and defined tools.',
        tools: ['MCP', 'Hermes', 'OpenClaw', 'Codex', 'Claude'],
      },
      {
        title: 'Operational guardrails',
        description: 'I develop controls around an operations agent, with attention to the boundary between interpreting a request and acting on a system.',
        tools: ['Agent guardrails', 'Ops UI', 'Workflow controls'],
      },
      {
        title: 'Development & QA',
        description: 'I use AI alongside code review and end-to-end checks, treating generated changes as engineering work that still needs validation.',
        tools: ['Codex', 'Claude', 'GitHub Actions', 'End-to-end QA'],
      },
    ],
    diagram: [
      { title: 'Request', subtitle: 'A task with a defined scope' },
      { title: 'Context', subtitle: 'Knowledge and structured tools' },
      { title: 'Control', subtitle: 'Access and action boundaries' },
      { title: 'Review', subtitle: 'Check the behavior and result' },
    ],
    experienceIds: ['pinax'],
  },
  {
    id: 'blockchain',
    index: '03',
    name: 'Blockchain & Data',
    shortName: 'Blockchain',
    headline: 'From operating nodes to making chain data usable.',
    description: 'Full and archive nodes, blockchain data services, network upgrades, and the tools around them.',
    intro: 'At Pinax, I work with the infrastructure behind multi-network blockchain data services. My experience covers consensus and execution clients, RPC, Firehose, Substreams, and network upgrades. Earlier roles add smart-contract security and Hyperledger Fabric development. I also build public tools that make network metadata and RPC workflows easier to use.',
    accent: 'amber',
    tags: ['Full & archive nodes', 'RPC', 'Firehose', 'Substreams', 'The Graph', 'EVM'],
    capabilities: [
      {
        title: 'Node operations',
        description: 'I work across execution and consensus clients, handling upgrades, forks, incidents, and the coordination that network changes require.',
        tools: ['Geth', 'Nethermind', 'Besu', 'Reth', 'Lighthouse', 'Prysm', 'Teku'],
      },
      {
        title: 'Blockchain data pipelines',
        description: 'I operate services that expose chain data through RPC and streaming interfaces, including Firehose and Substreams for The Graph ecosystem.',
        tools: ['RPC', 'Firehose', 'Substreams', 'Token API', 'The Graph'],
      },
      {
        title: 'Developer tooling',
        description: 'I build network registry and RPC tools, connecting chain metadata, endpoint health, and interfaces for developers and AI assistants.',
        tools: ['Chains API', 'Fastify', 'MCP', 'Postman', 'Prometheus'],
      },
      {
        title: 'Contracts & deployments',
        description: 'My blockchain work also includes source and attack-surface analysis, enterprise ledger development, and NFT deployment projects.',
        tools: ['Smart contracts', 'EVM', 'Hyperledger Fabric', 'NFT deployments'],
      },
    ],
    diagram: [
      { title: 'Network', subtitle: 'Execution and consensus clients' },
      { title: 'Ingest', subtitle: 'Live and historical chain data' },
      { title: 'Process', subtitle: 'Streaming and indexing workflows' },
      { title: 'Use', subtitle: 'APIs, applications, and tools' },
    ],
    experienceIds: ['pinax', 'crypto-com', 'astri'],
  },
  {
    id: 'cybersecurity',
    index: '04',
    name: 'Cybersecurity',
    shortName: 'Security',
    headline: 'Security analysis from source code to attack surface.',
    description: 'Proof-of-concept validation, code analysis, threat intelligence, and secure operational workflows.',
    intro: 'My security background includes validating reported exploit proofs of concept, examining blockchain infrastructure and contracts, and building security lab environments. I combine source analysis with a view of the wider system: the service, its dependencies, and its trust boundaries. My current projects extend that work into threat intelligence and controls for AI-assisted operations.',
    accent: 'emerald',
    tags: ['Attack surface', 'SAST & DAST', 'Threat intelligence', 'Fuzzing', 'DevSecOps', 'Agent security'],
    capabilities: [
      {
        title: 'Exploit & attack-surface analysis',
        description: 'I validate reported proofs of concept and examine the trust boundaries around validators, bridges, minting flows, and smart contracts.',
        tools: ['Proof-of-concept validation', 'Smart-contract review', 'AWS Nitro Enclaves'],
      },
      {
        title: 'Source & runtime testing',
        description: 'I use static analysis, dynamic testing, and fuzzing to investigate code behavior and support practical remediation.',
        tools: ['SonarScanner', 'Burp Suite', 'Go', 'Rust', 'Fuzz testing'],
      },
      {
        title: 'Threat intelligence & research',
        description: 'I work on a security-center project and threat-analysis tooling, connecting research and collected signals to a clearer investigation workflow.',
        tools: ['CA Security Center', 'Threat intelligence', 'Static analysis'],
      },
      {
        title: 'Security in operations',
        description: 'I bring security into platform work through lab isolation, operational checks, access controls, and guardrails for agent-driven workflows.',
        tools: ['Linux', 'OpenShift', 'Bash', 'Cloudflare Zero Trust', 'Agent guardrails'],
      },
    ],
    diagram: [
      { title: 'Understand', subtitle: 'Code, assets, and trust boundaries' },
      { title: 'Investigate', subtitle: 'Reports, signals, and test cases' },
      { title: 'Validate', subtitle: 'Reproduce and assess behavior' },
      { title: 'Improve', subtitle: 'Remediation and operational controls' },
    ],
    experienceIds: ['crypto-com', 'astri', 'hkt-internship'],
  },
];
