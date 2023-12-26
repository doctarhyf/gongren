import React, { useRef, useState } from "react";
import Loading from "../comps/Loading";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import {
  CONTRATS,
  EQUIPES,
  NATIONALITIES,
  POSTE,
  SECTIONS,
} from "../helpers/flow";

export default function FormNewAgent({
  onFormNewAgentSave,
  onFormNewAgentCancel,
  agentDataToUpdate,
}) {
  let isNewAgent = agentDataToUpdate === undefined;

  let agent = agentDataToUpdate || {
    id: 36,
    created_at: "2023-09-08T17:42:53.34043+00:00",
    contrat: "BNC",
    equipe: "C",
    mingzi: "",
    nationalite: "CD",
    nom: "",
    poste: "NET",
    postnom: "",
    prenom: "",
    section: "ENSACHAGE",
    phone: "",
    matricule: "",
    page: 2,
  };

  const ref_id = useRef();
  const ref_created_at = useRef();
  const ref_contrat = useRef();
  const ref_equipe = useRef();
  const ref_mingzi = useRef();
  const ref_nationalite = useRef();
  const ref_nom = useRef();
  const ref_poste = useRef();
  const ref_postnom = useRef();
  const ref_prenom = useRef();
  const ref_section = useRef();
  const ref_phone = useRef();
  const ref_matricule = useRef();
  const ref_page = useRef();

  const [loading, setloading] = useState(false);

  async function saveNewAgent() {
    setloading(true);

    let agent_data = {
      //id: _(ref_id),
      //created_at: _(ref_created_at),
      contrat: _(ref_contrat),
      equipe: _(ref_equipe),
      mingzi: _(ref_mingzi),
      nationalite: _(ref_nationalite),
      nom: _(ref_nom),
      poste: _(ref_poste),
      postnom: _(ref_postnom),
      prenom: _(ref_prenom),
      section: _(ref_section),
      phone: _(ref_phone),
      matricule: _(ref_matricule),
      //page: _(ref_page),
    };

    let res = await SB.InsertItem(TABLES_NAMES.AGENTS, agent_data);

    if (res === null) {
      onFormNewAgentCancel();
    } else {
      alert(res);
    }
    setloading(false);
  }

  async function onUpdateAgent() {
    // alert("upd");
  }

  function _(ref) {
    return ref.current && ref.current.value;
  }

  return (
    <div>
      {loading && <div>Loading ...</div>}
      {[
        [ref_id, `id`, agent.id, , ,],
        [ref_created_at, `created_at`, agent.created_at, , ,],

        [ref_nom, "nom", agent.nom],
        [ref_postnom, "postnom", agent.postnom],
        [ref_prenom, "prenom", agent.prenom],
        [ref_mingzi, "mingzi", agent.mingzi],

        [ref_section, "section", agent.section, SECTIONS],
        [ref_equipe, "equipe", agent.equipe, EQUIPES],
        [ref_poste, "poste", agent.poste, POSTE],

        [ref_contrat, "contrat", agent.contrat, CONTRATS],

        [ref_matricule, "matricule", agent.matricule],
        [ref_nationalite, "nationalite", agent.nationalite, NATIONALITIES],
        [ref_phone, "phone", agent.phone],
      ].map((agent_data, i) => (
        <tr key={i}>
          <td align="right" className="text-neutral-400 text-sm">
            {agent_data[1]}
          </td>
          <td className=" ">
            {agent_data.length - 1 == 2 && (
              <input
                ref={agent_data[0]}
                className=" outline-none border border-sky-500  rounded-md "
                type="text"
                defaultValue={agent_data[2]}
              />
            )}

            {agent_data.length - 1 == 3 && (
              <select
                ref={agent_data[0]}
                className=" outline-none border border-sky-500  rounded-md "
                type="text"
                defaultValue={agent_data[3]}
              >
                {agent_data[3].map((it, i) => (
                  <option key={i}>{it}</option>
                ))}
              </select>
            )}
            {agent_data.length - 1 == 4 && <div>{agent_data[2]}</div>}
          </td>
        </tr>
      ))}
      <button
        onClick={(e) => onFormNewAgentCancel()}
        className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      >
        ANNULER
      </button>
      {isNewAgent && (
        <button
          onClick={(e) => saveNewAgent()}
          className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          SAVE
        </button>
      )}
      {!isNewAgent && (
        <button
          onClick={(e) => onUpdateAgent()}
          className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          UPDATE
        </button>
      )}
    </div>
  );
}
