import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  Filter,
  Search,
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
    <section className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            Catalog
          </span>

          <h1>Products</h1>
        </div>
      </div>

      <div className="toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
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

        <label className="select-field">
          <Filter size={18} />
          <select
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
          className="price-input"
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
          className="price-input"
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
        <div className="empty-state">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          No products found.
        </div>
      ) : (
        <div className="product-grid">
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
          <div className="pagination">
            <button
              type="button"
              className="secondary-button"
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

            <span>
              Page {pagination.page} of{' '}
              {pagination.totalPages}
            </span>

            <button
              type="button"
              className="secondary-button"
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
