import { io } from 'socket.io-client';
const { VITE_SOCKET_URL } = import.meta.env;

const URL = VITE_SOCKET_URL;
const socket = io(URL, { autoConnect: false });

socket.on('connect_error', (err) => {
  if (err.message === 'invalid username') {
    console.log('Usuário inválido');
  }
});

socket.onAny((event, ...args) => {
  console.log('[ON_ANY_EVENTS]', event, args);
});

export default socket;
