import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryApi } from '../utils/api';

export default function DeliveryPage() {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mengambil data status pengiriman dari delivery-service (Port 8004)
    deliveryApi.get('/delivery/1')
      .then((res) => {
        setDelivery(res.data.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data kurir:", err);
        // Jaring pengaman demonstrasi ketahanan microservice
        alert("⚠️ Gagal melacak kurir! Layanan 'delivery-service' sedang down/mati.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        
        {/* Header Kartu */}
        <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">🛵 Pelacakan Pengiriman Live</h1>
            <p className="text-xs text-gray-400 mt-1">Pantau pergerakan driver Wrapsville menuju tempatmu.</p>
          </div>
          <button 
            onClick={() => navigate('/orders')} 
            className="text-xs font-bold bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition text-gray-300"
          >
            ← Kembali
          </button>
        </div>

        {/* State Handling */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Menghubungi satelit GPS kurir...</p>
          </div>
        ) : !delivery ? (
          <div className="text-center py-16 px-6 text-gray-500 italic">
            <div className="text-4xl mb-3">📭</div>
            Belum ada pengiriman aktif untuk orderan ini.
          </div>
        ) : (
          <div className="p-6 space-y-8">
            
            {/* Profil Driver Card */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold">
                  👨‍✈️
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Driver Anda</p>
                  <h3 className="font-bold text-gray-800 text-base">
                    {delivery.driver_name || 'Driver Wrapsville'}
                  </h3>
                </div>
              </div>
              
              {/* Badge Status Berkedip */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-50 text-orange-600 border border-orange-100 animate-pulse uppercase tracking-wide">
                {delivery.status}
              </span>
            </div>

            {/* Komponen Timeline Vertikal Premium */}
            <div className="relative border-l-2 border-gray-100 pl-6 ml-6 space-y-8">
              
              {/* Step 1: Di Restoran */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] ring-4 ring-white">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Pesanan Dikonfirmasi & Diproses</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Makanan sedang disiapkan oleh tim dapur Wrapsville.</p>
                </div>
              </div>

              {/* Step 2: Sedang Di Jalan */}
              <div className="relative">
                <span className={`absolute -left-[31px] top-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ring-4 ring-white ${
                  delivery.status === 'ON_DELIVERY' ? 'bg-orange-500 text-white animate-ping' : delivery.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {delivery.status === 'delivered' ? '✓' : '•'}
                </span>
                {/* Cadangan titik statis saat animasi ping membesar */}
                {delivery.status === 'ON_DELIVERY' && (
                  <span className="absolute -left-[31px] top-0.5 bg-orange-500 rounded-full w-4 h-4 ring-4 ring-white"></span>
                )}
                <div>
                  <h4 className={`font-bold text-sm ${delivery.status === 'ON_DELIVERY' ? 'text-orange-600' : delivery.status === 'delivered' ? 'text-gray-800' : 'text-gray-400'}`}>
                    Kurir Sedang Menuju Rumahmu
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Posisi Kurir saat ini: <span className="font-semibold text-gray-700">{delivery.current_location || 'Restoran'}</span>
                  </p>
                </div>
              </div>

              {/* Step 3: Sampai Tujuan */}
              <div className="relative">
                <span className={`absolute -left-[31px] top-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ring-4 ring-white ${
                  delivery.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {delivery.status === 'delivered' ? '✓' : '•'}
                </span>
                <div>
                  <h4 className={`font-bold text-sm ${delivery.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                    Makanan Sudah Sampai di Tujuan
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Estimasi sisa waktu perjalanan: <span className="font-semibold text-gray-700">{delivery.estimated_time || 0} Menit</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Informasi Waktu Update */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-[11px] text-gray-400 font-medium">
              <span>Sistem Pemantauan Otomatis</span>
              <span>Terakhir Update: {new Date(delivery.updatedAt || new Date()).toLocaleTimeString('id-ID')}</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}