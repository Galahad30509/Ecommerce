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
    useCallback(async () => {
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
    loadCart();
  }, [loadCart]);

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
      <div className="empty-state">
        Loading cart...
      </div>
    );
  }

  const items =
    cart?.items || [];

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <ShoppingBag size={38} />
        <h1>Your cart is empty</h1>
        <Link
          to="/products"
          className="primary-link"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section cart-layout">
      <div>
        <div className="page-heading">
          <div>
            <span className="eyebrow">
              Shopping
            </span>
            <h1>Cart</h1>
          </div>
        </div>

        <div className="cart-list">
          {items.map((item) => {
            const imageUrl =
              getImageUrl(
                item.product.image
              );

            return (
              <article
                className="cart-row"
                key={item.id}
              >
                <div className="cart-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        item.product.title
                      }
                    />
                  ) : (
                    <Package size={30} />
                  )}
                </div>

                <div className="cart-info">
                  <h3>
                    {item.product.title}
                  </h3>
                  <span className="muted">
                    {formatPrice(
                      item.product.price
                    )}
                  </span>
                </div>

                <div className="stepper">
                  <button
                    type="button"
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

                <strong className="row-price">
                  {formatPrice(
                    Number(
                      item.product.price
                    ) * item.quantity
                  )}
                </strong>

                <button
                  type="button"
                  className="icon-button danger"
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

      <aside className="summary-panel">
        <h2>Summary</h2>

        <div className="summary-line">
          <span>Items</span>
          <strong>
            {items.length}
          </strong>
        </div>

        <div className="summary-line total">
          <span>Total</span>
          <strong>
            {formatPrice(total)}
          </strong>
        </div>

        <button
          type="button"
          className="primary-button wide-button"
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
