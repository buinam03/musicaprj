import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/config';

const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'],
    auth: {
        get token() {
            return localStorage.getItem('jwt');
        },
    },
});

export default socket;
