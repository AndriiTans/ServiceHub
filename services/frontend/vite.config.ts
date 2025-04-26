// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: './', // Use relative paths for assets in the build
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure that the generated asset paths are absolute, which resolves the issue with broken paths on nested routes
  ///////////////
  // make stable name
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js', // Stable name for the entry file
        chunkFileNames: 'assets/[name].js', // Optional: Non-entry chunk files
        assetFileNames: 'assets/[name][extname]', // Optional: Asset files (CSS, images, etc.)
      },
    },
  },
  ///////////////
});
