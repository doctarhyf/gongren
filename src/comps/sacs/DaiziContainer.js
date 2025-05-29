import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import * as SB from "../../helpers/sb";
import { TABLES_NAMES } from "../../helpers/sb.config";
import { formatCreatedAt } from "../../helpers/func";
import { DAIZI_FUZEREN } from "../../helpers/flow";

function TableContainer({ trans, onAdd }) {
  return (
    <div>
      <div>CONTAINER</div>
      <div>
        <button className="btn btn-primary" onClick={onAdd}>
          Add
        </button>
      </div>
      <table class="table-auto">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          <tr>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              ID
            </th>
            {/*  <th className="p1 border border-gray-900 dark:border-white p-1 ">
        created
      </th> */}
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              DATE TIME
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              OP
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              s32
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              s42
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              stock32
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              stock42
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              fuzeren
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              team
            </th>
          </tr>
        </thead>
        <tbody>
          {trans.map((item) => (
            <tr key={item.id}>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.id}
              </td>
              {/*   <td className="p1 border border-gray-900 dark:border-white p-1 ">
          {formatCreatedAt(item.created_at)}
        </td> */}
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.date_time}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.operation}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.s32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.s42}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.stock32}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.stock42}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.fuzeren}
              </td>
              <td className="p1 border border-gray-900 dark:border-white p-1 ">
                {item.team}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableInput({ onCancel, onInputChage, resetStock }) {
  const [data, setData] = useState({
    date_time: "",
    operation: "in",
    s32: 0,
    s42: 0,
    stock32: 0,
    stock42: 0,
    fuzeren: "谭义勇",
    team: "A",
  });
  //const [operation, setOperation] = useState("in");

  useEffect(() => {
    const finalData = {
      ...data,
    };

    console.log("final data", finalData);

    if (isNaN(data.s32)) {
      finalData.s32 = 0;
      resetStock();
    }

    if (isNaN(data.s42)) {
      finalData.s42 = 0;
      resetStock();
    }

    onInputChage(finalData);
  }, [data]);

  return (
    <div>
      <div>
        <button className="btn btn-primary">Save</button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <table class="table-auto">
        <thead className="p1 border border-gray-900 dark:border-white p-1 ">
          <tr>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              DATE TIME
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              OP
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              s32
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              s42
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              stock32
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              stock42
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              fuzeren
            </th>
            <th className="p1 border border-gray-900 dark:border-white p-1 ">
              team
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="datetime-local"
                className="w-full"
                value={data.date_time}
                onChange={(e) =>
                  setData((prev) => ({
                    ...data,
                    date_time: e.target.value.replace("T", " "),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <select
                className="w-full"
                value={data.operation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, operation: e.target.value }))
                }
              >
                <option value="in">in</option>
                <option value="out">out</option>
              </select>
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                className="w-full"
                placeholder="s32"
                value={data.s32}
                onChange={(e) =>
                  setData((prev) => ({
                    ...data,
                    s32: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <input
                type="number"
                className="w-full"
                placeholder="s42"
                value={data.s42}
                onChange={(e) =>
                  setData((prev) => ({
                    ...data,
                    s42: parseInt(e.target.value),
                  }))
                }
              />
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              stock32
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              stock42
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <select
                className="w-full"
                value={data.fuzeren}
                onChange={(e) =>
                  setData((prev) => ({ ...data, fuzeren: e.target.value }))
                }
              >
                {DAIZI_FUZEREN.map((fuzeren) => (
                  <option key={fuzeren} value={fuzeren}>
                    {fuzeren}{" "}
                  </option>
                ))}
              </select>
            </td>
            <td className="p1 border border-gray-900 dark:border-white p-1 ">
              <select
                className="w-full"
                value={data.team}
                onChange={(e) =>
                  setData((prev) => ({ ...data, team: e.target.value }))
                }
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function DaiziContainer({ onInputChage, resetStock }) {
  const [, , user] = useContext(UserContext);

  const [trans, setTrans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(false);

  useEffect(() => {
    // Load transactions or any other data needed
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const fetchedTrans = await SB.LoadAllItems(
      TABLES_NAMES.DAIZI_JIZHUANGXIANG
    );
    if (fetchedTrans) {
      setTrans(fetchedTrans);
      console.log("Transactions loaded:", fetchedTrans);
      setLoading(false);
    } else {
      console.error("Failed to load transactions");
      setLoading(false);
    }
  }

  return loading ? (
    <div>Loading ... </div>
  ) : input ? (
    <TableInput
      onCancel={(e) => {
        setInput(false);
        resetStock();
      }}
      onInputChage={onInputChage}
      resetStock={resetStock}
    />
  ) : (
    <TableContainer trans={trans} onAdd={(e) => setInput(true)} />
  );
}
