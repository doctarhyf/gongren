import logo from "./logo.svg";
import "./App.css";
import { MAIN_MENU } from "./helpers/flow";
import { useState } from "react";
import MainNav from "./comps/MainNav";

function App() {
  const [curPage, setCurPage] = useState(MAIN_MENU[0].path);

  function onMenuClick(menu_item) {
    setCurPage(menu_item.path);
  }

  return (
    <div className=" h-[100vh] flex ">
      <MainNav onMenuClick={onMenuClick} curPage={curPage} />
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

export default App;
