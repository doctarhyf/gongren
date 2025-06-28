import { GoogleGenAI, Type } from "@google/genai";
import { useContext, useEffect, useState } from "react";
import { CLASS_BTN, CLASS_INPUT_TEXT, LOGO } from "../helpers/flow";
import Loading from "./Loading";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import { UserContext } from "../App";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function Gemini() {
  const [gemRes, setGemRes] = useState("N/A");
  const [word, setword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, , user] = useContext(UserContext);
  const [genImg, setGenImg] = useState(false);

  async function loadGem(word) {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: word, // `is this " ${word} " chinese? if yes, translate it to french, if its latin translate it to chinse.`,
        /*  config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.STRING,
        },
      }, */
      });

      // console.log(response.text);

      setGemRes(response.text);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }

    setLoading(false);
  }

  return (
    <div className=" min-w-24 border-l  p-4 border-orange-800/60 container flex flex-col gap-4 justify-center items-center h-full min-h-40 ">
      <image src={LOGO} width={200} height={100} />

      <div className=" text-3xl font-thin  ">
        BagTrack <span className=" font-black  ">AI</span>
      </div>
      <div className=" text-sm italic  ">
        {GetTransForTokensArray(LANG_TOKENS.ASK_ME_ANYTHING, user.lang)}
      </div>
      <div></div>
      <div className=" bg-white p-4 rounded-full w-[80%] flex justify-center  ">
        <input
          className="bg-transparent w-full text-black outline-none"
          type="text"
          placeholder={GetTransForTokensArray(
            LANG_TOKENS.ASK_ME_ANYTHING,
            user.lang
          )}
          value={word}
          onChange={(e) => setword(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setGemRes("");
              loadGem(word);
            }
          }}
        />
      </div>
      {/*   <div>
        <input
          value={genImg}
          onChange={(e) => setGenImg(e.target.checked)}
          type="checkbox"
        />
        Gen Image{" "}
      </div> */}
      <div className="   ">{gemRes}</div>

      <Loading isLoading={loading} />
    </div>
  );
}
