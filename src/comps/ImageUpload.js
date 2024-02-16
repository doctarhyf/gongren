import React, { useEffect, useState } from "react";
import { CLASS_BTN } from "../helpers/flow";
import Loading from "./Loading";
import { supabase } from "../helpers/sb.config";

// imageCompressor.js
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const targetWidth = 280;
      const targetHeight = (image.height / image.width) * targetWidth;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        0.9
      );
    };

    image.onerror = (error) => {
      console.error("Error loading image:", error);
      reject(error);
    };

    image.src = URL.createObjectURL(file);
  });
}

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
    setError(null);
    const file = event.target.files[0];
    const allowed_types = ["image/jpeg", "image/gif", "image/png"];
    const { type } = file;

    if (!allowed_types.includes(type)) {
      setError(
        `File type: " ${type} ", not allowed!. Allowed types: ${allowed_types.join(
          ", "
        )}. Please chose a picture file!`
      );
      return;
    }

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

    const fileExtension = selectedFile.name.split(".").pop();
    const uniqueFilename = `file_${Date.now()}_${generateUniqueId()}.${fileExtension}`;

    console.log("unique file name : ", uniqueFilename);

    try {
      const compressedFile = await compressImage(selectedFile);
      const { data, error } = await supabase.storage
        .from(bucketName) // Replace with your bucket name
        .upload(fileName || uniqueFilename, compressedFile); //selectedFile);

      if (error) {
        onImageUploadError(error);
        throw error;
      }

      console.log("Image uploaded successfully:", data);

      onImageUploadSuccsess(data, uniqueFilename);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".jpg, .jpeg, .png, .gif"
      />
      <Loading isLoading={loading} />
      {error && (
        <p className="bg-red-500 text-white text-sm p-1 rounded-md m-1">
          {error}
        </p>
      )}
      {error === null && (
        <button
          className={` ${CLASS_BTN} text-xs ${loading ? "hidden" : "block"} `}
          onClick={handleUpload}
        >
          Upload Photo
        </button>
      )}
    </div>
  );
}
