import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../utils/api';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mengambil data riwayat order dari order-service Docker (Port 8003)
    orderApi.get('/orders')
      .then((res) => {
        setOrders(res.data.data || res.data || []);
      })
      .catch((err) => {
        console.error("Gagal memuat riwayat order:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">📋 Riwayat Transaksi</h1>
            <p className="text-sm text-gray-500 mt-1">Daftar seluruh pesanan paket Wrapsville yang pernah kamu buat.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="self-start sm:self-center text-sm font-bold text-red-600 hover:text-red-700 transition flex items-center gap-1"
          >
            ← Kembali ke Dashboard
          </button>
        </div>

        {/* State Handling */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Menyusun arsip nota transaksi...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
            <div className="text-4xl mb-3">🧾</div>
            <p className="text-gray-500 font-medium">Kamu belum memiliki riwayat pemesanan makanan.</p>
          </div>
        ) : (
          /* List Item Transaksi Premium */
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col sm:flex-row justify-between sm:items-center gap-6"
              >
                {/* Info Nota */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-gray-900 text-white px-2.5 py-0.5 rounded">
                      ORDER ID: #{order.id}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      • {new Date(order.created_at || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Pembayaran</p>
                    <p className="text-xl font-black text-red-600 tracking-tight mt-0.5">
                      Rp {parseInt(order.total_price || order.total || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                
                {/* Tombol Lacak Aksi */}
                <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                  <button 
                    onClick={() => navigate('/delivery')}
                    className="w-full sm:w-auto bg-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase hover:bg-orange-600 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    🚚 Lacak Pengiriman Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}