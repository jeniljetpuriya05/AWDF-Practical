import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Orders() {
  const { state } = useShop();
  const { orders } = state;

  if (orders.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-cart-card">
          <span className="big-emoji">📦</span>
          <h2>No Past Orders Yet</h2>
          <p>Orders you place during this session or saved in local storage will appear here.</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper orders-page">
      <div className="page-header-row">
        <h2>Order History ({orders.length})</h2>
        <span className="info-subtext">Real-time local state receipts</span>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-header-left">
                <span className="order-id">Order ID: <strong>{order.id}</strong></span>
                <span className="order-date">{order.date}</span>
              </div>
              <div className="order-header-right">
                <span className="order-status-badge status-processing">
                  ● {order.status}
                </span>
                <span className="order-total-pill">${order.total}</span>
              </div>
            </div>

            <div className="order-items-grid">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item-chip">
                  <span className="order-item-icon">{item.image}</span>
                  <div className="order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-meta">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-shipping-summary">
                <span className="shipping-label">Shipped to:</span>
                <span className="shipping-text">
                  {order.shippingAddress.name}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </span>
              </div>
              <div className="order-pricing-summary">
                <span>Subtotal: ${order.subtotal}</span>
                {Number(order.discount) > 0 && <span>Discount: -${order.discount}</span>}
                <span>Tax: ${order.tax}</span>
                <strong>Grand Total: ${order.total}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
