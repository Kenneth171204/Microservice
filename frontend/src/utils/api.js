import axios from 'axios';

const gatewayUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const userApi = axios.create({ baseURL: gatewayUrl });
export const restaurantApi = axios.create({ baseURL: gatewayUrl });
export const orderApi = axios.create({ baseURL: gatewayUrl });
export const deliveryApi = axios.create({ baseURL: gatewayUrl });
export const gatewayApi = axios.create({ baseURL: gatewayUrl });