import type { DomainId } from '../data/domains';
import type { Experience } from '../data/experience';
import type { Locale } from './index';

type LocalizedRole = { title: string; period: string; domains: Partial<Record<DomainId, string[]>> };
const translations: Record<Exclude<Locale,'en'>, Record<string, LocalizedRole>> = {
  'zh-Hant': {
    pinax:{title:'網站可靠性工程師',period:'2023 年 5 月–至今',domains:{cloud:['我參與將區塊鏈基礎設施遷移至 Kubernetes，並透過 FluxCD GitOps 交付設定。','我處理維運事件，並與維護所依賴網路與服務的團隊協調變更。'],ai:['我運用 AI 工具支援操作手冊管理、區塊鏈監控及維運資訊蒐集。'],blockchain:['我維運多網路區塊鏈基礎設施，使用 Geth、Nethermind、Besu、Reth 等執行層用戶端，以及 Lighthouse、Prysm、Teku 等共識層用戶端。','我參與 RPC、Firehose、Token API 與 Substreams 服務，包括升級、分叉、事件應變與社群協調。']}},
    'crypto-com':{title:'區塊鏈安全分析師',period:'2021 年 10 月–2023 年 2 月',domains:{cloud:['我評估驗證者基礎設施的安全邊界，包括採用 AWS Nitro Enclaves 的設計。'],blockchain:['我檢視驗證者、鑄造、橋接與智慧合約的攻擊面，並驗證已回報的漏洞概念驗證。','我為驗證者維運編寫 Bash 檢查與安全指引，並參與監控及事件後分析。'],cybersecurity:['我驗證安全研究人員回報的漏洞概念驗證，並調查其行為與影響。','我以 Go 模糊測試調查阻斷服務行為，並對 Go 與 Rust 程式碼進行靜態及動態分析。','工具包括 SonarScanner、Burp Suite 與 Grafana，並涵蓋安全指引及驗證者檢查。']}},
    astri:{title:'區塊鏈工程師',period:'2020 年 3 月–2021 年 10 月',domains:{cloud:['我參與強調可用性的 AWS 部署，也運用 OpenShift 與 AWX 自動化實驗環境。'],blockchain:['我使用 React、Node.js 與 SQL 開發 Hyperledger Fabric 應用，並透過 Jira 和 Bitbucket 參與敏捷交付。'],cybersecurity:['我建置 Linux 與容器安全實驗環境，支援測試與調查。']}},
    hkt:{title:'雲端服務工程師見習生',period:'2019 年 6 月–2020 年 3 月',domains:{cloud:['我支援 Azure Stack 升級，以及雲端服務第一線與第二線維運。','我參與復原規劃、VMware 遷移，並以 PowerShell 自動化維運工作。']}},
    'hkt-internship':{title:'實習生',period:'2018 年 6 月–2018 年 8 月',domains:{cybersecurity:['實習期間，我支援 Nessus 弱點掃描、警示設定與網路稽核。']}},
  },
  'zh-Hans': {
    pinax:{title:'网站可靠性工程师',period:'2023 年 5 月–至今',domains:{cloud:['我参与将区块链基础设施迁移到 Kubernetes，并通过 FluxCD GitOps 交付配置。','我处理运维事件，并与维护相关网络和服务的团队协调变更。'],ai:['我使用 AI 工具协助管理运行手册、监控区块链并收集运维信息。'],blockchain:['我运维多网络区块链基础设施，使用 Geth、Nethermind、Besu、Reth 等执行层客户端，以及 Lighthouse、Prysm、Teku 等共识层客户端。','我负责 RPC、Firehose、Token API 和 Substreams 服务，包括升级、分叉、事件响应和社区协调。']}},
    'crypto-com':{title:'区块链安全分析师',period:'2021 年 10 月–2023 年 2 月',domains:{cloud:['我评估验证者基础设施的安全边界，包括采用 AWS Nitro Enclaves 的设计。'],blockchain:['我分析验证者、铸造流程、桥接和智能合约的攻击面，并验证报告的漏洞概念验证。','我为验证者运维开发 Bash 检查和安全指南，并参与监控与事件后分析。'],cybersecurity:['我验证安全研究人员提交的漏洞概念验证，并调查其行为和影响。','我使用 Go 模糊测试调查拒绝服务行为，并对 Go 和 Rust 代码进行静态和动态分析。','我使用 SonarScanner、Burp Suite 和 Grafana 等工具，也编写安全指南和验证者检查。']}},
    astri:{title:'区块链工程师',period:'2020 年 3 月–2021 年 10 月',domains:{cloud:['我参与面向可用性的 AWS 部署，并使用 OpenShift 和 AWX 自动化实验环境。'],blockchain:['我使用 React、Node.js 和 SQL 开发 Hyperledger Fabric 应用，并通过 Jira 与 Bitbucket 参与敏捷交付。'],cybersecurity:['我构建 Linux 和容器安全实验环境，支持测试与调查。']}},
    hkt:{title:'云服务工程师培训生',period:'2019 年 6 月–2020 年 3 月',domains:{cloud:['我支持 Azure Stack 升级，以及云服务一线和二线运维。','我参与恢复规划、VMware 迁移，并使用 PowerShell 自动化运维。']}},
    'hkt-internship':{title:'实习生',period:'2018 年 6 月–2018 年 8 月',domains:{cybersecurity:['实习期间，我协助开展 Nessus 漏洞扫描、告警配置和网络审计。']}},
  },
  fr: {
    pinax:{title:'Ingénieur fiabilité des sites',period:'Mai 2023 – aujourd’hui',domains:{cloud:['Je participe à la migration d’infrastructures blockchain vers Kubernetes et à la livraison des configurations avec GitOps et FluxCD.','Je traite les incidents opérationnels et coordonne les changements avec les équipes qui maintiennent les réseaux et services nécessaires.'],ai:['J’utilise des outils d’IA pour les procédures opérationnelles, la supervision blockchain et la collecte d’informations utiles aux opérations.'],blockchain:['J’exploite plusieurs réseaux blockchain avec des clients d’exécution tels que Geth, Nethermind, Besu et Reth, et des clients de consensus tels que Lighthouse, Prysm et Teku.','Je travaille sur les services RPC, Firehose, Token API et Substreams : mises à niveau, forks, gestion des incidents et coordination communautaire.']}},
    'crypto-com':{title:'Analyste sécurité blockchain',period:'Octobre 2021 – février 2023',domains:{cloud:['J’ai évalué les limites de sécurité de l’infrastructure des validateurs, notamment dans des conceptions utilisant AWS Nitro Enclaves.'],blockchain:['J’ai étudié les surfaces d’attaque des validateurs, du minting, des bridges et des contrats intelligents, puis validé des preuves de concept signalées.','J’ai développé des contrôles Bash et des recommandations de sécurité pour les validateurs, et participé à la supervision et à l’analyse post-incident.'],cybersecurity:['J’ai validé des preuves de concept signalées par des chercheurs en sécurité et étudié leur comportement et leur impact.','J’ai utilisé le fuzzing Go pour étudier des dénis de service et analysé statiquement et dynamiquement du code Go et Rust.','Mes outils comprenaient SonarScanner, Burp Suite et Grafana, ainsi que des recommandations de sécurité et des contrôles des validateurs.']}},
    astri:{title:'Ingénieur blockchain',period:'Mars 2020 – octobre 2021',domains:{cloud:['J’ai participé à des déploiements AWS pensés pour la disponibilité et automatisé des laboratoires avec OpenShift et AWX.'],blockchain:['J’ai développé des applications Hyperledger Fabric avec React, Node.js et SQL au sein d’un processus agile utilisant Jira et Bitbucket.'],cybersecurity:['J’ai créé des environnements de laboratoire sécurisés sous Linux et avec des conteneurs pour les tests et les investigations.']}},
    hkt:{title:'Ingénieur cloud en formation',period:'Juin 2019 – mars 2020',domains:{cloud:['J’ai contribué aux mises à niveau Azure Stack et au support de premier et deuxième niveaux des services cloud.','J’ai participé à la planification de reprise, à une migration VMware et à l’automatisation opérationnelle avec PowerShell.']}},
    'hkt-internship':{title:'Stagiaire',period:'Juin 2018 – août 2018',domains:{cybersecurity:['Pendant mon stage, j’ai contribué aux scans de vulnérabilités Nessus, au paramétrage des alertes et aux audits réseau.']}},
  },
};

export function localizedExperience(experience: Experience, locale: Locale, domain: DomainId): LocalizedRole | Experience {
  if (locale === 'en') return experience;
  const localized = translations[locale][experience.id];
  return { title: localized.title, period: localized.period, domains: { [domain]: localized.domains[domain] ?? [] }, employer: experience.employer, id: experience.id, source: 'CV' };
}
