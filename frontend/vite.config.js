import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin-allow-popups",  // For google login popup
            "Referrer-Policy": "no-referrer-when-downgrade"   // This is just for development
        },
        proxy: {
            "/api": "http://localhost:5000", // forward API requests to backend
        },
    },
})
