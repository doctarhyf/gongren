import { useContext, useEffect, useState } from "react";
import Loading from "../comps/Loading";
import plus from "../img/plus.png";
import check from "../img/check.svg";
import del from "../img/delete.png";
import ActionButton from "../comps/ActionButton";
import Boazhuang2 from "../comps/sacs/Baozhuang2";
import { ParseBaozhuang } from "../helpers/func";
import { UserContext } from "../App";

const DEF_TRUCK = {
  sacs: 800,
  plaque: "4270AR05",
  dejacharge: false,
};

function CamionItem({ data, onUpdateCamion, onDeleteCamion }) {
  const [camion, setcamion] = useState(DEF_TRUCK);

  useEffect(() => {
    setcamion(data);
  }, [data]);

  return (
    <tr className={`${camion.dejacharge && "bg-green-300 "}  `}>
      <td className=" border border-slate-600 p-1 ">{camion.id}</td>
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
        {!camion.dejacharge && (
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

  useEffect(() => {
    calcRepport();
  }, [camions]);

  function calcRepport() {
    const totsacs = camions.reduce((acc, cv) => cv.sacs + acc, 0);

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

    const code = "A_M_2024_0_1";

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
      camions: camions.length,
      dechires: 0,
      sacs_adj: 0,
    };

    const bz = ParseBaozhuang(load);

    setrepportdata(bz);
  }

  function onAddCamion() {
    const trucks = [...camions];
    const newtruck = { ...DEF_TRUCK, id: trucks.length };
    setcamions((prev) => [...prev, newtruck]);
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

      <div className=" flex justify-center items-center  ">
        <div className="form-control w-52">
          <label className="label cursor-pointer">
            <span className="label-text">VOIR RAPPORT</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              defaultChecked
              value={showrepport}
              onChange={(e) => setshowrepport(!showrepport)}
            />
          </label>
        </div>
      </div>
      <div className="">
        {!showrepport ? (
          <Boazhuang2 repportdata={repportdata} editmode={true} />
        ) : (
          <div className=" flex justify-center flex-col items-center gap-4 ">
            <ActionButton
              icon={plus}
              title={"NOUVEAU CAMION"}
              onClick={onAddCamion}
            />

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
                    key={data.plaque}
                    data={data}
                    onUpdateCamion={onUpdateCamion}
                    onDeleteCamion={onDeleteCamion}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
