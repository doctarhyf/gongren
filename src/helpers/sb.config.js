import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ltvavdcgdrfqhlfpgkks.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dmF2ZGNnZHJmcWhsZnBna2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1NzEwMjUsImV4cCI6MjAwNjE0NzAyNX0.nAuA5lILpr3giK0fiurM0DprdD1JAf4xgam0laMGfRU";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const TABLES_NAMES = {
  AGENTS: "agents",
  AGENTS_RLD: "agents_rld",
  TEST: "test",
  LOADS: "loads",
  USERS: "users_gongren",
  DICO: "dico",
  SACS: "sacs",
  SACS_CONTAINER: "sacs_cont",
  SACS_PRODUCTION: "sacs_prod",
  SACS_STOCK_CONTAINER: "sacs_stock_cont",
  SACS_STOCK_PRODUCTION: "sacs_stock_prod",
  OPERATIONS_LOGS: "ops_logs",
  BIGBAG: "bigbag",
  NOTIFICATIONS: "notifications'",
};
