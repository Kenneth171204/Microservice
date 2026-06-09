import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RestaurantPage from "./pages/RestaurantPage";
import Checkout from "./pages/Checkout";
import OrderPage from "./pages/OrderPage";
import DeliveryPage from "./pages/DeliveryPage";
import Navbar from './components/Navbar';

export default function App() {
  // State keranjang belanja global agar datanya bisa mengalir dari katalog ke checkout
  const [cart, setCart] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* 2. Pasang Navbar global di sini */}
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

    <Routes>
      {/* Alur 1: Auth */}
      <Route path="/login" element={<Login />} />

      {/* Alur 2: Dashboard Utama */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Alur 3: Detail Katalog Menu Restoran */}
      <Route
        path="/restaurant/:id"
        element={<RestaurantPage cart={cart} setCart={setCart} />}
      />

      {/* Alur 4: Ringkasan Belanja & Checkout Order */}
      <Route
        path="/checkout"
        element={<Checkout cart={cart} setCart={setCart} />}
      />

      {/* Alur 5: Riwayat Order & Status Pengiriman */}
      <Route path="/orders" element={<OrderPage />} />

      {/* Alur 6: Riwayat Order & Status Pengiriman */}
      <Route path="/delivery" element={<DeliveryPage />} />

      {/* Jika mengetik URL di luar daftar di atas, auto tendang ke Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </div>
  );
}
