import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Wishlist() {
  const { state, dispatch } = useShop();
  const { wishlist } = state;

  const handleMoveToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  if (wishlist.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-cart-card">
          <span className="big-emoji">❤️</span>
          <h2>Your Wishlist is Empty</h2>
          <p>Tap the heart icon on any product in the catalog to save it for later.</p>
          <Link to="/" className="btn btn-primary">
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper wishlist-page">
      <div className="page-header-row">
        <h2>Saved Favorites ({wishlist.length} items)</h2>
        <span className="info-subtext">Items remain stored across browser sessions</span>
      </div>

      <div className="products-grid">
        {wishlist.map((item) => (
          <article key={item.id} className="product-card">
            <div className="card-top">
              <span className="product-tag">{item.category}</span>
              <button
                className="btn-wishlist favorited"
                onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: item })}
                title="Remove from favorites"
              >
                ❤️
              </button>
            </div>

            <div className="product-avatar-preview" style={{ background: `radial-gradient(circle, ${item.color}22 0%, rgba(20,20,35,0.7) 100%)` }}>
              <span className="product-emoji">{item.image}</span>
            </div>

            <div className="product-details">
              <h3 className="product-title">{item.name}</h3>
              <p className="product-desc">{item.description}</p>

              <div className="product-meta">
                <span className="rating-badge">⭐ {item.rating}</span>
                <span className="current-price">${item.price.toFixed(2)}</span>
              </div>

              <div className="wishlist-action-buttons">
                <button
                  className="btn btn-primary btn-move-cart"
                  onClick={() => handleMoveToCart(item)}
                >
                  Move to Cart 🛒
                </button>
                <button
                  className="btn-danger-outline"
                  onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: item })}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
