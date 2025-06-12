import { GoogleGenAI } from "@google/genai";
import { useContext, useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";
import Loading from "./Loading";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import { UserContext } from "../App";

const API_KEY = "AIzaSyDjLd-iW3ZqbmLuvSlVFiDlTNMgrR0RmMA";

const ai = new GoogleGenAI({ apiKey: API_KEY });

//await main();

export default function Gemini() {
  const [gemRes, setGemRes] = useState("N/A");
  const [word, setword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, , user] = useContext(UserContext);

  async function loadGem(word) {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `If ${word} is in chinese, translate it to french, and if it's in french give me chinese translation. repond me in french on chinese`,
    });
    console.log(response.text);

    setGemRes(response.text);

    setLoading(false);
  }

  return (
    <div className=" py-2 border-b mb-2  ">
      <input
        className={CLASS_INPUT_TEXT}
        type="text"
        placeholder="ex: 锤子..."
        value={word}
        onChange={(e) => setword(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setGemRes("");
            loadGem(word);
          }
        }}
      />
      <button className={CLASS_BTN} onClick={(e) => loadGem(word)}>
        {GetTransForTokensArray(LANG_TOKENS.TRANSLATE, user.lang)}
      </button>
      <div className="  italic bg-gradient-to-br from-white to-slate-200 p-2 rounded-md shadow-md border-slate-400  text-ellipsis  ">
        Result: {gemRes.replace("[", "").replace("]", "").replace("\n", "")}
      </div>
      <Loading isLoading={loading} />
    </div>
  );
}
