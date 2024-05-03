import "./App.css";
import { Outlet } from "react-router-dom";
import FilterNavBar from "./components/FilterNavBar";
import Hero from "./components/hero/Hero";
import SimpleSlider from "./components/Slider/Slider";
import ComplexSlider from "./components/Slider/Slider2";
import Footer from "./components/Footer";
import React, { useState, useEffect, useContext, lazy } from "react";
import CardCountContext from "./contexts/CartCountContext";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProductSales from "./components/products/ProductSales";
// import ProductCard from "./components/product-card/product-card.component";

const ProductList = lazy(() => import("./components/products/ProductList"));

function App() {
  // const dispatch = useDispatch();
  const location = useLocation();
  const auth = localStorage.getItem("user");
  const [cartCount] = useContext(CardCountContext);

  useEffect(() => {
    if (cartCount) {
      localStorage.setItem("cartCounts", JSON.stringify(cartCount));
    }
  }, [cartCount]);

  const [user, setUser] = useState({});

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
      <FilterNavBar />
      {auth && location.pathname === "/" ? (
        <>
          <Hero />
          {/* https://blackbox.ai/share/331c5926-1923-4a84-a628-c092e0bec58f */}
          {/* <SimpleSlider />
          <br />
          <br />
          <br />
          <br />
          <ComplexSlider /> */}
          <ProductSales />
          <ProductList />
          {/* <ProductCard /> */}
          {/* <Checkout cartItems={cartItems} /> */}
          <Footer />
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
    </div>
  );
}

export default App;
