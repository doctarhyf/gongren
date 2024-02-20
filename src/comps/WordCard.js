import React, { useContext, useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES, supabase } from "../helpers/sb.config";
import Loading from "./Loading";
import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  NO_IMAGE,
  USER_LEVEL,
} from "../helpers/flow";
import { UserContext } from "../App";

export default function WordCard({ word, onUpdateWord, onDeleteWord, onOkay }) {
  const user = useContext(UserContext);
  const [publicUrl, setPublicUrl] = useState("");
  const [loading, setloading] = useState(true);
  const [showImage, showData] = useContext(UserContext);

  useEffect(() => {
    word && getPublicUrl(word.pics[0]);
  }, [word]);
  if (word === undefined) {
    return <div>-</div>;
  }

  const words_data = Object.entries(word);

  async function getPublicUrl(filePath) {
    setloading(true);
    filePath = filePath && filePath.replace("dico/", "");
    console.log("Getting public url of : ", filePath);
    try {
      const { data, error } = await supabase.storage
        .from("dico") // Replace 'your-bucket-name' with your actual bucket name
        .createSignedUrl(filePath, 60); // 60 seconds validity, adjust as needed

      if (error) {
        console.error("Error getting public URL:", error);
        setloading(false);
        setPublicUrl(NO_IMAGE);
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
    <div className="  mt-2  p-2 ">
      <div className="text-sky-500 text-3xl">{word.zh}</div>
      <div>
        {words_data.map(
          (it, i) =>
            !["pics", "id", "created_at", "tags"].includes(it[0]) && (
              <div>
                <span className="text-sky-500">{it[0]}:</span> -{" "}
                <span className="  ">{it[1]}</span>
              </div>
            )
        )}

        <div className="flex gap-2">
          <span className="text-sky-500">tags:</span>{" "}
          {word.tags
            .split(";")
            .map(
              (t, i) =>
                t.length > 0 && (
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
            className={`  my-2 ${
              loading ? "hidden" : "block"
            } w-[180pt]  object-contain object-center overflow-hidden`}
          >
            {/* <a href={publicUrl} target="_blank"> */}
            <button
              className={`  ${CLASS_BTN}   `}
              onClick={(e) => showImage(publicUrl)}
            >
              <img src={publicUrl} />
            </button>
            {/*  </a> */}
          </div>
          <div>
            {word.pics.map((p, i) => (
              <div>
                <div>
                  No{i + 1} : {p}
                </div>
              </div>
            ))}
          </div>{" "}
          <Loading isLoading={loading} center />
        </div>
      </div>
      {user.user_level >= USER_LEVEL.ADMIN && (
        <>
          <button className={CLASS_BTN} onClick={(e) => onUpdateWord(word)}>
            UPDATE
          </button>
          <button className={CLASS_BTN} onClick={(e) => onDeleteWord(word)}>
            DELETE
          </button>
        </>
      )}
      <button className={CLASS_BTN} onClick={(e) => onOkay(word)}>
        OK
      </button>
    </div>
  );
}
