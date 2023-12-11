import "./App.css";
import { Outlet } from "react-router-dom";
import FilterNavBar from "./components/FilterNavBar";
import Checkout from "./components/payment/Checkout";
import Hero from "./components/hero/Hero";
import SimpleSlider from "./components/Slider/Slider";
import ComplexSlider from "./components/Slider/Slider2";
import ProductList from "./components/main/ProductList";
import Footer from "./components/Footer";
import FileUploadForm from "./components/testBlob";
import React, { useState, useEffect } from "react";
import { Component } from "react";
import { useLocation } from "react-router-dom";
import { Buffer } from "buffer";

function App() {
  const location = useLocation();
  const auth = localStorage.getItem("user");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const counters = JSON.parse(localStorage.getItem("cartCounts"));
    if (counters) {
      setCartCount(counters);
    }
  }, []);

  useEffect(() => {
    if (cartCount) {
      localStorage.setItem("cartCounts", JSON.stringify(cartCount));
    }
  }, [cartCount]);

  const [user, setUser] = useState({});

  const handleClickBuyNow = (productId) => {
    const isProductInCart = cartItems.some(
      (item) => item.productId === productId
    );

    if (!isProductInCart) {
      // Add the product to the cart
      setCartCount((prevCount) => prevCount + 1);
      setCartItems((prevItems) => [...prevItems, { productId }]);
    }
    console.log("cart: " + cartCount);
    console.log(
      "Product IDs:",
      cartItems.map((item) => item.productId)
    );
  };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/retrieve/base64",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result) {
        setUser(result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const base64Image = Buffer.from(user.profilePicture.data).toString("base64");
  // const imageSrc = `data:image/jpeg;base64,${base64Image}`;

  // const bufferImage = user.profilePicture;
  //   const blob = new Blob([bufferImage], { type: "image/jpeg" });
  //   const imageUrl = URL.createObjectURL(blob);
  //   console.log(imageUrl);
  return (
    <div className="App">
      <FilterNavBar count={cartCount} />
      {auth && location.pathname === "/" ? (
        <>
          <Hero />
          <SimpleSlider />
          <br />
          <br />
          <br />
          <br />
          <ComplexSlider /> <ProductList onClickBuyNow={handleClickBuyNow} />
          {/* <Checkout cartItems={cartItems} /> */}
        </>
      ) : (
        <Outlet />
      )}
      {/* <FileUploadForm /> */}
      {/* <div>
        <img src={`data:image/jpeg;base64,${user.profilePicture.data}`} width="200px" alt="Profile" />
        {imageUrl && <img src={imageUrl} width="200px" alt="Profile" />}
      </div> */}
      {/* <NavBar /> */}
      {/* <Form /> */}
      <Footer />
    </div>
  );
}

export default App;