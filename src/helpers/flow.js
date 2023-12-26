import Home from "../pages/home";
import Agents from "../pages/agents";
import Roulements from "../pages/roulements";
import Equipes from "../pages/equipes";
import Sections from "../pages/sections";

export const CLASS_BTN =
  " mx-1 hover:bg-sky-500 hover:text-white border p-1 text-sky-400 border-transparent cursor-pointer rounded-md";

export const SECTIONS = ["BROYAGE", "ENSACHAGE"];
export const POSTE = ["NET", "EXP", "OPE", "CHARG", "MEC"];
export const EQUIPES = ["JR", "A", "B", "C", "D"];

export const MAIN_MENU = [
  { name: "Home", path: "/home", el: Home },
  { name: "Agents", path: "/agents", el: Agents },
  { name: "Roulements", path: "/roulements", el: Roulements },
  { name: "Equipes", path: "/equipes", el: Equipes },
  /*{ name: "Sections", path: "/sections", el: Sections }, */
];
