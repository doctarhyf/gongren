import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./App.css";
import FormLogin from "./comps/FormLogin";
import Loading from "./comps/Loading";
import GongRen from "./GongRen";
import { CLASS_BTN, LOG_OPERATION } from "./helpers/flow";
import { UpdateOperationsLogs } from "./helpers/func";
import * as SB from "./helpers/sb";
import { supabase, TABLES_NAMES } from "./helpers/sb.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
      seterror(JSON.stringify(error));
      document.getElementById("my_modal_1").showModal();
      console.error(error);
      //alert(JSON.stringify(data));
      return;
    }

    if (data.length === 1) {
      setuser(data[0]);

      const l = await UpdateOperationsLogs(SB, data[0], LOG_OPERATION.LOGIN);
      console.log("res log login ", l);
      setCookie("u", data[0], {
        expires: new Date(new Date().getTime() + 3600 * 10 * 10), //Expires after 10 minuties of inactivity
      });
    } else {
      if (error === null) {
        err = `User matricule: "${matricule}", pin : "${pin}" cant be found`;
        document.getElementById("my_modal_1").showModal();
        seterror(err);
        // alert(err);
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

  async function onLogout() {
    const l = await UpdateOperationsLogs(SB, user, LOG_OPERATION.LOGOUT);
    console.log("res logout ", l);
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

    console.log(window);
  }

  function showData(data) {
    setModalType("data");
    setModalData(data);
    setShowModal(true);
  }

  useEffect(() => {
    console.log("cookies ==>> \n", cookies["u"]);
    if (user === undefined && cookies["u"]) {
      setuser(cookies["u"]);
    }
  }, []);

  return user ? (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={[showImage, showData, user, setuser]}>
        <div>
          <div
            className={`  flex flex-col justify-center items-center bg-black/60 backdrop-blur-md text-white  absolute h-lvh w-lvw ${
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
          <GongRen user={user} onLogout={onLogout} />
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  ) : (
    <>
      <FormLogin onLogin={onLogin} />

      <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">
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
