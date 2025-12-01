{
  "name": "telegram-bingo-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.6.1",
    "framer-motion": "^10.16.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.4",
    "vite": "^4.4.9",
    "gh-pages": "^6.0.0"
  }
}
