import React from "react";
import { MAIN_MENU, USER_LEVEL } from "../helpers/flow";
import gck from "../img/gck.png";

function MainNav({ user, onMenuClick, curPage, onLogout }) {
  return (
    <section className="bg-sky-500 h-full w-44">
      <div className=" border-b">
        <div className="p-1">
          <img src={gck} height={80} />
        </div>
        <div className="text-white  pb-4 p-2 text-center">工人管理</div>
        <>
          <div>
            Hello, <span>{user.display_name}</span>
          </div>
          <div>User level : {Object.keys(USER_LEVEL)[user.user_level]}</div>
        </>
        <button
          onClick={onLogout}
          className=" w-1/2  rounded-md mx-auto bg-red-500 text-white hover:bg-red-700 "
        >
          LOGOUT
        </button>
      </div>
      <div>
        <ul className="text-end p-2">
          {MAIN_MENU.map((menu_item, i) => (
            <li className="mb-2" key={i}>
              {user.user_level >= menu_item.user_level && (
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
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default MainNav;
