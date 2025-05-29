import { useContext } from "react";
import { UserContext } from "../../App";

export default function DaiziProd({ stock }) {
  const [, , user] = useContext(UserContext);
  return <div>prod</div>;
}
