import React, { useContext, useEffect, useRef, useState } from "react";
export default function SacsCalc() {
  const [sacs_trouves, setstv] = useState(0);
  const [sacs_sortis, setss] = useState(0);
  const [sacs_dechires, setsd] = useState(0);
  const [sacs_utilises, setsu] = useState(0);
  const [sacs_restants, setsr] = useState(0);
  const [sacs_comptes, setsc] = useState(0);
  const [sacs_perdus, setsdiff] = useState(0);

  useEffect(() => {
    let restants = sacs_trouves + sacs_sortis - sacs_dechires - sacs_utilises;
    let lost = restants - sacs_comptes;

    setsr(restants);
    setsdiff(lost);

    console.log(`Sacs restants ; ${restants}`);
  }, [sacs_trouves, sacs_sortis, sacs_dechires, sacs_utilises, sacs_comptes]);

  return (
    <div>
      <div>Calculateurs de sacs</div>
      <div>Sacs trouves</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sacs_trouves}
        onChange={(e) => setstv(parseInt(e.target.value))}
      />
      <div>Sacs sortis</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sacs_sortis}
        onChange={(e) => setss(parseInt(e.target.value))}
      />
      <div>Sacs dechires</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sacs_dechires}
        onChange={(e) => setsd(parseInt(e.target.value))}
      />
      <div>Sacs utilises</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sacs_utilises}
        onChange={(e) => setsu(parseInt(e.target.value))}
      />

      <div>Sacs comptes apres chargement</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sacs_comptes}
        onChange={(e) => setsc(parseInt(e.target.value))}
      />

      <div className=" border-t py-2 border-teal-950/20 mt-2 ">
        <div className=" font-bold ">Sacs Restants (supposes rester)</div>
        {!isNaN(sacs_restants) && (
          <div className=" text-xxl text-lime-800 font-bold text-4xl ">
            {sacs_restants}
          </div>
        )}
        {sacs_perdus === 0 || isNaN(sacs_perdus) ? null : (
          <>
            <div className=" font-bold ">Sacs Perdus</div>
            <div className=" text-xxl text-red-500 font-bold text-4xl ">
              {sacs_perdus}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
