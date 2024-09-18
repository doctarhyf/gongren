import { useContext, useEffect, useRef, useState } from "react";
import Loading from "../comps/Loading";
import plus from "../img/plus.png";
import books from "../img/books.png";
import check from "../img/check.svg";
import delivery from "../img/delivery.png";
import unloading from "../img/unloading.png";
import del from "../img/delete.png";
import ActionButton from "../comps/ActionButton";
import Boazhuang2 from "../comps/sacs/Baozhuang2";
import {
  GetDateParts,
  ParseBaozhuang,
  readFromLocalStorage,
  saveToLocalStorage,
} from "../helpers/func";
import { UserContext } from "../App";
import {
  CLASS_INPUT_TEXT,
  CLASS_SELECT_TITLE,
  EQUIPES_CHARGEMENT,
  SHIFT_HOURS_ZH,
} from "../helpers/flow";

const DEF_TRUCK = {
  sacs: 0,
  plaque: "plaque",
  dejacharge: true,
};

const CAMIONS = {
  TOTAL: "total",
  CHARGES: "charges",
  NON_CHARGES: "noncharges",
  LOCAL_STORAGE_KEY: "camions",
};

function CamionItem({ data, onUpdateCamion, onDeleteCamion, num }) {
  const [camion, setcamion] = useState(DEF_TRUCK);

  useEffect(() => {
    setcamion(data);
  }, [data]);

  return (
    <tr className={`${camion.dejacharge && "bg-green-300 "}  `}>
      <td className=" border border-slate-600 p-1 ">{num}</td>
      <td className=" border border-slate-600 p-1 ">
        <input
          type="text"
          maxLength={8}
          size={8}
          className="p-1 border border-slate-800 rounded-md outline-none "
          value={camion.plaque}
          onChange={(e) => onUpdateCamion(camion, "plaque", e.target.value)}
        />
      </td>
      <td className=" border border-slate-600 p-1 ">
        <input
          type="number"
          maxLength={4}
          size={4}
          className="sacs p-1 w-16 border border-slate-800 rounded-md outline-none "
          value={camion.sacs}
          onChange={(e) =>
            onUpdateCamion(camion, "sacs", parseInt(e.target.value) || 0)
          }
        />
      </td>
      <td className=" border border-slate-600 p-1 ">
        {camion.dejacharge ? (
          <ActionButton
            icon={unloading}
            title={"ANNULER"}
            onClick={(e) => onUpdateCamion(camion, "dejacharge", false)}
          />
        ) : (
          <ActionButton
            icon={check}
            title={"OK"}
            onClick={(e) => onUpdateCamion(camion, "dejacharge", true)}
          />
        )}

        <ActionButton
          icon={del}
          title={"DELETE"}
          onClick={(e) => document.getElementById("my_modal_5").showModal()}
        />

        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              {`Etes vous sure de vouloir supprimer le camion "${camion.plaque}"`}
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                <button
                  className="btn btn-primary "
                  onClick={(e) => onDeleteCamion(camion)}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </td>
    </tr>
  );
}

