import React, { useState } from "react";
import { MAIN_MENU, USER_LEVEL } from "../helpers/flow";
import gck from "../img/gck.png";

function UserInfo({ user }) {
  return (
    <div className="flex">
      <div>
        <div className="text-white text-xl font-bold w-fit  pb-4 p-2 text-center">
          水泥车间
        </div>
      </div>
      <div className=" justify-center text-xs uppercase  items-center  p-1 mr-2 ">
        <div>
          Hello, <span className="text-white">{user.display_name}</span>
        </div>
        <div>
          User level : <span className="text-white"> {user.user_level}</span>
        </div>
      </div>
    </div>
  );
}

function MainNav({ user, onMenuClick, curPage, onLogout }) {
  // console.log(user);
  const [hidden, sethidden] = useState(true);

  return (
    <section className="bg-sky-500 h-min md:h-fit w-full  md:flex justify-between">
      <div
        onClick={(e) => sethidden(!hidden)}
        className="p-1 cursor-pointer mx-auto w-fit max-w-[120pt] flex justify-center items-center "
      >
        <img src={gck} height={20} />
      </div>

      <div
        className={` ${
          hidden ? "hidden" : "block"
        } md:block transition ease-in-out delay-150 duration-300 `}
      >
        <div className=" border-b md:flex gap-4 items-center mx-auto md:mr-0  justify-end w-fit  ">
          <UserInfo user={user} />
        </div>

        <div className={`md:flex  items-center justify-between `}>
          <ul className="text-end p-2 md:flex gap-2 flex-wrap ">
            {MAIN_MENU.map((menu_item, i) => (
              <li className="mb-2" key={i}>
                {user.user_level >= menu_item.user_level && (
                  <button
                    onClick={(e) => {
                      onMenuClick(menu_item);
                      sethidden(true);
                    }}
                    className={`
                ${curPage === menu_item.path ? "text-sky-500 bg-white" : ""}

                text-right cursor-pointer
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
