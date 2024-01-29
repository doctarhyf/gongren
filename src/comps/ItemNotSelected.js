import React from "react";
import smile from "../img/smile.png";

export default function ItemNotSelected({ show, message }) {
  return (
    <div
      className={`p-8 text-center justify-center  ${
        show ? "hidden" : "block"
      } `}
    >
      <div className="flex justify-center content-center">
        <img src={smile} width={60} />
      </div>
      <div>{message || "Please select an item to start!"}</div>
    </div>
  );
}
