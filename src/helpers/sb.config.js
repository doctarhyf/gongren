import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

///console.log("supabaseUrl", supabaseUrl);
///console.log("supabaseKey", supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);

export const TABLES_NAMES = {
  AGENTS: "agents",
  AGENTS_RLD: "agents_rld",
  TEST: "test",
  LOADS: "loads",
  USERS: "users_gongren",
  DICO: "dico",
  SACS: "sacs",
  SUIVI_SACS_CONTAINER: "suivi_sacs_container",
  SACS_EXIT_CONTAINER: "sacs_exit_cont",
  SACS_PRODUCTION: "sacs_prod",
  SACS_STOCK_CONTAINER: "sacs_stock_cont",
  SACS_STOCK_PRODUCTION: "sacs_stock_prod",
  OPERATIONS_LOGS: "logs",
  BIGBAG: "bigbag",
  NOTIFICATIONS: "notifications",
  CUSTOM_AGENTS_LISTS: "custom_agents_lists",
  DAIZI_SHENGCHAN: "dzsc",
  DAIZI_JIZHUANGXIANG: "dzjzx",
  DAIZI_SHENGYU: "dzsy",
  SETTINGS: "settings",
  PANDIAN: "dzpandian",
  TIME_TABLE: "timetable",
};
