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

      const targetWidth = 50;
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
/* 
// imageUploader.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file) {
  try {
    const compressedFile = await compressImage(file);

    const { data, error } = await supabase.storage.from('your-bucket-name').upload(file.name, compressedFile);

    if (error) {
      console.error('Error uploading compressed image:', error);
      throw error;
    }

    console.log('Compressed image uploaded successfully:', data);
    return data;
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    throw error;
  }
} */

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
      const compressedFile = await compressImage(selectedFile);
      const { data, error } = await supabase.storage
        .from(bucketName) // Replace with your bucket name
        .upload(fileName || selectedFile.name, compressedFile); //selectedFile);

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
