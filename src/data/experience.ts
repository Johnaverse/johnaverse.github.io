import type { DomainId } from './domains';

export type Experience = {
  id: string;
  employer: string;
  title: string;
  period: string;
  domains: Partial<Record<DomainId, string[]>>;
  source: 'CV';
};

export const experiences: Experience[] = [
  {
    id: 'pinax',
    employer: 'Pinax Network',
    title: 'Site Reliability Engineer',
    period: 'May 2023 – Present',
    domains: {
      cloud: [
        'I work on the migration of blockchain infrastructure to Kubernetes and on configuration delivery through FluxCD GitOps.',
        'I handle operational incidents and coordinate changes with the people maintaining the networks and services we depend on.',
      ],
      ai: [
        'I use AI tools to support runbook management, blockchain monitoring, and information gathering for operational work.',
      ],
      blockchain: [
        'I operate multi-network blockchain infrastructure across execution clients including Geth, Nethermind, Besu, and Reth, and consensus clients including Lighthouse, Prysm, and Teku.',
        'I work with RPC, Firehose, Token API, and Substreams services, including upgrades, forks, incident response, and community coordination.',
      ],
    },
    source: 'CV',
  },
  {
    id: 'crypto-com',
    employer: 'Crypto.com',
    title: 'Blockchain Security Analyst',
    period: 'October 2021 – February 2023',
    domains: {
      cloud: [
        'I assessed security boundaries around validator infrastructure, including designs using AWS Nitro Enclaves.',
      ],
      blockchain: [
        'I examined attack surfaces across validators, minting, bridges, and smart contracts, and validated reported exploit proofs of concept.',
        'I developed Bash checks and security guidance for validator operations and worked with monitoring and post-incident analysis.',
      ],
      cybersecurity: [
        'I validated hacker-submitted proofs of concept and investigated their behavior and impact.',
        'I used Go fuzzing to investigate denial-of-service behavior and applied static and dynamic analysis to Go and Rust code.',
        'My tooling included SonarScanner, Burp Suite, and Grafana, alongside security guidelines and validator checks.',
      ],
    },
    source: 'CV',
  },
  {
    id: 'astri',
    employer: 'Hong Kong ASTRI',
    title: 'Engineer, Blockchain',
    period: 'March 2020 – October 2021',
    domains: {
      cloud: [
        'I worked on AWS deployments designed for availability and on lab automation using OpenShift and AWX.',
      ],
      blockchain: [
        'I developed Hyperledger Fabric applications with React, Node.js, and SQL, working within an agile delivery process using Jira and Bitbucket.',
      ],
      cybersecurity: [
        'I built Linux and container security lab environments to support testing and investigation.',
      ],
    },
    source: 'CV',
  },
  {
    id: 'hkt',
    employer: 'HKT',
    title: 'Graduate Trainee, Cloud Service Engineer',
    period: 'June 2019 – March 2020',
    domains: {
      cloud: [
        'I supported Azure Stack upgrades and first- and second-line cloud service operations.',
        'I worked on recovery planning, VMware migration, and operational automation with PowerShell.',
      ],
    },
    source: 'CV',
  },
  {
    id: 'hkt-internship',
    employer: 'HKT',
    title: 'Intern',
    period: 'June 2018 – August 2018',
    domains: {
      cybersecurity: [
        'I supported Nessus vulnerability scanning, alert configuration, and network audits during my internship.',
      ],
    },
    source: 'CV',
  },
];
