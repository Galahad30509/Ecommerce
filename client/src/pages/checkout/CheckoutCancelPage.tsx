import { Link } from 'react-router-dom';

import {
  ArrowLeft,
  XCircle,
} from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <section className="grid min-h-72 place-items-center gap-5 rounded-lg border border-amber-200 bg-white p-8 text-center shadow-sm">
      <span className="grid size-16 place-items-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
        <XCircle size={40} />
      </span>

      <div>
        <h1 className="text-3xl font-black text-slate-950">
          Payment canceled
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Your cart is still available.
        </p>
      </div>

      <Link
        to="/cart"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
      >
        <ArrowLeft size={18} />
        Back to Cart
      </Link>
    </section>
  );
}
