import france from "../img/france.png";
import usa from "../img/usa.png";
import china from "../img/china.png";

export const STRINGS = {
  Matricule: {
    default: "Matricule",
    "en-US": "Agent Number",
    "fr-FR": "Numero Matricule",
    "zh-CN": "工号",
  },
  PIN: {
    default: "PIN",
    "en-US": "PIN",
    "fr-FR": "Code PIN",
    "zh-CN": "密码",
  },
  Signin: {
    default: "Signin",
    "en-US": "Signin",
    "fr-FR": "Se connecter",
    "zh-CN": "登录",
  },

  "Code and Design by": {
    default: "Code and Design by",
    "en-US": "Code and Design by",
    "fr-FR": "Code et conception par",
    "zh-CN": "代码和设计由",
  },
  "Agents count": {
    default: "Agents count",
    "en-US": "Agents count",
    "fr-FR": "Nombre d'agents",
    "zh-CN": "工人数量",
  },
  Team: {
    default: "Team",
    "en-US": "Team",
    "fr-FR": "Equipe",
    "zh-CN": "班组",
  },
};

function GenStringKeys(strings) {
  let strz = {};

  Object.keys(strings).forEach((it, i) => {
    strz[it] = it;
  });

  return strz;
}

function GET_TRAD(stringKey, langCode) {
  const STRINGS_KEYS = GenStringKeys(STRINGS);

  const strings = STRINGS[stringKey];
  console.log("string key => ", stringKey);

  if (!strings) {
    return STRINGS_KEYS[stringKey];
  }

  const trad = strings[langCode];

  if (!trad) {
    return STRINGS_KEYS[stringKey];
  }

  return trad;
}

export const LANGS = [
  {
    code: "fr-FR",
    icon: france,
    name: "Francais",
    active: false,
  },
  {
    code: "en-US",
    icon: usa,
    name: "English",
    active: true,
  },
  {
    code: "zh-CN",
    icon: china,
    name: "Zhongwen",
    active: true,
  },
];

export const GET_STRINGS_KEYS = (key) => {
  const stk = GenStringKeys(STRINGS);

  return stk[key];
};

export const GEN_TRANSLATIONS = (translations, newLang) => {
  let newtrads = {};
  translations.forEach((it, i) => {
    newtrads = { ...newtrads, [it]: GET_TRAD(it, newLang.code) };
  });

  return newtrads;
};

export const PACK_TRANSLATIONS_STRINGS = (trans) =>
  trans.map((t, i) => GET_STRINGS_KEYS(t.default));

export default GET_TRAD;
