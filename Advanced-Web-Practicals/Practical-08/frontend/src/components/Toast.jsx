import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Toast() {
  const { state, dispatch } = useShop();

  if (!state.notification) return null;

  return (
    <div className={`toast-container toast-${state.notification.type}`}>
      <span className="toast-icon">
        {state.notification.type === 'success' ? '✅' : state.notification.type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span className="toast-text">{state.notification.message}</span>
      <button
        className="toast-close"
        onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
        aria-label="Dismiss toast"
      >
        ✕
      </button>
    </div>
  );
}
