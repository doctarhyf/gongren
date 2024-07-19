import React, { Children, useContext, useEffect, useState } from "react";

import Loading from "../comps/Loading";
import { UserHasAccessCode } from "../helpers/func";
import { ACCESS_CODES, LANG_COOKIE_KEY, POSTE, POSTES } from "../helpers/flow";
import { useCookies } from "react-cookie";
import {
  GEN_TRANSLATIONS,
  GET_STRINGS_KEYS,
  LANGS,
  PACK_TRANSLATIONS_STRINGS,
  STRINGS,
} from "../helpers/lang_strings";
import { UserContext } from "../App";
import TableLoadsTotals from "../comps/TableLoadsTotal";
import SacsCalc from "../comps/SacsCalc";
import {
  HUDAgents,
  HUDGestionSacs,
  HUDGreetings,
  HUDBonus,
  HUDMonthProgress,
  HUDSacsCalc,
  HUDMyTeam,
  HUDOpsLogs,
  HUDCalculsBons,
} from "../comps/home/HUDS";

export default function Home() {
  const [, , user] = useContext(UserContext);
  const [agents, setagents] = useState([]);
  const [loading, setloading] = useState(false);
  const [agents_by_teams, set_agents_by_teams] = useState({});

  const [cookies, setCookie, removeCookie] = useCookies([LANG_COOKIE_KEY]);

  const TRANSLATIONS = PACK_TRANSLATIONS_STRINGS([
    STRINGS["Agents count"],
    STRINGS.Team,
  ]);
  const [trads, settrads] = useState({});
  const [lang, setlang] = useState(LANGS[1]);

  useEffect(() => {
    // loadData();
    const sellang = LANGS[cookies[LANG_COOKIE_KEY]] || LANGS[1];
    setlang(sellang);
    settrads(GEN_TRANSLATIONS(TRANSLATIONS, sellang));

    console.log("sellang : ", sellang);
  }, []);

  return (
    <div className=" container md:mx-auto ">
      <Loading isLoading={loading} />

      <HUDGreetings user={user} />

      <div className="p-2 text-cente mx-auto text-center text-lg font-thin px-2">
        Cliquer sur une rubrique pour voir plus de details.{" "}
      </div>

      <div className=" container flex gap-4 my-4 flex-col md:flex-row flex-wrap ">
        {(UserHasAccessCode(user, ACCESS_CODES.CAN_SEE_BONUS_TOTAL) ||
          user.poste === "SUP" ||
          user.poste === "DEQ" ||
          user.poste === "INT") && <HUDBonus />}
        <HUDMonthProgress />
        <HUDMyTeam user={user} />

        <HUDSacsCalc />
        <HUDCalculsBons />
        {(UserHasAccessCode(user, ACCESS_CODES.ROOT) ||
          user.poste === "INT") && <HUDAgents />}
        {false && <HUDGestionSacs />}
        {(UserHasAccessCode(user, ACCESS_CODES.ROOT) ||
          user.poste === "INT") && <HUDOpsLogs />}
      </div>

      <div className="text-sm text-center">
        Code & Design by{" "}
        <b>
          <a
            className="text-sky-500  italic"
            href="https://github.com/doctarhyf"
          >
            Ir. Franvale Mutunda K. (库齐) / @doctarhyf
          </a>
        </b>
      </div>
    </div>
  );
}
