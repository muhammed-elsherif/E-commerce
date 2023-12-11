import {
  Box,
  Button,
  Container,
  Dialog,
  Rating,
  InputBase,
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
import { styled } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import ProductDetails from "./ProductDetails";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductList = ({ onClickBuyNow }) => {
  const [products, setProducts] = useState([]);
  const userValidation = JSON.parse(localStorage.getItem("user")).admin;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: JSON.parse(localStorage.getItem("token")),
          // authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const result = await response.json();
      if (result) {
        setProducts(result);
        console.log("Images product: " + products.productPicture);
        console.log("Products: " + products);
      }
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

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  const Search = styled("div")(({ theme }) => ({
    flexGrow: 0.4,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid #777",
    "&:hover": {
      border: "1px solid #333",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "266px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "330px",
    },
  }));

  const handleSearch = async (event) => {
    event.preventDefault();
    let key = event.target.value;
    if (key) {
      try {
        const response = await fetch(`http://localhost:4000/search/${key}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result) {
          setProducts(result);
          // console.log("Products: ", result);
          console.log("Products: ", products);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      getProducts();
    }
  };

  return (
    <Container sx={{ py: 9 }}>
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
          onChange={handleSearch}
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
          exclusive
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
            sx={{ color: theme.palette.text.primary }}
            className="myButton"
            // value={allProductsAPI}
            aria-label="left aligned"
          >
            All Products
          </ToggleButton>

          <ToggleButton
            sx={{ mx: "16px !important", color: theme.palette.text.primary }}
            className="myButton"
            // value={menCategoryAPI}
            aria-label="centered"
          >
            MEN category
          </ToggleButton>

          <ToggleButton
            sx={{ color: theme.palette.text.primary }}
            className="myButton"
            // value={womenCategoryAPI}
            aria-label="right aligned"
          >
            Women category
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

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
                      <Button sx={{ textTransform: "capitalize" }} size="large">
                        <Link to={"/delete-product/" + item._id}>delete</Link>
                      </Button>
                      <Button sx={{ textTransform: "capitalize" }} size="large">
                        <Link to={"/update-product/" + item._id}>update</Link>
                      </Button>
                    </CardActions>
                  ) : (
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button
                        onClick={() => {
                          handleClickOpen();
                          setclickedProduct(item._id);
                          onClickBuyNow(item._id);
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
            ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
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
    </Container>
  );
};

export default ProductList;
