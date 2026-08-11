"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type {
  Product,
  CreateProductPayload,
  Operator,
  CreateOperatorPayload,
  OrderStatus,
  LegacyMilestone,
  CreateLegacyPayload,
} from "@/types/database";

// ─── Supabase Admin Client ────────────────────────────────────────────────────

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase configuration in environment variables");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ─── Session Guard ────────────────────────────────────────────────────────────

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    throw new Error("Unauthorized: Admin authentication required");
  }
}

// ─── Shared Image Upload Helper ───────────────────────────────────────────────

async function uploadImage(formData: FormData, prefix: string): Promise<string> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error("Failed to upload image: " + uploadError.message);

  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
  return data.publicUrl;
}

// ─── Product Server Actions ───────────────────────────────────────────────────

export async function createProductAction(payload: CreateProductPayload): Promise<Product> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { data, error } = await supabase.from("products").insert(payload).select().single();
  if (error) throw new Error("Failed to create product: " + error.message);
  return data as Product;
}

export async function updateProductAction(id: string, payload: CreateProductPayload): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) throw new Error("Failed to update product: " + error.message);
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error("Failed to delete product: " + error.message);
}

export async function uploadProductImageAction(formData: FormData): Promise<string> {
  return uploadImage(formData, "product");
}

// ─── Order Server Actions ─────────────────────────────────────────────────────

export async function updateOrderStatusAction(orderId: string, status: OrderStatus): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error("Failed to update order status: " + error.message);
}

// ─── Operator Server Actions ──────────────────────────────────────────────────

export async function createOperatorAction(payload: CreateOperatorPayload): Promise<Operator> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { data, error } = await supabase.from("operators").insert(payload).select().single();
  if (error) throw new Error("Failed to create operator: " + error.message);
  return data as Operator;
}

export async function updateOperatorAction(id: string, payload: CreateOperatorPayload): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("operators").update(payload).eq("id", id);
  if (error) throw new Error("Failed to update operator: " + error.message);
}

export async function deleteOperatorAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("operators").delete().eq("id", id);
  if (error) throw new Error("Failed to delete operator: " + error.message);
}

export async function uploadOperatorImageAction(formData: FormData): Promise<string> {
  return uploadImage(formData, "operator");
}

// ─── Legacy Milestone Server Actions ─────────────────────────────────────────

export async function createLegacyAction(payload: CreateLegacyPayload): Promise<LegacyMilestone> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { data, error } = await supabase.from("legacy_milestones").insert(payload).select().single();
  if (error) throw new Error("Failed to create milestone: " + error.message);
  return data as LegacyMilestone;
}

export async function updateLegacyAction(id: string, payload: CreateLegacyPayload): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("legacy_milestones").update(payload).eq("id", id);
  if (error) throw new Error("Failed to update milestone: " + error.message);
}

export async function deleteLegacyAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase.from("legacy_milestones").delete().eq("id", id);
  if (error) throw new Error("Failed to delete milestone: " + error.message);
}

export async function uploadLegacyImageAction(formData: FormData): Promise<string> {
  return uploadImage(formData, "legacy");
}
