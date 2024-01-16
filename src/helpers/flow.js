import Home from "../pages/home";
import Agents from "../pages/agents";
import Roulements from "../pages/roulements";
import Equipes from "../pages/equipes";
import Sections from "../pages/sections";
import Listes from "../pages/listes";

export const CLASS_TD = `p-1 border border-neutral-300`;
export const CLASS_BTN =
  " mx-1 hover:bg-sky-500 hover:text-white border p-1 text-sky-400 border-transparent cursor-pointer rounded-md";

export const K_POSTE_NETTOYEUR = 0;
export const K_POSTE_EXPLOITANT = 1;
export const K_POSTE_OPERATEUR = 2;
export const K_POSTE_CHARGEUR = 3;
export const K_POSTE_MECANICIEN = 4;
export const K_POSTE_INTERPRETE = 5;
export const K_POSTE_SUPERVISEUR = 6;
export const K_POSTE_AIDE_OPERATEUR = 7;

export const SECTIONS = ["BROYAGE", "ENSACHAGE", "NETTOYAGE", "N/A"];
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
export const EQUIPES = ["JR", "A", "B", "C", "D", "MEC", "NET", "INT", "N/A"];
export const CONTRATS = ["BNC", "KAY", "GCK"];
export const NATIONALITIES = ["CD", "ZH"];

export const MAIN_MENU = [
  { name: "Home", path: "/home", el: Home },
  { name: "Agents", path: "/agents", el: Agents },
  { name: "Roulements", path: "/roulements", el: Roulements },
  { name: "Equipes", path: "/equipes", el: Equipes },
  { name: "Listes", path: "/listes", el: Listes },
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
