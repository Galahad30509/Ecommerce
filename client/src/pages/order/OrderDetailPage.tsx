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
      <div className="empty-state">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="empty-state">
        Order not found.
      </div>
    );
  }

  return (
    <section className="page-section">
      <Link
        to="/orders"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Orders
      </Link>

      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {formatDate(
              order.createdAt
            )}
          </span>
          <h1>
            Order #{order.id}
          </h1>
        </div>

        <strong className="detail-price compact">
          {formatPrice(
            order.totalPrice
          )}
        </strong>
      </div>

      <div className="cart-list">
        {(order.items || []).map(
          (item) => {
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
                    Qty {item.quantity}
                  </span>
                </div>

                <strong className="row-price">
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
