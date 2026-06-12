import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  ArrowLeft,
  Package,
} from 'lucide-react';

import {
  getOrderById,
} from '../../services/order.service';

import type { Order } from '../../types/order.types';

import {
  formatDate,
  formatPrice,
  getImageUrl,
} from '../../utils/format';

export default function OrderDetailPage() {
  const { id } = useParams();

  const [
    order,
    setOrder,
  ] = useState<Order | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchOrder =
      async () => {
        if (!id) {
          return;
        }

        setLoading(true);

        try {
          const result =
            await getOrderById(
              Number(id)
            );

          setOrder(result);
        } catch {
          toast.error(
            'Cannot load order'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Order not found.
      </div>
    );
  }

  return (
    <section className="grid gap-6">
      <Link
        to="/orders"
        className="inline-flex w-fit items-center gap-2 rounded-lg px-1 py-2 text-sm font-black text-emerald-700 transition hover:text-emerald-800"
      >
        <ArrowLeft size={18} />
        Orders
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <span className="inline-flex rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
            {formatDate(
              order.createdAt
            )}
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Order #{order.id}
          </h1>
        </div>

        <strong className="text-2xl font-black text-emerald-700">
          {formatPrice(
            order.totalPrice
          )}
        </strong>
      </div>

      <div className="grid gap-3">
        {(order.items || []).map(
          (item) => {
            const imageUrl =
              getImageUrl(
                item.product.image
              );

            return (
              <article
                className="grid gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center"
                key={item.id}
              >
                <div className="grid size-20 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-teal-50 to-amber-50 text-slate-400">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        item.product.title
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={30} />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-slate-950">
                    {item.product.title}
                  </h3>
                  <span className="text-sm font-bold text-slate-500">
                    Qty {item.quantity}
                  </span>
                </div>

                <strong className="whitespace-nowrap text-base font-black text-slate-950">
                  {formatPrice(
                    Number(item.price) *
                      item.quantity
                  )}
                </strong>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}
