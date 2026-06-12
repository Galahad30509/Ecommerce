import type { ReactNode } from 'react';

import {
  Link,
  NavLink,
} from 'react-router-dom';

import {
  LayoutDashboard,
  LogIn,
  LogOut,
  PackageSearch,
  ReceiptText,
  ShoppingCart,
  Store,
  UserPlus,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link
          to="/"
          className="brand"
        >
          <Store size={24} />
          <span>North & Bogie</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/products">
            <PackageSearch size={18} />
            Products
          </NavLink>

          {user && (
            <>
              <NavLink to="/cart">
                <ShoppingCart size={18} />
                Cart
              </NavLink>

              <NavLink to="/orders">
                <ReceiptText size={18} />
                Orders
              </NavLink>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <NavLink to="/admin">
              <LayoutDashboard size={18} />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="auth-actions">
          {user ? (
            <>
              <span className="user-pill">
                {user.name}
              </span>

              <button
                type="button"
                className="icon-button"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="ghost-link"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                to="/register"
                className="primary-link"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="content">
        {children}
      </main>
    </div>
  );
}
