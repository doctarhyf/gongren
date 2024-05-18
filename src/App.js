import logo from "./logo.svg";
import "./App.css";
import { CLASS_BTN, LOGO, MAIN_MENU } from "./helpers/flow";
import { useEffect, useRef, useState } from "react";
import MainNav from "./comps/MainNav";
import Loading from "./comps/Loading";
import * as SB from "./helpers/sb";
import { _ } from "./helpers/func";
import { TABLES_NAMES, supabase } from "./helpers/sb.config";
import FormLogin from "./comps/FormLogin";
import GongRen from "./GongRen";
import { useCookies } from "react-cookie";
import { createContext } from "react";

export const UserContext = createContext();

function App() {
  const [user, setuser] = useState();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(undefined);
  const [cookies, setCookie, removeCookie] = useCookies(["gr_user"]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [modalType, setModalType] = useState("img");

  /*  useEffect(() => {
    const myCookieValue = cookies.gr_user;

    if (myCookieValue) {
      setuser(myCookieValue);
    }
  });  */

  async function onLogin(matricule, pin) {
    let err;
    seterror(undefined);
    setloading(true);

    matricule = matricule.toUpperCase().trim();
    pin = pin.trim();

    const { data, error } = await supabase
      .from(TABLES_NAMES.AGENTS)
      .select("*")
      .eq("matricule", matricule)
      .eq("pin", pin);

    if (!data) {
      alert(JSON.stringify(error));
      console.error(error);
      alert(JSON.stringify(data));
      return;
    }

    if (data.length === 1) {
      setuser(data[0]);
    } else {
      if (error === null) {
        err = `User matricule: "${matricule}", pin : "${pin}" cant be found`;
        seterror(err);
        alert(err);
        console.log(err);
      } else {
        err = "Error loging in\n" + JSON.stringify(error);
        seterror(err);
        console.log(err);
        alert(err);
      }
    }

    console.log(data, error, user);
    setloading(false);
  }

  function onLogout() {
    removeCookie("gr_user", { path: "/" });
    setuser(undefined);
  }

  function showImage(url) {
    setModalType("img");
    setModalData(url);
    setShowModal(true);
  }

  function showData(data) {
    setModalType("data");
    setModalData(data);
    setShowModal(true);
  }

  return user ? (
    <UserContext.Provider value={[showImage, showData, user]}>
      <div>
        <div
          className={`  flex flex-col justify-center items-center bg-black/60 backdrop-blur-md text-white  absolute h-full w-full ${
            showModal ? "absolute" : "hidden"
          } `}
        >
          <div>
            {modalType === "img" && <img src={modalData} alt={modalData} />}
            {modalType === "data" &&
              Object.entries(modalData).map(([k, v], i) => (
                <div key={i}>
                  <span className="text-sky-500">{k}: </span>
                  <span>{v}</span>
                </div>
              ))}
          </div>
          <div>
            <button onClick={(e) => setShowModal(false)} className={CLASS_BTN}>
              OK
            </button>
          </div>
        </div>
        <GongRen user={user} onLogout={onLogout} />
      </div>
    </UserContext.Provider>
  ) : (
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
