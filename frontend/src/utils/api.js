import axios from 'axios';

const gatewayUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// userApi biarin gini soalnya di halaman Login.jsx kamu udah nulis /api/user secara manual
export const userApi = axios.create({ baseURL: gatewayUrl });

// sisa service yang lain kita pasangin prefix jalurnya secara otomatis
export const restaurantApi = axios.create({ baseURL: `${gatewayUrl}/api/restaurant` });
export const orderApi = axios.create({ baseURL: `${gatewayUrl}/api/order` });
export const deliveryApi = axios.create({ baseURL: `${gatewayUrl}/api/delivery` });
export const gatewayApi = axios.create({ baseURL: gatewayUrl });