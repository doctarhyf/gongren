import france from "../img/france.png";
import usa from "../img/usa.png";
import china from "../img/china.png";

//Here’s the updated code with French translations added as the third element in each array:

export const LANG_TOKENS = {
  CLEAR_CURRENT_TEAM: [
    "CLEAR CURRENT TEAM",
    "清除当前团队",
    "Effacer l'équipe actuelle",
  ],
  TONS_ALREADY_LOADED_THIS_MONTH: [
    "Tons Already Loaded for This Month.",
    "本月已装载吨数",
    "Tonnes Déjà Chargées pour Ce Mois.",
  ],
  DAYS_REM_IN_MONTH: [
    "Days Remaining in the Month",
    "本月剩余天数",
    "Jours restants du mois",
  ],
  CEMENT_ALREADY_SHIPPED: [
    "Cement Already Shipped (in USD)",
    "已发运水泥金额 （美元）",
    "Ciment deja expedie (USD)",
  ],
  AGENTS_LIST: ["Agents List", "工人名单", "Liste des agents"],
  MY_TEAM: ["My Team", "我的班组", "Mon Equipe"],
  TOTAL: ["TOTAL", "总计", "TOTAL"],
  INTERPRETES: ["INTERPRETS", "翻译", "INTERPRETES"],
  INTERPRETE: ["INTERPRET", "翻译", "INTERPRETE"],
  CLEAR_CUSTOM_LIST: [
    "CLEAR CURRENT TEAM",
    "清除自定义列表  ",
    "Effacer la liste personnalisée",
  ],
  CONTRACT: ["Contract", "工作合同", "Contrat"],
  EMPLOYE_ID: ["Employe ID", "工号", "ID d'employé"],
  PIN: ["PIN", "密码", "Code PIN"],
  LOGIN: ["Login", "登录", "Connexion"],
  CODE_AND_DESIGN: [
    "Code and design by ",
    "代码与设计：",
    "Code et design par ",
  ],
  CHOOSE_LANG: ["Choose language", "选择语言", "Choisissez la langue"],
  HOME: ["HOME", "主页", "ACCUEIL"],
  LOADING_TRACKING: ["Load Tracking", "卡车装载监控", "Suivi de chargement"],
  HUD_TITLE_LOADING_TRACKING: [
    "LOADING TRACKING %y/%m",
    "装载跟踪 - %y年%m月",
    "Suivi de chargement - %y/%m",
  ],
  HUD_TITLE_BONUS_TRACKING: [
    "BONUS TRACKING %y/%m",
    "奖金跟踪 - %y年%m月",
    "Suivi des bonus - %y/%m",
  ],
  HUD_DESC_BONUS: [
    "Bonus Tracking for the Current Month",
    "本月奖金跟踪",
    "Suivi des bonus pour le mois en cours",
  ],
  HUD_DESC_LOADING: [
    "*Loading Progress for the Current Month",
    "本月装载进度",
    "Progression du chargement pour le mois en cours",
  ],
  TEAM: ["Team", "班组", "Équipe"],
  NEW: ["NEW", "加薪", "NOUVEAU"],
  REFRESH: ["REFRESH", "帅新", "RAFRAÎCHIR"],
  PRINT_REPPORT: ["PRINT REPPORT", "打印报告", "IMPRIMER LE RAPPORT"],
  CEMENT_LOADING: ["Cement Loading", "水泥包装", "Chargement de ciment"],
  TRUCK: ["TRUCK", "车辆", "CAMION"],
  TRUCKS_LOADING_TRACKING: [
    "Truck Loading Tracking",
    "卡车装载跟踪",
    "Suivi de chargement des camions",
  ],
  TORN_BAGS: ["TORN BAGS", "破袋", "SACS DÉCHIRÉS"],
  TORN_B: ["T.B.", "破袋", "DECH."],
  T: ["T", "吨", "T"],
  DATE: ["Date", "日期", "Date"],
  EQ: ["EQ.", "班", "EQ."],
  SHIFT: ["Shift", "班次", "Shift"],
  BAGS: ["Bags", "袋子", "Sacs"],
  MSG_INSERT_NEW_DATA: [
    "Please insert all the data without any errors, please! Your bonus depends on it!",
    "请毫无错误地插入所有数据，拜托！您的奖金取决于此！",
    "Veuillez insérer toutes les données sans erreurs, s'il vous plaît! Votre bonus en dépend!",
  ],
  CUSTOM_LIST: ["CUSTOM LIST", "自定义名单", "LISTE PERSONNALISÉE"],
  TEAM_STATS: ["TEAM STATS", "班组统计", "STATISTIQUES D'ÉQUIPE"],
  TEAM_FILTER: ["TEAM FILTERS", "班组筛选器", "FILTRES D'ÉQUIPE"],
  SHOW_MAP: ["SHOW MAP", "显示地图", "AFFICHER LA CARTE"],
  SHOW_TEAM_SELECTOR: [
    "SHOW TEAM SELECTOR",
    "显示班组选择器",
    "AFFICHER LE SÉLECTEUR D'ÉQUIPE",
  ],
  LOGOUT: ["LOGOUT", "退出登录", "DÉCONNEXION"],
  NOTIFICATIONS: ["Notifications", "通知", "Notifications"],
  AGENTS: ["Agents", "工人", "Agents"],
  LOADING_REPPORT: ["Loading Repport", "包装报告", "Rapport de chargement"],
  BIGBAG: ["BigBag", "吨包包装", "BigBag"],
  ATTENDANCE: ["Attendance", "考勤", "Présence"],
  WAREHOUSE: ["Warehouse", "库房", "Magasin"],
  DICO: ["Dictionnary", "词典", "Dictionnaire"],
  NAME_LISTS: ["Name Lists", "名单", "Listes de noms"],
  MSG_WELCOME: [
    "Welcome to the cement plant portal",
    "欢迎来到水泥厂门户",
    "Bienvenue sur le portail de la cimenterie",
  ],
  MSG_SECTION: [
    "Click on a section to see more details.",
    " 点击一个栏目查看更多详情。",
    "Cliquez sur une section pour voir plus de détails.",
  ],
  MSG_SHOW_MONTH_DATA: [
    "Show data for the month of",
    "显示选的月份的数据",
    "Afficher les données du mois de",
  ],
  YEAR: ["YEAR", "年", "ANNÉE"],
  MONTH: ["MONTH", "月", "MOIS"],
  SUP: ["SUP", "班长", "SUP"],
  DEQ: ["SQUAD LEADER", "小班长", "CHEF D'ÉQUIPE"],
  Workshop: ["Workshop", "车间", "Section"],
  Position: ["Position", "岗位", "Poste"],
  Phone: ["Phone", "电话", "Téléphone"],
  PRINT: ["PRINT", "打印", "IMPRIMER"],
  UPDATE: ["UPDATE", "更新", "MISE À JOUR"],
  DELETE: ["DELETE", "删除", "SUPPRIMER"],
  UPDATE_ACCESS_CODES: [
    "UPDATE ACCESS CODES",
    "更新访问代码",
    "METTRE A JOUR CODES D'ACCES",
  ],
  OUI: ["YES", "是", "OUI"],
  NON: ["NO", "否", "NON"],
  SAVE: ["SAVE", "保存", "ENREGISTRER"],
  SAVE_WHOLE_TEAM: [
    "SAVE (WHOLE TEAM)",
    "保存 （全班）",
    "ENREGISTRER (ÉQUIPE ENTIÈRE)",
  ],
  CANCEL: ["CANCEL", "取消", "ANNULER"],
  SHOW_ONLY_ACTIVE: [
    "SHOW ONLY ACTIVE",
    "仅显示活跃用户",
    "AFFICHER UNIQ. ACTIFS",
  ],
  Page: ["Page %p", "%p 页", "Page %p"],
  Nom: ["Name", "姓名", "Nom"],

  NET: ["CLEANER", "打扫卫生", "NETTOYEUR"],
  EXP: ["EXPLOITANT", "岗位工", "EXPLOITANT"],
  EXPEDITOR: ["EXPEDITOR", "发货员", "EXP"],
  OPE: ["OPERATOR", "插袋工", "OPERATEUR"],
  CHARG: ["LOADER", "装车工", "CHARGEUR"],
  MEC: ["MECANIC", "机修工", "MECANICIEN"],
  INT: ["TRANSLATOR", "翻译", "INT"],
  SUP: ["SUPERVISOR", "班长", "SUPERVISEUR"],
  DIR: ["DIRECTOR", "主任", "DIRECTEUR"],
  AIDOP: ["ASSISTANT OP.", "助插袋工", "AIDOP"],
  BROYAGE: ["CEMENT GRINDER", "水泥磨", "BROYAGE"],
  ENSACHAGE: ["CEMENT PACKAGING", "水泥包装", "ENSACHAGE"],
  NETTOYAGE: ["CLEANING", "打扫卫生", "NETTOYAGE"],
  CIMENTERIE: ["CIMENT WORKSHOP", "水泥车间", "CIMENTERIE"],
  "N/A": ["N/A", "无", "N/A"],
  created_at: ["CREATED AT", "创建于", "Créé le"],
  contrat: ["CONTRACT", "工作合同", "CONTRAT"],
  equipe: ["TEAM", "班组", "EQUIPE"],
  mingzi: ["CHINESE NAME", "中名", "NOM"],
  nationalite: ["NATIONALITY", "国籍", "NATIONALITE"],
  nom: ["NAME", "姓名", "NOM"],
  poste: ["POSITION", "岗位", "POSTE"],
  postnom: ["SURNAME", "姓氏", "POSTNOM"],
  prenom: ["FIRSTNAME", "名字", "PRENOM"],
  section: ["WORKSHOP", "车间", "SECTION"],
  phone: ["PHONE", "电话", "PHONE"],
  matricule: ["EMPLOYE ID", "工号", "MATRICULE"],
  chef_deq: ["SQUAD LEADER", "小班长", "CHEF D'EQUIPE"],
  tenue: ["WORKING CLOTHES", "工作服", "TENUE"],
  pin: ["PIN", "密码", "PIN"],
  user_level: ["USER LEVEL", "用户级别", "Niveau d'utilisateur"],
  active: ["ACTIVE", "活跃", "ACTIF"],
  is_exp: ["IS EXPEDITOR", "发货员", "EXPEDITEUR"],
  lang: ["LANGUAGE", "语言", "LANGUE"],
  CHIN: ["CHINESE AGENTS", "中方员工", "AGENTS CHINOIS"],
  JR: ["DAILY TEAM", "全白班", "EQUIPE DU JOUR"],
};

