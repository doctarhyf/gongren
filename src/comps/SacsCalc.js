import React, { useContext, useEffect, useRef, useState } from "react";
import { UserHasAccessCode } from "../helpers/func";
import { ACCESS_CODES } from "../helpers/flow";
import { UserContext } from "../App";
import Loading from "./Loading";

export default function SacsCalc() {
  const [sacs_trouves, setstv] = useState(0);
  const [sacs_sortis, setss] = useState(0);
  const [sacs_dechires, setsd] = useState(0);
  const [sacs_utilises, setsu] = useState(0);
  const [sacs_restants, setsr] = useState(0);
  const [sacs_comptes, setsc] = useState(0);
  const [sacs_perdus, set_sacs_perdus] = useState(0);
  const [lockdechires, setlockdechires] = useState(true);
  const [, , user, setuser] = useContext(UserContext);

  useEffect(() => {
    if (lockdechires) {
      let dechires = sacs_trouves + sacs_sortis - sacs_comptes - sacs_utilises;
      setsd(dechires);
      console.log(`Sacs restants ; ${dechires}`);
    }
    console.log("okayyy");
  }, [sacs_trouves, sacs_sortis, sacs_utilises, sacs_comptes, lockdechires]);

  useEffect(() => {
    if (!lockdechires) {
      let restants = sacs_trouves + sacs_sortis - sacs_dechires - sacs_utilises;
      let diff = -restants + sacs_comptes;

      setsr(restants);
      set_sacs_perdus(diff);

      console.log(`Sacs restants ; ${restants}`);
    }
  }, [
    sacs_trouves,
    sacs_sortis,
    sacs_dechires,
    sacs_utilises,
    sacs_comptes,
    lockdechires,
  ]);

  return (
    <div>
      {/* <div className=" font-bold  ">CALCULATEUR DE SACS/袋子计算</div> */}

      <div className=" text-white p-2 bg-slate-800 border  border-slate-200 rounded-md my-2 ">
        <div
          className={`  ${
            !UserHasAccessCode(user, ACCESS_CODES.ROOT) && "hidden"
          } `}
        >
          <input
            type="checkbox"
            checked={lockdechires}
            value={lockdechires}
            onChange={(e) => setlockdechires(e.target.checked)}
          />{" "}
          CALCULS SACS DECHIRES
        </div>

        <div>Sacs trouves</div>
        <input
          className="outline-none dark:text-white text-black border border-sky-200 hover:border-sky-500 p-1 rounded-md"
          type="number"
          keyboardType={"numeric"}
          value={sacs_trouves}
          onChange={(e) => setstv(parseInt(e.target.value))}
        />
        <div>Sacs sortis</div>
        <input
          className="outline-none dark:text-white text-black border border-sky-200 hover:border-sky-500 p-1 rounded-md"
          type="number"
          keyboardType={"numeric"}
          value={sacs_sortis}
          onChange={(e) => setss(parseInt(e.target.value))}
        />
        {!lockdechires && (
          <>
            <div>Sacs dechires</div>

            <input
              className={` text-black dark:text-white   border-sky-200 hover:border-sky-500 
         outline-none border  p-1 rounded-md`}
              type="number"
              keyboardType={"numeric"}
              disabled={lockdechires}
              value={sacs_dechires}
              onChange={(e) => setsd(parseInt(e.target.value))}
            />
          </>
        )}
        <div>Sacs utilises</div>
        <input
          className="outline-none border dark:text-white text-black border-sky-200 hover:border-sky-500 p-1 rounded-md"
          type="number"
          keyboardType={"numeric"}
          value={sacs_utilises}
          onChange={(e) => setsu(parseInt(e.target.value))}
        />

        <div>Sacs comptes apres chargement</div>
        <input
          className="outline-none border dark:text-white text-black border-sky-200 hover:border-sky-500 p-1 rounded-md"
          type="number"
          keyboardType={"numeric"}
          value={sacs_comptes}
          onChange={(e) => setsc(parseInt(e.target.value))}
        />

        {/* thisifosf */}

        {lockdechires ? (
          <div>
            <div className="  font-bold ">SACS DECHIRES</div>
            <div className="  text-[42pt] text-green-800 font-bold ">
              {!!sacs_dechires ? sacs_dechires : <Loading isLoading={true} />}{" "}
            </div>
            {!sacs_dechires && (
              <div className=" bg-red-900 border-red-600 border-2  p-2 rounded-md text-red-500 text-center uppercase font-bold  ">
                Calcul incorrect!
              </div>
            )}
          </div>
        ) : (
          <div className=" border-t py-2 border-teal-950/20 mt-2 ">
            <div className=" font-bold ">Sacs Restants (supposes rester)</div>
            {!isNaN(sacs_restants) && (
              <div className=" text-[42pt] text-green-800 font-bold ">
                {sacs_restants}
              </div>
            )}

            {sacs_perdus === 0 || isNaN(sacs_perdus) ? (
              !isNaN(sacs_perdus) && (
                <div className="p-2 px-auto rounded-full bg-slate-100 text-green-500 font-bold">
                  Comptage normal
                </div>
              )
            ) : (
              <>
                <div className=" font-bold ">Sacs Perdus</div>
                <div className=" text-xxl text-red-500 font-bold text-4xl ">
                  {sacs_perdus}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
