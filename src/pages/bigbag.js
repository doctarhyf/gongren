import { useState } from "react";
import DateSelector from "../comps/DateSelector";
import TabCont from "../comps/TabCont";
import { BIGBAG_SECTIONS, CLASS_INPUT_TEXT, SECTIONS } from "../helpers/flow";
import FormNewBigbagTruck from "../comps/bigbag/FormNewBigbagTruck";
import ListBigbagTrucks from "../comps/bigbag/ListBigbagTrucks";
import { supabase } from "../helpers/sb.config";
import { UploadFile } from "../helpers/FileUpload";
import Loading from "../comps/Loading";

export function Bigbag() {
  const [curs, setcurs] = useState(Object.entries(BIGBAG_SECTIONS)[0]);
  const [loading, setloading] = useState(false);

  async function onSaveBibag(data) {
    //setcurs(Object.entries(BIGBAG_SECTIONS)[0]);
    setloading(true);
    console.log(data);
    //1.upload images
    const { images } = data;
    const [p1, p2, p3] = Object.values(images);
    try {
      const pp1 = await UploadFile(supabase, p1.file, "bigbag", true);
      const pp2 = await UploadFile(supabase, p2.file, "bigbag", true);
      const pp3 = await UploadFile(supabase, p3.file, "bigbag", true);

      console.log(pp1, pp2, pp3);
    } catch (e) {
      alert(`Error upload data \n `);
      setloading(false);
    }
    //2.save data
  }

  function onDataNotValid(arr) {
    console.log(arr);
    //alert(`All fields are required\n ${JSON.stringify(arr)}`);
  }

  return (
    <div>
      {loading && <Loading isLoading={true} />}
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
