import React from "react";
import { CLASS_TD } from "../helpers/flow";
import Excelexport from "../tmp-comps/Excelexport";

const fakeUserDataArray = [
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

export default function Dico() {
  return (
    <div>
      <Excelexport excelData={fakeUserDataArray} fileName={"Excel Export"} />
    </div>
  );
}
