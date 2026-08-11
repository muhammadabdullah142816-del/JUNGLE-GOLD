"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase"; // needed for realtime only
import { fetchOrders, updateOrderStatus, fetchProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, fetchOperators, createOperator, updateOperator, deleteOperator, uploadOperatorImage } from "@/lib/api";
import { logout } from "./login/actions";
import type { Order, Product, OrderStatus, ProductVariant, Operator } from "@/types/database";
import {
  Package, ShoppingBag, LogOut, RefreshCw,
  TrendingUp, Clock, Truck, CheckCircle2,
  Search, XCircle, Plus, Image as ImageIcon, Trash2, Edit2, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "operators">("orders");

  return (
    <div className="min-h-screen bg-forest text-cream font-sans pb-20">
      {/* Header */}
      <header className="glass-card-dark border-b border-gold/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand-logo.png" alt="Jungle Gold Logo" className="h-10 w-10 rounded-full object-contain" />
            <div>
              <span className="font-serif text-lg font-bold text-gold">Jungle Gold</span>
              <span className="text-cream/40 text-xs ml-2 uppercase tracking-wider hidden sm:inline-block">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === "orders" ? "text-gold" : "text-cream/50 hover:text-cream"
                }`}
              >
                <ShoppingBag size={16} /> Orders
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === "products" ? "text-gold" : "text-cream/50 hover:text-cream"
                }`}
              >
                <Package size={16} /> Products
              </button>
              <button
                onClick={() => setActiveTab("operators")}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === "operators" ? "text-gold" : "text-cream/50 hover:text-cream"
                }`}
              >
                <Users size={16} /> Team
              </button>
            </nav>
            <div className="w-px h-6 bg-white/10" />
            <form action={logout}>
              <button type="submit" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                <LogOut size={16} /> Exit
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "orders" ? <OrdersTab /> : activeTab === "products" ? <ProductsTab /> : <OperatorsTab />}
      </main>
    </div>
  );
}

// ─── Status Styles ──────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-yellow-900/60 text-yellow-300 border-yellow-700/40",
  Processing: "bg-blue-900/60 text-blue-300 border-blue-700/40",
  Shipped: "bg-purple-900/60 text-purple-300 border-purple-700/40",
  Delivered: "bg-green-900/60 text-green-300 border-green-700/40",
  Cancelled: "bg-red-900/60 text-red-300 border-red-700/40",
};

// ─── Orders Tab ───────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Pending" | "Shipped" | "Delivered" | "Cancelled">("All");

  async function loadOrders() {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Supabase fetch error:", err);
        setFetchError(err.message);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();

    // Setup Supabase Realtime Listener
    const channel = supabase
      .channel("orders-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o)));
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const originalOrders = [...orders];
    // Optimistic update
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as OrderStatus } : o));
    
    try {
      await updateOrderStatus(id, newStatus as OrderStatus);
    } catch (err: unknown) {
      setOrders(originalOrders); // Revert on error
      if (err instanceof Error) {
        alert("Failed to update status: " + err.message + "\n\n(Make sure you have an RLS policy allowing UPDATE)");
      }
    }
  }

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (filterTab !== "All" && o.status !== filterTab) return false;
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        if (
          !o.customer_name.toLowerCase().includes(q) &&
          !o.phone.includes(q) &&
          !String(o.order_number).includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [orders, search, filterTab]);

  // KPI Stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "Pending").length;
    const revenue = orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
    return { totalOrders, pendingOrders, revenue };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-white/5"><ShoppingBag size={100} /></div>
          <p className="text-cream/50 text-sm mb-1 uppercase tracking-wider font-medium">Total Orders</p>
          <p className="font-serif text-3xl font-bold text-cream">{stats.totalOrders}</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-yellow-500/5"><Clock size={100} /></div>
          <p className="text-yellow-400/70 text-sm mb-1 uppercase tracking-wider font-medium">Pending</p>
          <p className="font-serif text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-green-500/5"><TrendingUp size={100} /></div>
          <p className="text-green-400/70 text-sm mb-1 uppercase tracking-wider font-medium">Est. Revenue</p>
          <p className="font-serif text-3xl font-bold text-green-400">Rs. {stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 rounded-xl border border-white/5">
        <div className="flex bg-white/5 rounded-lg p-1 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab as "All" | "Pending" | "Shipped" | "Delivered" | "Cancelled")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                filterTab === tab ? "bg-white/10 text-gold shadow-sm" : "text-cream/40 hover:text-cream/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input
            type="text"
            placeholder="Search name, phone, order #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-cream/40 text-left bg-white/5">
                <th className="px-5 py-4 font-medium">Order #</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Items</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-cream/40">Loading orders...</td></tr>
              ) : fetchError ? (
                <tr><td colSpan={6} className="text-center py-10 text-red-400">Error fetching orders: {fetchError}</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-cream/40">No orders found.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-gold/80">#{order.order_number}</td>
                    <td className="px-5 py-4 text-cream/60 whitespace-nowrap">
                      {new Date(order.created_at!).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-cream">{order.customer_name}</div>
                      <div className="text-cream/40 text-xs mt-1">{order.phone}</div>
                      <div className="text-cream/30 text-xs truncate max-w-[150px]">{order.city} - {order.address}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-xs text-cream/70 whitespace-nowrap">
                            {item.quantity}x {item.size} <span className="text-cream/30">({item.price})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-cream whitespace-nowrap">
                      Rs. {Number(order.total_amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id!, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-md border appearance-none focus:outline-none cursor-pointer ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}
                      >
                        <option value="Pending" className="bg-forest text-cream">Pending</option>
                        <option value="Processing" className="bg-forest text-cream">Processing</option>
                        <option value="Shipped" className="bg-forest text-cream">Shipped</option>
                        <option value="Delivered" className="bg-forest text-cream">Delivered</option>
                        <option value="Cancelled" className="bg-forest text-cream">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err);
      setProducts([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  function openModal(product: Product | null = null) {
    setEditingProduct(product);
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setImages([...(product.images || [])]);
      setVariants([...(product.variants || [])]);
    } else {
      setTitle("");
      setDescription("");
      setImages([]);
      setVariants([{ id: "var-" + Date.now(), size: "", price: 0, in_stock: true }]);
    }
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const url = await uploadProductImage(file);
      setImages([...images, url]);
    } catch (err: unknown) {
      if (err instanceof Error) alert("Upload failed: " + err.message);
    }
    setIsUploading(false);
  }

  async function handleSave() {
    if (!title || variants.length === 0) return alert("Title and at least 1 variant required");
    setIsSaving(true);
    const payload = { title, description, images, variants };
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      await loadProducts();
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) alert("Failed to save product: " + err.message);
    }
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) alert("Failed to delete product: " + err.message);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-cream">Product Catalog</h2>
        <div className="flex items-center gap-4">
          <button onClick={loadProducts} className="text-gold/70 hover:text-gold text-sm flex items-center gap-2"><RefreshCw size={14}/> Refresh</button>
          <button onClick={() => openModal()} className="bg-gold text-forest px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gold-light transition-all shadow-gold-glow">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-cream/40">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-10 text-cream/40">No products found.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl border border-gold/10 overflow-hidden flex flex-col">
              <div className="relative h-48 bg-white/5 flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-white/10" size={48} />
                )}
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-cream/80 backdrop-blur-sm">
                  {product.variants?.length || 0} variant(s)
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif font-bold text-lg text-cream mb-1">{product.title}</h3>
                <p className="text-cream/50 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  {product.variants?.map(v => (
                    <div key={v.id} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded">
                      <span className="text-cream/70">{v.size}</span>
                      <span className="text-gold font-medium">Rs. {v.price}</span>
                      <span className={v.in_stock ? "text-green-400" : "text-red-400"}>{v.in_stock ? "In Stock" : "Out"}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => openModal(product)} className="flex-1 border border-gold/20 hover:bg-gold/10 text-gold py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="px-3 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-forest border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-bold text-cream">{editingProduct ? "Edit Product" : "New Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-cream/40 hover:text-cream"><XCircle size={24} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-cream/70 mb-1">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-gold outline-none" placeholder="e.g. Sidr Honey" />
              </div>
              
              <div>
                <label className="block text-sm text-cream/70 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-gold outline-none h-24" placeholder="Product details..." />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm text-cream/70 mb-2">Image Gallery</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500/80 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 hover:border-gold/50 flex flex-col items-center justify-center text-cream/40 hover:text-gold cursor-pointer transition-colors">
                    {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Plus size={24} />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
              </div>

              {/* Variants */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-cream/70">Variants (Size & Pricing)</label>
                  <button onClick={() => setVariants([...variants, { id: "var-" + Date.now(), size: "", price: 0, in_stock: true }])} className="text-xs text-gold hover:underline flex items-center gap-1"><Plus size={12}/> Add Variant</button>
                </div>
                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div key={v.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                      <input type="text" value={v.size} onChange={e => { const nv = [...variants]; nv[i].size = e.target.value; setVariants(nv); }} placeholder="Size (e.g. 200ml)" className="flex-1 bg-transparent border-b border-white/20 text-cream text-sm outline-none focus:border-gold" />
                      <input type="number" value={v.price} onChange={e => { const nv = [...variants]; nv[i].price = Number(e.target.value); setVariants(nv); }} placeholder="Price" className="w-24 bg-transparent border-b border-white/20 text-cream text-sm outline-none focus:border-gold" />
                      <label className="flex items-center gap-2 text-sm text-cream/70 cursor-pointer">
                        <input type="checkbox" checked={v.in_stock} onChange={e => { const nv = [...variants]; nv[i].in_stock = e.target.checked; setVariants(nv); }} className="accent-gold w-4 h-4" />
                        In Stock
                      </label>
                      <button onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-cream/70 hover:text-cream">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-gold text-forest px-6 py-2 rounded-lg font-bold hover:bg-gold-light transition-all flex items-center gap-2">
                {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {isSaving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Operators Tab ────────────────────────────────────────────────────────
function OperatorsTab() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<Operator | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function loadOperators() {
    setLoading(true);
    try {
      const data = await fetchOperators();
      setOperators(data);
    } catch {
      setOperators([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOperators();
  }, []);

  function openModal(op: Operator | null = null) {
    setEditingOp(op);
    if (op) {
      setName(op.name);
      setRole(op.role);
      setDescription(op.description);
      setImageUrl(op.image_url || "");
    } else {
      setName("");
      setRole("");
      setDescription("");
      setImageUrl("");
    }
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const url = await uploadOperatorImage(e.target.files[0]);
      setImageUrl(url);
    } catch (err: unknown) {
      if (err instanceof Error) alert("Upload failed: " + err.message);
    }
    setIsUploading(false);
  }

  async function handleSave() {
    if (!name || !role) return alert("Name and role are required");
    setIsSaving(true);
    const payload = { name, role, description, image_url: imageUrl };
    try {
      if (editingOp) {
        await updateOperator(editingOp.id, payload);
      } else {
        await createOperator(payload);
      }
      await loadOperators();
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) alert("Failed to save: " + err.message);
    }
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    try {
      await deleteOperator(id);
      await loadOperators();
    } catch (err: unknown) {
      if (err instanceof Error) alert("Failed to delete: " + err.message);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-cream">Team & Operators</h2>
        <div className="flex items-center gap-4">
          <button onClick={loadOperators} className="text-gold/70 hover:text-gold text-sm flex items-center gap-2"><RefreshCw size={14}/> Refresh</button>
          <button onClick={() => openModal()} className="bg-gold text-forest px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gold-light transition-all shadow-gold-glow">
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-cream/40">Loading team...</div>
        ) : operators.length === 0 ? (
          <div className="col-span-full text-center py-10 text-cream/40">No team members yet.</div>
        ) : (
          operators.map((op) => (
            <div key={op.id} className="glass-card rounded-2xl border border-gold/10 overflow-hidden flex flex-col">
              <div className="relative h-52 bg-white/5 flex items-center justify-center overflow-hidden">
                {op.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={op.image_url} alt={op.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="text-white/10" size={48} />
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif font-bold text-lg text-cream">{op.name}</h3>
                <p className="text-gold text-sm font-medium mb-2">{op.role}</p>
                <p className="text-cream/50 text-sm line-clamp-3 flex-1">{op.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openModal(op)} className="flex-1 border border-gold/20 hover:bg-gold/10 text-gold py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(op.id)} className="px-3 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-forest border border-gold/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-bold text-cream">{editingOp ? "Edit Member" : "New Member"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-cream/40 hover:text-cream"><XCircle size={24} /></button>
            </div>

            <div className="space-y-5">
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                  {imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="text-white/20" size={32} />
                  )}
                </div>
                <label className="text-sm text-gold hover:underline cursor-pointer flex items-center gap-2">
                  {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                  {isUploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>

              <div>
                <label className="block text-sm text-cream/70 mb-1">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-gold outline-none" placeholder="e.g. Ahmed Khan" />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1">Role</label>
                <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-gold outline-none" placeholder="e.g. Head Beekeeper" />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-gold outline-none h-24" placeholder="Brief bio..." />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-cream/70 hover:text-cream">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-gold text-forest px-6 py-2 rounded-lg font-bold hover:bg-gold-light transition-all flex items-center gap-2">
                {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {isSaving ? "Saving..." : "Save Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
