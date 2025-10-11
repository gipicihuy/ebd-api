import React from 'react';
import ReactDOM from 'react-dom/client';
import Index from './Index.tsx'; // Import komponen Index Anda
import '../index.css'; // Pastikan jalur ke index.css Anda benar

// Pastikan elemen dengan id 'root' ada di index.html Anda
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
