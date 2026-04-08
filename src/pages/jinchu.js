import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
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
  const [addTime, setAddTime] = useState(false);
  const [statsMode, setStatsMode] = useState(false);
  const [textToCopy, settextToCopy] = useState("");

  const [data, setData] = useState({
    shift: SHIFTS[0],
    park_int: 0,
    charges: 0,
    t: 0,
    encours: 0,
    charges_bigbag: 0,
    noncharges_bigbag: 0,
  });

  async function onCopy(data) {
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

    const date = `${y}年${m}月${d}日`;
    const hr = `${now.getHours()}H${now.getMinutes()}`;
    const final_ts = addTime ? `${date} - ${hr}` : date;

    const text_header = !statsMode ? `•${final_ts} •${shift}` : "";

    const text_tonnage = showTonnage ? `•Tonnage / 已装吨位 : ${t}吨` : "";

    const text_waiting = statsMode
      ? `•Camions en attente / 等待装车 : ${park_int}辆`
      : "";

    const text_bigbag = showBigBag
      ? `•Camions chargés (BIG BAG) / 吨袋车满载 : ${charges_bigbag}辆
•Camions non chargés (BIG BAG) / 吨袋空车 : ${noncharges_bigbag}辆`
      : "";

    const final_text = [
      text_header,
      text_tonnage,
      `•Camions chargés / 已装车 : ${charges}辆`,
      text_waiting,
      `•En cours de chargement / 正在装车 : ${encours}辆`,
      text_bigbag,
    ]
      .filter(Boolean) // removes empty strings
      .join("\n");
    try {
      await navigator.clipboard.writeText(final_text);
      settextToCopy(final_text);
      setAlertMsg(`Copied successfully`);
    } catch (err) {
      setAlertMsg("Copy failed");
    }
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  return (
    <Box display="flex " justifyContent="center" mt={4}>
      <Paper elevation={4} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        {!statsMode ? (
          <Typography variant="h6" gutterBottom>
            🚚 Rapport Chargement
          </Typography>
        ) : (
          <Typography variant="h6" gutterBottom>
            🚚 Statistique Chargement
          </Typography>
        )}

        {/* Toggles */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <FormControlLabel
            control={
              <Switch
                checked={showTonnage}
                onChange={() => setShowTonnage(!showTonnage)}
              />
            }
            label="Tonnage"
          />

          {UserHasAccessCode(user, ACCESS_CODES.ROOT) && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={statsMode}
                    onChange={() => setStatsMode(!statsMode)}
                  />
                }
                label="Stats Mode"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showBigBag}
                    onChange={() => setShowBigBag(!showBigBag)}
                  />
                }
                label="BigBag"
              />
            </>
          )}
        </Box>

        {/* Shift */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={data.shift}
            onChange={(e) => setData({ ...data, shift: e.target.value })}
          >
            {SHIFTS.map((sh) => (
              <MenuItem key={sh} value={sh}>
                {sh}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Inputs */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Attente"
              type="number"
              fullWidth
              value={data.park_int}
              onChange={(e) =>
                setData({ ...data, park_int: +e.target.value || 0 })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">辆</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Chargés"
              type="number"
              fullWidth
              value={data.charges}
              onChange={(e) =>
                setData({ ...data, charges: +e.target.value || 0 })
              }
            />
          </Grid>

          {showTonnage && (
            <Grid item xs={12}>
              <TextField
                label="Tonnage"
                type="number"
                fullWidth
                value={data.t}
                onChange={(e) => setData({ ...data, t: +e.target.value || 0 })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">T</InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              label="En cours"
              type="number"
              fullWidth
              value={data.encours}
              onChange={(e) =>
                setData({ ...data, encours: +e.target.value || 0 })
              }
            />
          </Grid>

          {showBigBag && (
            <>
              <Grid item xs={6}>
                <TextField
                  label="BigBag Chargés"
                  type="number"
                  fullWidth
                  value={data.charges_bigbag}
                  onChange={(e) =>
                    setData({
                      ...data,
                      charges_bigbag: +e.target.value || 0,
                    })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="BigBag Vide"
                  type="number"
                  fullWidth
                  value={data.noncharges_bigbag}
                  onChange={(e) =>
                    setData({
                      ...data,
                      noncharges_bigbag: +e.target.value || 0,
                    })
                  }
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* Action */}
        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onCopy(data)}
            startIcon={<img src={copy} width={20} />}
          >
            COPY
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={alertMsg}
          action={
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          }
        />
      </Paper>
    </Box>
  );
}
