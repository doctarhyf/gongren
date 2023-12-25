import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className=" h-[100vh] ">
      <section className="bg-sky-500 h-full w-44">
        <div className="text-white  border-b pb-4 text-3xl p-2 text-center">
          工人管理
        </div>
        <div>
          <ul className="text-end p-2">
            {[...Array(5)].map((it, i) => (
              <li className="mb-2" key={i}>
                <button className="text-right cursor-pointer hover:text-sky-500 hover:bg-white w-full  rounded-md p-2 ">
                  Item
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default App;
