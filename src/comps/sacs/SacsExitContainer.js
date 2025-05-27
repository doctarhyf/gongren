import { useEffect } from "react";

export default function SacsExitContainer({ trans }) {
  return (
    <div className="sacs-exit-container">
      <table className="table table-striped table-bordered">
        <thead>
          <td colSpan="6" className="text-center">
            SACS EXIT CONTAINER
          </td>
        </thead>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date/Time</th>
            <th>Fuzeren</th>
            <th>Nb. Sacs</th>
            <th>Stock</th>
            <th>Team</th>
          </tr>
        </thead>
        {trans.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.date_time}</td>
            <td>{item.fuzeren}</td>
            <td>{item.daizi}</td>
            <td>{item.stock}</td>
            <td>{item.team}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
