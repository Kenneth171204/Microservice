import axios from 'axios';

// Jalur langsung ke masing-masing service di Docker
export const userApi = axios.create({
  baseURL: 'http://localhost:8001', // Laravel User Service
});

export const restaurantApi = axios.create({
  baseURL: 'http://localhost:8002', // Node Restaurant Service
});

export const orderApi = axios.create({
  baseURL: 'http://localhost:8003', // Node Order Service
});

export const deliveryApi = axios.create({
  baseURL: 'http://localhost:8004', // Node Delivery Service
});

// Cadangan jika kelak API Gateway Go (Port 8080) sudah beres rutenya:
export const gatewayApi = axios.create({
  baseURL: 'http://localhost:8080',
});