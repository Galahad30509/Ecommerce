export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | string;
  stock: number;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListPayload {
  products: Product[];
  pagination: Pagination;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: ProductListPayload;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}
