import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Cart() {
  const { state, dispatch } = useShop();
  const { cart, promoCode, discountPercent } = state;
  const navigate = useNavigate();

  const [inputCoupon, setInputCoupon] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: 'Alex Morgan',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    card: '•••• •••• •••• 4242'
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const shipping = taxableAmount > 150 || taxableAmount === 0 ? 0 : 12;
  const tax = taxableAmount * 0.0825;
  const total = taxableAmount + shipping + tax;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    dispatch({ type: 'APPLY_PROMO', payload: inputCoupon });
    setInputCoupon('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'PLACE_ORDER',
      payload: {
        subtotal: subtotal.toFixed(2),
        discount: discountAmount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        shippingAddress
      }
    });
    setShowCheckoutModal(false);
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-cart-card">
          <span className="big-emoji">🛒</span>
          <h2>Your Cart is Currently Empty</h2>
          <p>Explore our catalog of high-performance peripherals and gear to add items to your cart.</p>
          <Link to="/" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper cart-page">
      <div className="page-header-row">
        <h2>Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h2>
        <button
          className="btn-text-danger"
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
        >
          Clear entire cart
        </button>
      </div>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-row">
              <div className="cart-item-image">
                <span>{item.image}</span>
              </div>

              <div className="cart-item-info">
                <span className="cart-item-category">{item.category}</span>
                <h4 className="cart-item-title">{item.name}</h4>
                <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>
              </div>

              <div className="cart-qty-control">
                <button
                  className="qty-btn"
                  onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-number">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="btn-remove-item"
                onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="order-summary-card">
          <h3>Order Summary</h3>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-line discount-line">
              <span>Coupon ({promoCode} - {discountPercent}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-line">
            <span>Shipping</span>
            <span>{shipping === 0 ? <strong className="free-text">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="summary-line">
            <span>Est. Sales Tax (8.25%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-line total-line">
            <span>Estimated Total</span>
            <span className="total-val">${total.toFixed(2)}</span>
          </div>

          {/* Promo form */}
          <form className="promo-form" onSubmit={handleApplyPromo}>
            <input
              type="text"
              placeholder="Promo code (SAVE20)"
              value={inputCoupon}
              onChange={(e) => setInputCoupon(e.target.value)}
              className="input-promo"
            />
            <button type="submit" className="btn-apply-promo">
              Apply
            </button>
          </form>
          <span className="promo-hint">💡 Try code <strong>SAVE20</strong> or <strong>WELCOME10</strong></span>

          <button
            className="btn btn-primary btn-checkout"
            onClick={() => setShowCheckoutModal(true)}
          >
            Proceed to Checkout 💳
          </button>
        </aside>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-backdrop" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Secure Checkout</h3>
              <button className="btn-modal-close" onClick={() => setShowCheckoutModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-group">
                <label>Recipient Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method (Demo Token)</label>
                <input
                  type="text"
                  readOnly
                  value={shippingAddress.card}
                />
              </div>

              <div className="checkout-total-banner">
                <span>Final Amount Charged:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Pay ${total.toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
