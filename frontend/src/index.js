import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SignUp from "./pages/signUp/SignUp";
import Form from "./pages/add-product/AddProductForm";
import Login from "./pages/SignIn/Login";
import Logout from "./components/logout/Logout";
import UpdateProduct from "./pages/signUp/UpdateProduct";
import ShoppingCart from "./pages/cart/ShoppingCart";
import PaymentMethod from "./components/payment/Checkout";
import ProductList from "./components/products/ProductList";
import NotFound from "./pages/notFound/NotFound";
import Profile from "./pages/profile/profile";
import Loader from "./components/Loader";
import Spinner from './components/spinner/spinner'
import CartCountContext from "./contexts/CartCountContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import DeleteProduct from "./components/delete-product/DeleteProduct";
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

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="add-product" element={
          <ProtectedRoute requireAdmin>
            <Form />
          </ProtectedRoute>
        } />
        <Route path="images-slider" element={<ImagesSlider />} />
        <Route path="delete-product/:id" element={
          <ProtectedRoute requireAdmin>
            <DeleteProduct />
          </ProtectedRoute>
        } />
        <Route path="update-product/:id" element={
          <ProtectedRoute requireAdmin>
            <UpdateProduct />
          </ProtectedRoute>
        } />
        <Route path="product-details/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
            <PaymentMethod />
          </ProtectedRoute>
        } />
        <Route path="shopping-cart" element={
          <ProtectedRoute>
            <ShoppingCart />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <CartCountContext.Provider value={cartCount}>
      <RouterProvider router={router} />
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
