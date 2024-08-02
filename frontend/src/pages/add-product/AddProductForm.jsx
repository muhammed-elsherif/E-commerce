import React, { useState } from "react";
import {
  Box,
  Container,
  Alert,
  Snackbar,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

const Form = () => {
  const [inputs, setInputs] = useState({});
  const [isInStock, setIsInStock] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState({});
  const userValidation = JSON.parse(localStorage.getItem("user")).admin;

  const handleFileChange = (event) => {
    // setSelectedFile(event.target.files[0]);
    setSelectedFile(event.target.files);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const onSubmit = async () => {
    const price = parseFloat(inputs.price);
    const discount = parseFloat(inputs.discountPercentage);
    const discountPrice = price - (price * discount) / 100;

    const formData = new FormData();
    // formData.append("productPicture", selectedFile);
    for (let i = 0; i < selectedFile.length; i++) {
      formData.append("productPictures", selectedFile[i]);
    }
    const userId = JSON.parse(localStorage.getItem("user"))._id;

    formData.append("jsonData", JSON.stringify({ ...inputs, userId, discountPrice }));
    const response = await fetch("http://localhost:4000/add-product", {
      method: "post",
      body: formData,
      // body: JSON.stringify({ ...inputs, userId }), // Include userId in inputs
      headers: {},
    });
    const result = await response.json();
    handleClick();
    navigate("/products");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <Box>
      <Container>
        <Header
          title="Admin Product Form"
          subTitle="Add new product to the website"
        />
        {userValidation ? (
          <Box
            onSubmit={handleSubmit(onSubmit)}
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              pt: 4,
            }}
            noValidate
            autoComplete="off"
          >
            <Stack sx={{ gap: 2 }} direction={"row"}>
              <TextField
                error={Boolean(errors.name)}
                helperText={
                  Boolean(errors.name)
                    ? "This field is required & min 3 character"
                    : null
                }
                {...register("name", { required: true, minLength: 3 })}
                sx={{ flex: 1 }}
                label="Product Name"
                variant="filled"
                onChange={handleChange}
              />

              <TextField
                error={Boolean(errors.price)}
                helperText={
                  Boolean(errors.price)
                    ? "This field is required & min 3 character"
                    : null
                }
                {...register("price", { required: true })}
                sx={{ flex: 1 }}
                label="Product Price"
                variant="filled"
                onChange={handleChange}
              />
            </Stack>

            <TextField
              error={Boolean(errors.description)}
              helperText={
                Boolean(errors.description)
                  ? "Please provide a valid Description"
                  : null
              }
              {...register("description", {
                required: true,
              })}
              label="Product Description"
              variant="filled"
              onChange={handleChange}
              multiline
              rows={4}
            />

            <TextField
              error={Boolean(errors.category)}
              helperText={
                Boolean(errors.category)
                  ? "Please provide a valid email address"
                  : null
              }
              {...register("category", {
                required: true,
                // pattern: regEmail
              })}
              label="Product Category"
              variant="filled"
              onChange={handleChange}
            />

            <TextField
              error={Boolean(errors.company)}
              helperText={
                Boolean(errors.company)
                  ? "Please provide a valid Company name"
                  : null
              }
              {...register("company", {
                required: true,
                // pattern: phoneRegExp,
              })}
              label="Product Company"
              variant="filled"
              onChange={handleChange}
            />

            <TextField
              error={Boolean(errors.rating)}
              helperText={
                Boolean(errors.rating) ? "Please provide a valid number" : null
              }
              {...register("rating", {
                required: true,
              })}
              label="Product Rating"
              variant="filled"
              onChange={handleChange}
            />

            <Stack sx={{ gap: 2 }} direction={"row"}>
              <TextField
                {...register("availability")}
                select
                label="Availability"
                variant="filled"
                fullWidth
                value={isInStock ? "In Stock" : "Out of Stock"}
                onChange={(e) => setIsInStock(e.target.value === "In Stock")}
                sx={{ flex: 1 }}
              >
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </TextField>

              {isInStock && (
                <TextField
                  error={Boolean(errors.stockQuantity)}
                  helperText={
                    Boolean(errors.stockQuantity)
                      ? "Please provide a valid stock quantity"
                      : null
                  }
                  {...register("stockQuantity", { required: true })}
                  fullWidth
                  label="Stock Quantity"
                  variant="filled"
                  sx={{ flex: 1 }}
                />
              )}
            </Stack>

            <TextField
              error={Boolean(errors.discountPercentage)}
              helperText={
                Boolean(errors.discountPercentage)
                  ? "Please provide a valid discount percentage"
                  : null
              }
              {...register("discountPercentage", {
                pattern: /^\d+$/,
              })}
              label="Discount Percentage"
              variant="filled"
              onChange={handleChange}
            />

            {/* <input type="file" onChange={handleFileChange} /> */}
            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <form onSubmit={onSubmit}>
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
                          multiple
                        />
                      </label>
                    </form>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", pb: 5 }}> */}
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

            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="info"
                sx={{ width: "100%" }}
              >
                Product added successfully
              </Alert>
            </Snackbar>
            {/* </Box> */}
          </Box>
        ) : (
          <Box>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Sorry, You don't have access to this page.
            </h1>
            <a
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Go to home page.
            </a>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Form;
