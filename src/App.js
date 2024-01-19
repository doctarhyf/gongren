import logo from "./logo.svg";
import "./App.css";
import { CLASS_BTN, LOGO, MAIN_MENU } from "./helpers/flow";
import { useRef, useState } from "react";
import MainNav from "./comps/MainNav";
import Loading from "./comps/Loading";
import * as SB from "./helpers/sb";
import { _ } from "./helpers/func";
import { TABLES_NAMES } from "./helpers/sb.config";

function MyApp({ user, onLogout }) {
  const [curPage, setCurPage] = useState(MAIN_MENU[0].path);

  function onMenuClick(menu_item) {
    setCurPage(menu_item.path);
  }
  return (
    <div className=" h-[100vh] flex ">
      <MainNav
        onMenuClick={onMenuClick}
        onLogout={onLogout}
        curPage={curPage}
      />
      <div className="p-2">
        <div className="text-3xl text-sky-500 border-b  border-sky-500">
          {curPage}
        </div>
        <div>
          {MAIN_MENU.map((pg, i) => pg.path === curPage && <pg.el key={i} />)}
        </div>
      </div>
    </div>
  );
}

function FormLogin({ onLogin }) {
  const ref_mat = useRef();
  const ref_pin = useRef();

  function onBtnLogin() {
    const mat = ref_mat.current.value;
    const pin = ref_pin.current.value;

    onLogin(mat, pin);
  }

  return (
    <div className=" flex flex-col mt-4 ">
      <div className="mx-auto flex flex-col space-y-4 ">
        <img src={LOGO} width={200} />
        <div>Matricule</div>
        <input ref={ref_mat} type="text" placeholder="matricule" />
        <div>Password</div>
        <input ref={ref_pin} type="password" placeholder="000000" />
        <div>
          <button
            onClick={(e) => onBtnLogin()}
            className={` ${CLASS_BTN} mx-auto w-full`}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setuser] = useState();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(undefined);

  async function onLogin(mat, pin) {
    seterror(undefined);
    setloading(true);
    const res = await SB.GetUser(mat.toUpperCase(), pin);

    if (res === null) {
      let error_message = `User cant be found!\nmat: '${mat}', pin: '${pin}'`;
      alert(error_message);
      console.log(error_message);
      seterror(error_message);
    }

    setuser(res);

    setloading(false);
  }

  function onLogout() {
    setuser(undefined);
    console.log(user);
  }

  if (user) return <MyApp user={user} onLogout={onLogout} />;
  return (
    <>
      <FormLogin onLogin={onLogin} />
      {error && (
        <div className="mx-auto max-w-96 rounded-xl bg-red-500 border p-1  text-center text-white">
          {error}
        </div>
      )}
      <Loading isLoading={loading} />
    </>
  );
}

export default App;
