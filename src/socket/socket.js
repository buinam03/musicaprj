
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { // URL backend
  autoConnect: false, 
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