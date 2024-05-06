import React, { useEffect, useState } from "react";
import axios from "axios";

const FileUploadForm = () => {
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/getImage/blob",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result) {
        // setImageData(response.data.imageData);
        setImageData(response);
        console.log("Images: " + imageData.profilePicture);
        console.log("response: " + response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await fetch("http://localhost:4000/api/upload/blob", {
        method: "post",
        body: formData,
        headers: {
          // "Content-Type": "multipart/form-data",
        },
      });
      const result = await response.json();
      console.log("add product: " + result);
      console.log("File uploaded successfullyyyyy");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {imageData && <img src={`data:image/jpeg;blob,${imageData.profilePicture.data}`} alt="Blob Image" />}
    </div>
  );
};

export default FileUploadForm;
