import { supabase } from "./supabase";
import type { Order, Product, CreateOrderPayload, CreateProductPayload, OrderStatus, Operator, CreateOperatorPayload } from "@/types/database";

// ─── Security Helpers ────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace to prevent XSS injection */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/[<>"'`;]/g, "").trim();
}

/** Validate Pakistan phone format: 03XXXXXXXXX or +923XXXXXXXXX */
const PK_PHONE_REGEX = /^(03\d{9}|\+923\d{9})$/;

// ─── Order CRUD ──────────────────────────────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  // 1. Sanitize text fields
  const cleanPayload = {
    customer_name: sanitize(payload.customer_name),
    phone: payload.phone.replace(/\s/g, ""), // strip spaces before validation
    city: sanitize(payload.city),
    address: sanitize(payload.address),
    items: payload.items,
    total_amount: payload.total_amount,
  };

  // 2. Validate required fields
  if (!cleanPayload.customer_name || !cleanPayload.city || !cleanPayload.address) {
    throw new Error("Missing required fields: name, city, address");
  }

  // 3. Validate phone number
  if (!PK_PHONE_REGEX.test(cleanPayload.phone)) {
    throw new Error("Invalid phone number format. Use 03XXXXXXXXX or +923XXXXXXXXX");
  }

  // 4. Verify total against actual product prices (anti-tampering)
  const { data: products } = await supabase
    .from("products")
    .select("id, variants");

  if (products && products.length > 0) {
    let verifiedTotal = 0;
    for (const item of cleanPayload.items) {
      // Find the product containing this variant
      const product = products.find((p: { id: string; variants: { size: string; price: number }[] }) =>
        p.variants?.some((v: { size: string; price: number }) => v.size === item.size)
      );
      if (product) {
        const variant = product.variants.find((v: { size: string; price: number }) => v.size === item.size);
        if (variant) {
          verifiedTotal += variant.price * item.quantity;
        }
      }
    }
    // Use server-verified total instead of client-submitted one
    if (verifiedTotal > 0) {
      cleanPayload.total_amount = verifiedTotal;
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({ ...cleanPayload, status: "Pending" })
    .select()
    .single();

  if (error) throw new Error("Failed to create order: " + error.message);
  return data as Order;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch orders: " + error.message);
  return data as Order[];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error("Failed to update status: " + error.message);
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch products: " + error.message);
  return data as Product[];
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error("Failed to create product: " + error.message);
  return data as Product;
}

export async function updateProduct(id: string, payload: CreateProductPayload): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error("Failed to update product: " + error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to delete product: " + error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) throw new Error("Failed to upload image: " + uploadError.message);

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ─── Operator CRUD ──────────────────────────────────────────────────────────

export async function fetchOperators(): Promise<Operator[]> {
  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to fetch operators: " + error.message);
  return data as Operator[];
}

export async function createOperator(payload: CreateOperatorPayload): Promise<Operator> {
  const { data, error } = await supabase
    .from("operators")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error("Failed to create operator: " + error.message);
  return data as Operator;
}

export async function updateOperator(id: string, payload: CreateOperatorPayload): Promise<void> {
  const { error } = await supabase
    .from("operators")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error("Failed to update operator: " + error.message);
}

export async function deleteOperator(id: string): Promise<void> {
  const { error } = await supabase
    .from("operators")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to delete operator: " + error.message);
}

export async function uploadOperatorImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `operator-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (uploadError) throw new Error("Failed to upload image: " + uploadError.message);

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
