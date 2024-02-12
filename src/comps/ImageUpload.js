import React, { useEffect, useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import Loading from "./Loading";
import { supabase } from "../helpers/sb.config";

export default function ImageUpload({
  fileName,
  onImageUploadSuccsess,
  onImageUploadError,
  onImageUploadStart,
  bucketName = "dico",
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload!");
      return;
    }

    onImageUploadStart && onImageUploadStart(selectedFile);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.storage
        .from(bucketName) // Replace with your bucket name
        .upload(fileName || selectedFile.name, selectedFile);

      if (error) {
        onImageUploadError(error);
        throw error;
      }

      console.log("Image uploaded successfully:", data);

      onImageUploadSuccsess(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Loading isLoading={loading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className={` ${CLASS_BTN} text-xs ${loading ? "hidden" : "block"} `}
        onClick={handleUpload}
      >
        Upload Photo
      </button>
    </div>
  );
}
