import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3002,
      host: '0.0.0.0',
      strictPort: true,
      hmr: {
        overlay: false // Disable error overlay to reduce lag
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      sourcemap: false, // Disable sourcemap in dev for faster builds
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-charts': ['recharts'],
            'vendor-icons': ['lucide-react']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react']
    }
  };
});
