import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  Filter,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import {
  getProducts,
} from '../../services/product.service';

import {
  addToCart,
} from '../../services/cart.service';

import type {
  Pagination,
  Product,
} from '../../types/product.types';

import ProductCard from '../../components/product/ProductCard';

import { useAuth } from '../../hooks/useAuth';

export default function ProductListPage() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    sort,
    setSort,
  ] = useState('newest');

  const [
    minPrice,
    setMinPrice,
  ] = useState('');

  const [
    maxPrice,
    setMaxPrice,
  ] = useState('');

  const [
    page,
    setPage,
  ] = useState(1);

  useEffect(() => {
    const fetchProducts =
      async () => {
        setLoading(true);

        try {
          const result =
            await getProducts({
              page,
              limit: 12,
              search,
              sort,
              min: minPrice
                ? Number(minPrice)
                : undefined,
              max: maxPrice
                ? Number(maxPrice)
                : undefined,
            });

          setProducts(
            result.products
          );

          setPagination(
            result.pagination
          );
        } catch {
          toast.error(
            'Cannot load products'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [
    page,
    search,
    sort,
    minPrice,
    maxPrice,
  ]);

  const handleAddToCart =
    async (product: Product) => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await addToCart(
          product.id,
          1
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

  const resetPage = (
    next: () => void
  ) => {
    setPage(1);
    next();
  };

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-emerald-700 ring-1 ring-emerald-100">
            Catalog
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Products
          </h1>
        </div>

        {pagination && (
          <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
            {pagination.total} items
          </span>
        )}
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr)_190px_120px_120px]">
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} />
          <input
            className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(event) =>
              resetPage(() =>
                setSearch(
                  event.target.value
                )
              )
            }
          />
        </label>

        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
          <Filter size={18} />
          <select
            className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
            value={sort}
            onChange={(event) =>
              resetPage(() =>
                setSort(
                  event.target.value
                )
              )
            }
          >
            <option value="newest">
              Newest
            </option>
            <option value="price_asc">
              Price low to high
            </option>
            <option value="price_desc">
              Price high to low
            </option>
          </select>
        </label>

        <input
          className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          type="number"
          min="0"
          placeholder="Min"
          value={minPrice}
          onChange={(event) =>
            resetPage(() =>
              setMinPrice(
                event.target.value
              )
            )
          }
        />

        <input
          className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          type="number"
          min="0"
          placeholder="Max"
          value={maxPrice}
          onChange={(event) =>
            resetPage(() =>
              setMaxPrice(
                event.target.value
              )
            )
          }
        />
      </div>

      {loading ? (
        <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="grid min-h-56 place-items-center gap-3 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <SlidersHorizontal
            size={34}
            className="text-slate-400"
          />
          <p className="font-bold text-slate-600">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {products.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={
                  handleAddToCart
                }
              />
            )
          )}
        </div>
      )}

      {pagination &&
        pagination.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page <= 1}
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1
                )
              }
            >
              Previous
            </button>

            <span className="text-sm font-black text-slate-600">
              Page {pagination.page} of{' '}
              {pagination.totalPages}
            </span>

            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                page >=
                pagination.totalPages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1
                )
              }
            >
              Next
            </button>
          </div>
        )}
    </section>
  );
}
