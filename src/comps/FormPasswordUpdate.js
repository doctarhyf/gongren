import React from "react";
import ActionButton from "./ActionButton";

export default function FormPasswordUpdate({ onUpdatePassword }) {
  return (
    <div>
      <p>FormPasswordUpdate</p>
      <ActionButton title={"OK"} onClick={onUpdatePassword} />
    </div>
  );
}
