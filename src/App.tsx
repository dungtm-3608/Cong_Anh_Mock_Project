import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CategoryProductsPage from "./pages/user/CategoryProductsPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import HomePage from "./pages/user/HomePage";
import OrderDetailPage from "./pages/user/OrderDetailPage";
import OrdersPage from "./pages/user/OrdersPage";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import ProductsPage from "./pages/user/ProductsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route
          path="/danh-muc/:categorySlug"
          element={<CategoryProductsPage />}
        />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/don-hang" element={<OrdersPage />} />
        <Route path="/don-hang/:orderId" element={<OrderDetailPage />} />
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
