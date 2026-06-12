import {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  ArrowRight,
  ReceiptText,
} from 'lucide-react';

import {
  getMyOrders,
} from '../../services/order.service';

import type { Order } from '../../types/order.types';

import {
  formatDate,
  formatPrice,
} from '../../utils/format';

export default function OrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchOrders =
      async () => {
        setLoading(true);

        try {
          const result =
            await getMyOrders();

          setOrders(result);
        } catch {
          toast.error(
            'Cannot load orders'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="grid gap-6">
      <div>
        <span className="inline-flex rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
          Purchases
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">
          Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="grid min-h-72 place-items-center gap-4 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="grid size-14 place-items-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
            <ReceiptText size={34} />
          </span>
          <h2 className="text-2xl font-black tracking-normal text-slate-950">
            No orders yet
          </h2>
          <Link
            to="/products"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <Link
              to={`/orders/${order.id}`}
              className="group grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/40 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center"
              key={order.id}
            >
              <div className="grid min-w-0 gap-1">
                <strong className="text-base font-black text-slate-950">
                  Order #{order.id}
                </strong>
                <span className="text-sm font-semibold text-slate-500">
                  {formatDate(
                    order.createdAt
                  )}
                </span>
              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-black text-slate-600">
                {order.items?.length || 0}{' '}
                items
              </span>

              <strong className="text-base font-black text-emerald-700">
                {formatPrice(
                  order.totalPrice
                )}
              </strong>

              <ArrowRight
                size={20}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
