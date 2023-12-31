import { TABLES_NAMES, supabase } from "./sb.config";

export async function InsertItem(tableName, newData) {
  const { data, error } = await supabase.from(tableName).insert([newData]);

  if (error) return error;
  return data;
}

export async function UpdateRoulement2(
  month_code,
  roulemant_data,
  onSuccess,
  onError
) {
  const count = await CountItemsInTableWithRowEqVal(
    TABLES_NAMES.AGENTS_RLD,
    "month_code",
    month_code
  );

  const shouldCreateNewRecord = count === 0;
  let res;
  if (shouldCreateNewRecord) {
    res = await InsertItem(TABLES_NAMES.AGENTS_RLD);
  } else {
    const { data, error } = await supabase
      .from(TABLES_NAMES.AGENTS_RLD)
      .update({ rl: roulemant_data })
      .eq("month_code", month_code)
      .select();

    if (data) {
      res = data;
      if (onSuccess) onSuccess(data);
    }
    if (error) {
      res = error;
      if (onError) onError(error);
    }
  }

  return count;
}

export async function UpdateRoulement(month_code, newData) {
  const { data, error } = await supabase
    .from(TABLES_NAMES.AGENTS_RLD)
    .upsert([newData], { onConflict: "month_code" })
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  console.log(data);
  return data;
}

export async function CountItemsInTable(tableName) {
  let { data, error } = await supabase.from(tableName).select("*");

  if (error) return 0;
  return data.length;
}

export async function CountItemsInTableWithRowEqVal(
  tableName,
  rowName,
  rowVal
) {
  console.log(
    "CountItemsInTableWithRowEqVal() ",
    ` => counting from ${tableName} where ${rowName} === "${rowVal}" `
  );

  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, rowVal);

  console.log("da count => ", data);

  if (error) return 0;
  return data.length;
}

export async function CountAllItems(tableName) {
  let { data, error } = await supabase.from(tableName).select("*");

  if (error) return error;

  return data.length;
}

export async function LoadAllItems(tableName) {
  let { data, error } = await supabase.from(tableName).select("*");

  if (error) return error;

  return data;
}

export async function LoadItems(tableName, pageNum = 1, perPage = 5) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .range(perPage * pageNum - 5, 5 * pageNum);

  if (error) return error;

  return data;
}

export async function LoadItemWithID(tableName, id) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", parseInt(id));

  if (error) return error;

  return data[0];
}

export async function LoadItemWithColNameEqColVal(tableName, colName, colVal) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(colName, colVal);

  if (error) return error;

  return data[0];
}

export async function UpdateItem(table_name, upd_data) {
  const { data, error } = await supabase
    .from(table_name)
    .update(upd_data)
    .eq("id", upd_data.id)
    .select();

  if (error) return error;

  return data;
}

export async function DeleteItem(table_name, item_data) {
  const { error } = await supabase
    .from(table_name)
    .delete()
    .eq("id", item_data.id);
  if (error) return error;
}

export async function DeleteItemByColEqVal(table_name, col_name, col_val) {
  const { error } = await supabase
    .from(table_name)
    .delete()
    .eq(col_name, col_val);
  if (error) return error;
}
