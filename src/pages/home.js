import React, { Children, useContext, useEffect, useState } from "react";

import Loading from "../comps/Loading";
import { UserHasAccessCode } from "../helpers/func";
import { ACCESS_CODES, LANG_COOKIE_KEY } from "../helpers/flow";
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
  HUDTotals,
  HUDMonthLoadTarget,
  HUDSacsCalc,
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
    <div className="md:w-[980pt] md:mx-auto ">
      <Loading isLoading={loading} />

      <HUDGreetings user={user} />

      <div className=" container flex gap-4 my-4 flex-col md:flex-row flex-wrap ">
        <HUDMonthLoadTarget />
        {(UserHasAccessCode(user, ACCESS_CODES.CAN_SEE_BONUS_TOTAL) ||
          user.poste === "SUP" ||
          user.poste === "DEQ" ||
          user.poste === "INT") && <HUDTotals />}

        <HUDSacsCalc />
        <HUDAgents />
        <HUDGestionSacs />
      </div>

      {false && (
        <div className="oldmain">
          <div>
            {trads[GET_STRINGS_KEYS(STRINGS["Agents count"].default)]} :
            {agents.length}
          </div>
          <div className="w-fit ">
            {Object.entries(agents_by_teams).map((section, i) => (
              <details key={i}>
                <summary className="cursor-pointer">{section[0]}</summary>
                <div>
                  {Object.entries(section[1])
                    .sort()
                    .map((team, i) => (
                      <div className="ml-8">
                        {trads[GET_STRINGS_KEYS(STRINGS.Team.default)]} :
                        {
                          trads[
                            GET_STRINGS_KEYS(STRINGS["Agents count"].default)
                          ]
                        }{" "}
                        :{team[0]} : <b>{team[1].length}</b>
                      </div>
                    ))}
                </div>
              </details>
            ))}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
