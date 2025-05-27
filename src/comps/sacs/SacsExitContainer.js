import { useEffect } from "react";

export default function SacsExitContainer({ children }) {
  useEffect(() => {
    const data = loadData();
    console.log("Data loaded:", data);
  }, []);

  function loadData() {
    // Placeholder for loading data logic
    console.log("Loading data...");
  }

  return <div className="sacs-exit-container">this is cool</div>;
}
