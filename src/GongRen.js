import { useState } from "react";
import "./App.css";
import MainNav from "./comps/MainNav";
import { MAIN_MENU } from "./helpers/flow";
import { GetTransForTokensArray } from "./helpers/lang_strings";

export default function GongRen({ user, onLogout }) {
  const [menuItem, setMenuItem] = useState(MAIN_MENU[0]);

  function onMenuClick(menu_item) {
    setMenuItem(menu_item);
  }
  return (
    <div className=" h-[100vh] md:flex md:flex-col ">
      <MainNav
        user={user}
        onMenuClick={onMenuClick}
        onLogout={onLogout}
        curPage={menuItem.path}
      />
      <div className="p-2">
        <div className="text-3xl text-sky-500 border-b  border-sky-500">
          {menuItem.trad?.length > 0
            ? GetTransForTokensArray(menuItem.trad, user.lang)
            : menuItem.path}
        </div>
        <div>
          {MAIN_MENU.map(
            (pg, i) => pg.path === menuItem.path && <pg.el key={i} />
          )}
        </div>
      </div>
    </div>
  );
}
