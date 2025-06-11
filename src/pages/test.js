import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";
import Loading from "../comps/Loading";

const API_KEY = "AIzaSyDjLd-iW3ZqbmLuvSlVFiDlTNMgrR0RmMA";

const ai = new GoogleGenAI({ apiKey: API_KEY });

//await main();

export default function Test() {
  const [gemRes, setGemRes] = useState("N/A");
  const [word, setword] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadGem(word) {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `If ${word} is in chinese, translate it to french, and if it's in french give me chinese translation. put the translation in brackets []`,
    });
    console.log(response.text);

    setGemRes(response.text);
    setLoading(false);
  }

  return (
    <div>
      <div>
        Gem Res: {gemRes.replace("[", "").replace("]", "").replace("\n", "")}
      </div>
      <input
        className={CLASS_INPUT_TEXT}
        type="text"
        value={word}
        onChange={(e) => setword(e.target.value)}
      />
      <button className={CLASS_BTN} onClick={(e) => loadGem(word)}>
        Translate
      </button>
      <Loading isLoading={loading} />
    </div>
  );
}
