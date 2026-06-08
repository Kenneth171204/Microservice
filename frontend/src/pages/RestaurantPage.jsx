import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../utils/api';

export default function RestaurantPage({ cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil seluruh data restoran untuk memfilter info nama/alamat cabang
    const fetchRestaurantInfo = restaurantApi.get('/restaurants');
    // 2. Ambil katalog menu spesifik berdasarkan parameter ID restoran (Mengikuti rute asli backend)
    const fetchMenuCatalog = restaurantApi.get(`/restaurants/${id}/menus`);

    Promise.all([fetchRestaurantInfo, fetchMenuCatalog])
      .then(([restoRes, menuRes]) => {
        // Ambil array daftar semua restoran
        const allRestaurants = restoRes.data.data || restoRes.data;
        // Cari restoran yang ID-nya cocok dengan parameter URL
        const targetResto = allRestaurants.find(r => r.id === parseInt(id));
        
        if (targetResto) {
          setRestaurant(targetResto);
        } else {
          // Fallback info darurat jika id restoran tidak singkron di database
          setRestaurant({ name: "Wrapsville Gresik Pusat", address: "Menganti, Gresik", category: "Fast Food" });
        }

        // Set daftar menu makanan asli yang diambil dari backend (port 8002/restaurants/:id/menus)
        const activeMenus = menuRes.data.data || menuRes.data || [];
        
        // Pemetaan struktur: ubah properti 'id' bawaan database menu menjadi 'menu_id' agar cocok dengan payload order-service
        const mappedMenus = activeMenus.map(item => ({
          menu_id: item.id,
          name: item.name,
          price: parseInt(item.price),
          description: item.description
        }));

        setMenus(mappedMenus);
      })
      .catch((err) => {
        console.error("Gagal memuat katalog restoran:", err);
        alert("⚠️ Gagal sinkronisasi dengan restaurant-service Docker!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Fungsi andalan menyuntikkan makanan ke state keranjang global App.jsx
  const handleAddToCart = (menu) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.menu_id === menu.menu_id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.menu_id === menu.menu_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...menu, quantity: 1 }];
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-50">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Memasak katalog menu Wrapsville...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Detail Restoran Banner */}
      <div className="bg-white border-b border-gray-200 py-8 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2.5 py-1 rounded-md">
                🏪 {restaurant?.category || 'Fast Food'}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live System
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mt-3">
              {restaurant?.name || 'Wrapsville Cabang'}
            </h1>
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-1.5">
              <span className="text-base">📍</span> {restaurant?.address || 'Alamat Cabang'}
            </p>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="self-start md:self-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            ← Ganti Cabang
          </button>
        </div>
      </div>

      {/* Area Katalog Menu Makanan */}
      <div className="max-w-5xl mx-auto px-4 mt-10">
        <h2 className="text-xl font-black text-gray-800 tracking-tight mb-6">🌯 Pilihan Menu Makanan Terbaik</h2>
        
        {menus.length === 0 ? (
          <div className="text-center bg-white border rounded-xl p-10 shadow-sm text-gray-500">
            Belum ada menu yang dimasukkan ke dalam cabang ini.
            <p className="text-xs text-blue-500 mt-2">💡 Gunakan POST /restaurants/:restaurantId/menus via Postman!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menus.map((menu) => {
              const currentQty = cart.find(item => item.menu_id === menu.menu_id)?.quantity || 0;
              
              return (
                <div 
                  key={menu.menu_id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-lg text-gray-800 tracking-tight">{menu.name}</h3>
                      <span className="font-black text-red-600 text-lg shrink-0">
                        Rp {menu.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2 flex-grow leading-relaxed">
                      {menu.description || 'Hidangan lezat racikan bumbu rahasia dari tim dapur Wrapsville.'}
                    </p>
                  </div>

                  {/* Tombol Eksekusi Tambah Keranjang */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-400">
                      {currentQty > 0 ? `Sudah ditambahkan: ${currentQty}x` : 'Belum ada di keranjang'}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(menu)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all duration-200 flex items-center gap-2 ${
                        currentQty > 0 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      <span>{currentQty > 0 ? '✓ Tambah Lagi' : '➕ Tambahkan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Banner */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-8 z-40 max-w-md w-11/12 border border-gray-800">
          <div>
            <p className="text-xs text-gray-400 font-medium">Keranjang Belanja Kamu</p>
            <p className="text-sm font-black text-orange-400">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Item Pilihan
            </p>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="ml-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition shadow-md"
          >
            Lanjut Bayar →
          </button>
        </div>
      )}
    </div>
  );
}