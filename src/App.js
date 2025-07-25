import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./App.css";
import FormLogin from "./comps/FormLogin";
import Loading from "./comps/Loading";
import GongRen from "./GongRen";
import { ACCESS_CODES, CLASS_BTN, LOG_OPERATION } from "./helpers/flow";
import {
  formatDateForDatetimeLocal,
  updateLoggedOut,
  UpdateOperationsLogs,
  UserHasAccessCode,
} from "./helpers/func";
import * as SB from "./helpers/sb";
import { supabase, TABLES_NAMES } from "./helpers/sb.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GetTransForTokensArray, LANG_TOKENS } from "./helpers/lang_strings";
import FormPasswordUpdate from "./comps/FormPasswordUpdate";
import { v4 as uuidv4 } from "uuid";

export const UserContext = createContext();
const queryClient = new QueryClient();

function App() {
  const [user, setuser] = useState();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(undefined);
  const [cookies, setCookie, removeCookie] = useCookies(["gr_user"]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [modalType, setModalType] = useState("img");
  const [lang, setlang] = useState("en-US");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [uid, setuid] = useState(-1);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  function showModalErrorMessage(msg) {
    console.error(msg);
    /* err =   GetTransForTokensArray(LANG_TOKENS.MSG_NO_ACCESS, lang, {
      a: fname,
    }); */
    document.getElementById("my_modal_1").showModal();
    seterror(msg);
  }

  async function onLogin(matricule, pin, lang, logoutlogin) {
    let error_message;
    setlang(lang);
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
      seterror(JSON.stringify(error));
      document.getElementById("my_modal_1").showModal();
      console.error(error);
      //alert(JSON.stringify(data));
      return;
    }

    if (data.length === 1) {
      const nuser = { ...data[0] };
      nuser.session = uuidv4();
      if (nuser.logged_in && !logoutlogin) {
        setAlreadyLoggedIn(true);
        showModalErrorMessage(
          "Sorry you are logged in somewhere else! Logout first, before loggin here!"
        );

        return;
      }
      nuser.lang = lang;
      setuid(nuser.id);

      if (nuser.pin.trim() === "0000" || nuser.pin.trim() === "") {
        showModalErrorMessage(
          GetTransForTokensArray(LANG_TOKENS.MSG_CHANGE_DEFAULTT_PIN, lang)
        );

        setTimeout(() => {
          setUpdatingPassword(true);
        }, 3000);

        return;
      }

      if (!UserHasAccessCode(nuser, ACCESS_CODES.CAN_ACCESS_PLATFORM)) {
        const { nom, postnom, prenom, mingzi, matricule } = nuser;
        const fname = `${nom} ${postnom} ${prenom} ${mingzi} - ${matricule}`;

        error_message = GetTransForTokensArray(
          LANG_TOKENS.MSG_NO_ACCESS,
          lang,
          {
            a: fname,
          }
        );
        console.error(error_message);
        //document.getElementById("my_modal_1").showModal();
        seterror(error_message);
        showModalErrorMessage(error_message);
        return;
      }

      //check expires
      const expires = new Date(nuser.expires);
      const now = new Date();
      const expired = now > expires || !nuser.expires;

      if (
        !UserHasAccessCode(nuser, ACCESS_CODES.ACCOUNT_CAN_NOT_EXPIRE) &&
        expired
      ) {
        alert(
          GetTransForTokensArray(
            LANG_TOKENS.SUBSCRIPTION_INACTIVE_MESSAGE,
            lang
          )
          //formatDateForDatetimeLocal(new Date(expires.toISOString()))
        );
        setloading(false);
        return;
      }

      setuser(nuser);

      const l = await UpdateOperationsLogs(SB, nuser, LOG_OPERATION.LOGIN);
      const u = await SB.UpdateItem(
        TABLES_NAMES.AGENTS,
        {
          id: nuser.id,
          lang: lang,
        },
        (
            s //console.log("updated lang ", lang),
          ) =>
          (e) =>
            console.error("Error updating lang", e)
      );

      const matricule = `${nuser.matricule}, (${nuser.prenom} ${nuser.nom})`;

      const log = await SB.InsertItem(TABLES_NAMES.OPERATIONS_LOGS, {
        matricule: matricule,
        session: nuser.session,
      });
      console.log("upd => ", log);

      setCookie("u", nuser, {
        expires: new Date(new Date().getTime() + 3600 * 10 * 10), //Expires after 10 minuties of inactivity
      });
    } else {
      if (error === null) {
        error_message = `User matricule: "${matricule}", pin : "${pin}" cant be found`;
        document.getElementById("my_modal_1").showModal();
        seterror(error_message);
        // alert(err);
        //console.log(err);
      } else {
        error_message = "Error loging in\n" + JSON.stringify(error);
        seterror(error_message);
        //console.log(err);
        alert(error_message);
      }
    }

    //console.log(data, error, user);
    setloading(false);
  }

  async function onLogout() {
    // const l = await UpdateOperationsLogs(SB, user, LOG_OPERATION.LOGOUT);

    const loutres = await updateLoggedOut(supabase, user.session);

    console.log("log out res => ", loutres);

    const r = await SB.UpdateItem(TABLES_NAMES.AGENTS, {
      ...user,
      logged_in: false,
    });
    if (r.length === 1) setAlreadyLoggedIn(false);
    console.log("res logout ", r);
    removeCookie("u", { path: "/" });
    setuser(undefined);
  }

  function showImage(url) {
    setModalType("img");
    setModalData(url);
    setShowModal(true);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Optional: adds smooth scrolling effect
    });

    //console.log(window);
  }

  function showData(data) {
    setModalType("data");
    setModalData(data);
    setShowModal(true);
  }

  useEffect(() => {
    //console.log("cookies ==>> \n", cookies["u"]);
    if (user === undefined && cookies["u"]) {
      setuser(cookies["u"]);
    }
  }, []);

  function onUpdatePassword(success) {
    setUpdatingPassword(!success);
    setloading(false);

    const msg = success ? "PIN update success!" : "PIN Update error!";
    alert(msg);
  }

  return user && !updatingPassword ? (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={[showImage, showData, user, setuser]}>
        <div>
          <div
            className={`  flex flex-col justify-center items-center backdrop-blur-md text-white  absolute h-lvh w-lvw ${
              showModal ? "absolute" : "hidden"
            } `}
          >
            <div className="   ">
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
              <button
                onClick={(e) => setShowModal(false)}
                className={CLASS_BTN}
              >
                OK
              </button>
            </div>
          </div>
          <GongRen user={user} onLogout={(e) => onLogout(user)} />
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  ) : updatingPassword ? (
    <FormPasswordUpdate
      onUpdatePassword={onUpdatePassword}
      uid={uid}
      lang={lang}
      onCancelUpdatePIN={(e) => setUpdatingPassword(false)}
    />
  ) : (
    <>
      <FormLogin onLogin={onLogin} alreadyLoggedIn={alreadyLoggedIn} />

      <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {GetTransForTokensArray(LANG_TOKENS.LOGIN_ERROR, lang)}
          </h3>
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
