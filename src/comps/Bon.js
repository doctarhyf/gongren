import { CLASS_BTN } from "../helpers/flow";

export default function Bon({ id, sacs, onSacsChange, onRemoveBon }) {
  return (
    <div className="bon flex gap-2 border-t">
      <div className="text-xl">No. {id + 1}</div>
      <div>
        <div>Sacs</div>
        <div className="flex">
          <input
            value={sacs}
            onChange={(e) =>
              onSacsChange && onSacsChange(id, Number(e.target.value))
            }
            type="text"
            className=" text-black dark:bg-slate-800 dark:text-white outline-none  rounded-md p-1 text-sm  "
          />
          <button
            className={CLASS_BTN}
            onClick={(e) => onRemoveBon && onRemoveBon(id)}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
