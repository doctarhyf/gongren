import france from "../img/france.png";
import usa from "../img/usa.png";
import china from "../img/china.png";

const STRINGS = {
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
  Login: {
    default: "LOGIN",
    "en-US": "LOGIN",
    "fr-FR": "SE CONNECTER",
    "zh-CN": "登录",
  },
  "Code and Design by": {
    default: "Code and Design by",
    "en-US": "Code and Design by",
    "fr-FR": "Code et conception par",
    "zh-CN": "代码和设计由",
  },
};

export const STRINGS_KEYS = {
  MATRICULE: "Matricule",
  PIN: "PIN",
  Login: "Login",
  "Code and Design by": "Code and Design by",
};

function genStringKeys(stringKeysData) {
  let stringKeys = {};
  Object.keys(stringKeysData).forEach((dt) => {
    stringKeys[dt] = dt;
  });

  return stringKeys;
}

function GET_TRAD(stringKey, langCode) {
  const strings = STRINGS[stringKey];

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

export default GET_TRAD;
