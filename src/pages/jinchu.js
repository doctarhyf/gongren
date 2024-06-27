import React, { useState } from "react";
import imageCompression from "browser-image-compression";

function ImageCompressor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setSelectedImage(URL.createObjectURL(imageFile));

      // Set options for compression
      const options = {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true, // Use web workers for better performance
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);

        setCompressedImage(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  return (
    <div>
      <h1>Image Compressor</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <div>
          <h2>Original Image:</h2>
          <img
            src={selectedImage}
            alt="Original"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      {compressedImage && (
        <div>
          <h2>Compressed Image:</h2>
          <img
            src={compressedImage}
            alt="Compressed"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

export default function JinChu() {
  return (
    <div>
      <div>JinChu</div>
      <div>
        <ImageCompressor />
      </div>
    </div>
  );
}
