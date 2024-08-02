import "./App.css";
import { Outlet } from "react-router-dom";
import FilterNavBar from "./components/navbar/FilterNavBar";
import Hero from "./components/hero/Hero";
import SimpleSlider from "./components/Slider/Slider";
import ComplexSlider from "./components/Slider/Slider2";
import Footer from "./components/footer/Footer";
import React, { useState, useEffect, useContext, lazy } from "react";
import CardCountContext from "./contexts/CartCountContext";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProductSales from "./components/products/ProductSales";
import Admin from "./components/role/Admin";
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
          <Footer />
        </>
      ) : (
        <Outlet />
      )}

    </div>
  );
}

export default App;
