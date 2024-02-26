import {
  CLASS_BTN,
  CLASS_INPUT_TEXT,
  pinyinVowelsWithTones,
} from "../helpers/flow";

export default function PYKBD({ show, onType, onHidePYKBD }) {
  return (
    <div
      className={` border  p-1 px-2 rounded-md bg-neutral-200/70 shadow-md ${
        show ? "block" : "hidden"
      } `}
    >
      <div className="flex flex-row font-bold text-xs items-center my-2  justify-between">
        <span>PINYIN KEYBOARD</span>
        <button
          onClick={onHidePYKBD}
          className="text-white bg-red-500 text-xs rounded-full w-6 h-6"
        >
          X
        </button>
      </div>

      <div>
        {pinyinVowelsWithTones.map((pyletter_array, i) => (
          <div key={i} className="flex justify-between">
            {pyletter_array.map((py, i) => (
              <button key={i} className={CLASS_BTN} onClick={(e) => onType(py)}>
                {py}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
