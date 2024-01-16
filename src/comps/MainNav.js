import React from "react";
import { MAIN_MENU } from "../helpers/flow";
import gck from "../img/gck.png";

function MainNav({ onMenuClick, curPage }) {
  return (
    <section className="bg-sky-500 h-full w-44">
      <div className="p-1">
        <img src={gck} height={80} />
      </div>
      <div className="text-white  border-b pb-4 p-2 text-center">工人管理</div>
      <div>
        <ul className="text-end p-2">
          {MAIN_MENU.map((menu_item, i) => (
            <li className="mb-2" key={i}>
              <button
                onClick={(e) => onMenuClick(menu_item)}
                className={`
                ${curPage === menu_item.path ? "text-sky-500 bg-white" : ""}

                text-right cursor-pointer
                 hover:text-sky-500 
                 hover:bg-white 
                 w-full  
                 rounded-md p-2 `}
              >
                {menu_item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default MainNav;
