import logo from "./logo.svg";
import "./App.css";
import { CLASS_BTN, LOGO, MAIN_MENU } from "./helpers/flow";
import { useRef, useState } from "react";
import MainNav from "./comps/MainNav";
import Loading from "./comps/Loading";
import * as SB from "./helpers/sb";
import { _ } from "./helpers/func";

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

function Login({ onLogin }) {
  const ref_mat = useRef();
  const ref_pin = useRef();

  function login() {
    const mat = _(ref_mat).toUpperCase().replace(" ", "");
    const pin = _(ref_pin).toUpperCase().replace(" ", "");
    console.log(`mat : ${mat}, pin : ${pin}`);
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
          <button onClick={login} className={` ${CLASS_BTN} mx-auto w-full`}>
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

  async function onLogin(mat, pin) {
    setloading(true);

    const u = await SB.GetUser(mat, pin);
    console.log(u);
    //setuser({ id: 1, mat: "L0501", nom: "Franvale" });
  }

  function onLogout() {
    setuser(undefined);
    console.log(user);
  }

  if (user) return <MyApp user={user} onLogout={onLogout} />;

  return (
    <div>
      <Login onLogin={onLogin} />
      <Loading isLoading={loading} />
    </div>
  );
}

export default App;
