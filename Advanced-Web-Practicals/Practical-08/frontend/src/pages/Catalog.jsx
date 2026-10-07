import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/products';

export default function Catalog() {
  const { state, dispatch } = useShop();
  const { products, searchQuery, selectedCategory, sortBy, priceRange, minRating, wishlist, cart } = state;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesPrice = p.price <= priceRange;
        const matchesRating = p.rating >= minRating;
        return matchesQuery && matchesCat && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // featured/default
      });
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, minRating]);

  return (
    <div className="page-wrapper catalog-page">
      <div className="hero-banner">
        <div className="hero-content">
          <span className="badge-pill">🔥 Practical 08 — Advanced React</span>
          <h1>Explore Premium Gear & Accessories</h1>
          <p>
            Powered by modern React 19 architecture featuring reducer-driven state management,
            multi-criteria filters, and client-side reactive store.
          </p>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <label className="filter-title">Search Gear</label>
            <div className="search-input-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className="input-search"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-title">Category</label>
            <div className="category-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', payload: cat })}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header-row">
              <label className="filter-title">Max Price</label>
              <span className="filter-value">${priceRange}</span>
            </div>
            <input
              type="range"
              min="30"
              max="600"
              step="10"
              value={priceRange}
              onChange={(e) => dispatch({ type: 'SET_PRICE_RANGE', payload: Number(e.target.value) })}
              className="range-slider"
            />
          </div>

          <div className="filter-group">
            <label className="filter-title">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => dispatch({ type: 'SET_MIN_RATING', payload: Number(e.target.value) })}
              className="select-dropdown"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5 Stars & Above</option>
              <option value="4.7">4.7 Stars & Above</option>
              <option value="4.8">4.8 Stars & Above</option>
            </select>
          </div>

          <button
            className="btn-reset-filters"
            onClick={() => {
              dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
              dispatch({ type: 'SET_CATEGORY', payload: 'All' });
              dispatch({ type: 'SET_SORT', payload: 'featured' });
              dispatch({ type: 'SET_PRICE_RANGE', payload: 600 });
              dispatch({ type: 'SET_MIN_RATING', payload: 0 });
            }}
          >
            Reset All Filters
          </button>
        </aside>

        {/* Product Grid Section */}
        <main className="catalog-main">
          <div className="catalog-toolbar">
            <span className="results-count">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </span>
            <div className="sort-box">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
                className="select-sort"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔎</span>
              <h3>No matching products found</h3>
              <p>Try modifying your keyword, price slider, or selected category.</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
                  dispatch({ type: 'SET_CATEGORY', payload: 'All' });
                }}
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const isFavorite = wishlist.some((item) => item.id === product.id);
                const inCart = cart.find((item) => item.id === product.id);

                return (
                  <article key={product.id} className="product-card">
                    <div className="card-top">
                      <span className="product-tag">{product.tag}</span>
                      <button
                        className={`btn-wishlist ${isFavorite ? 'favorited' : ''}`}
                        onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product })}
                        aria-label="Wishlist item"
                        title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {isFavorite ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <div className="product-avatar-preview" style={{ background: `radial-gradient(circle, ${product.color}22 0%, rgba(20,20,35,0.7) 100%)` }}>
                      <span className="product-emoji">{product.image}</span>
                    </div>

                    <div className="product-details">
                      <span className="product-category">{product.category}</span>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>

                      <div className="product-meta">
                        <span className="rating-badge">
                          ⭐ {product.rating} <span className="reviews">({product.reviewsCount})</span>
                        </span>
                        <span className="stock-badge">
                          {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                        </span>
                      </div>

                      <div className="card-footer">
                        <div className="price-container">
                          <span className="current-price">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>

                        <button
                          className={`btn-add-cart ${inCart ? 'in-cart' : ''}`}
                          onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                        >
                          {inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart 🛒'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
