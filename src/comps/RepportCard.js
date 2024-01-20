export default function RepportCard({ data }) {
  return (
    <div className="border mt-2 rounded-md p-1 bg-neutral-100 shadow-md">
      <div className=" text-sky-500">
        <div className="py-1 text-xl border-b mb-1">
          {" "}
          Rapport {data && data.type}
        </div>
        <div>{data && data.type && data.date}</div>
      </div>
      <div>
        {data &&
          Object.entries(data).map((k, v) => (
            <div>
              {k[0] !== "date" && k[0] !== "type" && (
                <>
                  {" "}
                  {k[0]} : <b>{k[1]}</b>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
