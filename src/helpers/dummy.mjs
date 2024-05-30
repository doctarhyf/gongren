export function GetDummyContainer(count = 10, stock_init = 5e4) {
  let stock = stock_init;

  let a = [];

  for (let index = 0; index < count; index++) {
    const team_idx = Math.floor(Math.random() * 4);
    const team = ["A", "B", "C", "D"][team_idx];
    const sacs_sortis = Math.abs(Math.round(Math.random() * 6000 - 1000));
    const sacs_restants = stock - sacs_sortis;

    const element = {
      id: index,
      stock: index === 0 ? stock : sacs_restants + sacs_sortis,
      sacs_sortis: sacs_sortis,
      sacs_restants: sacs_restants,
      team: team,
      created_at: new Date(),
    };
    a.push(element);
    stock -= sacs_sortis;
  }

  return a;
}
