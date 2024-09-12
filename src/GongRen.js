import { useState } from "react";
import "./App.css";
import MainNav from "./comps/MainNav";
import { MAIN_MENU } from "./helpers/flow";

export default function GongRen({ user, onLogout }) {
  const [curPage, setCurPage] = useState(MAIN_MENU[0].path);

  function onMenuClick(menu_item) {
    setCurPage(menu_item.path);
  }
  return (
    <div className=" h-[100vh] md:flex md:flex-col ">
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
