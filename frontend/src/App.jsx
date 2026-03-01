import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingForm from "./pages/BookingForm";
import Favorites from "./pages/Favorites";
import MyReservations from "./pages/MyReservations";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="pt-16 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/administracion" element={<Admin />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id/booking" element={<BookingForm />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/mis-reservas" element={<MyReservations />} />
          </Routes>
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </BrowserRouter>
  );
}