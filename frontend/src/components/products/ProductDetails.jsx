import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React, { useEffect, useState, useNavigate, useContext } from "react";
import { RadioGroup } from "@headlessui/react";
import CardCountContext from "../../contexts/CartCountContext";
import CartItemContext from "../../contexts/CartItemContext";
import { productsApi } from "../../services/api";

const productD = {
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "XXL", inStock: true },
    { name: "XXXL", inStock: false },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetails = ({ clickedProduct }) => {
  const [selectedImg, setselectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productD.colors[0]);
  const [selectedSize, setSelectedSize] = useState(productD.sizes[2]);
  const [product, setProduct] = useState([]);
  // const [cartCount, setCartCount] = useContext(CardCountContext);
  // const [cartItems, setCartItems] = useContext(CartItemContext);

  // const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
  }, [clickedProduct]);

  const getProductDetails = async () => {
    try {
      const result = await productsApi.getById(clickedProduct);
      setProduct(result);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // const handleClickBuyNow = (productId) => {
  //   const isProductInCart = cartItems.some(
  //     (item) => item.productId === productId
  //   );

  //   if (!isProductInCart) {
  //     // Add the product to the cart
  //     setCartCount((prevCount) => prevCount + 1);
  //     setCartItems((prevItems) => [...prevItems, { productId }]);
  //   }
  //   console.log("cart: " + cartCount);
  //   console.log(
  //     "Product IDs:",
  //     cartItems.map((item) => item.productId)
  //   );
  // };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box sx={{ display: "flex" }}>
        {product.productPictures && product.productPictures.length > 0 && (
          <img
            width={360}
            src={`data:image/jpeg;base64,${product.productPictures[selectedImg]}`}
            alt="ProductImage"
          />
        )}
      </Box>

      <Box sx={{ py: 2, textAlign: { xs: "center", sm: "left" } }}>
        <Typography variant="h5">{product.name}</Typography>
        <Typography my={0.4} fontSize={"22px"} color={"crimson"} variant="h6">
          ${product.price}
        </Typography>
        <Typography variant="body1">{product.category}</Typography>
        <Typography variant="body2" color={"grey"}>
          {product.description}
        </Typography>
        <form>
          {/* Colors */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Color</h4>

            <RadioGroup
              value={selectedColor}
              onChange={setSelectedColor}
              className="mt-4"
            >
              <RadioGroup.Label className="sr-only">
                Choose a color
              </RadioGroup.Label>
              <span className="flex items-center space-x-3">
                {productD.colors.map((color) => (
                  <RadioGroup.Option
                    key={color.name}
                    value={color}
                    className={({ active, checked }) =>
                      classNames(
                        color.selectedClass,
                        active && checked ? "ring ring-offset-1" : "",
                        !active && checked ? "ring-2" : "",
                        "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                      )
                    }
                  >
                    <RadioGroup.Label as="span" className="sr-only">
                      {color.name}
                    </RadioGroup.Label>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        color.class,
                        "h-8 w-8 rounded-full border border-black border-opacity-10"
                      )}
                    />
                  </RadioGroup.Option>
                ))}
              </span>
            </RadioGroup>
          </div>
          {/* Sizes */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Size</h4>
              <a
                href="#"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Size guide
              </a>
            </div>

            <RadioGroup
              value={selectedSize}
              onChange={setSelectedSize}
              className="mt-4"
            >
              <RadioGroup.Label className="sr-only">
                Choose a size
              </RadioGroup.Label>
              <div className="grid grid-cols-4 gap-4">
                {productD.sizes.map((size) => (
                  <RadioGroup.Option
                    key={size.name}
                    value={size}
                    disabled={!size.inStock}
                    className={({ active }) =>
                      classNames(
                        size.inStock
                          ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                          : "cursor-not-allowed bg-gray-50 text-gray-200",
                        active ? "ring-2 ring-indigo-500" : "",
                        "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1"
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <RadioGroup.Label as="span">
                          {size.name}
                        </RadioGroup.Label>
                        {size.inStock ? (
                          <span
                            className={classNames(
                              active ? "border" : "border-2",
                              checked
                                ? "border-indigo-500"
                                : "border-transparent",
                              "pointer-events-none absolute -inset-px rounded-md"
                            )}
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                          >
                            <svg
                              className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              stroke="currentColor"
                            >
                              <line
                                x1={0}
                                y1={100}
                                x2={100}
                                y2={0}
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Stack
            sx={{ justifyContent: { xs: "center", sm: "left" } }}
            direction={"row"}
            gap={1}
            my={10}
          >
            {product.productPictures && product.productPictures.length > 0 && (
              <ToggleButtonGroup
                value={selectedImg}
                exclusive
                sx={{
                  ".Mui-selected": {
                    border: "1px solid royalblue !important",
                    borderRadius: "5px !important",
                    opacity: "1",
                    backgroundColor: "initial",
                  },
                }}
              >
                {product.productPictures.map((item, index) => {
                  return (
                    <ToggleButton
                      key={item.id}
                      value={index}
                      sx={{
                        width: "110px",
                        height: "110px",
                        mx: 1,
                        p: "0",
                        opacity: selectedImg === index ? "1" : "0.5",
                        border:
                          selectedImg === index
                            ? "1px solid royalblue"
                            : "1px solid transparent",
                        borderRadius: "5px",
                        backgroundColor:
                          selectedImg === index ? "initial" : "transparent",
                      }}
                    >
                      <img
                        onClick={() => {
                          setselectedImg(index);
                        }}
                        style={{ borderRadius: 3 }}
                        width={"50%"}
                        src={`data:image/jpeg;base64,${item}`}
                        alt=""
                      />
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            )}
          </Stack>

          <Button
            sx={{ mb: { xs: 1, sm: 0 }, textTransform: "capitalize" }}
            variant="contained"
            onClick={() => {
              // handleClickBuyNow(product._id);
              // navigate('/');
            }}
          >
            <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize="small" />
            add to cart
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ProductDetails;
