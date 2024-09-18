import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { fetchAllItemFromTable } from "../api/queries";
import { UserContext } from "../App";
import ActionButton from "../comps/ActionButton";
import Loading from "../comps/Loading";
import { ACCESS_CODES } from "../helpers/flow";
import { UserHasAccessCode } from "../helpers/func";
import check from "../img/check.svg";
import plus from "../img/plus.png";
import truck from "../img/truck.jpg";
import { TABLES_NAMES } from "../helpers/sb.config";

export default function Notifications() {
  const [show, , user, setuser] = useContext(UserContext);
  const [selectednot, setselectednot] = useState(undefined);
  const [adding, setadding] = useState(false);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: [TABLES_NAMES.NOTIFICATIONS],
    queryFn: fetchAllItemFromTable,
  });

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className=" container  ">
      <div>
        NOTIFICATIONS{" "}
        <span className=" bg-red-600 text-white text-sm rounded-full font-bold px-2 p-1  ">
          En cours developement!!!
        </span>
        <span>
          <Loading isLoading={isLoading} />
        </span>
      </div>
      {UserHasAccessCode(user, ACCESS_CODES.CAN_POST_NOTIFICATIONS) ||
        (true && (
          <ActionButton
            title={"Nouvelle Notification"}
            icon={plus}
            onClick={(e) => setadding(true)}
          />
        ))}
      {adding ? (
        <div>
          Adding
          <ActionButton title={"ok"} onClick={(e) => setadding(false)} />
        </div>
      ) : (
        <>
          {selectednot ? (
            <div>
              <h5>{selectednot.title}</h5>
              <div>{selectednot.desc}</div>
              <div className=" w-56 h-56 overflow-hidden rounded-md ">
                <img src={truck} className=" hover:cursor-pointer  " />
              </div>
              <ActionButton
                title={"OK"}
                icon={check}
                onClick={(e) => setselectednot(undefined)}
              />
            </div>
          ) : (
            <div>
              <table class="table-fixed">
                <thead>
                  <tr>
                    <th className=" p-1 border-slate-500 border ">ID</th>
                    <th className=" p-1 border-slate-500 border ">Date</th>
                    <th className=" p-1 border-slate-500 border ">Plaque</th>
                    <th className=" p-1 border-slate-500 border ">Problem</th>
                    <th className=" p-1 border-slate-500 border ">Audio</th>
                    <th className=" p-1 border-slate-500 border ">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((not, i) => (
                      <tr
                        onClick={(e) => setselectednot(not)}
                        className="  hover:bg-slate-500 hover:text-white hover:cursor-pointer  "
                      >
                        <td className=" p-1 border-slate-500 border ">
                          {i + 1}
                        </td>
                        <td className=" p-1 border-slate-500 border ">
                          {not.date}
                        </td>
                        <td className=" p-1 border-slate-500 border ">
                          {not.plaque}
                        </td>
                        <td className=" p-1 border-slate-500 border ">
                          {not.problem}
                        </td>
                        <td className=" p-1 border-slate-500 border ">
                          {not.audio}
                        </td>
                        <td className=" p-1 border-slate-500 border ">
                          {not.images && not.images[0]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* export default function Notifications() {
  const [loading, setloading] = useState(false);
  const [notifications, setnotifications] = useState([]);
  const [show, , user, setuser] = useContext(UserContext);
  const [selectednot, setselectednot] = useState(undefined);
  const [adding, setadding] = useState(false);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: SB.LoadAllItems(TABLES_NAMES.NOTIFICATIONS),
  });

  if (query.isError) return <div>{JSON.stringify(query.error)}</div>;
  if (query.isLoading) return <Loading isLoading={true} />;

  return (
    <div className=" container  ">
      cool {JSON.stringify(queryClient)}
      <div>
        NOTIFICATIONS{" "}
        <span className=" bg-red-600 text-white text-sm rounded-full font-bold px-2 p-1  ">
          En cours developement!!!
        </span>
        <span>
          <Loading isLoading={loading} />
        </span>
      </div>
      {UserHasAccessCode(user, ACCESS_CODES.CAN_POST_NOTIFICATIONS) ||
        (true && (
          <ActionButton
            title={"Nouvelle Notification"}
            icon={plus}
            onClick={(e) => setadding(true)}
          />
        ))}
      {adding ? (
        <div>
          Adding
          <ActionButton title={"ok"} onClick={(e) => setadding(false)} />
        </div>
      ) : (
        <>
          {selectednot ? (
            <div>
              <h5>{selectednot.title}</h5>
              <div>{selectednot.desc}</div>
              <div className=" w-56 h-56 overflow-hidden rounded-md ">
                <img src={truck} className=" hover:cursor-pointer  " />
              </div>
              <ActionButton
                title={"OK"}
                icon={check}
                onClick={(e) => setselectednot(undefined)}
              />
            </div>
          ) : (
            <div>
              <table class="table-fixed">
                <thead>
                  <tr>
                    <th className=" p-1 border-slate-500 border ">ID</th>
                    <th className=" p-1 border-slate-500 border ">Date</th>
                    <th className=" p-1 border-slate-500 border ">Plaque</th>
                    <th className=" p-1 border-slate-500 border ">Problem</th>
                    <th className=" p-1 border-slate-500 border ">Audio</th>
                    <th className=" p-1 border-slate-500 border ">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data?.map((not, i) => (
                    <tr
                      onClick={(e) => setselectednot(not)}
                      className="  hover:bg-slate-500 hover:text-white hover:cursor-pointer  "
                    >
                      <td className=" p-1 border-slate-500 border ">{i + 1}</td>
                      <td className=" p-1 border-slate-500 border ">
                        {not.date}
                      </td>
                      <td className=" p-1 border-slate-500 border ">
                        {not.plaque}
                      </td>
                      <td className=" p-1 border-slate-500 border ">
                        {not.title}
                      </td>
                      <td className=" p-1 border-slate-500 border ">
                        {not.audio}
                      </td>
                      <td className=" p-1 border-slate-500 border ">
                        {not.images[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
} */
