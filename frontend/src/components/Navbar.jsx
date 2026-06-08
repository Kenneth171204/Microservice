import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Jangan munculkan navbar kalau masih di halaman login
  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Sisi Kiri: Logo */}
          <div className="flex items-center gap-6">
            <span 
              onClick={() => navigate('/dashboard')} 
              className="text-2xl font-black tracking-tight text-red-600 cursor-pointer hover:opacity-80 transition"
            >
              Wrapsville<span className="text-gray-800 text-sm font-semibold ml-1">Dashboard</span>
            </span>
            
            {/* Menu Navigasi */}
            <div className="hidden md:flex space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${location.pathname === '/dashboard' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                🏠 Beranda
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${location.pathname === '/orders' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                📋 Riwayat Order
              </button>
            </div>
          </div>

          {/* Sisi Kanan: Status & Logout */}
          <div className="flex items-center gap-4">
            {/* Tombol Keranjang Belanja */}
            <button 
              onClick={() => navigate('/checkout')}
              className="relative p-2 text-gray-600 hover:text-gray-800 transition bg-gray-100 rounded-full"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-gray-200"></div>

            {/* Tombol Logout */}
            <button 
              onClick={handleLogout}
              className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-red-600 transition shadow-sm"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}