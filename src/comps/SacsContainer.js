import { useEffect, useState } from "react";
import { GetDummyContainer } from "../helpers/dummy.mjs";

export default function SacsContainer() {
  const [cont_data, set_cont_dat] = useState([]);
  const [showDataInput, setShowDataInput] = useState(false);
  const [new_trans, set_new_trans] = useState({});
  const [stock, setstock] = useState(0);
  const [recountStock, setRecountStock] = useState(false);

  /* useEffect(() => {
    console.log(cont_data);
  }, [cont_data]);
 */
  const onEntree = () => {
    setShowDataInput(true);
    //set_cont_dat([...cont_data, GetDummyContainer(1)[0]]);
  };

  const onChange = (n, v) => {
    set_new_trans((old) => ({ ...old, [n]: v }));
  };

  const onConfirm = (e) => {
    console.log(new_trans);

    let stock_restant =
      new_trans.op === "add"
        ? stock + new_trans.sacs_count
        : stock - new_trans.sacs_count;
    setstock(stock_restant);

    if (recountStock) setstock(new_trans.sacs_count);

    const trans = {
      id: Math.random() * 1000,
      recount: recountStock ? "recount" : "",
      team: new_trans.team,
      op: recountStock ? "" : new_trans.op || "rem",
      sacs_count: new_trans.sacs_count,
      stock: new_trans.stock,
      stock_restant: recountStock ? new_trans.sacs_count : stock_restant,
      created_at: new Date().toISOString(),
    };

    set_cont_dat((old) => [...old, trans]);
    setShowDataInput(false);
  };

  return (
    <div>
      <div>Stock: {stock}</div>
      {!showDataInput && (
        <button onClick={(e) => onEntree()}>DISPATCH SACS</button>
      )}

      {!showDataInput && (
        <div className=" container mx-auto p-4 ">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 border-b">ID</th>
                <th className="py-2 px-4 bg-gray-200 border-b">
                  Recount Stock
                </th>
                <th className="py-2 px-4 bg-gray-200 border-b">Equipe</th>
                <th className="py-2 px-4 bg-gray-200 border-b">OP</th>
                <th className="py-2 px-4 bg-gray-200 border-b">Sacs Count</th>
                <th className="py-2 px-4 bg-gray-200 border-b">Stock</th>
                <th className="py-2 px-4 bg-gray-200 border-b">
                  Stock Restant
                </th>
                <th className="py-2 px-4 bg-gray-200 border-b">Date</th>
              </tr>
            </thead>

            <tbody className="table-body">
              {cont_data.map((op, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{op.recount}</td>
                  <td>{op.team}</td>
                  <td>{op.op}</td>
                  <td>{op.sacs_count}</td>
                  <td>{op.stock}</td>
                  <td>{op.stock_restant}</td>
                  <td>{op.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDataInput && (
        <div className=" container mx-auto p-4 ">
          <div>
            <label for="option-select">Equipe:</label>
            <select
              id="option-select"
              name="option"
              value={new_trans.team || "A"}
              onChange={(e) => onChange("team", e.target.value)}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              value={new_trans.sacs_count || 0}
              onChange={(e) => onChange("sacs_count", parseInt(e.target.value))}
            />
          </div>
          <div>
            <label for="d-option">RECOUNT STOCK</label>
            <input
              onChange={(e) => setRecountStock(e.target.checked)}
              checked={recountStock}
              type="checkbox"
              id="d-option"
              name="options"
              value="Reset Count"
            ></input>
          </div>
          {!recountStock && (
            <div>
              <select
                id="action-select"
                name="action"
                value={new_trans.op || "rem"}
                onChange={(e) => onChange("op", e.target.value)}
              >
                <option value="rem">Retirer</option>
                <option value="add">Ajouter</option>
              </select>
            </div>
          )}

          <button onClick={onConfirm}>CONFIRM</button>
          <button onClick={(e) => setShowDataInput(false)}>CANCEL</button>
        </div>
      )}
    </div>
  );
}
