import React, { useEffect, useMemo, useState } from 'react';
import { User } from '../types';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ApiStore,
  type ApiProduct,
} from '../services/api';
import './Inventory.css';

interface InventoryProps {
  user: User;
  stores?: ApiStore[];
}

const Inventory: React.FC<InventoryProps> = ({ user, stores = [] }) => {
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [rows, setRows] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const isAdmin = user.role === 'Admin';
  const isManagerOrAdmin = user.role === 'Admin' || user.role === 'Manager';

  const loadInventory = async (storeId: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await listProducts(storeId);
      setRows(data);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeStores = stores.filter((store) => store.is_active);
    if (activeStores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(activeStores[0].id);
      return;
    }

    if (activeStores.length === 0) {
      setRows([]);
      setLoading(false);
    }
  }, [stores, selectedStoreId]);

  // Product CRUD states
  const [showProductForm, setShowProductForm] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState('');
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    brand: '',
    model: '',
    imei: '',
    condition: 'New',
    category: 'new_phone' as any,
    price: '',
    stock_quantity: '1',
    store_id: '',
  });

  useEffect(() => {
    if (selectedStoreId) {
      setNewProduct(prev => ({ ...prev, store_id: selectedStoreId }));
    }
  }, [selectedStoreId]);

  useEffect(() => {
    void loadInventory(selectedStoreId);
  }, [selectedStoreId]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      return (row.name && row.name.toLowerCase().includes(q))
        || (row.sku && row.sku.toLowerCase().includes(q))
        || (row.job_id && row.job_id.toLowerCase().includes(q))
        || (row.imei && row.imei.toLowerCase().includes(q))
        || (row.category && row.category.toLowerCase().includes(q));
    });
  }, [rows, search]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError('');
    setStatusMessage('');
    
    const targetStore = newProduct.store_id || selectedStoreId;
    if (!targetStore) {
      setProductFormError('Please select a store for the product.');
      return;
    }
    if (!newProduct.name || !newProduct.price) {
      setProductFormError('Name and price are required.');
      return;
    }

    try {
      setCreatingProduct(true);
      await createProduct({
        ...newProduct,
        store_id: targetStore,
        selling_price: newProduct.price.trim(),
        stock_quantity: newProduct.stock_quantity ? Number(newProduct.stock_quantity) : 1,
      } as any);
      setShowProductForm(false);
      setNewProduct({ sku: '', name: '', brand: '', model: '', imei: '', condition: 'New', category: 'new_phone', price: '', stock_quantity: '1', store_id: selectedStoreId });
      setStatusMessage('Product created successfully.');
      void loadInventory(selectedStoreId);
    } catch (err) {
      setProductFormError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    setStatusMessage('');
    try {
      await deleteProduct(productId);
      setStatusMessage('Product deleted successfully.');
      void loadInventory(selectedStoreId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleTransferProduct = async (productId: string, currentStoreId: string) => {
    const activeStores = stores.filter(s => s.is_active && s.id !== currentStoreId);
    if (activeStores.length === 0) {
      alert("No other active stores available for transfer.");
      return;
    }

    const storeOptions = activeStores.map(s => `${s.id} - ${s.name}`).join('\n');
    const targetStoreId = window.prompt(`Enter Target Store ID from the list below:\n${storeOptions}`);

    if (!targetStoreId) return;

    if (!activeStores.find(s => s.id === targetStoreId.trim())) {
      alert("Invalid Store ID.");
      return;
    }

    try {
      const token = window.sessionStorage.getItem("quality-mobiles-token");
      const res = await fetch(`/api/v1/product/transfer/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ target_store_id: targetStoreId.trim() })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to transfer");
      setStatusMessage('Product transferred successfully.');
      void loadInventory(selectedStoreId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer product');
    }
  };

  const totalUnits = filteredRows.reduce((sum, row) => sum + row.stock_quantity, 0);
  const lowStock = filteredRows.filter((row) => row.stock_quantity <= 1).length;
  const inventoryValue = filteredRows.reduce((sum, row) => sum + (Number(row.selling_price || row.price) * row.stock_quantity), 0);

  const canAdd = isAdmin;

  return (
    <div className="inventory-page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card inventory-top" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Inventory Management</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Store-specific product tracking with Unique Job IDs.
          </p>
        </div>
        {canAdd && (
          <button className="btn btn-primary" onClick={() => setShowProductForm(!showProductForm)}>
            {showProductForm ? 'Cancel' : '+ New Product'}
          </button>
        )}
      </div>

      {showProductForm && canAdd && (
        <form onSubmit={handleCreateProduct} className="card" style={{ padding: 24 }}>
          <h3>Create New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Assign to Store *</label>
              <select 
                className="form-input" 
                value={newProduct.store_id} 
                onChange={(e) => setNewProduct({ ...newProduct, store_id: e.target.value })}
                required
              >
                <option value="">Select Store</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Name *</label>
              <input className="form-input" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Category</label>
              <select className="form-input" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}>
                <option value="new_phone">New Phone</option>
                <option value="used_phone">Used Phone</option>
                <option value="accessories">Accessories</option>
                <option value="services">Services</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Brand</label>
              <input className="form-input" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Model</label>
              <input className="form-input" value={newProduct.model} onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>IMEI / Serial</label>
              <input className="form-input" value={newProduct.imei} onChange={(e) => setNewProduct({ ...newProduct, imei: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>SKU / Barcode</label>
              <input className="form-input" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Condition</label>
              <select className="form-input" value={newProduct.condition} onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Selling Price *</label>
              <input type="number" step="0.01" className="form-input" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Quantity</label>
              <input type="number" className="form-input" value={newProduct.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} />
            </div>
          </div>
          {productFormError && <p style={{ color: 'var(--color-error-600)', margin: '8px 0 0' }}>{productFormError}</p>}
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" type="submit" disabled={creatingProduct}>
              {creatingProduct ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      )}

      <div className="card inventory-form" style={{ padding: 16 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>View Store Inventory</label>
            <select
              className="form-input"
              value={selectedStoreId}
              onChange={(event) => setSelectedStoreId(event.target.value)}
              disabled={user.role !== 'Admin'}
            >
              {user.role === 'Admin' && <option value="">All Stores (Select to filter)</option>}
              {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Search</label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Job ID, IMEI, SKU, name..."
              className="form-input"
            />
          </div>
        </div>
      </div>

      {loading && <p className="inventory-state">Loading inventory...</p>}
      {error && <p className="inventory-state inventory-state-error">{error}</p>}
      {!error && statusMessage && <p className="inventory-state">{statusMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 inventory-stats">
        <div className="card inventory-stat-card" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', fontWeight: 700 }}>Total Items</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: 'var(--text-primary)' }}>{filteredRows.length}</p>
        </div>
        <div className="card inventory-stat-card" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', fontWeight: 700 }}>Total Quantity</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: 'var(--text-primary)' }}>{totalUnits.toLocaleString()}</p>
        </div>
        <div className="card inventory-stat-card" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', fontWeight: 700 }}>Low Stock</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: 'var(--text-primary)' }}>{lowStock}</p>
        </div>
      </div>

      <div className="card inventory-table-wrap" style={{ overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Estimated Inventory Value: Rs {Math.round(inventoryValue).toLocaleString()}
        </div>

        <table className="inventory-table-modern" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Job ID</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Product Details</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>IMEI / SKU</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Store</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const lowStockState = row.stock_quantity <= 1;
              const storeName = stores.find(s => s.id === row.store_id)?.name || 'Unknown Store';
              return (
                <tr key={row.id}>
                  <td style={{ padding: '14px 16px', fontFamily: 'Courier New, monospace', fontSize: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{row.job_id || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)' }}>
                    <div style={{ fontWeight: 700 }}>{row.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.brand} {row.model}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {row.imei && <div style={{ fontSize: 12 }}>IMEI: {row.imei}</div>}
                    {row.sku && <div style={{ fontSize: 12 }}>SKU: {row.sku}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>{storeName}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{row.category}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-primary)', fontWeight: 700 }}>Rs {Number(row.selling_price || row.price).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: lowStockState ? 'var(--color-warning-600)' : 'var(--text-primary)', fontWeight: 800 }}>{row.stock_quantity}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {isAdmin && (
                        <>
                          <button
                            className="btn btn-sm"
                            onClick={async () => {
                              const input = window.prompt('Enter new quantity for ' + row.name + ' (current: ' + row.stock_quantity + ')');
                              if (!input) return;
                              const qty = Number(input.trim());
                              if (!Number.isFinite(qty)) {
                                alert('Invalid quantity');
                                return;
                              }
                              try {
                                await updateProduct(row.id, { stock_quantity: qty });
                                setStatusMessage('Stock updated successfully.');
                                void loadInventory(selectedStoreId);
                              } catch (err) {
                                setError(err instanceof Error ? err.message : 'Failed to update stock');
                              }
                            }}
                          >
                            Update Qty
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => void handleTransferProduct(row.id, row.store_id || selectedStoreId)}
                          >
                            Transfer
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => void handleDeleteProduct(row.id)}>
                            Delete
                          </button>
                        </>
                      )}
                      {!isAdmin && <span style={{ color: 'var(--text-secondary)' }}>View Only</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && filteredRows.length === 0 && (
              <tr>
                <td colSpan={8} className="inventory-empty">No inventory products found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;