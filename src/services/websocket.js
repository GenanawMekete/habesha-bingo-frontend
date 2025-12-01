import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

class GameSocket {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      toast.success('Connected to game server!');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Failed to connect to game server');
      }
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnect attempt ${attemptNumber}`);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      toast.success('Reconnected to game server!');
    });

    // Game events
    this.socket.on('game:update', (data) => {
      this.emitToListeners('game:update', data);
    });

    this.socket.on('game:numberDrawn', (data) => {
      toast(`🎲 Number drawn: ${data.number}`, {
        icon: '🎯',
        duration: 3000,
      });
      this.emitToListeners('game:numberDrawn', data);
    });

    this.socket.on('game:winner', (data) => {
      toast(`🏆 Winner: ${data.winner.name} won ${data.prize} coins!`, {
        duration: 10000,
        icon: '🎉',
      });
      this.emitToListeners('game:winner', data);
    });

    this.socket.on('game:chat', (data) => {
      this.emitToListeners('game:chat', data);
    });

    this.socket.on('game:playerJoined', (data) => {
      toast(`${data.player.name} joined the game`);
      this.emitToListeners('game:playerJoined', data);
    });

    this.socket.on('game:playerLeft', (data) => {
      toast(`${data.player.name} left the game`);
      this.emitToListeners('game:playerLeft', data);
    });
  }

  joinGame(gameId) {
    if (!this.socket?.connected) {
      toast.error('Not connected to game server');
      return;
    }

    this.socket.emit('game:join', { gameId });
  }

  leaveGame(gameId) {
    if (this.socket?.connected) {
      this.socket.emit('game:leave', { gameId });
    }
  }

  drawNumber(gameId) {
    if (this.socket?.connected) {
      this.socket.emit('game:drawNumber', { gameId });
    }
  }

  sendMessage(gameId, message) {
    if (this.socket?.connected) {
      this.socket.emit('game:chat', { gameId, message });
    }
  }

  markNumber(gameId, cardId, number) {
    if (this.socket?.connected) {
      this.socket.emit('game:markNumber', { gameId, cardId, number });
    }
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emitToListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }
}

const gameSocket = new GameSocket();

export const initWebSocket = (token) => {
  return gameSocket.connect(token);
};

export const getSocket = () => {
  return gameSocket.socket;
};

export default gameSocket;
