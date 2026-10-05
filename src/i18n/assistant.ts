import type { AssistantLocale } from '../lib/assistant-types';
export interface AssistantCopy {
  launch: string; title: string; subtitle: string; welcome: string; description: string;
  aiDescription: string; input: string; placeholder: string; send: string; close: string; reset: string;
  you: string; guide: string; searching: string; answering: string; ready: string;
  found: string; noMatch: string; sources: string; unavailable: string; rateLimit: string;
  loadError: string; tooLong: string; privacy: string; aiPrivacy: string; prompts: string[];
}
export const assistantCopy: Record<AssistantLocale, AssistantCopy> = {
  en: {
    launch: 'Ask Johnaverse', title: 'The website guide', subtitle: 'PUBLIC KNOWLEDGE / FOUR DOMAINS',
    welcome: 'What would you like to explore?', description: 'Find answers in Johnathan’s published projects, experience, and engineering practice.',
    aiDescription: 'Ask about Johnathan’s projects and experience. AI answers use the published website; follow the sources to check the context.',
    input: 'Your question', placeholder: 'Ask about projects, experience, or tools…', send: 'Send question', close: 'Close guide', reset: 'New conversation',
    you: 'You', guide: 'Johnaverse', searching: 'Finding the relevant pages…', answering: 'Reading the website and preparing an answer…', ready: 'Ready',
    found: 'Here are the relevant passages from the website:', noMatch: 'I couldn’t find that information in the published website. Try a project or tool name, or contact Johnathan at contact@johnaverse.cc.',
    sources: 'Supporting pages', unavailable: 'AI is unavailable right now. Here are the relevant website passages instead.', rateLimit: 'Please wait before asking the AI again. You can still explore the website passages below.',
    loadError: 'The website content couldn’t be loaded. Please retry your question.', tooLong: 'Keep your question within 600 characters.',
    privacy: 'Questions stay in this tab. Answers quote published pages.', aiPrivacy: 'Questions are sent to the assistant service. Chat history stays in this tab.',
    prompts: ['What infrastructure does Johnathan work on?', 'How does the 3-2-1 backup strategy work?', 'What blockchain experience does he have?', 'How can I contact Johnathan?'],
  },
  'zh-Hant': {
    launch: '詢問 Johnaverse', title: '網站知識導覽', subtitle: '公開知識 / 四大領域',
    welcome: '想了解哪一方面？', description: '從 Johnathan 已公開的專案、職涯經驗與工程實踐中，尋找相關資訊。',
    aiDescription: '詢問 Johnathan 的專案與職涯經驗。AI 回答以公開網站為依據，可透過來源連結確認脈絡。',
    input: '你的問題', placeholder: '詢問專案、經驗或使用的工具…', send: '送出問題', close: '關閉導覽', reset: '開始新對話',
    you: '你', guide: 'Johnaverse', searching: '正在尋找相關頁面…', answering: '正在閱讀網站並整理回答…', ready: '已準備就緒',
    found: '以下是網站中的相關內容：', noMatch: '公開網站中沒有找到這項資訊。請嘗試專案或工具名稱，或透過 contact@johnaverse.cc 聯絡 Johnathan。',
    sources: '參考頁面', unavailable: 'AI 暫時無法使用，以下改為提供網站中的相關內容。', rateLimit: '請稍後再向 AI 提問。你仍可閱讀下方的網站內容。',
    loadError: '無法載入網站內容，請再次送出問題。', tooLong: '請將問題控制在 600 個字元內。',
    privacy: '問題只保留在此分頁，回答引用公開頁面。', aiPrivacy: '問題會傳送至助理服務，對話紀錄只保留在此分頁。',
    prompts: ['Johnathan 從事哪些基礎設施工作？', '3-2-1 備份原則如何運作？', '他有哪些區塊鏈經驗？', '如何聯絡 Johnathan？'],
  },
  'zh-Hans': {
    launch: '询问 Johnaverse', title: '网站知识导览', subtitle: '公开知识 / 四大领域',
    welcome: '想了解哪一方面？', description: '从 Johnathan 已公开的项目、职业经历和工程实践中查找相关信息。',
    aiDescription: '询问 Johnathan 的项目和职业经历。AI 回答以公开网站为依据，可通过来源链接确认上下文。',
    input: '你的问题', placeholder: '询问项目、经验或使用的工具…', send: '发送问题', close: '关闭导览', reset: '开始新对话',
    you: '你', guide: 'Johnaverse', searching: '正在查找相关页面…', answering: '正在阅读网站并整理回答…', ready: '已准备就绪',
    found: '以下是网站中的相关内容：', noMatch: '公开网站中没有找到这项信息。请尝试项目或工具名称，或通过 contact@johnaverse.cc 联系 Johnathan。',
    sources: '参考页面', unavailable: 'AI 暂时不可用，以下改为提供网站中的相关内容。', rateLimit: '请稍后再向 AI 提问。你仍可阅读下方的网站内容。',
    loadError: '无法加载网站内容，请再次发送问题。', tooLong: '请将问题控制在 600 个字符内。',
    privacy: '问题只保留在此标签页，回答引用公开页面。', aiPrivacy: '问题会发送至助手服务，对话记录只保留在此标签页。',
    prompts: ['Johnathan 从事哪些基础设施工作？', '3-2-1 备份原则如何运作？', '他有哪些区块链经验？', '如何联系 Johnathan？'],
  },
  fr: {
    launch: 'Demander à Johnaverse', title: 'Le guide du site', subtitle: 'CONNAISSANCES PUBLIQUES / QUATRE DOMAINES',
    welcome: 'Que souhaitez-vous découvrir ?', description: 'Trouvez des réponses dans les projets publiés, l’expérience et les pratiques techniques de Johnathan.',
    aiDescription: 'Posez vos questions sur les projets et l’expérience de Johnathan. Les réponses de l’IA s’appuient sur ce site ; consultez les sources pour vérifier le contexte.',
    input: 'Votre question', placeholder: 'Une question sur les projets, l’expérience ou les outils…', send: 'Envoyer la question', close: 'Fermer le guide', reset: 'Nouvelle conversation',
    you: 'Vous', guide: 'Johnaverse', searching: 'Recherche des pages pertinentes…', answering: 'Lecture du site et préparation de la réponse…', ready: 'Prêt',
    found: 'Voici les passages pertinents du site :', noMatch: 'Je n’ai pas trouvé cette information sur le site publié. Essayez un nom de projet ou d’outil, ou contactez Johnathan à contact@johnaverse.cc.',
    sources: 'Pages de référence', unavailable: 'L’IA est indisponible pour le moment. Voici les passages pertinents du site.', rateLimit: 'Patientez avant de poser une nouvelle question à l’IA. Vous pouvez consulter les passages ci-dessous.',
    loadError: 'Le contenu du site n’a pas pu être chargé. Veuillez réessayer votre question.', tooLong: 'Limitez votre question à 600 caractères.',
    privacy: 'Vos questions restent dans cet onglet. Les réponses citent les pages publiées.', aiPrivacy: 'Les questions sont envoyées au service d’assistance. L’historique reste dans cet onglet.',
    prompts: ['Sur quelles infrastructures travaille Johnathan ?', 'Comment fonctionne la stratégie de sauvegarde 3-2-1 ?', 'Quelle est son expérience blockchain ?', 'Comment contacter Johnathan ?'],
  },
};
