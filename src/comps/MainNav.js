import React from "react";
import { MAIN_MENU, USER_LEVEL } from "../helpers/flow";
import gck from "../img/gck.png";

function MainNav({ user, onMenuClick, curPage, onLogout }) {
  console.log(user);

  return (
    <section className="bg-sky-500 h-full md:h-fit w-44 md:w-full md:flex justify-between">
      <div className=" border-b md:flex gap-4 ">
        <div>
          <div className="p-1 min-w-[120pt] flex justify-center items-center ">
            <img src={gck} height={40} />
          </div>
          <div className="text-white w-fit  pb-4 p-2 text-center">工人管理</div>
        </div>
        <div className=" justify-center items-center md:border-r p-1">
          <div>
            Hello, <span>{user.display_name}</span>
          </div>
          <div>User level : {Object.keys(USER_LEVEL)[user.user_level]}</div>
        </div>
      </div>

      <div className="md:flex  items-center justify-between">
        <ul className="text-end p-2 md:flex gap-2 flex-wrap ">
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
          <li className="flex justify-center items-center mb-2">
            <button
              onClick={onLogout}
              className=" w-fit text-xs p-1  rounded-md mx-auto bg-red-500 text-white hover:bg-red-700 "
            >
              LOGOUT
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}
export default MainNav;
