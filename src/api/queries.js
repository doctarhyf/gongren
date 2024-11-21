import { supabase, TABLES_NAMES } from "../helpers/sb.config";

export const fetchAllItemFromTable = async (args) => {
  const tableName = args.queryKey[0];

  if (undefined === tableName)
    throw new Error(
      `TABLENAME (queryKey[0]) arg is undefined!, fetchAllItemFromTable() can not proceed`
    );

  const { data, error } = await supabase.from(tableName).select("*");

  if (data) {
    const a = data.map((it, i) => ({ idx: i + 1, ...it }));
    //console.log(a);
    return a;
  }
  throw new Error(JSON.stringify(error));
};

/* const fetchPosts = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return data;
}; */
