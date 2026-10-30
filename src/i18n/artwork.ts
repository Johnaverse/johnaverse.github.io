import type { DomainId } from '../data/domains';
import type { Locale } from './index';

// Alt text for the conceptual illustrations, per locale.
export const artworkDescriptions: Record<Locale, Record<DomainId | 'home', string>> = {
  en: { home: 'Conceptual engineering landscape connecting cloud servers, AI agents, blockchain ledgers, and security systems.', cloud: 'Conceptual cloud infrastructure with graphite servers, a glass cloud, and cyan storage and access connections.', ai: 'Conceptual violet model core connected to four agent modules through a control gate.', blockchain: 'Conceptual amber ledger blocks connected to graphite blockchain server nodes.', cybersecurity: 'Conceptual emerald protective shield and inspection lens beside service modules.' },
  'zh-Hant': { home: '概念示意圖：串連雲端伺服器、AI 代理、區塊鏈帳本與安全系統的工程環境。', cloud: '雲端基礎設施概念示意圖：石墨色伺服器、玻璃質感雲端，以及青色儲存與存取連線。', ai: '概念示意圖：紫色模型核心透過控制閘道連接四個代理模組。', blockchain: '概念示意圖：琥珀色帳本區塊連接石墨色區塊鏈節點。', cybersecurity: '概念示意圖：翠綠色防護盾與檢視鏡旁的服務模組。' },
  'zh-Hans': { home: '概念示意图：连接云服务器、AI 代理、区块链账本和安全系统的工程环境。', cloud: '云基础设施概念示意图：石墨色服务器、玻璃质感云，以及青色存储和访问连接。', ai: '概念示意图：紫色模型核心通过控制网关连接四个代理模块。', blockchain: '概念示意图：琥珀色账本区块连接石墨色区块链节点。', cybersecurity: '概念示意图：翠绿色防护盾和检测镜旁的服务模块。' },
  fr: { home: 'Illustration conceptuelle d’un environnement d’ingénierie reliant serveurs cloud, agents IA, registres blockchain et sécurité.', cloud: 'Illustration conceptuelle du cloud : serveurs graphite, nuage de verre et connexions de stockage et d’accès cyan.', ai: 'Illustration conceptuelle d’un modèle violet relié à quatre modules d’agents par une passerelle de contrôle.', blockchain: 'Illustration conceptuelle de blocs de registre ambrés reliés à des nœuds blockchain graphite.', cybersecurity: 'Illustration conceptuelle d’un bouclier vert et d’une loupe à côté de modules de services.' },
};
