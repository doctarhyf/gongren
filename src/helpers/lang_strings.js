import france from "../img/france.png";
import usa from "../img/usa.png";
import china from "../img/china.png";

const STRINGS = {
  MATRICULE: {
    default: "Matricule",
    "en-US": "Agent Number",
    "fr-FR": "Numero Matricule",
    "zh-CN": "工号",
  },
};

export const STRINGS_KEYS = {
  MATRICULE: "Matricule",
};

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
