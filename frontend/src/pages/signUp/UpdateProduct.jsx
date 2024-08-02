import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";

const UpdateProduct = () => {
  const params = useParams();
  const [selectedFile, setSelectedFile] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [isInStock, setIsInStock] = useState(false);

  useEffect(() => {
    console.warn(params);
    getProductDetails();
    console.log(inputs);
  }, []);

  const getProductDetails = async () => {
    const response = await fetch(`http://localhost:4000/product/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result) {
      setInputs(result);
      setSelectedFile(result.productPictures);
      console.log(result.productPictures);
    }
  };

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [flag, setFlag] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
    console.log(selectedFile);
    setFlag(1);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    console.warn(inputs);
  };

  const onSubmit = async () => {
    const price = parseFloat(inputs.price);
    const discount = parseFloat(inputs.discountPercentage);
    const discountPrice = price - (price * discount) / 100;

    const formData = new FormData();
    if (selectedFile && flag) {
      // formData.append("productPictures", selectedFile);
      for (let i = 0; i < selectedFile.length; i++) {
        formData.append("productPictures", selectedFile[i]);
      }
    }
    console.warn(inputs);
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    formData.append(
      "jsonData",
      JSON.stringify({ ...inputs, userId, discountPrice })
    );
    const response = await fetch(`http://localhost:4000/product/${params.id}`, {
      method: "put",
      body: formData,
      // body: JSON.stringify({ ...inputs, userId }),
      headers: {
        // "Content-Type": "application/json",
      },
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
    <Box className="contact" id="contact">
      <Container>
      <Header
          title="Admin Product Form"
          subTitle="Update product in the website"
        />
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
              value={inputs.name || ""}
              error={Boolean(errors.name)}
              helperText={
                Boolean(errors.name)
                  ? "This field is required & min 3 character"
                  : null
              }
              {...register("name", { minLength: 3 })}
              sx={{ flex: 1 }}
              label="Product Name"
              variant="filled"
              onChange={handleChange}
            />

            <TextField
              value={inputs.price || ""}
              error={Boolean(errors.price)}
              helperText={
                Boolean(errors.price)
                  ? "This field is required & min 3 character"
                  : null
              }
              {...register("price")}
              sx={{ flex: 1 }}
              label="Product Price"
              variant="filled"
              onChange={handleChange}
            />
          </Stack>

          <TextField
            value={inputs.description || ""}
            error={Boolean(errors.company)}
            helperText={
              Boolean(errors.company)
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
            value={inputs.category || ""}
            error={Boolean(errors.category)}
            helperText={
              Boolean(errors.category)
                ? "Please provide a valid email address"
                : null
            }
            {...register("category", {
              // pattern: regEmail
            })}
            label="Product Category"
            variant="filled"
            onChange={handleChange}
          />

          <TextField
            value={inputs.company || ""}
            error={Boolean(errors.company)}
            helperText={
              Boolean(errors.company)
                ? "Please provide a valid Company name"
                : null
            }
            {...register("company", {
              // pattern: phoneRegExp,
            })}
            label="Product Company"
            variant="filled"
            onChange={handleChange}
          />

          <TextField
            value={inputs.rating || ""}
            error={Boolean(errors.rating)}
            helperText={
              Boolean(errors.rating) ? "Please provide a valid number" : null
            }
            {...register("rating", {
              // required: true,
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
            value={inputs.discountPercentage || ""}
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

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <p>Product Image</p>
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
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </Stack>
            {inputs.productPictures &&
              inputs.productPictures.map((item) => {
                return (
                  <img
                    key={item.id}
                    src={`data:image/jpeg;base64,${item}`}
                    alt="productImage"
                    width="200px"
                  />
                );
              })}
          </Stack>
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
              Update Product
            </button>
          </div>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
              Product updated successfully
            </Alert>
          </Snackbar>
          {/* </Box> */}
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateProduct;
