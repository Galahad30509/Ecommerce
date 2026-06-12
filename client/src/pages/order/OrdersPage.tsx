import {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import toast from 'react-hot-toast';

import {
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
      <div className="empty-state">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            Purchases
          </span>
          <h1>Orders</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <ReceiptText size={38} />
          <h2>No orders yet</h2>
          <Link
            to="/products"
            className="primary-link"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <Link
              to={`/orders/${order.id}`}
              className="order-row"
              key={order.id}
            >
              <div>
                <strong>
                  Order #{order.id}
                </strong>
                <span className="muted">
                  {formatDate(
                    order.createdAt
                  )}
                </span>
              </div>

              <span>
                {order.items?.length || 0}{' '}
                items
              </span>

              <strong>
                {formatPrice(
                  order.totalPrice
                )}
              </strong>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