export default function SuiviCamions() {
  const [firstload, setfirstload] = useState(true);
  const [camions, setcamions] = useState([]);
  const [loading, setloading] = useState(false);
  const [showrepport, setshowrepport] = useState(false);
  const [repportdata, setrepportdata] = useState();
  const [, , user, setuser] = useContext(UserContext);
  const [team, setteam] = useState("A");
  const [shift, setshift] = useState("M");

  useEffect(() => {
    calcRepport();
    saveToLocalStorage(CAMIONS.LOCAL_STORAGE_KEY, camions);
  }, [camions, showrepport, team, shift]);

  useEffect(() => {
    setcamions(readFromLocalStorage(CAMIONS.LOCAL_STORAGE_KEY));
  }, []);

  function calcRepport() {
    const totsacs = camions.reduce(
      (acc, cv) => (cv.dejacharge ? cv.sacs + acc : acc),
      0
    );

    /*
{
    "id": 149,
    "created_at": "2024-01-10T07:46:21.975371+00:00",
    "contrat": "GCK",
    "equipe": "INT",
    "mingzi": "库齐",
    "nationalite": "CD",
    "nom": "MUTUNDA",
    "poste": "INT",
    "postnom": "KOJI",
    "prenom": "FRANVALE",
    "section": "CIMENTERIE",
    "phone": "0893092849",
    "matricule": "L0501",
    "chef_deq": "NON",
    "list_priority": 1,
    "tenue": "165/B,bleue,42",
    "pin": "disck12",
    "user_level": 3,
    "active": "OUI",
    "photo": "https://ltvavdcgdrfqhlfpgkks.supabase.co/storage/v1/object/public/agents_photos/1719478491470.jpeg",
    "access_codes": [
        "HME",
        "ROOT"
    ]
}
    */

    //console.log("user", user);

    const { year: y, month: m, day: d } = GetDateParts();
    const code = `${team}_${shift}_${y}_${m}_${d}`;

    const load = {
      //id: 94,
      //created_at: "2024-01-26T11:49:16.169349+00:00",
      sacs: totsacs,
      retours: 0,
      ajouts: 0,
      code: code,
      prob_machine: null,
      prob_courant: null,
      autre: null,
      camions: camions.filter((c) => c.dejacharge).length,
      dechires: 0,
      sacs_adj: 0,
    };

    const bz = ParseBaozhuang(load);

    console.log("calcRepport() => ", bz);

    setrepportdata(bz);
  }

  function onAddCamion() {
    const trucks = [...camions];
    const newtruck = { ...DEF_TRUCK, id: new Date().getTime() };
    setcamions((prev) => [...prev, newtruck]);

    console.log(newtruck);
  }

  function onUpdateCamion(camion, prop, val) {
    console.log("onUpdateItem", camion, prop, val);
    const idx = camions.findIndex((it) => it.id === camion.id);
    const item = { ...camions[idx] };

    if (prop === "sacs") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(val)) {
        item[prop] = parseInt(val); // Update the state if it's valid
      } else {
        item[prop] = 0;
      }
    } else {
      item[prop] = val;
    }

    const trucks = [...camions];
    trucks[idx] = item;

    setcamions(trucks);
  }

  function onDeleteCamion(camion) {
    /*  if (
      window.confirm(
        `Etes vous sure de vouloir supprimer le camion "${camion.plaque}"`
      )
    ) { */
    // console.log(camion);
    const idx = camions.findIndex((it) => it.id === camion.id);
    const trucks = [...camions];
    trucks.splice(idx, 1);
    setcamions(trucks);
    //}
  }

  function CalculateCamionDetails(camions, type) {
    {
      /*  {repportdata?.camions} / {repportdata?.sacs} sacs /{" "}
                {repportdata?.t} T */
    }

    let nbcamions = 0;
    let sacs = 0;
    let t = 0;
    let selcamions = camions;

    if (CAMIONS.TOTAL === type) selcamions = camions;

    if (CAMIONS.CHARGES === type)
      selcamions = camions.filter((c) => c.dejacharge);

    if (CAMIONS.NON_CHARGES === type)
      selcamions = camions.filter((c) => !c.dejacharge);

    nbcamions = selcamions.length;
    sacs = selcamions.reduce((acc, cv) => cv.sacs + acc, 0);
    t = parseFloat(sacs / 20).toFixed(2);

    return `${nbcamions} 辆车 | ${sacs} Sacs | ${t} T.`;
  }

  return (
    <div className=" container  ">
      <div>
        SUIVI CAMIONS
        <span>
          <Loading isLoading={loading} />
        </span>
      </div>

      <div className=" flex justify-center items-center  "></div>
      <div className="">
        <div
          className={`   ${
            showrepport ? "block" : "hidden"
          } flex justify-center items-center flex-col  `}
        >
          <Boazhuang2
            hideCancel
            repportdata={repportdata}
            editmode={true}
            onBaozhuangCancel={(e) => setshowrepport(false)}
          />
          <div className=" my-2  ">
            <ActionButton
              icon={delivery}
              title={"LSITE CAMIONS"}
              onClick={(e) => setshowrepport(false)}
            />
          </div>
        </div>

        <div
          className={` flex justify-center flex-col  items-center gap-4  ${
            showrepport ? "hidden" : "block"
          }   `}
        >
          <div className=" flex flex-col md:flex-row gap-2 pb-4   ">
            <ActionButton
              icon={plus}
              title={"NOUVEAU CAMION"}
              onClick={onAddCamion}
            />

            <ActionButton
              icon={books}
              title={"ENVOYER RAPPORT"}
              onClick={(e) => setshowrepport(true)}
            />
          </div>

          <div className=" rounded-md border-purple-500 border p-4 shadow-md shadow-black/50  ">
            <div className=" text-center font-bold font-serif text-lg  ">
              CAMIONS / 车辆
            </div>
            <div>
              <span className=" bg-yellow-500 w-2 mr-2 h-2 inline-block rounded-full  "></span>{" "}
              <span> Total :</span>
              <span className="  font-bold ">
                {CalculateCamionDetails(camions, CAMIONS.TOTAL)}
              </span>
            </div>
            <div>
              <span className=" bg-green-500 w-2 mr-2 h-2 inline-block rounded-full  "></span>
              <span>Charges :</span>
              <span className="  font-bold ">
                {/* {repportdata?.camions} / {repportdata?.sacs} sacs /{" "}
                {repportdata?.t} T */}
                {CalculateCamionDetails(camions, CAMIONS.CHARGES)}
              </span>
            </div>
            <div>
              <span className=" bg-blue-500 w-2 mr-2 h-2 inline-block rounded-full  "></span>
              <span>Non Charges :</span>
              <span className="  font-bold ">
                {/*  {repportdata?.camions} / {repportdata?.sacs} sacs /{" "}
                {repportdata?.t} T */}
                {CalculateCamionDetails(camions, CAMIONS.NON_CHARGES)}
              </span>
            </div>
          </div>

          <div>
            <div>
              Equipe:
              <select
                value={team}
                onChange={(e) => setteam(e.target.value)}
                className={CLASS_INPUT_TEXT}
              >
                {EQUIPES_CHARGEMENT.map((eq, i) => (
                  <option key={i} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Shift:
              <select
                value={shift}
                onChange={(e) => setshift(e.target.value)}
                className={CLASS_INPUT_TEXT}
              >
                {Object.entries(SHIFT_HOURS_ZH).map((sh, i) => (
                  <option key={i} value={sh[0]}>
                    {sh[1].join(" - ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table class="table-auto mx-auto  ">
            <thead>
              <tr>
                <th className=" border border-slate-600 p-1 ">No</th>
                <th className=" border border-slate-600 p-1 ">Plaque</th>
                <th className=" border border-slate-600 p-1 ">Nb. Sacs</th>
                <th className=" border border-slate-600 p-1 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {camions.map((data, i) => (
                <CamionItem
                  num={i + 1}
                  key={data.id}
                  data={data}
                  onUpdateCamion={onUpdateCamion}
                  onDeleteCamion={onDeleteCamion}
                />
              ))}
            </tbody>
          </table>

          <div className=" flex flex-col md:flex-row gap-2 pb-4   ">
            <ActionButton
              icon={plus}
              title={"NOUVEAU CAMION"}
              onClick={onAddCamion}
            />

            <ActionButton
              icon={books}
              title={"ENVOYER RAPPORT"}
              onClick={(e) => setshowrepport(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
