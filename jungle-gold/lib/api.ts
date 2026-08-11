import { supabase } from "./supabase";
import type { Order, Product, CreateOrderPayload, Operator, LegacyMilestone } from "@/types/database";

// ─── Security Helpers ────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace to prevent XSS injection */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/[<>"'`;]/g, "").trim();
}

/** Validate Pakistan phone format: 03XXXXXXXXX or +923XXXXXXXXX */
const PK_PHONE_REGEX = /^(03\d{9}|\+923\d{9})$/;

// ─── Order Creation (Public Storefront) ──────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  // 1. Sanitize text fields
  const cleanPayload = {
    customer_name: sanitize(payload.customer_name),
    phone: payload.phone.replace(/\s/g, ""), // strip spaces before validation
    city: sanitize(payload.city),
    address: sanitize(payload.address),
    items: payload.items,
    total_amount: 0,
  };

  // 2. Validate required fields
  if (!cleanPayload.customer_name || !cleanPayload.city || !cleanPayload.address) {
    throw new Error("Missing required fields: name, city, address");
  }

  // 3. Validate phone number
  if (!PK_PHONE_REGEX.test(cleanPayload.phone)) {
    throw new Error("Invalid phone number format. Use 03XXXXXXXXX or +923XXXXXXXXX");
  }

  if (!cleanPayload.items || cleanPayload.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 4. Strict Item Integrity & In-Stock Verification
  const { data: products, error: productErr } = await supabase
    .from("products")
    .select("id, title, variants");

  if (productErr || !products) {
    throw new Error("Failed to verify product availability");
  }

  let verifiedTotal = 0;

  for (const item of cleanPayload.items) {
    // Find matching product
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      throw new Error(`Product '${item.title}' is no longer available.`);
    }

    // Find matching variant
    const variant = product.variants?.find((v: { size: string; price: number; in_stock: boolean }) => v.size === item.size);
    if (!variant) {
      throw new Error(`Size '${item.size}' for '${product.title}' is not valid.`);
    }

    if (!variant.in_stock) {
      throw new Error(`Item '${product.title}' (${variant.size}) is currently out of stock.`);
    }

    // Accumulate total using verified server price
    verifiedTotal += variant.price * item.quantity;
  }

  cleanPayload.total_amount = verifiedTotal;

  // 5. Force status to "Pending"
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...cleanPayload, status: "Pending" })
    .select()
    .single();

  if (error) throw new Error("Failed to create order: " + error.message);
  return data as Order;
}

// ─── Public Fetch Functions ──────────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch orders: " + error.message);
  return data as Order[];
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch products: " + error.message);
  return data as Product[];
}

export async function fetchOperators(): Promise<Operator[]> {
  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to fetch operators: " + error.message);
  return data as Operator[];
}

export async function fetchLegacyMilestones(): Promise<LegacyMilestone[]> {
  const { data, error } = await supabase
    .from("legacy_milestones")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error("Failed to fetch legacy milestones: " + error.message);
  return data as LegacyMilestone[];
}

