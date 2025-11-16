"use client";

import { useCallback, useState } from "react";

const team = [
  { id: 1, role: "Store Agent", name: "Alex Johnson", icon: "🏬" },
  { id: 2, role: "Store Director", name: "Maria Garcia", icon: "🏢" },
  { id: 3, role: "Finance Agent", name: "Chen Wei", icon: "💼" },
  { id: 4, role: "General Director", name: "Fatima Al-Sayed", icon: "⚙️" },
];

export default function Magasin() {
  const [selectedId, setSelctedID] = useState(-1);

  const handleClick = useCallback((member) => {
    setSelctedID(member.id);

    console.log(member.id);
  }, []);

  return (
    <div className="flex justify-center items-center  flex-col h-screen -mt-28">
      <div className="  text-3xl p-4 my-2 ">Warehouse Management</div>

      <div className="grid grid-cols-2 gap-4 w-[450px]">
        {team.map((t) => (
          <div
            key={t.id}
            onClick={() => handleClick(t)}
            className="
              bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200
              cursor-pointer transition-all
              hover:bg-white hover:border-gray-300 hover:shadow-md hover:scale-[1.02]
            "
          >
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <span className="text-xl">{t.icon}</span>
              {t.role}
            </div>
            <div className="mt-2 text-sm text-gray-500">{t.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
