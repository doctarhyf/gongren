import { useState } from "react";

const COLORS = [
  " bg-teal-700 text-teal-300 border-teal-300 p-2 rounded-md w-full md:w-64 ",
  " bg-sky-700 text-sky-300 border-sky-300 p-2 rounded-md w-full md:w-64 ",
  " bg-indigo-700 text-indigo-300 border-indigo-300 p-2 rounded-md w-full md:w-64 ",
  " bg-purple-700 text-purple-300 border-purple-300 p-2 rounded-md w-full md:w-64 ",
  " bg-rose-700 text-rose-300 border-rose-300 p-2 rounded-md w-full md:w-64 ",
  "  bg-lime-700 text-lime-300 border-lime-300 p-2 rounded-md w-full md:w-64 ",
];

const Card = ({ id, title, desc, children, wfull }) => {
  const [showChildren, setShowChildren] = useState(true);

  return (
    <div
      className={` flex-grow  ${COLORS[id]}   ${wfull ? "w-full" : "w-auto"}  `}
    >
      <h1
        className=" cursor-pointer  font-bold  border-b border-b-white/20   "
        onClick={(e) => setShowChildren(!showChildren)}
      >
        {title}
      </h1>
      {showChildren && <div>{children}</div>}
      <h5>{desc}</h5>
    </div>
  );
};

export default Card;
