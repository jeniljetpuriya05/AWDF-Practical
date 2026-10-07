import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <Toast />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <div className="footer-content">
              <p>Practical 08 • Advanced Frontend State Management with React 19 & Context API</p>
              <div className="footer-links">
                <span>⚡ ApexCommerce Store</span>
                <span>•</span>
                <span>Responsive & Reactive Architecture</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;
