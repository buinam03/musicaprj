// src/utils/socket.js
import { io } from 'socket.io-client';

// Khởi tạo kết nối
const socket = io('http://localhost:3000', { // URL backend
  autoConnect: false, // Tắt tự động kết nối
  reconnectionAttempts: 5, // Số lần thử kết nối lại
  reconnectionDelay: 1000, // Thời gian chờ giữa các lần thử
  transports: ['websocket'], // Ưu tiên WebSocket
  auth: {
    get token() {
        return localStorage.getItem('jwt'); // Dynamically fetch the token
      }
  }
});

export default socket;