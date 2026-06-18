import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import {
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../services/product.service';

import {
  getDashboardStats,
} from '../../services/admin.service';

import {
  uploadProductImage,
} from '../../services/upload.service';

import type {
  DashboardStats,
} from '../../types/admin.types';

import type {
  Product,
  ProductInput,
} from '../../types/product.types';

import {
  formatDate,
  formatPrice,
  getImageUrl,
} from '../../utils/format';

interface ProductFormState {
  title: string;
  description: string;
  price: string;
  stock: string;
  image: string;
}

const emptyForm: ProductFormState = {
  title: '',
  description: '',
  price: '',
  stock: '',
  image: '',
};

const inputClass =
  'min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100';

export default function DashboardPage() {
  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats | null>(
      null
    );

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    form,
    setForm,
  ] =
    useState<ProductFormState>(
      emptyForm
    );

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(
    null
  );

  const [
    imageFile,
    setImageFile,
  ] = useState<File | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const loadAdminData =
    useCallback(async (
      showLoading = false
    ) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const [
          dashboard,
          productResult,
        ] = await Promise.all([
          getDashboardStats(),
          getProducts({
            page: 1,
            limit: 100,
          }),
        ]);

        setStats(dashboard);
        setProducts(
          productResult.products
        );
      } catch {
        toast.error(
          'Cannot load admin data'
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    let active = true;

    Promise.all([
      getDashboardStats(),
      getProducts({
        page: 1,
        limit: 100,
      }),
    ])
      .then(([
        dashboard,
        productResult,
      ]) => {
        if (!active) {
          return;
        }

        setStats(dashboard);
        setProducts(
          productResult.products
        );
      })
      .catch(() => {
        toast.error(
          'Cannot load admin data'
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

  const updateField = (
    field: keyof ProductFormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
  };

  const startEdit = (
    product: Product
  ) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description:
        product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || '',
    });
    setImageFile(null);
  };

  const buildPayload =
    async (): Promise<ProductInput> => {
      let image =
        form.image.trim();

      if (imageFile) {
        image =
          await uploadProductImage(
            imageFile
          );
      }

      return {
        title: form.title.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        ...(image
          ? {
              image,
            }
          : {}),
      };
    };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload =
        await buildPayload();

      if (editingId) {
        await updateProduct(
          editingId,
          payload
        );

        toast.success(
          'Product updated'
        );
      } else {
        await createProduct(
          payload
        );

        toast.success(
          'Product created'
        );
      }

      resetForm();
      await loadAdminData();
    } catch {
      toast.error(
        'Cannot save product'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete =
    async (productId: number) => {
      const confirmed =
        window.confirm(
          'Delete this product?'
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteProduct(
          productId
        );

        toast.success(
          'Product deleted'
        );

        await loadAdminData();
      } catch {
        toast.error(
          'Cannot delete product'
        );
      }
    };

  if (loading) {
    return (
      <div className="grid min-h-56 place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-rose-700 ring-1 ring-rose-100">
            Admin
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Dashboard
          </h1>
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          onClick={() =>
            loadAdminData(true)
          }
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-sm font-black text-slate-500">
            Users
          </span>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats?.totalUsers ?? 0}
          </strong>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-sm font-black text-slate-500">
            Products
          </span>
          <strong className="mt-2 block text-3xl font-black text-emerald-700">
            {stats?.totalProducts ?? 0}
          </strong>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-sm font-black text-slate-500">
            Orders
          </span>
          <strong className="mt-2 block text-3xl font-black text-amber-700">
            {stats?.totalOrders ?? 0}
          </strong>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-sm font-black text-slate-500">
            Revenue
          </span>
          <strong className="mt-2 block text-3xl font-black text-rose-700">
            {formatPrice(
              stats?.totalRevenue ?? 0
            )}
          </strong>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
        <form
          className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-950">
              {editingId
                ? 'Edit Product'
                : 'New Product'}
            </h2>

            {editingId && (
              <button
                type="button"
                className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                onClick={resetForm}
                title="Cancel"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Title
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) =>
                updateField(
                  'title',
                  event.target.value
                )
              }
              required
              minLength={3}
            />
          </label>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Description
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              value={form.description}
              onChange={(event) =>
                updateField(
                  'description',
                  event.target.value
                )
              }
              required
              minLength={10}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Price
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    'price',
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-black text-slate-700">
              Stock
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) =>
                  updateField(
                    'stock',
                    event.target.value
                  )
                }
                required
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Image URL
            <input
              className={inputClass}
              value={form.image}
              onChange={(event) =>
                updateField(
                  'image',
                  event.target.value
                )
              }
            />
          </label>

          <label className="relative flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100">
            <Upload size={18} />
            <span className="truncate">
              {imageFile
                ? imageFile.name
                : 'Upload image'}
            </span>
            <input
              className="absolute inset-0 cursor-pointer opacity-0"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) =>
                setImageFile(
                  event.target.files?.[0] ||
                    null
                )
              }
            />
          </label>

          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={saving}
          >
            {editingId ? (
              <Save size={18} />
            ) : (
              <Plus size={18} />
            )}
            {saving
              ? 'Saving...'
              : editingId
                ? 'Save Product'
                : 'Create Product'}
          </button>
        </form>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-slate-950">
              Products
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {products.map(
              (product) => {
                const imageUrl =
                  getImageUrl(
                    product.image
                  );

                return (
                  <article
                    className="grid gap-3 p-4 transition hover:bg-slate-50 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center"
                    key={product.id}
                  >
                    <div className="grid size-16 place-items-center overflow-hidden rounded-lg bg-linear-to-br from-slate-100 via-teal-50 to-amber-50 text-slate-400">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <strong className="block truncate text-base font-black text-slate-950">
                        {product.title}
                      </strong>
                      <span className="block truncate text-sm font-bold text-slate-500">
                        {formatPrice(
                          product.price
                        )}{' '}
                        - Stock {product.stock}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                        onClick={() =>
                          startEdit(product)
                        }
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        type="button"
                        className="grid size-10 place-items-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                        onClick={() =>
                          handleDelete(
                            product.id
                          )
                        }
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      </div>

      {stats?.recentOrders &&
        stats.recentOrders.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-black text-slate-950">
                Recent Orders
              </h2>
            </div>

            <div className="divide-y divide-slate-200">
              {stats.recentOrders.map(
                (order) => (
                  <div
                    className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                    key={order.id}
                  >
                    <div className="min-w-0">
                      <strong className="block text-base font-black text-slate-950">
                        Order #{order.id}
                      </strong>
                      <span className="block truncate text-sm font-bold text-slate-500">
                        {order.user.name} -{' '}
                        {formatDate(
                          order.createdAt
                        )}
                      </span>
                    </div>

                    <strong className="text-base font-black text-emerald-700">
                      {formatPrice(
                        order.totalPrice
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </section>
  );
}
