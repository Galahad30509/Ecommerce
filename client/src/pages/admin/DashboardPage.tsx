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
    useCallback(async () => {
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
    loadAdminData();
  }, [loadAdminData]);

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
      <div className="empty-state">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            Admin
          </span>
          <h1>Dashboard</h1>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadAdminData}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <span>Users</span>
          <strong>
            {stats?.totalUsers ?? 0}
          </strong>
        </div>

        <div className="stat-tile">
          <span>Products</span>
          <strong>
            {stats?.totalProducts ?? 0}
          </strong>
        </div>

        <div className="stat-tile">
          <span>Orders</span>
          <strong>
            {stats?.totalOrders ?? 0}
          </strong>
        </div>

        <div className="stat-tile">
          <span>Revenue</span>
          <strong>
            {formatPrice(
              stats?.totalRevenue ?? 0
            )}
          </strong>
        </div>
      </div>

      <div className="admin-grid">
        <form
          className="admin-panel stack-form"
          onSubmit={handleSubmit}
        >
          <div className="panel-heading">
            <h2>
              {editingId
                ? 'Edit Product'
                : 'New Product'}
            </h2>

            {editingId && (
              <button
                type="button"
                className="icon-button"
                onClick={resetForm}
                title="Cancel"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <label>
            Title
            <input
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

          <label>
            Description
            <textarea
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

          <div className="form-row">
            <label>
              Price
              <input
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

            <label>
              Stock
              <input
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

          <label>
            Image URL
            <input
              value={form.image}
              onChange={(event) =>
                updateField(
                  'image',
                  event.target.value
                )
              }
            />
          </label>

          <label className="file-input">
            <Upload size={18} />
            <span>
              {imageFile
                ? imageFile.name
                : 'Upload image'}
            </span>
            <input
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
            className="primary-button wide-button"
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

        <div className="admin-panel">
          <div className="panel-heading">
            <h2>Products</h2>
          </div>

          <div className="admin-table">
            {products.map(
              (product) => {
                const imageUrl =
                  getImageUrl(
                    product.image
                  );

                return (
                  <article
                    className="admin-product-row"
                    key={product.id}
                  >
                    <div className="admin-product-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                        />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>

                    <div>
                      <strong>
                        {product.title}
                      </strong>
                      <span className="muted">
                        {formatPrice(
                          product.price
                        )}{' '}
                        · Stock{' '}
                        {product.stock}
                      </span>
                    </div>

                    <div className="row-tools">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() =>
                          startEdit(product)
                        }
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        type="button"
                        className="icon-button danger"
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
          <div className="admin-panel">
            <div className="panel-heading">
              <h2>Recent Orders</h2>
            </div>

            <div className="order-list">
              {stats.recentOrders.map(
                (order) => (
                  <div
                    className="order-row"
                    key={order.id}
                  >
                    <div>
                      <strong>
                        Order #{order.id}
                      </strong>
                      <span className="muted">
                        {order.user.name} ·{' '}
                        {formatDate(
                          order.createdAt
                        )}
                      </span>
                    </div>

                    <strong>
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
