import { CLASS_TD, MONTHS } from "../helpers/flow";
import { ParseDayRepport } from "../helpers/func";
import { draw_load_table } from "../helpers/funcs_print";
import ButtonPrint from "./ButtonPrint";

export default function TableLoads({ date, totalData, loadsData }) {
  function printDailRepport(data) {
    const dp = ParseDayRepport(data);
    draw_load_table(dp);
    //console.log("dtbl", dp);
  }

  function printAllRepport(loads) {
    loads.forEach((it, i) => {
      printDailRepport(it);
    });
  }

  return (
    <table>
     
      <thead>
        <tr>
          <td className={CLASS_TD} align="center" colSpan={11}>
            <b>
              RAPPORT CHARGEMENT, {date && MONTHS[date.m].toUpperCase()} -{" "}
              {date.y}
            </b>
          </td>
        </tr>
        <tr>
          {[
            "id",
            "date",
            //"code",
            "equipe",
            "shift",
            "sacs",
            "t",
            "bonus",
            "camions",
            "dechires",
            "retours",
            "ajouts",
          ].map((t, i) => (
            <td className={CLASS_TD}>{t}</td>
          ))}
        </tr>
        {totalData && (
          <tr>
            {[
              `TOTAL ${Number(date.m) + 1}月${date.y}年`,
              "",
              //"code",
              "",
              "",
              totalData.sacs,
              totalData.t,
              totalData.bonus,
              totalData.camions,
              totalData.dechires,
              totalData.retours,
              totalData.ajouts,
            ].map((t, i) => (
              <>
                {![1, 2, 3].includes(i) && (
                  <td
                    className={`${CLASS_TD} font-bold `}
                    colSpan={i === 0 ? 4 : 1}
                  >
                    {t}
                  </td>
                )}
              </>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {loadsData &&
          Object.entries(loadsData).map((ld, i) => (
            <tr
              className={`p-0 ${
                i % 2 === 0 ? "bg-neutral-100" : ""
              } hover:bg-slate-200 hover:cursor-pointer`}
            >
              <td className={CLASS_TD}>{i}</td>
              <td className={CLASS_TD}>
                <div>
                  {" "}
                  {ld[0].replaceAll("_", "/").replaceAll("/0/", "/1/")}
                </div>
                <ButtonPrint
                  title={"PRINT RPPORT"}
                  onClick={(e) => printDailRepport(ld)}
                />
              </td>
              {/*  <td>
                              {ld[1].map &&
                                ld[1].map((it, i) => (
                                  <div className={CLASS_TD}>{it.code}</div>
                                ))}
                            </td> */}
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.code.split("_")[0]}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.code.split("_")[1]}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.sacs}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{Number(it.sacs) / 20}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>
                      {Number(it.sacs) / 20 - 600 < 0
                        ? 0
                        : (Number(it.sacs) / 20 - 600).toFixed(2)}
                    </div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.camions}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.dechires}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.retours}</div>
                  ))}
              </td>
              <td>
                {ld[1].map &&
                  ld[1].map((it, i) => (
                    <div className={CLASS_TD}>{it.ajouts}</div>
                  ))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
