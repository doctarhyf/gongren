import { useState } from "react";
import {
  SACS_CONTAINER_OPERATION_TYPE,
  STOCK_TYPE,
  TRANSACTION_TYPE,
} from "../../helpers/flow";
import Stock from "./Stock";

export default function SacsContainer({
  trans,
  onAddTrans,
  stock,
  onResetStock,
}) {
  const [showInput, setShowInput] = useState(false);
  const [data, setdata] = useState({
    //id: 0,
    team: "A",
    op: SACS_CONTAINER_OPERATION_TYPE.IN,
    s32: 0,
    s42: 0,
    reset: false,
  });

  function onSaveTrans() {
    if (data.s32 === undefined || data.s42 === undefined) {
      alert("Please input sacs amount!");
      return;
    }

    setShowInput(false);
    onAddTrans(TRANSACTION_TYPE.CONTAINER, data);
    setdata({
      //id: 0,
      team: "A",
      op: SACS_CONTAINER_OPERATION_TYPE.IN,
      s32: 0,
      s42: 0,
    });
  }

  return (
    <div>
      <Stock id={STOCK_TYPE.CONTAINER} stock={stock} label={"CONTAINER"} />
      <div>
        {!showInput && (
          <button
            onClick={(e) => setShowInput(true)}
            className=" p-1 text-green-500 border rounded-md border-green-500 hover:text-white hover:bg-green-500 "
          >
            INSERT
          </button>
        )}

        {showInput && (
          <>
            <button
              onClick={onSaveTrans}
              className=" p-1 text-sky-500 border rounded-md border-sky-500 hover:text-white hover:bg-sky-500 "
            >
              SAVE
            </button>
            <button
              onClick={(e) => setShowInput(false)}
              className=" p-1 text-red-500 border rounded-md border-red-500 hover:text-white hover:bg-red-500 "
            >
              CANCEL
            </button>
            <div>
              <input
                type="checkbox"
                value={data.reset}
                onChange={(e) =>
                  setdata((old) => ({ ...old, reset: e.target.checked }))
                }
              />
              RESET
            </div>
          </>
        )}
      </div>
      <div className=" container  ">
        <table>
          <thead>
            <th className="p1 border border-gray-900">id</th>
            <th className="p1 border border-gray-900">Operation</th>
            <th className="p1 border border-gray-900">Equipe</th>
            <th className="p1 border border-gray-900">32.5</th>
            <th className="p1 border border-gray-900">42.5</th>
            <th className="p1 border border-gray-900">Stock 32.5</th>
            <th className="p1 border border-gray-900">Stock 42.5</th>
            <th className="p1 border border-gray-900">Stock Reset</th>
            <th className="p1 border border-gray-900">Date</th>
          </thead>
          <tbody>
            {showInput && (
              <tr>
                <td className="p1 border border-gray-900">0</td>
                <td className="p1 border border-gray-900">in</td>
                <td className="p1 border border-gray-900">
                  <select
                    className=" border p-1 "
                    value={data.team}
                    onChange={(e) =>
                      setdata((old) => ({ ...old, team: e.target.value }))
                    }
                  >
                    {["A", "B", "C", "D"].map((eq) => (
                      <option value={eq}>{eq}</option>
                    ))}
                  </select>
                </td>
                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16 "
                    value={data.s32}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        s32:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>
                <td className="p1 border border-gray-900">
                  <input
                    className=" w-16"
                    value={data.s42}
                    onChange={(e) =>
                      setdata((old) => ({
                        ...old,
                        s42:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      }))
                    }
                  />
                </td>
                <td className="p1 border border-gray-900"> - </td>
                <td className="p1 border border-gray-900"> - </td>
                <td className="p1 border border-gray-900">
                  {" "}
                  <input
                    type="checkbox"
                    value={data.stockres}
                    onChange={(e) =>
                      setdata((old) => ({ ...old, stockres: e.target.checked }))
                    }
                  />{" "}
                </td>
                <td className="p1 border border-gray-900">
                  {new Date().toDateString()}
                </td>
              </tr>
            )}
            {!showInput &&
              trans.map((t, i) => (
                <tr className={`  ${showInput ? "opacity-20" : ""}   `}>
                  <td className="p1 border border-gray-900">{i}</td>
                  <td className="p1 border border-gray-900">{t.op}</td>
                  <td className="p1 border border-gray-900">{t.team}</td>
                  <td className="p1 border border-gray-900">{t.s32}</td>
                  <td className="p1 border border-gray-900">{t.s42}</td>
                  <td className="p1 border border-gray-900">{t.stock32}</td>
                  <td className="p1 border border-gray-900">{t.stock42}</td>
                  <td className="p1 border border-gray-900">
                    {t.stockres ? "yes" : "no"}
                  </td>
                  <td className="p1 border border-gray-900">{t.created_at}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
