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
import { GetDateParts, ParseBaozhuang } from "../helpers/func";
import { UserContext } from "../App";
import {
  CLASS_INPUT_TEXT,
  CLASS_SELECT_TITLE,
  EQUIPES_CHARGEMENT,
  SHIFT_HOURS_ZH,
} from "../helpers/flow";

const DEF_TRUCK = {
  sacs: 800,
  plaque: "4270AR05",
  dejacharge: false,
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
          className="p-1 w-16 border border-slate-800 rounded-md outline-none "
          value={camion.sacs}
          onChange={(e) =>
            onUpdateCamion(camion, "sacs", parseInt(e.target.value))
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
          onClick={(e) => onDeleteCamion(camion)}
        />
      </td>
    </tr>
  );
}

export default function SuiviCamions() {
  const [camions, setcamions] = useState([]);
  const [loading, setloading] = useState(false);
  const [showrepport, setshowrepport] = useState(false);
  const [repportdata, setrepportdata] = useState();
  const [, , user, setuser] = useContext(UserContext);
  const [team, setteam] = useState("A");
  const [shift, setshift] = useState("M");

  useEffect(() => {
    calcRepport();
  }, [camions, showrepport, team, shift]);

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

    item[prop] = val;

    const trucks = [...camions];
    trucks[idx] = item;

    setcamions(trucks);
  }

  function onDeleteCamion(camion) {
    if (
      window.confirm(
        `Etes vous sure de vouloir supprimer le camion "${camion.plaque}"`
      )
    ) {
      console.log(camion);
      const idx = camions.findIndex((it) => it.id === camion.id);
      const trucks = [...camions];
      trucks.splice(idx, 1);
      setcamions(trucks);
    }
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
            <div>
              <span>Tot. Camions:</span>
              <span className="  font-bold ">{camions.length}</span>
            </div>
            <div>
              <span>Tot. Camions Charges:</span>
              <span className="  font-bold ">
                {repportdata?.camions} / {repportdata?.sacs} sacs /{" "}
                {repportdata?.t} T
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
                  <option value={sh[0]}>{sh[1].join(" - ")}</option>
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
        </div>
      </div>
    </div>
  );
}
