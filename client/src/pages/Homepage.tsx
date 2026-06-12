import { Link } from 'react-router-dom';

import {
  ArrowRight,
  LayoutDashboard,
  ReceiptText,
  ShoppingBag,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <section className="home-grid">
      <div className="intro-panel">
        <span className="eyebrow">
          North & Bogie
        </span>

        <h1>
          North & Bogie Store
        </h1>

        <p className="muted">
          {user
            ? `Welcome back, ${user.name}.`
            : 'Browse the catalog or sign in.'}
        </p>

        <div className="hero-actions">
          <Link
            to="/products"
            className="primary-link large-link"
          >
            <ShoppingBag size={18} />
            Browse Products
            <ArrowRight size={18} />
          </Link>

          {user && (
            <Link
              to="/cart"
              className="secondary-button large-link"
            >
              View Cart
            </Link>
          )}
        </div>
      </div>

      <div className="feature-list">
        <Link to="/products">
          <ShoppingBag size={22} />
          <strong>Products</strong>
        </Link>

        {user && (
          <>
            <Link to="/cart">
              <ShoppingBag size={22} />
              <strong>Cart</strong>
            </Link>

            <Link to="/orders">
              <ReceiptText size={22} />
              <strong>Orders</strong>
            </Link>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin">
            <LayoutDashboard size={22} />
            <strong>Admin</strong>
          </Link>
        )}
      </div>
    </section>
  );
}
