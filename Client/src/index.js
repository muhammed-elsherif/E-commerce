import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SignUp from "./components/signUp/SignUp";
import Form from "./components/AddProductForm";
import Login from "./components/SignIn/Login";
import Logout from "./components/Logout";
import PrivateComponent from "./components/PrivateComponent";
import UpdateProduct from "./components/UpdateProduct";
import ShoppingCart from "./components/ShoppingCart";
import PaymentMethod from "./components/payment/Checkout";
import ProductList from "./components/main/ProductList";
import NotFound from "./pages/notFound/NotFound";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import DeleteProduct from "./components/DeleteProduct";
import ImagesSlider from "./components/ImagesSlider";
import ProductDetails from "./components/main/ProductDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<PrivateComponent />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="add-product" element={<Form />} />
      <Route path="images-slider" element={<ImagesSlider />} />
      <Route path="delete-product/:id" element={<DeleteProduct />} />
      <Route path="update-product/:id" element={<UpdateProduct />} />
      <Route path="product-details/:id" element={<ProductDetails />} />
      <Route path="products" element={<ProductList />} />
      <Route path="checkout" element={<PaymentMethod />} />
      <Route path="shopping-cart" element={<ShoppingCart />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
