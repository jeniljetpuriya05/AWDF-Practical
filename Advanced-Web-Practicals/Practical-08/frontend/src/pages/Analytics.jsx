import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Analytics() {
  const { state } = useShop();
  const { products, cart, wishlist, orders } = state;

  // Compute metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + parseFloat(ord.total || 0), 0);
  const totalItemsSold = orders.reduce((sum, ord) => {
    return sum + (ord.items ? ord.items.reduce((iSum, it) => iSum + it.quantity, 0) : 0);
  }, 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00';
  const totalCartValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Group products by category
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const totalCatalogValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="page-wrapper analytics-page">
      <div className="page-header-row">
        <div>
          <h2>Store Intelligence & State Analytics</h2>
          <span className="info-subtext">Computed dynamically via React state and memoized reducers</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Revenue</span>
            <span className="metric-icon">💵</span>
          </div>
          <div className="metric-value">${totalRevenue.toFixed(2)}</div>
          <div className="metric-subtitle">From {orders.length} completed transactions</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Order Value</span>
            <span className="metric-icon">📈</span>
          </div>
          <div className="metric-value">${avgOrderValue}</div>
          <div className="metric-subtitle">Calculated per transaction</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Items Sold</span>
            <span className="metric-icon">📦</span>
          </div>
          <div className="metric-value">{totalItemsSold}</div>
          <div className="metric-subtitle">Total units dispatched</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Cart Value</span>
            <span className="metric-icon">🛒</span>
          </div>
          <div className="metric-value">${totalCartValue.toFixed(2)}</div>
          <div className="metric-subtitle">{cart.reduce((s, i) => s + i.quantity, 0)} items pending checkout</div>
        </div>
      </div>

      {/* Distribution Section */}
      <div className="analytics-details-grid">
        <div className="analytics-box">
          <h3>Catalog Category Distribution</h3>
          <p className="box-desc">Breakdown of {products.length} products across departments</p>
          <div className="bars-list">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / products.length) * 100);
              return (
                <div key={cat} className="bar-row">
                  <div className="bar-labels">
                    <span className="bar-name">{cat}</span>
                    <span className="bar-count">{count} items ({percentage}%)</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-box">
          <h3>Store State Health</h3>
          <ul className="stats-list">
            <li>
              <span>Catalog Total Stock Value:</span>
              <strong>${totalCatalogValue.toFixed(2)}</strong>
            </li>
            <li>
              <span>Favorited Items (Wishlist):</span>
              <strong>{wishlist.length} products</strong>
            </li>
            <li>
              <span>Client State Storage Engine:</span>
              <strong className="badge-code">HTML5 localStorage</strong>
            </li>
            <li>
              <span>State Architecture Pattern:</span>
              <strong className="badge-code">React 19 useReducer + Context</strong>
            </li>
            <li>
              <span>Order Fulfillment Status:</span>
              <strong className="status-badge-inline">100% Operational</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
