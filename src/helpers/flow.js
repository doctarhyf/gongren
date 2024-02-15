import Home from "../pages/home";
import Agents from "../pages/agents";
import Roulements from "../pages/roulements";
import Equipes from "../pages/equipes";
import Sections from "../pages/sections";
import Listes from "../pages/listes";
import Chargement from "../pages/chargement";
import Magasin from "../pages/magasin";
import Dico from "../pages/dico";
import Sacs from "../pages/sacs";

export const SUPERVISORS = {
  A: { nom: "ALBERT KANKOBWE", zh: "刚果贝" },
  B: { nom: "BERTIN KAYEMBE", zh: "编带" },
  C: { nom: "SERGE KAZALI", zh: "塞基尔" },
  D: { nom: "AMEDEE KATANGA", zh: "噶当噶" },
};

export const LOGO =
  "data:image/png;base64,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";
const MARG = 15;

export const NO_IMAGE =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDIFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMS44OCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wTU09J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8nPgogIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnN0b2NrOjM3MWE4YTRhLTJhNmYtNGQyNC1hZGU4LTViY2U1ZDI1ZjM3ZTwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjZjZDY5MmE2LTFhOWYtNGNmNS1iMzgxLWViYjYzODAyNmEzZDwveG1wTU06SW5zdGFuY2VJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAFAwQEBAMFBAQEBQUFBgcMCAcHBwcPCwsJDBEPEhIRDxERExYcFxMUGhURERghGBodHR8fHxMXIiQiHiQcHh8e/9sAQwEFBQUHBgcOCAgOHhQRFB4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e/8AAEQgBaAHgAwERAAIRAQMRAf/EABwAAQACAwEBAQAAAAAAAAAAAAABCAQFBgcDAv/EAE4QAAEDAgIEBw0FBQcBCQAAAAABAgMEBQYRByExQQgSE1FhdJEXIjI1N1NVcYGUsrPRFCNC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";

export const SHIFTS_ZH = ["白班", "中班", "夜班"];
export const SHIFT_HOURS_ZH = {
  M: ["MATIN", "白班", "07h00 - 15h00"],
  P: ["APREM", "中班", "15h00 - 23h00"],
  N: ["NUIT", "夜班", "23h00 - 07h00"],
};

export const CLASS_REPPORT_CARD = `border mt-2 rounded-md p-1 h-min bg-neutral-100 shadow-md`;
export const CLASS_TD = `p-1 border border-neutral-300`;
export const CLASS_TODAY = `bg-sky-500 text-white font-bold`;
export const CLASS_BTN =
  " mx-1 hover:bg-sky-500 hover:text-white border p-1 text-sky-400 border-transparent cursor-pointer rounded-md";

export const CLASS_INPUT_TEXT =
  "p-1 border rounded-md outline-none hover:border-sky-500 focus:border-purple-500";

export const CLASS_SELECT =
  "p-1 border rounded-md min-w-32 outline-none hover:border-sky-500 focus:border-purple-500";

export const CLASS_SELECT_TITLE = `min-w-24 inline-block mr-2 pb-4 text-sm font-bold  text-end`;

export const K_POSTE_NETTOYEUR = 0;
export const K_POSTE_EXPLOITANT = 1;
export const K_POSTE_OPERATEUR = 2;
export const K_POSTE_CHARGEUR = 3;
export const K_POSTE_MECANICIEN = 4;
export const K_POSTE_INTERPRETE = 5;
export const K_POSTE_SUPERVISEUR = 6;
export const K_POSTE_AIDE_OPERATEUR = 7;

export const USER_LEVEL = {
  AGENT: 0,
  SUPERVISOR: 1,
  ADMIN: 2,
  SUPER: 3,
};

export const SECTIONS = [
  "BROYAGE",
  "ENSACHAGE",
  "NETTOYAGE",
  "CIMENTERIE",
  "N/A",
];
export const POSTE = [
  "NET",
  "EXP",
  "OPE",
  "CHARG",
  "MEC",
  "INT",
  "SUP",
  "AIDOP",
];
export const EQUIPES = [
  "JR",
  "A",
  "B",
  "C",
  "D",
  "MEC",
  "NET",
  "INT",
  "CHIN",
  "N/A",
];

export const EQUIPES_NAMES = {
  JR: "DU JOUR",
  MEC: "MECANICIENS",
  NET: "NETTOYEURS",
  INT: "INTERPRETES",
  CHIN: "CHIOISE",
};

export const CONTRATS = ["BNC", "KAY", "GCK"];
export const NATIONALITIES = ["CD", "ZH"];

export const MAIN_MENU = [
  { name: "Home", path: "/home", el: Home, user_level: USER_LEVEL.AGENT },
  {
    name: "Agents",
    path: "/agents",
    el: Agents,
    user_level: USER_LEVEL.SUPERVISOR,
  },
  { name: "Chargement", path: "/chargement", el: Chargement, user_level: 0 },

  {
    name: "Roulements",
    path: "/roulements",
    el: Roulements,
    user_level: USER_LEVEL.SUPER,
  },
  {
    name: "Equipes",
    path: "/equipes",
    el: Equipes,
    user_level: USER_LEVEL.SUPERVISOR,
  },

  /* { name: "Magasin", path: "/magasin", el: Magasin, user_level: 0 }, */
  { name: "Dico", path: "/dico", el: Dico, user_level: 0 },
  { name: "Sacs", path: "/sacs", el: Sacs, user_level: 0 },

  { name: "Listes", path: "/listes", el: Listes, user_level: USER_LEVEL.AGENT },
  /*{ name: "Sections", path: "/sections", el: Sections }, */
];

export const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const pinyinVowelsWithTones = [
  ["ā", "á", "ǎ", "à"], // For 'a'
  ["ē", "é", "ě", "è"], // For 'e'
  ["ī", "í", "ǐ", "ì"], // For 'i'
  ["ō", "ó", "ǒ", "ò"], // For 'o'
  ["ū", "ú", "ǔ", "ù"], // For 'u'
  ["ǖ", "ǘ", "ǚ", "ǜ"], // For 'ü'
];
