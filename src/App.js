import logo from "./logo.svg";
import "./App.css";
import { CLASS_BTN, LOGO, MAIN_MENU } from "./helpers/flow";
import { useState } from "react";
import MainNav from "./comps/MainNav";

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
  return (
    <div className=" flex flex-col mt-4 ">
      <div className="mx-auto flex flex-col space-y-4 ">
        <img src={LOGO} width={200} />
        <div>Matricule</div>
        <input type="text" placeholder="matricule" />
        <div>Password</div>
        <input type="password" placeholder="000000" />
        <div>
          <button onClick={onLogin} className={` ${CLASS_BTN} mx-auto w-full`}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setuser] = useState();

  function onLogin() {
    setuser({ id: 1, mat: "L0501", nom: "Franvale" });
  }

  function onLogout() {
    setuser(undefined);
    console.log(user);
  }

  if (user) return <MyApp user={user} onLogout={onLogout} />;

  return <Login onLogin={onLogin} />;
}

export default App;
