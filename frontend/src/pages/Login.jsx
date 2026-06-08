import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menembak ke Laravel user-service (http://localhost:8001/api/login)
      const response = await userApi.post('/api/login', { email, password });
      
      // Simpan data esensial ke localStorage browser
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user.id);
      
      alert('Login Berhasil, Yos!');
      
      // Pindah otomatis ke halaman dashboard tanpa reload
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Login Gagal: ' + (error.response?.data?.message || 'Koneksi ke Docker bermasalah'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Food Delivery Login</h2>
        <p className="text-center text-sm text-gray-500 mb-6">User Service Integration</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              className="mt-1 w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yosafat@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              className="mt-1 w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}