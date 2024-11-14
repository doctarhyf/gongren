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
  SUIVI_CHARGEMENT: ["SUIVI CHARGEMENT", "卡车装载监控"],
  TEAM: ["TEAM", "班组"],
  NEW: ["NEW", "加薪"],
  REFRESH: ["REFRESH", "帅新"],
  PRINT_REPPORT: ["PRINT REPPORT", "打印报告"],
  CEMENT_LOADING: ["CEMENT LOADING", "水泥包装"],
  TRUCK: ["TRUCK", "车辆"],
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

export function GetTransForToken(token, user) {
  const keys = Object.keys(LANG_TOKENS);
  console.log("Keys :", keys);
  const vals = Object.values(LANG_TOKENS);
  console.log("vals: ", vals);
  console.log("token: ", token);
  const idx = vals.findIndex(
    (arr) => arr[0] === token[0] && arr[1] === token[1]
  );
  console.log("idx: ", idx);
  const key = keys[idx];
  console.log("key: ", key);

  //return LANG_TOKENS[key][user.lang];
  const trad = LANG_TOKENS[key][GetLangIndexByLangCode(user.lang)];
  console.log("trad: ", trad);
  return trad;
}
