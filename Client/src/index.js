import React, { useState, Suspense } from "react";
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
import ProductList from "./components/products/ProductList";
import NotFound from "./pages/notFound/NotFound";
import Loader from "./components/Loader";
import Spinner from './components/spinner/spinner'
import CartCountContext from "./contexts/CartCountContext";
import CartItemContext from "./contexts/CartItemContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
  RouterProvider,
  BrowserRouter,
} from "react-router-dom";
import DeleteProduct from "./components/DeleteProduct";
import ImagesSlider from "./components/ImagesSlider";
import ProductDetails from "./components/products/ProductDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const AppRouter = () => {
  const cartCount = useState(0);
  const cartItems = useState([]);

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

  return (
    <CartCountContext.Provider value={cartCount}>
      {/* <CartItemContext.Provider value={cartItems}> */}
      <RouterProvider router={router} />
      {/* </CartItemContext.Provider> */}
    </CartCountContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="loader-container">
            <Loader />
            <Spinner />
          </div>
        }
      >
        <AppRouter />
      </Suspense>
    </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
