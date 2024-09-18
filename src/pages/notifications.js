import React, { useContext, useState } from "react";
import Loading from "../comps/Loading";
import ActionButton from "../comps/ActionButton";
import plus from "../img/plus.png";
import check from "../img/check.svg";
import truck from "../img/truck.jpg";
import { UserHasAccessCode } from "../helpers/func";
import { ACCESS_CODES } from "../helpers/flow";
import { UserContext } from "../App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as SB from "../helpers/sb";
import { supabase } from "../helpers/sb.config";
import { TABLES_NAMES } from "../helpers/sb.config";
import axios from "axios";
const NOTS = [
  {
    id: 1,
    title: "Problème moteur",
    desc: "Le camion 001 a un problème moteur.",
    images: ["img1.jpg", "img2.jpg"],
    audio: "audio1.mp3",
    plaque: "ABC-1234",
    date: "2024-09-12",
  },
  {
    id: 2,
    title: "Freins défectueux",
    desc: "Le camion 002 a des freins défectueux.",
    images: ["img3.jpg"],
    audio: "audio2.mp3",
    plaque: "DEF-5678",
    date: "2024-08-30",
  },
  {
    id: 3,
    title: "Surchauffe moteur",
    desc: "Le camion 003 surchauffe souvent.",
    images: ["img4.jpg", "img5.jpg"],
    audio: "audio3.mp3",
    plaque: "GHI-9101",
    date: "2024-07-22",
  },
  {
    id: 4,
    title: "Fuite d'huile",
    desc: "Le camion 004 a une fuite d'huile.",
    images: ["img6.jpg"],
    audio: "audio4.mp3",
    plaque: "JKL-1121",
    date: "2024-08-15",
  },
  {
    id: 5,
    title: "Pneus usés",
    desc: "Le camion 005 a des pneus usés.",
    images: ["img7.jpg"],
    audio: "audio5.mp3",
    plaque: "MNO-3141",
    date: "2024-09-05",
  },
];

const fetchPosts = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return data;
};

const fetchnot = async () => {
  const { data, error } = await supabase
    .from(TABLES_NAMES.NOTIFICATIONS)
    .select("*");

  if (data) return data;
  throw new Error(JSON.stringify(error));
};

export default function Notifications() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchnot,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>This is a fucking error Error: {error.message}</div>;

  return (
    <div>
      <h2>Posts List</h2>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            {/* <strong>{post.title}</strong>
            <p>{post.body}</p> */}
            {Object.keys(post)}
          </li>
        ))}
      </ul>
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
