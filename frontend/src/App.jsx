import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Main>
      <Footer />
    </BrowserRouter>
  );
}

