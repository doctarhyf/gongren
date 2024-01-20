import logo from "./logo.svg";
import "./App.css";
import { CLASS_BTN, LOGO, MAIN_MENU } from "./helpers/flow";
import { useRef, useState } from "react";
import MainNav from "./comps/MainNav";
import Loading from "./comps/Loading";
import * as SB from "./helpers/sb";
import { _ } from "./helpers/func";
import { TABLES_NAMES } from "./helpers/sb.config";
import FormLogin from "./comps/FormLogin";

export default function GongRen({ user, onLogout }) {
  const [curPage, setCurPage] = useState(MAIN_MENU[0].path);

  function onMenuClick(menu_item) {
    setCurPage(menu_item.path);
  }
  return (
    <div className=" h-[100vh] flex ">
      <MainNav
        user={user}
        onMenuClick={onMenuClick}
        onLogout={onLogout}
        curPage={curPage}
      />
      <div className="p-2">
        <div className="text-3xl text-sky-500 border-b  border-sky-500">
          {curPage}
        </div>
        <div>
          {MAIN_MENU.map((pg, i) => pg.path === curPage && <pg.el key={i} />)}
        </div>
      </div>
    </div>
  );
}
