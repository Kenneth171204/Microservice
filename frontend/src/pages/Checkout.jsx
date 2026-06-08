import { useNavigate } from 'react-router-dom';
import { orderApi } from '../utils/api';

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  // Hitung total harga dari item yang ada di keranjang belanja
  const totalHarga = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fungsi pengeksekusi transaksi ke order-service Docker (Port 8003)
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjangmu masih kosong, Yos!");

    const payload = {
      user_id: parseInt(userId) || 1, // Fallback ke ID 1 jika belum login auth
      restaurant_id: 1, 
      items: cart.map(item => ({
        menu_id: item.menu_id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await orderApi.post('/orders', payload);
      alert(`🎉 Order Berhasil! Total Bayar: Rp ${response.data.total_price || totalHarga}`);
      
      setCart([]); // Bersihkan keranjang belanja setelah sukses
      navigate('/orders'); // Alihkan langsung ke riwayat order untuk melacak
    } catch (error) {
      console.error(error);
      // Di sini jaring pengaman simulasi "Service Order Mati" untuk demo dosen
      alert('⚠️ Gagal memproses checkout. Gara-gara service order mati/down!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        
        {/* Header Nota */}
        <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">🛒 Ringkasan Pesanan</h1>
            <p className="text-xs text-gray-400 mt-1">Pastikan menu Wrapsville pilihanmu sudah sesuai.</p>
          </div>
          <span className="text-2xl">📋</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="text-4xl mb-4">🛍️</div>
            <p className="text-gray-500 font-medium">Keranjang belanjaanmu masih kosong, Yos.</p>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-sm"
            >
              Kembali Berburu Kuliner
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Daftar Item Belanjaan */}
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.menu_id} className="py-4 flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded">
                      Rp {item.price.toLocaleString('id-ID')} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-black text-gray-700">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {/* Rincian Perhitungan Biaya */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Subtotal Makanan</span>
                <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Ongkos Kirim (Microservices Promo)</span>
                <span className="text-green-600 font-bold">Gratis</span>
              </div>
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-gray-800">Total Pembayaran:</span>
                <span className="text-2xl font-black text-red-600 tracking-tight">
                  Rp {totalHarga.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Tombol Navigasi & Eksekusi */}
            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-1/2 border border-gray-300 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition text-sm text-center"
              >
                ➕ Tambah Menu Lagi
              </button>
              <button 
                onClick={handleCheckout}
                className="w-1/2 bg-red-600 py-3.5 rounded-xl font-black text-white hover:bg-red-700 transition shadow-md hover:shadow-lg text-sm text-center tracking-wide uppercase"
              >
                🚀 Bayar Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}