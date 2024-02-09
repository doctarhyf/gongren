import React, { useEffect, useState } from "react";
import { CLASS_TD } from "../helpers/flow";
import Excelexport from "../comps/Excelexport";
import { supabase } from "../helpers/sb.config";

function ImageUpload() {
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

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.storage
        .from("dico") // Replace with your bucket name
        .upload(selectedFile.name, selectedFile);

      if (error) throw error;

      console.log("Image uploaded successfully:", data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

const SBBukcet = () => {
  const [publicUrls, setPublicUrls] = useState([]);

  useEffect(() => {
    const listFilesAndGeneratePublicUrls = async () => {
      try {
        const bucketName = "dico";

        // Fetch the files in the specified bucket
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list();

        if (error) {
          console.error("Error fetching files:", error);
          return;
        }

        // Generate public URLs for each file
        const urls = files.map((file) =>
          supabase.storage.from(bucketName).getPublicUrl(file.name)
        );

        // Set the public URLs to state
        console.log(urls);
        setPublicUrls(urls);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };

    // Call the function to list files and generate public URLs
    listFilesAndGeneratePublicUrls();
  }, []); // Run once on component mount

  return (
    <div>
      <h2>Public URLs for Files:</h2>
      <ul>
        {publicUrls.map((url, index) => (
          <li key={index}>
            <a
              href={url.data.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-32 h-32 overflow-clip object-cover ">
                <img src={url.data.publicUrl} className=" object-cover" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Dico() {
  return (
    <div>
      <ImageUpload />
      <SBBukcet />
    </div>
  );
}
