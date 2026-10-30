// Conceptual project workflows: the stages each project passes through and how they connect.
export type WorkflowIcon = 'sources' | 'registry' | 'api' | 'logs' | 'threshold' | 'restart' | 'metrics' | 'request' | 'node' | 'response' | 'charts' | 'cluster' | 'service' | 'terraform' | 'plan' | 'cloud' | 'access' | 'git' | 'flux' | 'docker' | 'tool' | 'routing' | 'models' | 'shield' | 'review' | 'qa' | 'feedback' | 'signal' | 'triage' | 'code' | 'analysis' | 'findings' | 'stream' | 'contract' | 'deploy' | 'backup' | 'update';
export interface WorkflowStage { label: string; icon: WorkflowIcon; }
export interface Workflow { stages: WorkflowStage[]; edges?: [number, number][]; }

const workflows: Record<string, Workflow> = {
  'chains-api': { stages: [{ label: 'Sources', icon: 'sources' }, { label: 'Registry', icon: 'registry' }, { label: 'REST / MCP', icon: 'api' }] },
  'service-log-monitor': { stages: [{ label: 'Logs', icon: 'logs' }, { label: 'Threshold', icon: 'threshold' }, { label: 'Restart', icon: 'restart' }, { label: 'Metrics', icon: 'metrics' }] },
  'evm-rpc-postman': { stages: [{ label: 'Methods', icon: 'registry' }, { label: 'Request', icon: 'request' }, { label: 'RPC node', icon: 'node' }, { label: 'Response', icon: 'response' }] },
  'launchpad-charts': { stages: [{ label: 'Helm charts', icon: 'charts' }, { label: 'Kubernetes', icon: 'cluster' }, { label: 'Services', icon: 'service' }] },
  'terraform-cloud-foundation': { stages: [{ label: 'Terraform', icon: 'terraform' }, { label: 'Plan', icon: 'plan' }, { label: 'OCI', icon: 'cloud' }, { label: 'Cloudflare', icon: 'access' }], edges: [[0, 1], [1, 2], [1, 3]] },
  'johnaverse-fleet': { stages: [{ label: 'Git', icon: 'git' }, { label: 'Flux', icon: 'flux' }, { label: 'Terraform', icon: 'terraform' }, { label: 'Docker', icon: 'docker' }], edges: [[0, 1], [2, 3]] },
  'model-routing-and-access': { stages: [{ label: 'Tools', icon: 'tool' }, { label: 'Access', icon: 'access' }, { label: 'LiteLLM', icon: 'routing' }, { label: 'Models', icon: 'models' }] },
  'ops-ui-agent-guardrails': { stages: [{ label: 'Request', icon: 'request' }, { label: 'Guardrails', icon: 'shield' }, { label: 'Tool action', icon: 'tool' }] },
  'ai-development-and-qa': { stages: [{ label: 'Change', icon: 'code' }, { label: 'Review', icon: 'review' }, { label: 'QA', icon: 'qa' }, { label: 'Feedback', icon: 'feedback' }] },
  'ca-security-center': { stages: [{ label: 'Signals', icon: 'signal' }, { label: 'Triage', icon: 'triage' }, { label: 'Investigate', icon: 'review' }] },
  'code-and-contract-analysis': { stages: [{ label: 'Source', icon: 'code' }, { label: 'Analysis', icon: 'analysis' }, { label: 'Findings', icon: 'findings' }] },
  'blockchain-data-operations': { stages: [{ label: 'Nodes', icon: 'node' }, { label: 'RPC', icon: 'api' }, { label: 'Firehose', icon: 'stream' }, { label: 'Substreams', icon: 'sources' }], edges: [[0, 1], [0, 2], [2, 3]] },
  'nft-deployment-work': { stages: [{ label: 'Contract', icon: 'contract' }, { label: 'Deploy', icon: 'deploy' }, { label: 'Application', icon: 'service' }] },
  'resilience-and-update-policies': { stages: [{ label: 'Services', icon: 'node' }, { label: 'Backups', icon: 'backup' }, { label: 'Grafana', icon: 'metrics' }, { label: 'Updates', icon: 'update' }], edges: [[0, 1], [0, 2], [0, 3]] },
};

const fallback: Workflow = {
  stages: [{ label: 'Context', icon: 'sources' }, { label: 'Approach', icon: 'tool' }, { label: 'Outcome', icon: 'response' }],
};

export function workflowFor(id: string): Workflow {
  return workflows[id] ?? fallback;
}

export function workflowEdges(workflow: Workflow): [number, number][] {
  return workflow.edges ?? workflow.stages.slice(1).map((_, index) => [index, index + 1] as [number, number]);
}

/** Every route from a starting stage to a final stage, as stage indexes, so branches read as separate lines. */
export function workflowPaths(workflow: Workflow): number[][] {
  const edges = workflowEdges(workflow);
  const next = (from: number) => edges.filter(([a]) => a === from).map(([, b]) => b);
  const roots = workflow.stages.map((_, index) => index).filter(index => !edges.some(([, b]) => b === index));
  const walk = (index: number): number[][] => {
    const after = next(index);
    return after.length ? after.flatMap(child => walk(child).map(path => [index, ...path])) : [[index]];
  };
  return roots.flatMap(walk);
}
