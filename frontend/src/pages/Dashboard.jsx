import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantApi } from '../utils/api';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    restaurantApi.get('/restaurants')
      .then((res) => {
        setRestaurants(res.data.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data restoran:", err);
        alert("Gagal mengambil data dari restaurant-service di Docker.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 1. Hero Section Sambutan */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Selamat Datang di Aplikasi Food Delivery Microservices 🌯
          </h1>
          <p className="mt-2 text-red-100 text-base md:text-lg max-w-2xl">
            Sistem data-driven terintegrasi penuh untuk mengelola kuliner legendaris Wrapsville secara real-time.
          </p>
        </div>
      </div>

      {/* 2. Konten Utama Kontainer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">🏪 Daftar Restoran Tersedia</h2>
            <p className="text-sm text-gray-500 mt-1">Pilih cabang terdekat untuk mulai memesan hidangan favoritmu.</p>
          </div>
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
            Total: {restaurants.length} Cabang
          </span>
        </div>

        {/* 3. State Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Memetakan koordinat restoran Docker...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
            <p className="text-gray-500 font-medium">Belum ada cabang restoran yang terdaftar di database MySQL.</p>
          </div>
        ) : (
          /* 4. Grid Kartu Restoran Premium */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((resto) => (
              <div
                key={resto.id}
                onClick={() => navigate(`/restaurant/${resto.id}`)}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Bagian Atas Kartu */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md">
                      🍔 {resto.category || 'Fast Food'}
                    </span>
                    
                    {/* Status Badge Aktif */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${resto.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${resto.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                      {resto.is_active ? 'Buka' : 'Tutup'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-200">
                    {resto.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mt-2 flex items-start gap-1">
                    <span className="text-base">📍</span> {resto.address}
                  </p>
                </div>

                {/* Bagian Bawah Kartu (Action) */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-red-50/50 transition-colors duration-200">
                  <span className="text-xs font-semibold text-gray-500">Lihat Katalog Menu</span>
                  <span className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-200 text-lg font-bold">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}