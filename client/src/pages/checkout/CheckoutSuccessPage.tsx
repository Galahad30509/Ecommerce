import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  CheckCircle2,
  ReceiptText,
} from 'lucide-react';

import {
  confirmCheckoutSession,
} from '../../services/payment.service';

import type { Order } from '../../types/order.types';

import { formatPrice } from '../../utils/format';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const sessionId =
      searchParams.get('session_id');

    if (!sessionId) {
      setError('Missing payment session');
      setLoading(false);
      return;
    }

    let active = true;

    confirmCheckoutSession(sessionId)
      .then((result) => {
        if (!active) {
          return;
        }

        setOrder(result);
        toast.success('Payment completed');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError('Cannot confirm payment');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Confirming payment...
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="grid min-h-72 place-items-center gap-4 rounded-lg border border-rose-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          Payment confirmation failed
        </h1>
        <p className="max-w-md text-sm font-semibold text-slate-500">
          {error || 'Order not found'}
        </p>
        <Link
          to="/cart"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
        >
          Back to Cart
        </Link>
      </section>
    );
  }

  return (
    <section className="grid min-h-72 place-items-center gap-5 rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-sm">
      <span className="grid size-16 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
        <CheckCircle2 size={40} />
      </span>

      <div>
        <h1 className="text-3xl font-black text-slate-950">
          Payment completed
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Order #{order.id} - {formatPrice(order.totalPrice)}
        </p>
      </div>

      <Link
        to={`/orders/${order.id}`}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
      >
        <ReceiptText size={18} />
        View Order
      </Link>
    </section>
  );
}
