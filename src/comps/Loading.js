import React from "react";

export default function Loading({ isLoading: loading }) {
  if (!loading) return;

  return (
    <div className="text-center">
      <span className="loading loading-bars loading-xs"></span>
    </div>
  );
}
