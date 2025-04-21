import {
  Box,
  Button,
  Container,
  Dialog,
  Rating,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { SearchIconWrapper, StyledInputBase, Search } from "../Search.styles";
import { Close } from "@mui/icons-material";
import ProductDetails from "./ProductDetails";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useProducts from "../../hooks/useProducts";
import useProductsSearch from "../../hooks/useProductsSearch";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cart/cart.actions";
import { productsApi } from "../../services/api";


const ProductList = () => {
  const [searchParams, setSearchParams] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const userValidation = JSON.parse(localStorage.getItem("user"))?.admin || false;
  const allProductsAPI = "all";
  const menCategoryAPI = "Men";
  const womenCategoryAPI = "Women";
  const productsQuery = useProducts();
  const products = Array.isArray(productsQuery.data) ? productsQuery.data : [];
  const [category, setCategory] = useState(allProductsAPI);

  const productsSearchQuery = useProductsSearch(searchParams);
  const productsSearch = Array.isArray(productsSearchQuery.data) ? productsSearchQuery.data : [];

  const dispatch = useDispatch();

  // Filter products based on the selected category
  const filteredProducts = (event, newValue) => {
    if (newValue !== null) {
      setCategory(newValue);
    }
    return category === allProductsAPI
      ? products
      : products.filter((product) => product.category === category);
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const getProducts = async () => {
    try {
      const result = await productsApi.getAll();
      console.log("Products: ", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [clickedProduct, setclickedProduct] = useState({});

  const handleSearch = async (event) => {
    event.preventDefault();
    const key = event.target.value;
    setSearchParams(key);
    if (key) {
      try {
        const result = await productsApi.search(key);
        console.log("Products: ", result);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      getProducts();
    }
  };

  const handleSearchChange = (event) => {
    const input = event.target.value;
    const newPosition = input.selectionStart + input.selectionEnd;
    setSearchParams(input.value);
    setCursorPosition(newPosition);
  };

  if (productsQuery.isLoading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  if (productsQuery.isError) {
    return <div>Error: {productsQuery.error.message}</div>;
  }

  return (
    <Container sx={{ py: 9 }}>
      {products && (
        <div>
          {userValidation ? (
            <Stack direction={"row"} justifyContent={"flex-end"} mt={3}>
              <Button
                variant="contained"
                component={Link}
                to="/add-product"
                color="primary"
              >
                Add Product
              </Button>
            </Stack>
          ) : (
            <>
              <Search
                sx={{
                  display: "flex",
                  borderRadius: "22px",
                  justifyContent: "space-between",
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchParams}
                  onChange={handleSearchChange}
                  onFocus={(e) =>
                    e.target.setSelectionRange(cursorPosition, cursorPosition)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                />
              </Search>

              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
                gap={3}
              >
                <Box>
                  <Typography variant="h6">Selected Products</Typography>
                  <Typography fontWeight={300} variant="body1">
                    All our new arrivals in a exclusive brand selection
                  </Typography>
                </Box>

                <ToggleButtonGroup
                  color="error"
                  value={category}
                  exclusive
                  onChange={filteredProducts}
                  aria-label="text alignment"
                  sx={{
                    ".Mui-selected": {
                      border: "1px solid rgba(233, 69, 96, 0.5) !important",
                      color: "#e94560",
                      backgroundColor: "initial",
                    },
                  }}
                >
                  <ToggleButton
                    sx={{ color: "blue" }}
                    className="myButton"
                    value="all"
                    aria-label="left aligned"
                  >
                    All Products
                  </ToggleButton>

                  <ToggleButton
                    sx={{ color: "blue" }}
                    className="myButton"
                    value="Men"
                    aria-label="centered"
                  >
                    MEN category
                  </ToggleButton>

                  <ToggleButton
                    sx={{ color: "blue" }}
                    className="myButton"
                    value="Women"
                    aria-label="right aligned"
                  >
                    Women category
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </>
          )}

          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
          >
            <AnimatePresence>
              {products.length > 0 ? (
                products.map((item) => {
                  return (
                    <Card
                      component={motion.section}
                      layout
                      initial={{ transform: "scale(0)" }}
                      animate={{ transform: "scale(1)" }}
                      transition={{
                        duration: 1.6,
                        type: "spring",
                        stiffness: 50,
                      }}
                      key={item._id}
                      sx={{
                        // maxWidth: 333,
                        width: 333,
                        mt: 6,
                        ":hover .MuiCardMedia-root ": {
                          rotate: "1deg",
                          scale: "1.1",
                          transition: "0.35s",
                        },
                      }}
                    >
                      <CardMedia
                        sx={{ height: 277 }}
                        image={`data:image/jpeg;base64,${item.productPictures[0]}`}
                        // <img src={`data:image/jpeg;base64,${user.profilePicture}`} width="200px" alt="Profile" />
                        title="green iguana"
                        onClick={() => {
                          handleClickOpen();
                          setclickedProduct(item._id);
                        }}
                      />

                      <CardContent>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Typography gutterBottom variant="h6" component="div">
                            {item.name}
                          </Typography>

                          <Typography variant="subtitle1" component="p">
                            {item.price}
                          </Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {item.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.company}
                        </Typography>
                      </CardContent>
                      {userValidation ? (
                        <CardActions sx={{ justifyContent: "space-between" }}>
                          <Button
                            sx={{ textTransform: "capitalize" }}
                            size="large"
                          >
                            <Link to={"/delete-product/" + item._id}>
                              delete
                            </Link>
                          </Button>
                          <Button
                            sx={{ textTransform: "capitalize" }}
                            size="large"
                          >
                            <Link to={"/update-product/" + item._id}>
                              update
                            </Link>
                          </Button>
                        </CardActions>
                      ) : (
                        <CardActions sx={{ justifyContent: "space-between" }}>
                          <Button
                            onClick={() => {
                              handleClickOpen();
                              setclickedProduct(item._id);
                              handleAddToCart(item);
                            }}
                            sx={{ textTransform: "capitalize" }}
                            size="large"
                          >
                            {/* <Link to={"/product-details/" + item._id}> */}
                            <AddShoppingCartOutlinedIcon
                              sx={{ mr: 1 }}
                              fontSize="small"
                            />
                            add to cart
                            {/* </Link> */}
                          </Button>
                          <Rating
                            precision={0.1}
                            name="read-only"
                            value={item.rating}
                            readOnly
                          />
                        </CardActions>
                      )}
                    </Card>
                  );
                })
              ) : (
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  fontWeight="bold"
                  sx={{
                    mt: 6,
                    py: 3,
                    backgroundColor: "#f5f5f5",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  No products found.
                </Typography>
              )}
            </AnimatePresence>
          </Stack>

          <Dialog
            sx={{ ".MuiPaper-root": { minWidth: { xs: "100%", md: 800 } } }}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <IconButton
              sx={{
                ":hover": {
                  color: "red",
                  rotate: "180deg",
                  transition: "0.3s",
                },
                position: "absolute",
                top: 0,
                right: 10,
              }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>

            <ProductDetails clickedProduct={clickedProduct} />
          </Dialog>
        </div>
      )}
    </Container>
  );
};

export default ProductList;
