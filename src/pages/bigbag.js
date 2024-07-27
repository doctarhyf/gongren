import { useState } from "react";
import DateSelector from "../comps/DateSelector";
import TabCont from "../comps/TabCont";
import { BIGBAG_SECTIONS, CLASS_INPUT_TEXT, SECTIONS } from "../helpers/flow";
import FormNewBigbagTruck from "../comps/bigbag/FormNewBigbagTruck";
import ListBigbagTrucks from "../comps/bigbag/ListBigbagTrucks";
import { supabase, TABLES_NAMES } from "../helpers/sb.config";
import * as SB from "../helpers/sb";
import { UploadFile } from "../helpers/FileUpload";
import Loading from "../comps/Loading";

export function Bigbag() {
  const [curs, setcurs] = useState(Object.entries(BIGBAG_SECTIONS)[0]);
  const [loading, setloading] = useState(false);

  async function onSaveBibag(data) {
    //setcurs(Object.entries(BIGBAG_SECTIONS)[0]);
    setloading(true);
    //console.log(data);

    const { plaque, t, date, time, images, bags, equipe } = data;
    const [img1, img2, img3] = Object.values(images);
    try {
      //1.upload images
      const pms1 = await UploadFile(supabase, img1.file, "bigbag", true);
      const pms2 = await UploadFile(supabase, img2.file, "bigbag", true);
      const pms3 = await UploadFile(supabase, img3.file, "bigbag", true);
      //2.save data
      const photos = [pms1.publicUrl, pms2.publicUrl, pms3.publicUrl];
      console.log("photos => ", photos);
      const bigbag = {
        plaque: plaque.toUpperCase(),
        t: parseInt(t),
        bags: parseInt(bags),
        photos: photos,
        date: date,
        time: time,
        stat: "",
        equipe: equipe,
      };
      //console.log(pms1, pms2, pms3);

      const r = await SB.InsertItem(TABLES_NAMES.BIGBAG, bigbag);
      console.log("bigbag \n", bigbag);
      console.log("bigbag insert result => ", r);
      setcurs(Object.entries(BIGBAG_SECTIONS)[0]);
      alert("Data saved!");
    } catch (e) {
      alert(`Error upload data \n ${JSON.stringify(e)} `);
      setloading(false);
    }

    setloading(false);
  }

  function onDataNotValid(arr) {
    console.log(arr);
    //alert(`All fields are required\n ${JSON.stringify(arr)}`);
  }

  return loading ? (
    <Loading isLoading={true} />
  ) : (
    <div>
      <TabCont
        tabs={BIGBAG_SECTIONS}
        onSelectTab={(e) => setcurs(e)}
        selectedIndex={0}
      />
      {curs[0] === BIGBAG_SECTIONS.NEW.label && (
        <FormNewBigbagTruck
          onSaveBibag={onSaveBibag}
          onDataNotValid={onDataNotValid}
          onCancel={(e) => setcurs(Object.entries(BIGBAG_SECTIONS)[0])}
        />
      )}
      {curs[0] === BIGBAG_SECTIONS.BIGBAG.label && <ListBigbagTrucks />}
    </div>
  );
}
