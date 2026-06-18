import { Link } from 'react-router-dom';

import {
  ArrowRight,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import heroImage from '../assets/hero.png';

import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch">
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <img
          src={heroImage}
          alt="North & Bogie product display"
          className="h-full min-h-105 w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/82 via-slate-950/42 to-transparent" />

        <div className="absolute inset-0 flex max-w-2xl flex-col justify-end p-6 sm:p-10">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg bg-white/12 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-emerald-100 ring-1 ring-white/20 backdrop-blur">
            <Sparkles size={16} />
            North & Bogie
          </span>

          <h1 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl">
            North & Bogie Store
          </h1>

          <p className="mt-4 max-w-lg text-base font-medium leading-7 text-slate-100">
            {user
              ? `Welcome back, ${user.name}.`
              : 'Fresh picks, simple checkout, and clean order tracking.'}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400"
            >
              <ShoppingBag size={18} />
              Browse Products
              <ArrowRight size={18} />
            </Link>

            {user && (
              <Link
                to="/cart"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/12 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                View Cart
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <Link
          to="/products"
          className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          <span className="grid size-12 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200">
            <PackageSearch size={22} />
          </span>
          <strong className="text-lg font-black text-slate-950">
            Products
          </strong>
          <ArrowRight
            className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
            size={20}
          />
        </Link>

        {user && (
          <>
            <Link
              to="/cart"
              className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-teal-50"
            >
              <span className="grid size-12 place-items-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
                <ShoppingBag size={22} />
              </span>
              <strong className="text-lg font-black text-slate-950">
                Cart
              </strong>
              <ArrowRight
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600"
                size={20}
              />
            </Link>

            <Link
              to="/orders"
              className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-200 hover:bg-amber-50"
            >
              <span className="grid size-12 place-items-center rounded-lg bg-white text-amber-700 shadow-sm ring-1 ring-slate-200">
                <ReceiptText size={22} />
              </span>
              <strong className="text-lg font-black text-slate-950">
                Orders
              </strong>
              <ArrowRight
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-600"
                size={20}
              />
            </Link>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <Link
            to="/admin"
            className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-rose-200 hover:bg-rose-50"
          >
            <span className="grid size-12 place-items-center rounded-lg bg-white text-rose-700 shadow-sm ring-1 ring-slate-200">
              <LayoutDashboard size={22} />
            </span>
            <strong className="text-lg font-black text-slate-950">
              Admin
            </strong>
            <ArrowRight
              className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-rose-600"
              size={20}
            />
          </Link>
        )}
      </div>
    </section>
  );
}
