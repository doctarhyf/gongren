import React from "react";

export default function Loading({ isLoading: loading, center }) {
  if (!loading) return;

  return (
    <div className={` ${center && "text-center"} `}>
      <span className="loading loading-bars loading-xs"></span>
    </div>
  );
}
