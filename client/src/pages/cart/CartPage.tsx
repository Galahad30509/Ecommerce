import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

import {
  getCart,
  removeCartItem,
  updateCartItem,
} from '../../services/cart.service';

import {
  checkout,
} from '../../services/order.service';

import type {
  Cart,
} from '../../types/cart.types';

import {
  formatPrice,
  getImageUrl,
} from '../../utils/format';

export default function CartPage() {
  const navigate = useNavigate();

  const [
    cart,
    setCart,
  ] = useState<Cart | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    checkingOut,
    setCheckingOut,
  ] = useState(false);

  const loadCart =
    useCallback(async (
      showLoading = false
    ) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const result =
          await getCart();

        setCart(result);
      } catch {
        toast.error(
          'Cannot load cart'
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    let active = true;

    getCart()
      .then((result) => {
        if (active) {
          setCart(result);
        }
      })
      .catch(() => {
        toast.error(
          'Cannot load cart'
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const total =
    useMemo(() => {
      return (
        cart?.items.reduce(
          (sum, item) =>
            sum +
            Number(item.product.price) *
              item.quantity,
          0
        ) || 0
      );
    }, [cart]);

  const updateQuantity =
    async (
      itemId: number,
      nextQuantity: number
    ) => {
      if (nextQuantity < 1) {
        return;
      }

      try {
        await updateCartItem(
          itemId,
          nextQuantity
        );

        await loadCart();
      } catch {
        toast.error(
          'Cannot update cart'
        );
      }
    };

  const removeItem =
    async (itemId: number) => {
      try {
        await removeCartItem(
          itemId
        );

        await loadCart();

        toast.success(
          'Item removed'
        );
      } catch {
        toast.error(
          'Cannot remove item'
        );
      }
    };

  const handleCheckout =
    async () => {
      setCheckingOut(true);

      try {
        const order =
          await checkout();

        toast.success(
          'Order placed'
        );

        navigate(
          `/orders/${order.id}`
        );
      } catch {
        toast.error(
          'Checkout failed'
        );
      } finally {
        setCheckingOut(false);
      }
    };

  if (loading) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Loading cart...
      </div>
    );
  }

  const items =
    cart?.items || [];

  if (items.length === 0) {
    return (
      <section className="grid min-h-72 place-items-center gap-4 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="grid size-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <ShoppingBag size={34} />
        </span>
        <h1 className="text-2xl font-black tracking-normal text-slate-950">
          Your cart is empty
        </h1>
        <Link
          to="/products"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="grid gap-5">
        <div>
          <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-emerald-700 ring-1 ring-emerald-100">
            Shopping
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Cart
          </h1>
        </div>

        <div className="grid gap-3">
          {items.map((item) => {
            const imageUrl =
              getImageUrl(
                item.product.image
              );

            return (
              <article
                className="grid gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[5rem_minmax(0,1fr)_auto_auto_2.5rem] sm:items-center"
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
                    {formatPrice(
                      item.product.price
                    )}
                  </span>
                </div>

                <div className="grid h-10 w-fit grid-cols-[2.5rem_4rem_2.5rem] overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <button
                    type="button"
                    className="grid place-items-center text-emerald-700 transition hover:bg-emerald-50"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                    title="Decrease"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    className="w-full border-x border-slate-200 text-center text-sm font-black outline-none"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.id,
                        Number(
                          event.target.value
                        ) || 1
                      )
                    }
                  />

                  <button
                    type="button"
                    className="grid place-items-center text-emerald-700 transition hover:bg-emerald-50"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                    title="Increase"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <strong className="whitespace-nowrap text-sm font-black text-slate-950">
                  {formatPrice(
                    Number(
                      item.product.price
                    ) * item.quantity
                  )}
                </strong>

                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                  onClick={() =>
                    removeItem(item.id)
                  }
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-xl font-black text-slate-950">
          Summary
        </h2>

        <div className="flex items-center justify-between gap-3 text-sm font-bold text-slate-600">
          <span>Items</span>
          <strong className="text-slate-950">
            {items.length}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-base font-black text-slate-950">
          <span>Total</span>
          <strong>
            {formatPrice(total)}
          </strong>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleCheckout}
          disabled={checkingOut}
        >
          <ShoppingBag size={18} />
          {checkingOut
            ? 'Checking out...'
            : 'Checkout'}
        </button>
      </aside>
    </section>
  );
}
