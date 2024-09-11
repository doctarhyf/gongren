import React, { useState } from "react";
import { MAIN_MENU, USER_LEVEL } from "../helpers/flow";
import gck from "../img/gck.png";
import logout from "../img/logout.svg";
import { UserHasAccessCode } from "../helpers/func";

function MenuIcon({ sethidden, hidden }) {
  return (
    <div
      className={`  cursor-pointer ${hidden ? "my-auto  " : "  "}   `}
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
        class="feather feather-menu text-black dark:text-white  "
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </div>
  );
}

function MainNav({ user, onMenuClick, curPage, onLogout }) {
  // console.log(user);
  const [hidden, sethidden] = useState(true);

  return (
    <section className=" p-1  relative  items-start  bg-sky-500 h-min md:h-fit w-full  md:flex justify-between">
      <div
        onClick={(e) => sethidden(!hidden)}
        className="    p-1 cursor-pointer h-[30pt]   md:w-fit md:max-w-[120pt] flex justify-between md:justify-center items-center "
      >
        <img src={gck} height={"10pt"} className=" h-[20pt] md:h-fit  " />
        <div className=" w-fit md:hidden   ml-auto  mb-2 ">
          <MenuIcon sethidden={sethidden} hidden={hidden} />
        </div>
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
                    className={` p-2 dark:text-white hover:bg-white rounded-md dark:hover:bg-black/50
                ${curPage === menu_item.path && "  bg-white dark:bg-black/50 "}

              `}
                  >
                    {menu_item.name}
                  </button>
                )}
              </li>
            ))}
            <li className="  ">
              <button
                onClick={onLogout}
                className=" flex gap-2 w-fit text-xs p-2  rounded-md mx-auto border-white border text-white hover:bg-red-700 "
              >
                <img src={logout} className=" w-4 h-4 " />
                LOGOUT
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="  hidden md:block ">
        <MenuIcon sethidden={sethidden} hidden={hidden} />
      </div>
    </section>
  );
}
export default MainNav;
