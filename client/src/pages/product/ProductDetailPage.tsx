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
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Product not found.
      </div>
    );
  }

  const imageUrl =
    getImageUrl(product.image);

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(280px,0.92fr)_minmax(340px,1.08fr)] lg:items-start">
      <Link
        to="/products"
        className="inline-flex w-fit items-center gap-2 rounded-lg px-1 py-2 text-sm font-black text-emerald-700 transition hover:text-emerald-800 lg:col-span-2"
      >
        <ArrowLeft size={18} />
        Products
      </Link>

      <div className="grid aspect-square place-items-center overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-100 via-teal-50 to-amber-50 text-slate-400 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package size={72} />
        )}
      </div>

      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="inline-flex w-fit rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-emerald-700 ring-1 ring-emerald-100">
          Product
        </span>

        <div className="grid gap-3">
          <h1 className="text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
            {product.title}
          </h1>

          <p className="text-base leading-7 text-slate-600">
            {product.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <strong className="text-3xl font-black text-emerald-700">
            {formatPrice(product.price)}
          </strong>

          <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-700 ring-1 ring-amber-100">
            Stock {product.stock}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="grid h-11 grid-cols-[2.75rem_4.5rem_2.75rem] overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              className="grid place-items-center text-emerald-700 transition hover:bg-emerald-50"
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
              className="w-full border-x border-slate-200 text-center text-sm font-black outline-none"
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
              className="grid place-items-center text-emerald-700 transition hover:bg-emerald-50"
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
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
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
