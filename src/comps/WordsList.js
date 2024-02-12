import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "./Loading";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";

export default function WordsList({ onSelectWord }) {
  const [words, setwords] = useState([]);
  const [wordsf, setwordsf] = useState([]);
  const [loading, setloading] = useState(false);
  const [q, setq] = useState("");

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    setloading(true);
    const res = await SB.LoadAllItems(TABLES_NAMES.DICO);

    setwords(res);
    setwordsf([...res]);
    setloading(false);
  }

  function onSearch(e) {
    const v = e.target.value && e.target.value.toLowerCase();
    setq(v);

    if (v.trim() === "") {
      setwordsf([...words]);
      return;
    }

    const f = words.filter((w, i) => {
      return (
        w.zh.toLowerCase().includes(v) ||
        w.py.toLowerCase().includes(v) ||
        w.lat.toLowerCase().includes(v)
      );
    });

    setwordsf(f);
  }

  return (
    <div>
      <Loading isLoading={loading} />
      <input
        type="search"
        value={q}
        onChange={onSearch}
        className={CLASS_INPUT_TEXT}
      />
      <ul>
        {wordsf.map((w, i) => (
          <li>
            <button onClick={(e) => onSelectWord(w)} className={CLASS_BTN}>
              {w.zh} - <span>{w.lat}</span>
            </button>
          </li>
        ))}

        {wordsf.length === 0 && <div>No words!</div>}
      </ul>
    </div>
  );
}
