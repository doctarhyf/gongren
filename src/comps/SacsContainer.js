import { useEffect, useState } from "react";
import { GetDummyContainer } from "../helpers/dummy.mjs";

export default function SacsContainer() {
  const [cont_data, set_cont_dat] = useState(GetDummyContainer(50));

  useEffect(() => {
    console.log(cont_data);
  }, [cont_data]);

  return (
    <div>
      <div>Sacs Restant: 2200</div>
      <div className=" container mx-auto p-4 ">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 border-b">ID</th>
              <th className="py-2 px-4 bg-gray-200 border-b">Equipe</th>
              <th className="py-2 px-4 bg-gray-200 border-b">Stock</th>
              <th className="py-2 px-4 bg-gray-200 border-b">Sacs Sortis</th>
              <th className="py-2 px-4 bg-gray-200 border-b">Sacs Restant</th>
            </tr>
          </thead>

          <tbody className="table-body">
            {cont_data.map((ling, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{ling.team}</td>
                <td>{ling.stock}</td>
                <td>{ling.sacs_sortis}</td>
                <td>{ling.sacs_restants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
