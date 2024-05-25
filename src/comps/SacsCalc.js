import React, { useContext, useEffect, useRef, useState } from "react";
export default function SacsCalc() {
  const [stv, setstv] = useState(0);
  const [ss, setss] = useState(0);
  const [sd, setsd] = useState(0);
  const [su, setsu] = useState(0);
  const [sr, setsr] = useState(0);
  const [sc, setsc] = useState(0);
  const [sdiff, setsdiff] = useState(0);

  useEffect(() => {
    let restants = stv + ss - sd - su;
    let diff = restants - sc;

    setsr(restants);
    setsdiff(diff);

    console.log(`Sacs restants ; ${restants}`);
  }, [stv, ss, sd, su, sc]);

  return (
    <div>
      <div>Calculateurs de sacs</div>
      <div>Sacs trouves</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={stv}
        onChange={(e) => setstv(parseInt(e.target.value))}
      />
      <div>Sacs sortis</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={ss}
        onChange={(e) => setss(parseInt(e.target.value))}
      />
      <div>Sacs dechires</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sd}
        onChange={(e) => setsd(parseInt(e.target.value))}
      />
      <div>Sacs utilises</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={su}
        onChange={(e) => setsu(parseInt(e.target.value))}
      />

      <div>Sacs comptes apres chargement</div>
      <input
        className="outline-none border border-sky-200 hover:border-sky-500 p-1 rounded-md"
        type="number"
        keyboardType={"numeric"}
        value={sc}
        onChange={(e) => setsc(parseInt(e.target.value))}
      />

      <div className=" border-t py-2 border-teal-950/20 mt-2 ">
        <div className=" font-bold ">Sacs Restants (supposes rester)</div>
        <div className=" text-xxl text-lime-800 font-bold text-4xl ">{sr}</div>
        {sdiff === 0 || isNaN(sdiff) ? null : (
          <>
            <div className=" font-bold ">Sacs Perdus</div>
            <div className=" text-xxl text-red-500 font-bold text-4xl ">
              {sdiff}
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
}
