import { Link } from 'react-router-dom';

import {
  Eye,
  Package,
  ShoppingCart,
} from 'lucide-react';

import type { Product } from '../../types/product.types';

import {
  formatPrice,
  getImageUrl,
} from '../../utils/format';

interface Props {
  product: Product;
  onAddToCart?: (
    product: Product
  ) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: Props) {
  const imageUrl =
    getImageUrl(product.image);

  return (
    <article className="group grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      <Link
        to={`/products/${product.id}`}
        className="grid aspect-4/3 place-items-center overflow-hidden bg-linear-to-br from-slate-100 via-teal-50 to-amber-50 text-slate-400"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <Package size={44} />
        )}
      </Link>

      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <h3 className="line-clamp-1 text-lg font-black tracking-normal text-slate-950">
            {product.title}
          </h3>

          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <strong className="text-lg font-black text-emerald-700">
            {formatPrice(product.price)}
          </strong>

          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">
            Stock {product.stock}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Eye size={16} />
            Detail
          </Link>

          {onAddToCart && (
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                onAddToCart(product)
              }
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={16} />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
