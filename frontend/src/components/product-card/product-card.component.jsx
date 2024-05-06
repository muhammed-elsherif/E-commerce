// import { useDispatch, useSelector } from "react-redux";

// import { selectCartItems } from "../../store/cart/cart.selector";
// import { addItemToCart } from "../../store/cart/cart.action";

// import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";

import {
  ProductCartContainer,
  Footer,
  Name,
  Price,
} from "./product-card.styles";

import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";

const ProductCard = ({ product }) => {
  // const { name, price, imageUrl } = product;
  const [products, setProducts] = useState([]);
  // const cartItems = useSelector(selectCartItems);
  // const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(true);

  // const addProductToCart = () => dispatch(addItemToCart(cartItems, product));

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
        setIsLoading(false);
        console.log("Images product: " + products.productPicture);
        console.log("Products: " + products);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {products.length > 0 ? (
        products.map((item) => {
          return (
            <ProductCartContainer>
              <img
                src={`data:image/jpeg;base64,${item.productPictures[0]}`}
                alt={`${item.name}`}
              />
              <Footer>
                <Name>{item.name}</Name>
                <Price>{item.price}</Price>
              </Footer>
              <Button>Add to card</Button>
            </ProductCartContainer>
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
    </div>
  );
};

export default ProductCard;
