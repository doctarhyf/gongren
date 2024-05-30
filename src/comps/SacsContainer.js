import { useEffect, useState } from "react";

const cont_rec = {
  id: 0,
  sacs_sortis: 1000,
  sacs_restants: 1500,
  team: "A",
  createdAt: new Date(),
};

function genDummy(count = 10) {
  const sacs_orig = 20000;

  let a = [];

  for (let index = 0; index < count; index++) {
    const sacs_sortis = Math.abs(Math.round(Math.random() * 6000 - 1000));
    const team_idx = Math.floor(Math.random() * 4);
    //const team = ["A", "B", "C", "D"][team_idx];
    const element = {
      ...cont_rec,
      id: index,
      sacs_sortis: sacs_sortis,
      sacs_restants: sacs_orig - sacs_sortis,
      team: team_idx,
      idx: team_idx,
      createdAt: new Date(),
    };
    a.push(element);
  }

  return a;
}

export default function SacsContainer() {
  const [cont_data, set_cont_dat] = useState([cont_rec]);

  useEffect(() => {
    console.error(genDummy());
  }, []);

  return (
    <div>
      <div>Sacs Restant: 2200</div>
    </div>
  );
}
