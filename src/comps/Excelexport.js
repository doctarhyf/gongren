import React, { useContext } from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import ButtonPrint from "./ButtonPrint";
import excel from "../img/excel.png";
import { GetTransForTokensArray, LANG_TOKENS } from "../helpers/lang_strings";
import { UserContext } from "../App";

let sampleData = [
  {
    firstName: "John",
    lastName: "Doe",
    employeeCode: "ABC123",
    mobileNo: "123-456-7890",
    dob: "1990-05-15",
    address: "123 Main Street, Cityville, State, 12345",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    employeeCode: "XYZ789",
    mobileNo: "987-654-3210",
    dob: "1985-08-22",
    address: "456 Oak Avenue, Townsville, State, 56789",
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    employeeCode: "DEF456",
    mobileNo: "555-123-4567",
    dob: "1988-11-10",
    address: "789 Pine Road, Villagetown, State, 67890",
  },
  {
    firstName: "Alice",
    lastName: "Williams",
    employeeCode: "GHI789",
    mobileNo: "111-222-3333",
    dob: "1992-03-25",
    address: "101 Cedar Lane, Hamletville, State, 98765",
  },
  {
    firstName: "Charlie",
    lastName: "Brown",
    employeeCode: "JKL012",
    mobileNo: "777-888-9999",
    dob: "1980-07-05",
    address: "202 Elm Street, Boroughburg, State, 54321",
  },
];

/* sampleData = [
  [1, "cool", "可以"],
  [2, "12312321", "sdasdsasd"],
]; */

export default function Excelexport({
  excelData,
  fileName = "Excel Export",
  title,
}) {
  const [, , user] = useContext(UserContext);
  title = !title
    ? GetTransForTokensArray(LANG_TOKENS.DOWNLOAD_EXCEL, user.lang)
    : title;
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const filexExtension = ".xlsx";
  const excel_icon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAdhAAAHYQGVw7i2AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABhdJREFUeJztm2tsU2UYgJ/Tru0u7dZurNu6cR1sWSYGHAJzQkAuclHjuMMPSYzGv14SYoKQCRgw3hHFKBCMSjSihMjdAKJEIjLdxl3ulzG2lXa9rt3pxR+Ehq1no2Utp2R9/p3vfOf93vfp16/ntF8hSd9GuI9rtMAIIDXGuUhRC1jjOUBUAtL7pVdkV2RuKZycP0RQCSnxSgrAft7Jzd2tVywX2kYB5niNE5WA3FHZO8Z8OGKmoLifiRMdt/61YkwzUrvxeMO1I42TiJMERTSdU3Qq7YMo/g4anYbnN0x7tGis6QCQH48xohIgBxqdmuqN04cXjTXtIw4SEl4AxFfCQyEA4ifhoREA8ZGQsAIEhUDQFwx0bdfo1FRvmDa8aLRpF9Cvt+MkrABNjhpbo90heS5TQ/WmaSOLRpv20UsJCSsgozCdxromSQEQOwkJKwABBAMayzmrv7susZCQuAKAAXMLcw99eKTZ1eIOdtentxISWoAiRaD0tcGm/Wt+bzr+/Rmbzys9GXojIa4PNLFAmaqk9NUhJtt/jo69Kw82Cn6FT52WImkic3BGjt6S9WPbedvESOMnvIA7ZJXo1FklusJ79bMus19qO2+LOG5CvwUeBEkBcicgN0kBcicgN0kBcicgN0kBcicgN0kBcicgN0kBcicgNz09DQ4DBt7d4Gn1GFqPWeKb0T1Iz08loyg9ZvEkBWQMS/vWMD5rhtqoMnQ919Ict98pI8J/NoDSqaD8lZKYxJMSMMwwPmtGzlP6sOITBdsfDlzX3TGZCVJrQKGmQJ2wxQMo+ynxtHpjEqvPL4J9XkCP3wkO1A1icdmLYe07Lm9HrzFQmV/FuoZPsHnbAKgwPs70QTP5rH4tVq8FjTKVqQOepiy7HF/AR4O5jgPX9xMI+pk56DkqjKPCYq84ujw07pcn13PT1RSjUqXpcQbkphuZNXQuek34kvB3819UmcZRM2YVAHqNgXerPsAlurB6LeSl57N15nbeeOxN9Bo9+Rn5rKhczZqq9wCoMI5i6sBpPY6brcnubX33JKJvhTec/IJTlpNh7UsOv87mKd8xq3gOlQVVtLS3sK7+YwCWj1lBqjKVWTufweK5BcAA3UCUgjJ0vcVjYcXR5bGo476JSMBT/SdTll0OQLuvnV2XfwHgxK0G1h//lKWja/D4PCzYMwsxIJKbZqSqYBzr6j8JFQ9w1XGlU1ytSsvsofNCx+faztJgru91UdEQkYBJ/afi8XkAsHotIQEApywnUQpKHB122ry3d7TpNXoAGp3XeoyrVeuYM3R+6HjH5e2JKWDpn0sk3wLZqTmsrFzDzxe28kTBkywb/TZLDr/ODVcjYkCkPGc4u6/s7DbuTVcTC/fMvv/sY0BEAvQaA7lpxtCx2+fGLbqoGbMKu9fGu8feoTynnA2Tvqa6eDbbLvzEtgtbmV+yiNOWU+y9ugulkMK8YQto97Wz9fwPACgERae4cHuGdTdum9eKGBB7VXBXIhLw+cSvOh1/c2Yz5nYzTxQ8yQv7FuL1e/inpZbNpzexpGIpda11vF+7BrVCzcrK1dSMXYWAgD/oY239R6E4Rdr+/Fp9qFPsRXvmdDvuS/sXc6z5aNRF9oTUpr8JxW8NOKgtS0elUEl+BLp9bnRqHf6An9b2llC7UlBSkGHC0WHH1nH797mCDBOlhjJ8AZEGcx32DjsAWpWOtJS0sNhWrwUBQXLcOzPAedpNXl4/ckaG9zm27MShpoPNEyKsv+cZIAbETgXejUt0hrX5g36ud1n4mlw3aHLdCOvrFB04xW43gHQ7bqzp87fCUgK8QTHge+CZRIMIClVsXjupKMcth+0X6XZTirwEA+A+7UFXrI1JPKk1wOk6277o4uqrNSk5Kt3dJxQBRWlmcUZcNi1HStAbpGT2IFLSlPfuHAGSi6BoFmtFs/hs1/aCiXm/PfJyqawCYk1yEZQ7AblJCpA7AblJCpA7AblJCoims+gQncFAgt4iAsFAENHeEf6U1gNR/3HSMDJzS9GUvCGCWpFQ22yDHQHftX03L7XVORa6ze7aSK9L9L/ORoMHqAOimgFJ+jr/A6eSCjNPjDMcAAAAAElFTkSuQmCC";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData || sampleData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + filexExtension);
  };

  return (
    <div className="  ">
      <div className={` ${excelData ? "block" : "hidden"} `}>
        <ButtonPrint
          icon={excel_icon}
          title={title}
          onClick={(e) => exportToExcel(fileName)}
        />
      </div>
      <div
        className={`text-xs text-white bg-red-500 rounded-md p-1 ${
          !excelData ? "block" : "hidden"
        } `}
      >
        NO EXCEL DATA
      </div>
    </div>
  );
}
