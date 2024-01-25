import { CLASS_BTN } from "../helpers/flow";
import { draw_load_table } from "../helpers/funcs_print";
import ButtonPrint from "./ButtonPrint";

export default function RepportCard({ data, onUpdateShiftData }) {
  function onPrintDailyRepport(data) {
    draw_load_table(data);
  }

  return (
    <div className="border mt-2 rounded-md p-1 bg-neutral-100 shadow-md">
      <div className=" text-sky-500">
        <div className="py-1 text-xl border-b mb-1">
          {" "}
          Rapport {data && data.type} / {data && data.type && data.date}
        </div>
      </div>
      <div>
        {data &&
          Object.entries(data).map((k, v) => (
            <div>
              {!["date", "type", "tid", "upd"].includes(k[0]) && (
                <>
                  {" "}
                  {k[0]} : <b>{k[1]}</b>
                </>
              )}
            </div>
          ))}
      </div>
      {data && data.tid === "s" && (
        <div>
          <button
            onClick={(e) => onUpdateShiftData(data)}
            className={CLASS_BTN}
          >
            UPDATE
          </button>
        </div>
      )}

      {data && data.tid === "d" && (
        <div>
          <ButtonPrint
            onClick={(e) => onPrintDailyRepport(data)}
            title={"PRINT DAILY REPPORT."}
          />
        </div>
      )}
    </div>
  );
}
