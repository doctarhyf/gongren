import React, { useState } from "react";
import { MAIN_MENU, USER_LEVEL } from "../helpers/flow";
import gck from "../img/gck.png";
import menu from "../img/menu.svg";
import { UserHasAccessCode } from "../helpers/func";

function MainNav({ user, onMenuClick, curPage, onLogout }) {
  // console.log(user);
  const [hidden, sethidden] = useState(true);

  return (
    <section className=" p-1  relative flex items-start  bg-sky-500 h-min md:h-fit w-full  md:flex justify-between">
      <div
        onClick={(e) => sethidden(!hidden)}
        className="p-1 cursor-pointer  w-fit max-w-[120pt] flex justify-center items-center "
      >
        <img src={gck} height={10} />
      </div>

      <div
        className={`${
          hidden ? "max-h-0" : "max-h-[700px] "
        } md:block   overflow-hidden transition-all duration-[250ms] ease-in-out`}
      >
        <div className={`md:flex  items-center justify-between `}>
          <ul className="text-end p-2 md:flex gap-2 flex-wrap ">
            {MAIN_MENU.map((menu_item, i) => (
              <li className="mb-2 " key={i}>
                {UserHasAccessCode(user, menu_item.access_code) && (
                  <button
                    onClick={(e) => {
                      onMenuClick(menu_item);
                      sethidden(true);
                    }}
                    className={` p-2
                ${curPage === menu_item.path ? "text-sky-500 bg-white" : ""}

               dark:text-white
                text-center cursor-pointer
                 hover:text-sky-500 
                 hover:bg-white 
                 w-full 
                 rounded-md px-1 `}
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
      </div>

      <div
        className={` cursor-pointer ${hidden ? "my-auto  " : "  "}   `}
        onClick={(e) => sethidden(!hidden)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-menu  "
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
    </section>
  );
}
export default MainNav;
