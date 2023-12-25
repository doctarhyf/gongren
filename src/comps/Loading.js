import React from "react";

export default function Loading({ isLoading }) {
  if (!isLoading) return;

  return <div className="text-green-500">Loading ...</div>;
}
