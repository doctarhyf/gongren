import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import * as SB from "../helpers/sb";
import { TABLES_NAMES } from "../helpers/sb.config";
import ActionButton from "../comps/ActionButton";
import save from "../img/save.png";

function ImageCompressor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setSelectedImage(URL.createObjectURL(imageFile));

      // Set options for compression
      const options = {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true, // Use web workers for better performance
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);

        setCompressedImage(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  return (
    <div>
      <h1>Image Compressor</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <div>
          <h2>Original Image:</h2>
          <img
            src={selectedImage}
            alt="Original"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      {compressedImage && (
        <div>
          <h2>Compressed Image:</h2>
          <img
            src={compressedImage}
            alt="Compressed"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

function OpsLogs({}) {
  const [logs, setlogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const a = await SB.LoadAllItems(TABLES_NAMES.OPERATIONS_LOGS);
    setlogs(a.reverse());
    console.log("longs \n", a);
  }

  return (
    <div>
      {logs.map((lg, i) => (
        <div>
          <span>{i + 1}.</span> <b>{lg.mat}</b>, {lg.op} on {lg.created_at}
        </div>
      ))}
    </div>
  );
}

/*

•MATIN白班
停车内Parking intérieur : 0辆车
车已近装Camions Chargés:16辆
在车道装Camion sur la voie de changement: 3辆车
吨袋车满载/Camions Chargés(BIG BAG): 0辆
吨袋空车/Camions Non Chargés(Big Bag): 0辆
*/

export default function JinChu() {
  const SHIFTS = ["MATIN/白班", "APREM/中班", "NUIT/夜班"];
  //const [selectedShift, setSelectedShift] = useState(SHIFTS[0]);
  const [data, setData] = useState({
    shift: "MATIN/白班",
    park_int: 0,
    charges: 0,
    encours: 0,
    charges_bigbag: 0,
    noncharges_bigbag: 0,
  });

  async function onCopy(data) {
    const {
      shift,
      park_int,
      charges,
      encours,
      charges_bigbag,
      noncharges_bigbag,
    } = data;

    const text = `•${shift}
停车内Parking intérieur : ${park_int}辆车
车已近装Camions Chargés:${charges}辆
在车道装Camion sur la voie de changement: ${encours}辆车
吨袋车满载/Camions Chargés(BIG BAG): ${charges_bigbag}辆
吨袋空车/Camions Non Chargés(Big Bag): ${noncharges_bigbag}辆`;

    await navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
        alert("Text copied to clipboard");
        console.log(text);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text:!\n" + JSON.stringify(err));
      });
  }

  return (
    <div>
      <div className=" shadow-black/10  shadow-lg border border-gray-400 rounded-md p-2 max-w-fit mt-2 ">
        <div>
          <span className=" text-black mx-1   ">•SHIFT:</span>
          <select
            value={data.shift}
            onChange={(e) => setData({ ...data, shift: e.target.value })}
            className=" border border-purple-500 rounded-md outline-none "
          >
            {SHIFTS.map((sh) => (
              <option>{sh}</option>
            ))}
          </select>{" "}
        </div>
        <div>
          停车内Parking intérieur :{" "}
          <input
            value={data.park_int}
            onChange={(e) =>
              setData({ ...data, park_int: parseInt(e.target.value) })
            }
            type="text"
            size={4}
            className=" outline-none border-purple-500 border rounded-md mx-1 "
          />
          辆车
        </div>
        <div>
          车已经装Camions Chargés:{" "}
          <input
            value={data.charges}
            onChange={(e) =>
              setData({ ...data, charges: parseInt(e.target.value) })
            }
            type="text"
            size={4}
            className=" outline-none border-purple-500 border rounded-md mx-1 "
          />
          辆
        </div>
        <div>
          在车道装Camion sur la voie de changement:{" "}
          <input
            value={data.encours}
            onChange={(e) =>
              setData({ ...data, encours: parseInt(e.target.value) })
            }
            type="text"
            size={4}
            className=" outline-none border-purple-500 border rounded-md mx-1 "
          />
          辆车
        </div>
        <div>
          吨袋车满载/Camions Chargés(BIG BAG):{" "}
          <input
            value={data.charges_bigbag}
            onChange={(e) =>
              setData({ ...data, charges_bigbag: parseInt(e.target.value) })
            }
            type="text"
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
              setData({ ...data, noncharges_bigbag: parseInt(e.target.value) })
            }
            type="text"
            size={4}
            className=" outline-none border-purple-500 border rounded-md mx-1 "
          />
          辆
        </div>
      </div>

      <ActionButton icon={save} title="Save" onClick={(e) => onCopy(data)} />
    </div>
  );
}
