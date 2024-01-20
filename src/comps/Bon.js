import { CLASS_BTN } from "../helpers/flow";

export default function Bon({ id, sacs, onSacsChange, onRemoveBon }) {
  return (
    <div className="bon flex gap-2 border-t">
      <div className="text-xl">No. {id}</div>
      <div>
        <div>Sacs</div>
        <div className="flex">
          <input
            value={sacs}
            onChange={(e) =>
              onSacsChange && onSacsChange(id, Number(e.target.value))
            }
            type="text"
          />
          <button
            className={CLASS_BTN}
            onClick={(e) => onRemoveBon && onRemoveBon(id)}
          >
            X
          </button>
        </div>
      </div>
      {/*  <div>
        <div>Plaque</div>
        <input type="text" />
      </div> */}
    </div>
  );
}
