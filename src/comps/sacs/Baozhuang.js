import gck from "../../img/gck.png";
export default function Boazhuang({ repportdata }) {
  return (
    <div className="  border dark:bg-white dark:text-black border-slate-600 shadow-lg dark:shadow-white/20 shadow-slate-400 max-w-[18rem] p-2 ">
      <div className="  text-end ">
        <span className=" font-bold underline">{repportdata.y}</span>年
        <span className=" font-bold underline">{repportdata.m}</span>月
        <span className=" font-bold underline">{repportdata.d}</span>日
      </div>
      <div className=" w-32 h-fit  ">
        <img src={gck} />
      </div>
      <div className="  text-center underline font-bold ">
        •EMBALLAGE CIMENT水泥包装{" "}
      </div>
      <div>
        •Équipe班:
        <span className=" font-bold underline ">{repportdata.team}</span>
      </div>
      <div>
        •Superviseur班长: @
        <span className=" font-bold underline ">{repportdata.sup}</span>
      </div>
      <div>
        •<span className=" font-bold underline ">{repportdata.shift}</span>
      </div>
      <div>
        •装车
        <span className=" font-bold underline ">{repportdata.camions}</span>
        辆/Camions Chargés
      </div>
      <div>
        •袋子用
        <span className=" font-bold underline ">{repportdata.sacs}</span>
        个/Sacs Utilisés
      </div>
      <div>
        •共计
        <span className=" font-bold underline ">{repportdata.t}</span>
        吨/Tonne
      </div>
      <div>
        •撕裂的袋子
        <span className=" font-bold underline ">{repportdata.dechires}</span>
        个/Sacs déchirés`;
      </div>
    </div>
  );
}
