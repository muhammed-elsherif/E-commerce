import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import FilterNavBar from "./components/navbar/FilterNavBar";
import Hero from "./components/hero/Hero";
import SimpleSlider from "./components/Slider/Slider";
import ComplexSlider from "./components/Slider/Slider2";
import Footer from "./components/footer/Footer";
import React, { useContext, lazy } from "react";
import CardCountContext from "./contexts/CartCountContext";
import authService from "./services/authService";
import ProductSales from "./components/products/ProductSales";
import Admin from "./components/role/Admin";
// import ProductCard from "./components/product-card/product-card.component";

const ProductList = lazy(() => import("./components/products/ProductList"));

function App() {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const [cartCount] = useContext(CardCountContext);

  // Only show the home page content if we're on the home page and authenticated
  const isHomePage = location.pathname === "/";
  const showHomeContent = isHomePage && isAuthenticated;

  return (
    <div className="App">
      <FilterNavBar />
      {showHomeContent ? (
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
