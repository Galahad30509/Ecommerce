import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from 'lucide-react';

import {
  getProductById,
} from '../../services/product.service';

import {
  addToCart,
} from '../../services/cart.service';

import type {
  Product,
} from '../../types/product.types';

import { useAuth } from '../../hooks/useAuth';

import {
  formatPrice,
  getImageUrl,
} from '../../utils/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [
    product,
    setProduct,
  ] =
    useState<Product | null>(
      null
    );

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchProduct =
      async () => {
        if (!id) {
          return;
        }

        setLoading(true);

        try {
          const result =
            await getProductById(
              Number(id)
            );

          setProduct(result);
        } catch {
          toast.error(
            'Product not found'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProduct();
  }, [id]);

  const handleAddToCart =
    async () => {
      if (!product) {
        return;
      }

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await addToCart(
          product.id,
          quantity
        );

        toast.success(
          'Added to cart'
        );
      } catch {
        toast.error(
          'Cannot add item'
        );
      }
    };

  if (loading) {
    return (
      <div className="empty-state">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state">
        Product not found.
      </div>
    );
  }

  const imageUrl =
    getImageUrl(product.image);

  return (
    <section className="detail-layout">
      <Link
        to="/products"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Products
      </Link>

      <div className="detail-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
          />
        ) : (
          <Package size={72} />
        )}
      </div>

      <div className="detail-content">
        <span className="eyebrow">
          Product
        </span>

        <h1>{product.title}</h1>

        <p className="muted">
          {product.description}
        </p>

        <div className="detail-price">
          {formatPrice(product.price)}
        </div>

        <div className="stock-row">
          <span className="stock-pill">
            Stock {product.stock}
          </span>
        </div>

        <div className="purchase-row">
          <div className="stepper">
            <button
              type="button"
              onClick={() =>
                setQuantity(
                  (current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                )
              }
              title="Decrease"
            >
              <Minus size={16} />
            </button>

            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Math.max(
                    1,
                    Number(
                      event.target.value
                    ) || 1
                  )
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setQuantity(
                  (current) =>
                    Math.min(
                      product.stock,
                      current + 1
                    )
                )
              }
              title="Increase"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