//Each entry now includes a French translation as the third element in the array. Let me know if there are any terms that might need adjustment or further customization!
export const LANGS = [
  {
    id: 0,
    code: "en-US",
    icon: usa,
    name: "English",
    active: true,
  },
  {
    id: 1,
    code: "zh-CN",
    icon: china,
    name: "Zhongwen",
    active: true,
  },
  {
    id: 2,
    code: "fr-FR",
    icon: france,
    name: "Francais",
    active: true,
  },
];

export function GetLangCodeByIndex(langID) {
  const lang = LANGS.find((it) => it.id === langID);

  if (lang) {
    return lang.code;
  }

  return "en-US";
}

export function GetLangIndexByLangCode(langCode) {
  const lang = LANGS.find((it) => it.code === langCode);

  if (lang) {
    return lang.id;
  }

  return 0;
}

export function GetTransForTokenName(tokenName, langCode, holderData) {
  const tokensArray = LANG_TOKENS[tokenName];

  if (tokensArray === undefined) return tokenName;

  return GetTransForTokensArray(tokensArray, langCode, holderData);
}

export function GetTransForTokensArray(tokensArray, langCode, holderData) {
  const keys = Object.keys(LANG_TOKENS);
  //console.log("Keys :", keys);
  const vals = Object.values(LANG_TOKENS);
  //console.log("vals: ", vals);
  //console.log("token: ", tokensArray);
  const idx = vals.findIndex((arr) => {
    return arr[0] === tokensArray[0] && arr[1] === tokensArray[1];
  });

  //return "test";
  //console.log("idx: ", idx);
  let key = keys[idx];
  //console.log("key: ", key);

  if (key === -1) key = 0;
  let trad = LANG_TOKENS[key][GetLangIndexByLangCode(langCode)];
  //console.log("trad: ", trad);
  if (holderData) {
    Object.entries(holderData).forEach((it) => {
      const k = it[0];
      const v = it[1];

      trad = trad.replaceAll("%" + k, v);
    });
  }
  //console.log("fin trad: ", trad);
  //console.log("holderData: ", holderData);
  const deftrad = LANG_TOKENS[key][GetLangIndexByLangCode("en-US")];
  return trad ? trad : deftrad;
}

export const GTFT = GetTransForTokensArray;
