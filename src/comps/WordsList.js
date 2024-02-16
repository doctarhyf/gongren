import React, { useEffect, useState } from "react";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import Loading from "./Loading";
import { CLASS_BTN, CLASS_INPUT_TEXT } from "../helpers/flow";

function Tags({ tags, onTagClick }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [firstClick, setFirstClick] = useState(false);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (firstClick) {
      onTagClick(selectedTags);
    }
  }, [selectedTags]);

  function onClick(tag) {
    setFirstClick(true);
    const idx = selectedTags.findIndex((it, i) => it === tag);
    const old_a = [...selectedTags];
    if (idx === -1) {
      setSelectedTags((old) => [...old, tag]);
    } else {
      old_a.splice(idx, 1);
      setSelectedTags(old_a);
    }
  }

  function onChange(e) {
    setShowTags(e.target.checked);
  }

  return (
    <div className="flex flex-col gap-2 my-2 flex-wrap">
      <div>
        <input type="checkbox" onChange={onChange} />
        SHOW/HIDE TAGS
      </div>
      <div className={` ${showTags ? "block" : "hidden"} `}>
        {tags.map((t, i) => (
          <button
            onClick={(e) => onClick(t)}
            key={i}
            className={`p-1 hover:text-sky-500 m-1 hover:border-sky-400  text-xs rounded-full px-2  ${
              selectedTags.includes(t)
                ? "text-white border-none bg-sky-500"
                : "text-black border"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WordsList({ onSelectWord }) {
  const [words, setwords] = useState([]);
  const [wordsf, setwordsf] = useState([]);
  const [loading, setloading] = useState(false);
  const [q, setq] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    setloading(true);
    setTags([]);
    const res = await SB.LoadAllItems(TABLES_NAMES.DICO);

    let new_tags = {};
    res.forEach((it, i) => {
      const tags = it.tags.split(";");
      tags.forEach((t, i) => {
        t = t.trim();
        if (t !== "") new_tags[t] = t;
      });
    });

    new_tags = Object.keys(new_tags);

    setTags(new_tags);

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

  function onTagClick(selectedTags) {
    const selectedTagsArrayEmpty = selectedTags.length === 0;

    console.log(selectedTags);

    if (selectedTagsArrayEmpty) {
      setwordsf([...words]);
      return;
    }

    const filteredWord = words.filter((word, i) => {
      let tagFound = false; // word.tags.indexOf("plasma") !== -1;

      selectedTags.forEach((t, i) => {
        tagFound = word.tags.indexOf(t) !== -1;
      });

      return tagFound;
    });

    setwordsf(filteredWord);
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

      <Tags onTagClick={onTagClick} tags={tags} />

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
