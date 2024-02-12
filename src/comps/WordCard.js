import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES, supabase } from "../helpers/sb.config";
import Loading from "./Loading";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";

export default function WordCard({ word, onUpdateWord, onDeleteWord }) {
  const [publicUrl, setPublicUrl] = useState("");
  const [loading, setloading] = useState(true);
  useEffect(() => {
    getPublicUrl(word.pics[0]);
  }, [word]);
  if (word === undefined) {
    return <div>-</div>;
  }

  const words_data = Object.entries(word);

  async function getPublicUrl(filePath) {
    setloading(true);
    filePath = filePath.replace("dico/", "");
    console.log("Getting public url of : ", filePath);
    try {
      const { data, error } = await supabase.storage
        .from("dico") // Replace 'your-bucket-name' with your actual bucket name
        .createSignedUrl(filePath, 60); // 60 seconds validity, adjust as needed

      if (error) {
        console.error("Error getting public URL:", error);
        setloading(false);
      } else {
        console.log("Public URL:", data.signedURL);
        console.log(data);
        setPublicUrl(data.signedUrl);
        setloading(false);
      }
    } catch (e) {
      console.error("An unexpected error occurred:", e);
      setloading(false);
    }
  }

  return (
    <div className=" bg-neutral-200 border-neutral-300 mt-2 border shadow-md rounded-md p-2 ">
      <div className="text-sky-500 text-lg">{word.zh}</div>
      <div>
        {words_data.map(
          (it, i) =>
            !["pics", "id", "created_at", "tags"].includes(it[0]) && (
              <div>
                <span className="text-sky-500">{it[0]}:</span> - {it[1]}
              </div>
            )
        )}

        <div className="flex gap-2">
          <span className="text-sky-500">tags:</span>{" "}
          {word.tags
            .split(";")
            .map(
              (t, i) =>
                i < word.tags.split(";").length - 1 && (
                  <span className="text-xs cursor-pointer px-2 text-white p-1 rounded-full bg-sky-400 hover:bg-sky-500 ">
                    {t}
                  </span>
                )
            )}
        </div>
        <div>
          <div>
            <span className="text-sky-500">Pictures:</span>
          </div>{" "}
          <div
            className={` ${
              loading ? "hidden" : "block"
            } w-[180pt] h-[180pt] object-contain object-center overflow-hidden`}
          >
            <a href={publicUrl} target="_blank">
              {" "}
              <img src={publicUrl} />
            </a>
          </div>
          <Loading isLoading={loading} center />
        </div>
      </div>
      <button className={CLASS_BTN} onClick={(e) => onUpdateWord(word)}>
        UPDATE
      </button>
      <button className={CLASS_BTN} onClick={(e) => onDeleteWord(word)}>
        DELETE
      </button>
    </div>
  );
}
