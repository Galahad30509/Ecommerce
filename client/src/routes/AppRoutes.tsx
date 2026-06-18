import {
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/Homepage';
import DashboardPage from '../pages/admin/DashboardPage';
import ProductListPage from '../pages/product/ProductListPage';
import ProductDetailPage from '../pages/product/ProductDetailPage';
import CartPage from '../pages/cart/CartPage';
import OrdersPage from '../pages/order/OrdersPage';
import OrderDetailPage from '../pages/order/OrderDetailPage';
import CheckoutSuccessPage from '../pages/checkout/CheckoutSuccessPage';
import CheckoutCancelPage from '../pages/checkout/CheckoutCancelPage';

import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/products"
        element={<ProductListPage />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetailPage />}
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/success"
        element={
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/cancel"
        element={
          <ProtectedRoute>
            <CheckoutCancelPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
