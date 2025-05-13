import { STOCK_RESET_PWD, STOCK_TYPE } from "../../helpers/flow";

export default function Stock({ id, stock, label, onResetStock }) {
  return (
    <div className=" py-4 border rounded-md p-1 bg-slate-200 shadow-md flex flex-col gap-2">
      <div className=" font-bold  "> STOCK {label}</div>

      <div className=" flex flex-col ">
        <div>
          {" "}
          <span className=" bg-green-500 text-white text-xs p-1 rounded-md font-bold  ">
            32.5n
          </span>{" "}
          :<span className="  text-4xl text-pretty  "> {stock.s32}</span>{" "}
        </div>
        <div>
          {" "}
          <span className=" bg-black text-white text-xs p-1 rounded-md font-bold  ">
            42.5n
          </span>{" "}
          : <span className="  text-4xl text-pretty  ">{stock.s42}</span>{" "}
        </div>
      </div>

      {onResetStock && (
        <button
          onClick={(e) => {
            // Prompt the user to enter the password
            let password = prompt("Please enter your password before reset!");

            // Check if the password is correct
            if (password === STOCK_RESET_PWD) {
              // Execute the function if the password is correct
              onResetStock(id);
            } else {
              // Alert the user if the password is incorrect
              alert("Incorrect password. Please try again.");
            }
          }}
          className="p-1 text-sm hover:bg-sky-500 hover:text-white text-sky-500 rounded-md"
        >
          RESET
        </button>
      )}
    </div>
  );
}
