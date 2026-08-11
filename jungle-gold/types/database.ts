export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface CartItem {
  id: string;
  title: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  items: CartItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export interface ProductVariant {
  id: string; // e.g. "variant-100ml"
  size: string; // e.g. "100ml", "200ml", "720ml"
  price: number;
  in_stock: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  created_at: string;
}

export type CreateOrderPayload = Omit<Order, "id" | "order_number" | "status" | "created_at">;
export type CreateProductPayload = Omit<Product, "id" | "created_at">;

export interface Operator {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  created_at: string;
}

export type CreateOperatorPayload = Omit<Operator, "id" | "created_at">;

export interface LegacyMilestone {
  id: string;
  year_or_date: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export type CreateLegacyPayload = Omit<LegacyMilestone, "id" | "created_at">;

