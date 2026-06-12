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

  console.log(
    '===================='
  );

  console.log(
    'PRODUCT =>',
    product
  );

  console.log(
    'PRODUCT IMAGE =>',
    product.image
  );

  console.log(
    'IMAGE URL =>',
    imageUrl
  );

  console.log(
    '===================='
  );

  return (
    <div className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-image"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            onLoad={() => {
              console.log(
                'IMAGE LOAD SUCCESS =>',
                imageUrl
              );
            }}
            onError={(e) => {
              console.log(
                'IMAGE LOAD FAILED =>',
                imageUrl
              );

              console.log(
                'PRODUCT =>',
                product
              );

              console.log(
                'ERROR EVENT =>',
                e
              );
            }}
          />
        ) : (
          <>
            {console.log(
              'NO IMAGE FOUND FOR PRODUCT =>',
              product
            )}

            <Package size={42} />
          </>
        )}
      </Link>

      <div className="product-card-body">
        <div>
          <h3>{product.title}</h3>

          <p className="muted line-clamp">
            {product.description}
          </p>
        </div>

        <div className="product-meta">
          <strong>
            {formatPrice(product.price)}
          </strong>

          <span className="stock-pill">
            Stock {product.stock}
          </span>
        </div>

        <div className="card-actions">
          <Link
            to={`/products/${product.id}`}
            className="secondary-button"
          >
            <Eye size={16} />
            Detail
          </Link>

          {onAddToCart && (
            <button
              type="button"
              className="primary-button"
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
    </div>
  );
}