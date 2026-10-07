import React from 'react';
import { NavLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { state } = useShop();

  const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistCount = state.wishlist.length;

  return (
    <header className="site-header">
      <div className="header-container">
        <NavLink to="/" className="brand-logo">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">ApexCommerce</span>
          <span className="badge-tech">React State Lab</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <span className="nav-icon">🛍️</span> Catalog
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <span className="nav-icon">❤️</span> Wishlist
            {totalWishlistCount > 0 && <span className="counter-pill">{totalWishlistCount}</span>}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <span className="nav-icon">🛒</span> Cart
            {totalCartCount > 0 && <span className="counter-pill counter-cart">{totalCartCount}</span>}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <span className="nav-icon">📦</span> Orders
            {state.orders.length > 0 && <span className="counter-pill">{state.orders.length}</span>}
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <span className="nav-icon">📊</span> Analytics
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
