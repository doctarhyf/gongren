import imageCompression from "browser-image-compression";
import { supabase } from "./sb.config.js";

export async function uploadPhoto(file, file_name, setuploading) {
  if (file) {
    !!setuploading && setuploading(true);

    const options = {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 1920, // Maximum width or height
      useWebWorker: true, // Use web workers for better performance
    };
    const cfile = await imageCompression(file, options);
    console.log("cfile", cfile);
    const { type } = cfile;
    const ext = type.split("/")[1];
    file_name = new Date().getTime() + "." + ext;

    let { data, error } = await supabase.storage
      .from("agents_photos")
      .upload(`${file_name}`, cfile);

    if (error && error.statusCode == "409") {
      alert("Updating ...");
      const res = await supabase.storage
        .from("agents_photos")
        .update(file_name, file, {
          cacheControl: "3600",
          upsert: true,
        });

      data = res.data;
      error = res.error;
    }

    !!setuploading && setuploading(false);

    if (error) {
      console.error("Error uploading file:", error.message);
      return error;
    } else {
      console.log("File uploaded successfully:", data.Key);

      const path = supabase.storage
        .from("agents_photos")
        .getPublicUrl(data.path);

      return path;
    }
  }
}
