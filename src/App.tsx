import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/user/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<h1 className="p-8">404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
