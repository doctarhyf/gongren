import React, { useContext, useRef, useState } from "react";
import Loading from "./Loading";
import {
  CONTRATS,
  EQUIPES,
  NATIONALITIES,
  POSTE,
  SECTIONS,
  USER_LEVEL,
} from "../helpers/flow";
import { UserContext } from "../App";
import ico_user from "../img/user.png";
import { supabase } from "../helpers/sb.config";
import imageCompression from "browser-image-compression";
import {
  GetTransForTokenName,
  GetTransForTokensArray,
  LANG_TOKENS,
} from "../helpers/lang_strings";
import { formatDateForDatetimeLocal, st2lt } from "../helpers/func";

const DATA_TYPE_TEXT_INPUT = 2;
const DATA_TYPE_SELECT = 3;
const DATA_TYPE_NOT_MUTABLE = 4;
const DATA_TYPE_DATE = 5;

export default function FormAddAgent({
  onFormSave,
  onFormUpdate,
  onFormCancel,
  agentDataToUpdate,
}) {
  const [, showData, user] = useContext(UserContext);
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
    active: "NON",
    photo: "",
    is_exp: "NON",
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
  const ref_pin = useRef();
  const ref_expires = useRef();
  const ref_chef_deq = useRef();
  const ref_list_priority = useRef();
  const ref_tenue = useRef();
  const ref_active = useRef();
  const ref_is_exp = useRef();
  const ref_page = useRef();
  //const ref_photo = useRef();
  const [photo, setphoto] = useState();

  const [loading, setloading] = useState(false);

  async function saveAgentData() {
    //setloading(true);

    if (!_(ref_expires)) {
      alert("Please select an expiration date!");
      return;
    }

    let agent_data = {
      //id: _(ref_id),
      //created_at: _(ref_created_at),
      contrat: _(ref_contrat),
      equipe: _(ref_equipe),
      mingzi: _(ref_mingzi),
      nationalite: _(ref_nationalite),
      nom: _(ref_nom),
      poste: _(ref_poste),
      chef_deq: _(ref_chef_deq),
      postnom: _(ref_postnom),
      prenom: _(ref_prenom),
      section: _(ref_section),
      phone: _(ref_phone),
      matricule: _(ref_matricule),
      pin: _(ref_pin),
      expires: new Date(_(ref_expires))
        ? new Date(_(ref_expires)).toISOString()
        : new Date().toISOString(),
      list_priority: _(ref_list_priority),
      tenue: _(ref_tenue),
      active: _(ref_active),
      is_exp: _(ref_is_exp),
      photo: photo,
      //page: _(ref_page),
    };

    function agentDataIsValid(agent_data) {
      const { contrat, nom, postnom, section, equipe } = agent_data;

      const contrat_check = !!contrat;
      const nom_check = !!nom;
      const postnom_check = !!postnom;
      const section_check = !!section;
      const equipe_check = !!equipe;

      const ok =
        contrat_check &&
        nom_check &&
        postnom_check &&
        section_check &&
        equipe_check;
      return ok
        ? true
        : {
            contrat: contrat_check,
            nom: nom_check,
            postnom: postnom_check,
            section: section_check,
            equipe: equipe_check,
          };
    }

    const check = agentDataIsValid(agent_data);
    if (check !== true) {
      alert("Please input all required agent data\n" + JSON.stringify(check));
      console.log("agent data \n", agent_data);
      console.log("check res \n", check);

      return;
    }

    if (!isNewAgent) {
      agent_data.id = _(ref_id);
      onFormUpdate(agent_data);
      return;
    }

    onFormSave(agent_data);
  }

  function _(ref) {
    return ref.current && ref.current.value;
  }

  const [uploading, setuploading] = useState(false);

  async function uploadPhoto(file, file_name) {
    if (file) {
      setuploading(true);

      const options = {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true, // Use web workers for better performance
      };
      const cfile = await imageCompression(file, options);
      //console.log("cfile", cfile);
      const { type } = cfile;
      const ext = type.split("/")[1];
      file_name = new Date().getTime() + "." + ext;

      let { data, error } = await supabase.storage
        .from("agents_photos")
        .upload(`${file_name}`, cfile);

      if (error && error.statusCode == "409") {
        alert("Updating ...");
        const res = await supabase.storage
          .from("agents_photos")
          .update(file_name, file, {
            cacheControl: "3600",
            upsert: true,
          });

        data = res.data;
        error = res.error;
      }

      setuploading(false);

      if (error) {
        console.error("Error uploading file:", error.message);
        return error;
      } else {
        //console.log("File uploaded successfully:", data.Key);

        const path = supabase.storage
          .from("agents_photos")
          .getPublicUrl(data.path);

        return path;
      }
    }
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));

      const file_name = `agent_${agentDataToUpdate.id}.jpg`;
      const { photo } = agent;

      const { data } = await uploadPhoto(file, file_name);

      if (photo) {
        const splits = agent.photo.split("/");
        const old_fname = splits[splits.length - 1];

        //console.log("old fname => ", old_fname);

        const r = await supabase.storage
          .from("agents_photos")
          .remove(old_fname);

        //console.log("Delete ", old_fname, " ==> ", r);
      } else {
        //console.log("no old photo");
      }

      if (data && data.publicUrl) {
        const { publicUrl } = data;
        setphoto(publicUrl);
        //console.log(publicUrl);
        //alert(publicUrl);
      } else {
        alert(`error ...`);
      }
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <div className=" p-2 rounded-md m-1 shadow-2xl shadow-slate-700  ">
      <Loading isLoading={loading} />
      <img
        className="  mx-auto m-2 rounded-full overflow-hidden "
        src={agent.photo || selectedImage || ico_user}
        width={120}
        height={120}
      />
      {uploading && (
        <div className="text-green-500 text-xs my-2 font-bold bg-black rounded-full p-2">
          Uploading photo ...
        </div>
      )}
      <tr>
        <td align="right" className="text-neutral-400 text-sm">
          Photo
        </td>

        <td>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleImageChange}
          />
        </td>
      </tr>
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

        [ref_chef_deq, `chef_deq`, agent.chef_deq, ["NON", "OUI"]],

        [ref_contrat, "contrat", agent.contrat, CONTRATS],

        [ref_matricule, "matricule", agent.matricule],
        [ref_pin, "pin", agent.pin],
        [ref_expires, "expires", agent.expires, null, null, null],
        [(ref_nationalite, "nationalite", agent.nationalite, NATIONALITIES)],
        [ref_phone, "phone", agent.phone],
        [ref_list_priority, "liste priority", agent.list_priority || 100],
        [ref_tenue, "tenue", agent.tenue],
        [ref_active, "active", agent.active, ["OUI", "NON"]],
        [ref_is_exp, "is_exp", agent.is_exp, ["NON", "OUI"]],
      ].map((agent_data, i) => (
        <tr key={i}>
          <td align="right" className="text-neutral-400 text-sm">
            {GetTransForTokenName(agent_data[1], user.lang)}
          </td>
          <td className=" ">
            {agent_data.length - 1 === DATA_TYPE_TEXT_INPUT && (
              <input
                ref={agent_data[0]}
                className=" outline-none border border-sky-500  rounded-md "
                type="text"
                defaultValue={agent_data[2]}
              />
            )}

            {agent_data.length - 1 === DATA_TYPE_SELECT && (
              <select
                ref={agent_data[0]}
                className=" outline-none border border-sky-500  rounded-md "
                type="text"
              >
                {agent_data[3].map((it, i) => (
                  <option
                    value={it}
                    key={i}
                    selected={agent_data[3].indexOf(agent[agent_data[1]]) === i}
                  >
                    {GetTransForTokenName(it, user.lang)}
                  </option>
                ))}
              </select>
            )}
            {agent_data.length - 1 == DATA_TYPE_NOT_MUTABLE && (
              <div>{agent_data[2]}</div>
            )}

            {agent_data.length - 1 === DATA_TYPE_DATE && (
              <>
                <input
                  ref={agent_data[0]}
                  className=" outline-none border border-sky-500  rounded-md "
                  type="datetime-local"
                  defaultValue={
                    agent_data[2] &&
                    formatDateForDatetimeLocal(new Date(agent_data[2]))
                  }
                />
              </>
            )}
          </td>
        </tr>
      ))}
      <button
        onClick={onFormCancel}
        className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      >
        {GetTransForTokensArray(LANG_TOKENS.CANCEL, user.lang)}
      </button>
      {isNewAgent && (
        <button
          onClick={saveAgentData}
          className="p-1 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          {GetTransForTokensArray(LANG_TOKENS.SAVE, user.lang)}
        </button>
      )}
      {!isNewAgent && (
        <>
          {!uploading && (
            <button
              onClick={saveAgentData}
              className="p-1 mx-4 disabled:bg-gray-400 rounded-md border my-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              {uploading
                ? "Uploading photo ..."
                : GetTransForTokensArray(LANG_TOKENS.UPDATE, user.lang)}
            </button>
          )}
        </>
      )}
    </div>
  );
}
