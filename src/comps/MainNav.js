import React, { useState } from "react";
import { MAIN_MENU, USER_LEVEL } from "../helpers/flow";
import gck from "../img/gck.png";
import { UserHasAccessCode } from "../helpers/func";

function MainNav({ user, onMenuClick, curPage, onLogout }) {
  // console.log(user);
  const [hidden, sethidden] = useState(true);

  return (
    <section className="relative bg-sky-500 h-min md:h-fit w-full  md:flex justify-between">
      <div
        onClick={(e) => sethidden(!hidden)}
        className="p-1 cursor-pointer mx-auto w-fit max-w-[120pt] flex justify-center items-center "
      >
        <img src={gck} height={10} />
      </div>

      <div
        className={`${
          hidden ? "max-h-0" : "max-h-fit "
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
    </section>
  );
}
export default MainNav;
