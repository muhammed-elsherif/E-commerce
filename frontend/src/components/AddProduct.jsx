import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Container } from "@mui/material";
import React, { useState } from "react";

export default function AddProduct() {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const onSubmit = async () => {
    if (!inputs.name || !inputs.price || !inputs.company || !inputs.category) {
      setError(true);
      return false;
    }
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    let result;
    const response = await fetch("http://localhost:4000/add-product", {
      method: "post",
      body: JSON.stringify(inputs, userId),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await response.json();
    console.log("add product: " + result);
    console.log("userId: ", userId);
    console.log(inputs);
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <div className="space-y-12 p-4">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Product
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="product-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product name
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    id="product-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && !inputs.name && <span>Enter valid name</span>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Price
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChange}
                    type="text"
                    name="price"
                    id="product-price"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && !inputs.price && <span>Enter valid price</span>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="product-category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Category
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChange}
                    id="product-category"
                    name="category"
                    type="text"
                    autoComplete="category"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && !inputs.category && (
                    <span>Enter valid category</span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="product-company"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Company
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChange}
                    type="text"
                    name="company"
                    id="product-company"
                    autoComplete="product-company"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && !inputs.company && <span>Enter valid company</span>}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </Container>
  );
}
