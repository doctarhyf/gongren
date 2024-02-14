import logo from "./logo.svg";
import "./App.css";
import { CLASS_BTN, LOGO, MAIN_MENU } from "./helpers/flow";
import { useEffect, useRef, useState } from "react";
import MainNav from "./comps/MainNav";
import Loading from "./comps/Loading";
import * as SB from "./helpers/sb";
import { _ } from "./helpers/func";
import { TABLES_NAMES } from "./helpers/sb.config";
import FormLogin from "./comps/FormLogin";
import GongRen from "./GongRen";
import { useCookies } from "react-cookie";
import { createContext } from "react";

export const ModalContext = createContext();

function App() {
  const [user, setuser] = useState();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(undefined);
  const [cookies, setCookie, removeCookie] = useCookies(["gr_user"]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const myCookieValue = cookies.gr_user;
    console.log("myCookieValue", myCookieValue);
    if (myCookieValue) {
      setuser(myCookieValue);
    }
  });

  async function onLogin(mat, pin) {
    seterror(undefined);
    setloading(true);
    const res = await SB.GetUser(mat.toUpperCase(), pin);

    if (res === null) {
      let error_message = `User cant be found!\nmat: '${mat}', pin: '${pin}'`;
      seterror(error_message);
      document.getElementById("my_modal_1").showModal();
      console.log(error_message);
    }

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
    setCookie("gr_user", JSON.stringify(res), {
      path: "/",
      expires: expirationTime,
    });
    setuser(res);

    setloading(false);
  }

  function onLogout() {
    removeCookie("gr_user", { path: "/" });
    setuser(undefined);
  }

  if (user)
    return (
      <ModalContext.Provider value={[showModal, setShowModal]}>
        <div>
          <div
            className={` flex flex-col justify-center items-center bg-black/60 backdrop-blur-md text-white  absolute h-full w-full ${
              showModal ? "absolute" : "hidden"
            } `}
          >
            <div>Modal cont</div>
            <div>
              <button
                onClick={(e) => setShowModal(false)}
                className={CLASS_BTN}
              >
                OK
              </button>
            </div>
          </div>
          <GongRen user={user} onLogout={onLogout} />
        </div>
      </ModalContext.Provider>
    );
  return (
    <>
      <FormLogin onLogin={onLogin} />

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Login error!</h3>
          <p className="py-4">{error}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <Loading isLoading={loading} center />
    </>
  );
}

export default App;
