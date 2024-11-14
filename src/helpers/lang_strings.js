import france from "../img/france.png";
import usa from "../img/usa.png";
import china from "../img/china.png";

export const LANG_TOKENS = {
  EMPLOYE_ID: ["Employe ID", "工号"],
  PIN: ["PIN", "密码"],
  LOGIN: ["Login", "登录"],
  CODE_AND_DESIGN: ["Code and design by ", "代码与设计："],
  CHOOSE_LANG: ["Choose language", "选择语言"],
  HOME: ["HOME", "主页"],
  LOADING_TRACKING: ["Load Tracking", "卡车装载监控"],
  HUD_TITLE_LOADING_TRACKING: ["LOADING TRACKING %y/%m", "装载跟踪 - %y年%m月"],
  HUD_TITLE_BONUS_TRACKING: ["BONUS TRACKING %y/%m", "奖金跟踪 - %y年%m月"],
  HUD_DESC_BONUS: ["Bonus Tracking for the Current Month", "本月奖金跟踪"],
  HUD_DESC_LOADING: ["*Loading Progress for the Current Month", "本月装载进度"],
  TEAM: ["TEAM", "班组"],
  NEW: ["NEW", "加薪"],
  REFRESH: ["REFRESH", "帅新"],
  PRINT_REPPORT: ["PRINT REPPORT", "打印报告"],
  CEMENT_LOADING: ["Cement Loading", "水泥包装"],
  TRUCK: ["TRUCK", "车辆"],
  TRUCKS_LOADING_TRACKING: ["Truck Loading Tracking", "卡车装载跟踪"],
  TORN_BAGS: ["TORN BAGS", "破袋"],
  T: ["T", "吨"],
  DATE: ["Date", "日期"],
  EQ: ["EQ.", "班"],
  SHIFT: ["Shift", "班次"],
  BAGS: ["Bags", "袋子"],
  MSG_INSERT_NEW_DATA: [
    "Please insert all the data without any errors, please! Your bonus depends on it!",
    "请毫无错误地插入所有数据，拜托！您的奖金取决于此！",
  ],
  CUSTOM_LIST: ["CUSTOM LIST", "自定义名单"],
  TEAM_STATS: ["TEAM STATS", "班组统计"],
  TEAM_FILTER: ["TEAM FILTERS", "班组筛选器"],
  SHOW_MAP: ["SHOW MAP", "显示地图"],
  SHOW_TEAM_SELECTOR: ["SHOW TEAM SELECTOR", "显示班组选择器"],
  LOGOUT: ["LOGOUT", "退出登录"],
  NOTIFICATIONS: ["Notifications", "通知"],
  AGENTS: ["Agents", "工人"],
  LOADING_REPPORT: ["Loading Repport", "包装报告"],
  BIGBAG: ["BigBag", "吨包包装"],
  ATTENDANCE: ["Attendance", "考勤"],
  WAREHOUSE: ["Warehouse", "库房"],
  DICO: ["Dictionnary", "词典"],
  NAME_LISTS: ["Name Lists", "名单"],
  MSG_WELCOME: ["Welcome to the cement plant portal", "欢迎来到水泥厂门户"],
  MSG_SECTION: [
    "Click on a section to see more details.",
    " 点击一个栏目查看更多详情。",
  ],
  MSG_SHOW_MONTH_DATA: ["Show data for the month of", "显示选的月份的数据"],
  YEAR: ["YEAR", "年"],
  MONTH: ["MONTH", "月"],
};
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
  /* {
    id: 2,
    code: "fr-FR",
    icon: france,
    name: "Francais",
    active: true,
  }, */
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

export function GetTransForToken(token, langCode, holderData) {
  const keys = Object.keys(LANG_TOKENS);
  console.log("Keys :", keys);
  const vals = Object.values(LANG_TOKENS);
  console.log("vals: ", vals);
  console.log("token: ", token);
  const idx = vals.findIndex(
    (arr) => arr[0] === token[0] && arr[1] === token[1]
  );
  console.log("idx: ", idx);
  let key = keys[idx];
  console.log("key: ", key);

  if (key === -1) key = 0;
  let trad = LANG_TOKENS[key][GetLangIndexByLangCode(langCode)];
  console.log("trad: ", trad);
  if (holderData) {
    Object.entries(holderData).forEach((it) => {
      const k = it[0];
      const v = it[1];

      trad = trad.replaceAll("%" + k, v);
    });
  }
  console.log("fin trad: ", trad);
  console.log("holderData: ", holderData);
  const deftrad = LANG_TOKENS[key][GetLangIndexByLangCode("en-US")];
  return trad ? trad : deftrad;
}
