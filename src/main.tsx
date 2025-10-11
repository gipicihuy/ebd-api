import React from 'react';
import ReactDOM from 'react-dom/client';
import Index from './Index.tsx'; // Komponen utama Anda bernama Index
import './index.css'; // <<< BARIS KRITIS YANG HILANG ATAU TERLEWAT

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
