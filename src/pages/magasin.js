import React, { useContext } from "react";
import { ModalContext } from "../App";
import { CLASS_BTN } from "../helpers/flow";

export default function Magasin() {
  const [showModal, setShowModal] = useContext(ModalContext);

  return (
    <div>
      <div>Magasin</div>

      <button onClick={(e) => setShowModal(true)} className={CLASS_BTN}>
        SHOW MODAL
      </button>
    </div>
  );
}
