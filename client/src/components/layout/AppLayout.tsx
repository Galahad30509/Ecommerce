import type { ReactNode } from 'react';

import {
  Link,
  NavLink,
} from 'react-router-dom';

import clsx from 'clsx';

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

const navLinkClass = ({
  isActive,
}: {
  isActive: boolean;
}) =>
  clsx(
    'inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors',
    isActive
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  );

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.16),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7faf9_44%,#eef3f1_100%)] text-slate-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 lg:grid-cols-[auto_1fr_auto]">
          <Link
            to="/"
            className="inline-flex min-w-0 items-center gap-3 text-lg font-black tracking-normal text-emerald-700"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Store size={22} />
            </span>
            <span className="truncate">
              North & Bogie
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 lg:justify-center">
            <NavLink
              to="/products"
              className={navLinkClass}
            >
              <PackageSearch size={18} />
              Products
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/cart"
                  className={navLinkClass}
                >
                  <ShoppingCart size={18} />
                  Cart
                </NavLink>

                <NavLink
                  to="/orders"
                  className={navLinkClass}
                >
                  <ReceiptText size={18} />
                  Orders
                </NavLink>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={navLinkClass}
              >
                <LayoutDashboard size={18} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex min-w-0 flex-wrap items-center gap-2 lg:justify-end">
            {user ? (
              <>
                <span className="max-w-44 truncate rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                  {user.name}
                </span>

                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
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
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
