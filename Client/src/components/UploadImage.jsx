import React, { useState } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import { PhotoIcon } from "@heroicons/react/24/outline";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState({});

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
    //   axios
    //     .post("http://localhost:80/reactPhp/api/user/save", formData)
    //     .then((response) => {
    //       console.log(response.data);
    //       // Handle success or display a success message
    //     })
    const response = await fetch("http://localhost:4000/api/upload/base64", {
      method: "post",
      body: formData,
      // formData.append("name", "John Doe");
      headers: {},
    });
    if (response) console.log("Image uploaded successfully:", response.data);
    // Update user's profile picture in the UI
    else console.error("Error uploading image:");
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button
          style={{ backgroundColor: "black", color: "white", padding: 4 }}
          type="submit"
        >
          Upload Image
        </button>
      </form>

      <div className="col-span-full">
        {/* <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Cover photo
        </label> */}
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    className="sr-only"
                    type="file"
                    onChange={handleFileChange}
                  />
                </label>
                {/* <p className="pl-1">or drag and drop</p> */}
              </form>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
        {/* <button
          style={{ backgroundColor: "black", color: "white", padding: 4 }}
          type="submit"
        >
          Upload Image
        </button> */}
      </div>
    </Container>
  );
};

export default UploadImage;
