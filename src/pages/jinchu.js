import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import ActionButton from "../comps/ActionButton";
import copy from "../img/copy.png";

import { ACCESS_CODES } from "../helpers/flow";
import { UserHasAccessCode } from "../helpers/func";
import { UserContext } from "../App";

export default function JinChu() {
  const SHIFTS = ["MATIN/白班", "APREM/中班", "NUIT/夜班"];
  const [, , user] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showTonnage, setShowTonnage] = useState(true);
  const [showBigBag, setShowBigBag] = useState(false);
  const [data, setData] = useState({
    shift: "MATIN/白班",
    park_int: 0,
    charges: 0,
    t: 0,
    encours: 0,
    charges_bigbag: 0,
    noncharges_bigbag: 0,
  });
  const [addTime, setAddTime] = useState(false);

  async function onCopy(data, show_tonnage, show_bigbag) {
    const {
      shift,
      park_int,
      charges,
      t,
      encours,
      charges_bigbag,
      noncharges_bigbag,
    } = data;

    const now = new Date();
    let [y, m, d] = now.toLocaleString("zh-CN").split(" ")[0].split("/");
    const h = now.getHours();
    const i = now.getMinutes();
    const s = now.getSeconds();

    const date = `${y}年${m}月${d}日`;
    const hr = `${h}H${i}`;
    let final_ts = `${date}`;

    if (addTime) {
      final_ts = `${date} - ${hr}`;
    }
    const text_tonnage = show_tonnage ? `Tonnage/已装吨位 : ${t}吨` : "";
    const text_bigbag = show_bigbag
      ? `Camions Chargés(BIG-BAG)/吨袋车满载: ${charges_bigbag}辆
Camions NonChargés(BIG-BAG)/吨袋空车: ${noncharges_bigbag}辆`
      : "";

    const final_text = `•${final_ts}
•${shift}
${text_tonnage}
 Camions en attente/等待装车 : ${park_int}辆
Camions Chargés/已装车:${charges}辆
En cours de changement/正在装车: ${encours}辆
${text_bigbag}`;

    await navigator.clipboard
      .writeText(final_text)
      .then(() => {
        console.log("Text copied to clipboard");

        const msg = "Text copied to clipboard";
        setAlertMsg(msg);
        setOpen(true);
        console.log(final_text);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        const msg = "Failed to copy text:!\n" + JSON.stringify(err);
        setAlertMsg(msg);
        setOpen(true);
      });
  }

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        OK
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <Paper
        variant="outlinded"
        elevation={3}
        square={false}
        sx={{ padding: 2 }}
      >
        <div>
          <div className=" space-x-2 flex   ">
            <button
              className=" p-1 border bg-sky-500 hover:bg-sky-600 text-white rounded-md  "
              onClick={(e) => {
                e.preventDefault();
                setShowTonnage(!showTonnage);
              }}
            >
              {showTonnage ? "Hide Tonnage" : "Show Tonnage"}
            </button>

            {UserHasAccessCode(user, ACCESS_CODES.ROOT) && (
              <button
                className=" p-1 border bg-sky-500 hover:bg-sky-600 text-white rounded-md  "
                onClick={(e) => {
                  e.preventDefault();
                  setShowBigBag(!showBigBag);
                }}
              >
                {showBigBag ? "Hide BigBag" : "Show BigBag"}
              </button>
            )}
          </div>

          <div>
            <span className=" mx-2   ">•SHIFT:</span>
            <select
              value={data.shift}
              onChange={(e) => setData({ ...data, shift: e.target.value })}
              className=" border p-2 rounded-md outline-none dark:bg-white dark:text-black dark:border-violet-800 "
            >
              {SHIFTS.map((sh) => (
                <option>{sh}</option>
              ))}
            </select>{" "}
          </div>

          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "black", color: "black" }, // default border
                "&:hover fieldset": { borderColor: "blue" }, // hover
                "&.Mui-focused fieldset": { borderColor: "red" }, // focused
              },
              input: {
                /*  color: "white", */
                // text color
                /*  backgroundColor: "#f5f5f5", */
              },
              label: {
                color: "gray",
              },
              marginTop: 2,
            }}
            id="outlined-basic"
            label=" 等待装车Camions en attente"
            variant="outlined"
            type="number"
            value={data.park_int}
            onChange={(e) =>
              setData({ ...data, park_int: parseInt(e.target.value) })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">辆</InputAdornment>
                ),
              },
            }}
          />

          <TextField
            sx={{ marginTop: 2 }}
            id="outlined-basic"
            label="车已经装/Camions Chargés:"
            variant="outlined"
            type="number"
            value={data.charges}
            onChange={(e) =>
              setData({ ...data, charges: parseInt(e.target.value) })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">辆</InputAdornment>
                ),
              },
            }}
          />

          {showTonnage && (
            <TextField
              sx={{ marginTop: 2 }}
              id="outlined-basic"
              label=" 吨位/Tonnage:"
              variant="outlined"
              type="number"
              value={data.t}
              onChange={(e) =>
                setData({ ...data, t: parseFloat(e.target.value) })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">T</InputAdornment>
                  ),
                },
              }}
            />
          )}

          <TextField
            sx={{ marginTop: 2 }}
            id="outlined-basic"
            label=" 在车道装/En cours de changement:"
            variant="outlined"
            type="number"
            value={data.encours}
            onChange={(e) =>
              setData({ ...data, encours: parseInt(e.target.value) })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">辆</InputAdornment>
                ),
              },
            }}
          />

          {showBigBag && (
            <>
              <div>
                吨袋车满载/Camions Chargés(BIG BAG):{" "}
                <input
                  value={data.charges_bigbag}
                  onChange={(e) =>
                    setData({
                      ...data,
                      charges_bigbag: parseInt(e.target.value),
                    })
                  }
                  type="number"
                  size={4}
                  className=" outline-none border-purple-500 border rounded-md mx-1 "
                />
                辆
              </div>
              <div>
                吨袋空车/Camions NonChargés(Big Bag):{" "}
                <input
                  value={data.noncharges_bigbag}
                  onChange={(e) =>
                    setData({
                      ...data,
                      noncharges_bigbag: parseInt(e.target.value),
                    })
                  }
                  type="number"
                  size={4}
                  className=" outline-none border-purple-500 border rounded-md mx-1 "
                />
                辆
              </div>
            </>
          )}
        </div>

        <ActionButton
          icon={copy}
          title="COPY"
          onClick={(e) => onCopy(data, showTonnage)}
        />
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={alertMsg}
        action={action}
      />
    </Box>
  );
}
