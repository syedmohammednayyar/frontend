export interface ApiCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  store_ref?: string | null;
  created_at: string;
}

export interface ApiStore {
  id: string;
  name: string;
  code: string;
  store_type: "main" | "addon";
  parent: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ApiEmployee {
  id: string;
  name: string;
  role: "Manager" | "Salesman" | "Technician" | "Staff";
  store: string;
  store_ref?: string | null;
  login_username?: string;
  email: string;
  phone: string;
  sales_count: number;
  join_date: string | null;
  created_at: string;
}

export interface ApiProduct {
  id: string;
  job_id?: string;
  sku: string;
  barcode?: string;
  imei?: string;
  name: string;
  brand?: string;
  model?: string;
  condition?: string;
  category?: "new_phone" | "used_phone" | "accessories" | "services";
  description: string;
  price: string;
  selling_price?: string;
  stock_quantity: number;
  primary_store_ref?: string | null;
  store_id?: string | null;
  active: boolean;
}

export interface ApiStoreInventoryRow {
  store_id: string;
  product_id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reserved_quantity: number;
  min_stock_level: number;
  unit_price: string;
  updated_at: string;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  category: "new_phone" | "used_phone" | "accessories" | "services";
  description?: string;
  price: string;
  stock_quantity: number;
  primary_store_ref?: string | null;
  active?: boolean;
}

export interface ApiSaleItem {
  id?: string;
  product: string;
  quantity: number;
  unit_price: string;
  line_total?: string;
}

export interface ApiSale {
  id: string;
  customer: string | null;
  store_ref?: string | null;
  job_no?: string;
  ic_number?: string;
  cash_amount?: string;
  online_amount?: string;
  exchange_amount?: string;
  exchange_model?: string;
  got_amount?: string;
  gift?: string;
  salesperson_name?: string;
  sold_at: string;
  notes: string;
  items: ApiSaleItem[];
  total_amount: string;
  payment_status?: "pending" | "partial" | "paid";
}

export interface ApiBuyback {
  id: string;
  imei: string;
  brand: string;
  model: string;
  color: string;
  customer?: string | null;
  store_ref?: string | null;
  job_no?: string;
  ic_number?: string;
  cash_amount?: string;
  online_amount?: string;
  exchange_amount?: string;
  exchange_model?: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  market_value: string;
  negotiated_price: string;
  status: "Pending" | "Accepted" | "Processed" | "Rejected";
  created_at: string;
}

export interface ApiRepairTicket {
  id: string;
  ticket_no: string;
  customer_name: string;
  customer?: string | null;
  store_ref?: string | null;
  device_model: string;
  problem?: string;
  technician_name: string;
  status: "Pending" | "In Progress" | "Completed" | "Delivered" | "Cancelled";
  parts: Array<{ name: string; qty: number; unitCost: number; status: "Pending" | "Purchased" }>;
  parts_charge?: string;
  labor_cost: string;
  got_amount?: string;
  in_cash?: string;
  in_online?: string;
  out_cash?: string;
  out_online?: string;
  warranty: "3 months" | "6 months" | "12 months";
  estimated_completion: string | null;
  notes: string;
  payment_status?: "pending" | "partial" | "paid";
  outstanding_amount?: string;
  created_at: string;
}

export interface ApiExpense {
  id: string;
  store_ref?: string | null;
  reason: string;
  out_cash: string;
  out_online: string;
  expense_date: string;
  notes: string;
  created_at: string;
}

export interface ApiPaymentEntry {
  id: string;
  store_ref?: string | null;
  entry_type: "in" | "out";
  dealer_name: string;
  cash_amount: string;
  online_amount: string;
  payment_status?: "pending" | "partial" | "paid";
  outstanding_amount?: string;
  entry_date: string;
  notes: string;
  source_type?: string | null;
  source_id?: string | null;
  created_at: string;
}

export interface ApiOutstandingBalance {
  id?: string;
  source_type: "sale" | "repair";
  source_id: string;
  store_ref?: string | null;
  party_name: string;
  reference_no: string;
  total_amount: string;
  paid_amount: string;
  outstanding_amount: string;
  payment_status: "pending" | "partial" | "paid";
  created_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Sales" | "Staff" | "Salesman" | "Technician";
  assignedStoreId?: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface CreateSalePayload {
  customer: string | null;
  store_ref?: string | null;
  job_no?: string;
  ic_number?: string;
  discount_amount?: string;
  cash_amount?: string;
  online_amount?: string;
  exchange_amount?: string;
  exchange_model?: string;
  got_amount?: string;
  gift?: string;
  salesperson_name?: string;
  notes: string;
  items: ApiSaleItem[];
}

export interface CreateBuybackPayload {
  imei: string;
  brand: string;
  model: string;
  color: string;
  customer?: string | null;
  store_ref?: string | null;
  job_no?: string;
  ic_number?: string;
  cash_amount?: string;
  online_amount?: string;
  exchange_amount?: string;
  exchange_model?: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  market_value: string;
  negotiated_price: string;
  status?: "Pending" | "Accepted" | "Processed" | "Rejected";
}

export interface CreateRepairPayload {
  ticket_no: string;
  customer_name: string;
  customer?: string | null;
  store_ref?: string | null;
  device_model: string;
  problem?: string;
  technician_name: string;
  status?: "Pending" | "In Progress" | "Completed" | "Delivered" | "Cancelled";
  parts?: Array<{ name: string; qty: number; unitCost: number; status: "Pending" | "Purchased" }>;
  parts_charge?: string;
  labor_cost?: string;
  got_amount?: string;
  in_cash?: string;
  in_online?: string;
  out_cash?: string;
  out_online?: string;
  warranty?: "3 months" | "6 months" | "12 months";
  estimated_completion?: string | null;
  notes?: string;
}

export interface CreateExpensePayload {
  store_ref?: string | null;
  reason: string;
  out_cash: string;
  out_online: string;
  expense_date: string;
  notes?: string;
}

export interface CreatePaymentEntryPayload {
  store_ref?: string | null;
  entry_type: "in" | "out";
  dealer_name: string;
  cash_amount: string;
  online_amount: string;
  payment_status?: "pending" | "partial" | "paid";
  outstanding_amount?: string;
  entry_date: string;
  source_type?: string | null;
  source_id?: string | null;
  notes?: string;
}

export interface CreateEmployeePayload {
  name: string;
  role: "Manager" | "Salesman" | "Technician" | "Staff";
  store: string;
  store_ref?: string | null;
  email: string;
  phone: string;
  username?: string;
  password?: string;
  sales_count?: number;
  join_date?: string | null;
}

export interface CreateStorePayload {
  name: string;
  code: string;
  store_type: "main" | "addon";
  parent?: string | null;
  is_active?: boolean;
}

export interface BriefReportParams {
  from?: string;
  to?: string;
  month?: string;
  store?: string;
  section?: string;
}

export type ReportType = "sales" | "product" | "store";
export type ReportPeriod = "daily" | "weekly" | "monthly" | "custom";

export interface ReportFilters {
  type: ReportType;
  period: ReportPeriod;
  from?: string;
  to?: string;
  store?: string;
}

export interface SalesReportRow {
  date: string;
  transactions: number;
  unitsSold: number;
  revenue: number;
}

export interface ProductReportRow {
  productId: string;
  sku: string;
  productName: string;
  transactions: number;
  unitsSold: number;
  revenue: number;
}

export interface StoreReportRow {
  storeId: string | null;
  storeName: string;
  transactions: number;
  unitsSold: number;
  revenue: number;
}

export type ReportRow = SalesReportRow | ProductReportRow | StoreReportRow;

export interface ReportDataResponse {
  type: ReportType;
  period: ReportPeriod;
  from: string;
  to: string;
  store: string | null;
  rows: ReportRow[];
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");
const TOKEN_KEY = "quality-mobiles-token";
const USER_KEY = "quality-mobiles-user";

type BackendAuthUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type BackendStoreRow = {
  _id: string;
  id?: string;
  code: string;
  name: string;
  store_type?: "main" | "addon";
  parent?: string | null;
  parent_store_id?: string | null;
  is_active: boolean;
  created_at: string;
};

type BackendInventoryRow = {
  store_id: string | { _id: string };
  product_id: string | { _id: string; sku: string; name: string; category: string };
  sku?: string;
  name?: string;
  category?: string;
  quantity: number;
  reserved_quantity?: number;
  min_stock_level?: number;
  unit_price: string;
  updated_at: string;
};

type BackendSale = {
  _id: string;
  id?: string;
  sale_no: string;
  store_id: string;
  customer_id: string | null;
  employee_id: string;
  subtotal: string;
  tax_total: string;
  discount_total: string;
  exchange_total: string;
  grand_total: string;
  amount_paid: string;
  payment_status: "pending" | "partial" | "paid";
  note?: string | null;
  created_at: string;
};

type BackendSaleItem = {
  _id: string;
  id?: string;
  sale_id: string;
  product_id: string | { _id: string };
  product?: { _id: string };
  quantity: number;
  unit_price: string;
  line_total: string;
};

type BackendPayment = {
  id: string;
  sale_id: string;
  payment_method: string;
  status: string;
  amount: string;
  reference_no?: string | null;
  notes?: string | null;
  paid_at: string;
};

type BackendSaleDetailResponse = {
  sale: BackendSale;
  items: BackendSaleItem[];
  payments: BackendPayment[];
};

type BackendSaleListRow = {
  _id: string;
  id?: string;
};

type PaymentMethodForCreate = "cash" | "card" | "bank_transfer" | "upi" | "wallet" | "mixed";

export class ApiError extends Error {
  status: number;
  code?: string;
  payload?: unknown;

  constructor(status: number, message: string, code?: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function nowIso(): string {
  return new Date().toISOString();
}

function toMoney(value: number | string | undefined): string {
  return Number(value || 0).toFixed(2);
}

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function sessionSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures in restricted browser contexts.
  }
}

function sessionRemove(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage removal failures in restricted browser contexts.
  }
}

function mapBackendRole(role: string): AuthUser["role"] {
  const normalized = (role || "").toLowerCase();
  if (normalized.includes("admin")) return "Admin";
  if (normalized.includes("manager") || normalized.includes("inventory_manager")) return "Manager";
  if (normalized.includes("sales") || normalized.includes("cashier")) return "Sales";
  return "Staff";
}

function mapAuthUser(user: BackendAuthUser): AuthUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email || "",
    role: mapBackendRole(user.role || ""),
    createdAt: nowIso(),
  };
}

function normalizeProductCategory(category: string): ApiProduct["category"] {
  if (category === "used_phone") return "used_phone";
  if (category === "repair_part") return "accessories";
  if (category === "accessory") return "accessories";
  if (category === "service") return "services";
  return "new_phone";
}

function apiCategoryToBackend(category: CreateProductPayload["category"]): string {
  if (category === "accessories") return "accessories";
  if (category === "services") return "services";
  return category;
}

function mapApiProduct(row: any): ApiProduct {
  // Map backend "quantity" to frontend "stock_quantity"
  const stockQty = row.stock_quantity !== undefined ? row.stock_quantity : (row.quantity !== undefined ? row.quantity : 0);
  // Map backend "selling_price" or "price" to frontend "price"
  const priceVal = row.selling_price !== undefined ? row.selling_price : (row.price !== undefined ? row.price : 0);
  
  // Handle populated store_id
  const storeId = row.store_id && typeof row.store_id === 'object' 
    ? String(row.store_id._id || row.store_id.id) 
    : (row.store_id ? String(row.store_id) : null);

  return {
    ...row,
    id: String(row._id || row.id),
    store_id: storeId,
    primary_store_ref: row.primary_store_ref === null || row.primary_store_ref === undefined ? null : String(row.primary_store_ref),
    price: toMoney(priceVal),
    selling_price: toMoney(row.selling_price || priceVal),
    stock_quantity: Number(stockQty),
    active: Boolean(row.active !== undefined ? row.active : true),
    category: row.category ? normalizeProductCategory(row.category) : undefined,
    description: row.description || "",
  };
}

function ensureAbsolutePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function mapStoreRow(row: BackendStoreRow): ApiStore {
  const parentFromLegacy = row.parent_store_id ? String(row.parent_store_id) : null;
  const normalizedParent = row.parent !== undefined ? (row.parent ? String(row.parent) : null) : parentFromLegacy;
  const storeType = row.store_type || (normalizedParent ? "addon" : "main");

  return {
    id: String(row._id || row.id),
    name: row.name,
    code: row.code,
    store_type: storeType,
    parent: normalizedParent,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

function resolveStoreFilter(store: string | undefined, stores: ApiStore[]): string | null {
  if (!store) return null;
  
  const match = stores.find((entry) => entry.id === store || entry.name.toLowerCase() === store.toLowerCase());
  return match ? match.id : null;
}

async function apiRequest<T>(path: string, options: RequestInit = {}, requiresAuth = true): Promise<T> {
  const headers = new Headers(options.headers || {});
  const bodyIsFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !headers.has("Content-Type") && !bodyIsFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE}${ensureAbsolutePath(path)}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  let payload: unknown = null;

  if (contentType.includes("application/json")) {
    payload = await response.json().catch(() => null);
  } else if (response.status !== 204) {
    payload = await response.text().catch(() => null);
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      clearSessionUser();
    }

    const errorPayload = payload as { error?: { message?: string; code?: string }; message?: string; detail?: string } | null;
    const message = errorPayload?.error?.message || errorPayload?.message || errorPayload?.detail || `Request failed (${response.status})`;
    const code = errorPayload?.error?.code;
    throw new ApiError(response.status, message, code, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return payload as T;
}

function inventoryRowToProduct(row: ApiStoreInventoryRow): ApiProduct {
  return {
    id: row.product_id,
    sku: row.sku,
    name: row.name,
    category: normalizeProductCategory(row.category),
    description: "",
    price: toMoney(row.unit_price),
    stock_quantity: row.quantity,
    primary_store_ref: row.store_id,
    active: true,
  };
}

function mapSaleDetailToApiSale(detail: BackendSaleDetailResponse): ApiSale {
  let cashAmount = 0;
  let onlineAmount = 0;

  (detail.payments || []).forEach((payment) => {
    const value = toNumber(payment.amount);
    if (payment.payment_method === "cash") {
      cashAmount += value;
      return;
    }
    onlineAmount += value;
  });

  return {
    id: String(detail.sale._id || detail.sale.id),
    customer: detail.sale.customer_id ? String(detail.sale.customer_id) : null,
    store_ref: String(detail.sale.store_id),
    job_no: detail.sale.sale_no,
    ic_number: "",
    cash_amount: toMoney(cashAmount),
    online_amount: toMoney(onlineAmount),
    exchange_amount: toMoney(detail.sale.exchange_total),
    exchange_model: "",
    got_amount: toMoney(detail.sale.amount_paid),
    gift: "",
    salesperson_name: "",
    sold_at: detail.sale.created_at,
    notes: detail.sale.note || "",
    items: (detail.items || []).map((item) => ({
      id: String(item._id || item.id),
      product: typeof item.product_id === 'object' ? String(item.product_id._id) : String(item.product_id),
      quantity: item.quantity,
      unit_price: toMoney(item.unit_price),
      line_total: toMoney(item.line_total),
    })),
    total_amount: toMoney(detail.sale.grand_total),
    payment_status: detail.sale.payment_status,
  };
}

function buildPayments(payload: CreateSalePayload): Array<{ paymentMethod: PaymentMethodForCreate; amount: number; notes?: string }> {
  const cashAmount = toNumber(payload.cash_amount);
  const onlineAmount = toNumber(payload.online_amount);

  const payments: Array<{ paymentMethod: PaymentMethodForCreate; amount: number; notes?: string }> = [];

  if (cashAmount > 0) {
    payments.push({ paymentMethod: "cash", amount: cashAmount });
  }

  if (onlineAmount > 0) {
    payments.push({ paymentMethod: "bank_transfer", amount: onlineAmount });
  }

  return payments;
}

async function fetchSaleByIdRaw(saleId: string): Promise<BackendSaleDetailResponse> {
  return apiRequest<BackendSaleDetailResponse>(`/sale/get/${saleId}`);
}

export function getAuthToken(): string | null {
  return sessionGet(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  sessionSet(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  sessionRemove(TOKEN_KEY);
}

export function getSessionUser(): AuthUser | null {
  const raw = sessionGet(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSessionUser(user: AuthUser): void {
  sessionSet(USER_KEY, JSON.stringify(user));
}

export function clearSessionUser(): void {
  sessionRemove(USER_KEY);
}

export async function login(payload: { email: string; password: string }): Promise<LoginResponse> {
  const result = await apiRequest<{ token: string; user: BackendAuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);

  return {
    token: result.token,
    user: mapAuthUser(result.user),
  };
}

export async function apiSignup(payload: { name: string; email: string; password: string; role: string }): Promise<{ message: string }> {
  const result = await apiRequest<{ message: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);

  return result;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const result = await apiRequest<{ user: BackendAuthUser }>("/auth/me");
  return mapAuthUser(result.user);
}

export async function logout(): Promise<{ detail: string }> {
  clearAuthToken();
  clearSessionUser();
  return { detail: "Logged out." };
}

export async function listStores(): Promise<ApiStore[]> {
  const result = await apiRequest<{ rows: (BackendStoreRow & { _id: string })[] }>("/store/list");
  return result.rows.map(mapStoreRow);
}

export async function listStoreInventory(storeId: string): Promise<ApiStoreInventoryRow[]> {
  const result = await apiRequest<{ rows: any[] }>(`/inventory/list?store_id=${storeId}`);
  return result.rows.map((row) => ({
    store_id: String(row.store_id?._id || row.store_id),
    product_id: String(row.product_id?._id || row.product_id),
    sku: row.product_id?.sku || row.sku,
    name: row.product_id?.name || row.name,
    category: row.product_id?.category || row.category,
    quantity: row.quantity,
    reserved_quantity: row.reserved_quantity || 0,
    min_stock_level: row.min_stock_level || 0,
    unit_price: toMoney(row.unit_price),
    updated_at: row.updated_at,
  }));
}

export async function createStore(payload: CreateStorePayload): Promise<ApiStore> {
  const result = await apiRequest<{ data: any }>("/store/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapStoreRow(result.data);
}

export async function updateStore(id: string, payload: Partial<CreateStorePayload>): Promise<ApiStore> {
  const result = await apiRequest<{ data: any }>(`/store/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapStoreRow(result.data);
}

export async function deleteStore(id: string): Promise<void> {
  await apiRequest<void>(`/store/delete/${id}`, { method: "DELETE" });
}

export async function listCustomers(): Promise<ApiCustomer[]> {
  const result = await apiRequest<{ rows: any[] }>("/customer/list");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id),
    store_ref: entry.store_ref ? String(entry.store_ref) : null,
  }));
}

export async function createCustomer(payload: Pick<ApiCustomer, "name" | "email" | "phone" | "store_ref">): Promise<ApiCustomer> {
  const result = await apiRequest<{ data: any }>("/customer/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
    store_ref: row.store_ref ? String(row.store_ref) : null,
  };
}

export async function updateCustomer(id: string, payload: Partial<Pick<ApiCustomer, "name" | "email" | "phone" | "store_ref">>): Promise<ApiCustomer> {
  const result = await apiRequest<{ data: any }>(`/customer/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
    store_ref: row.store_ref ? String(row.store_ref) : null,
  };
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiRequest<void>(`/customer/delete/${id}`, { method: "DELETE" });
}

export async function listEmployees(): Promise<ApiEmployee[]> {
  const result = await apiRequest<{ rows: any[] }>("/employee/list");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id || entry.id),
    store_ref: entry.store_ref ? String(entry.store_ref) : null,
  }));
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<ApiEmployee> {
  const result = await apiRequest<{ data: any }>("/employee/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
    store_ref: row.store_ref ? String(row.store_ref) : null,
  };
}

export async function updateEmployee(id: string, payload: Partial<CreateEmployeePayload>): Promise<ApiEmployee> {
  const result = await apiRequest<{ data: any }>(`/employee/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
    store_ref: row.store_ref ? String(row.store_ref) : null,
  };
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiRequest<void>(`/employee/delete/${id}`, { method: "DELETE" });
}

export async function listProducts(storeId?: string): Promise<ApiProduct[]> {
  const result = await apiRequest<{ rows: any[] }>(`/product/list${storeId ? `?storeId=${storeId}` : ""}`);
  return result.rows.map(mapApiProduct);
}

export async function createProduct(_payload: CreateProductPayload): Promise<ApiProduct> {
  // Map frontend fields to backend expected fields
  const backendPayload = {
    ..._payload,
    quantity: (_payload as any).stock_quantity !== undefined ? (_payload as any).stock_quantity : _payload.stock_quantity,
    selling_price: (_payload as any).selling_price || _payload.price,
  };
  
  const result = await apiRequest<{ data: any }>("/product/create", {
    method: "POST",
    body: JSON.stringify(backendPayload),
  });
  return mapApiProduct(result.data);
}

export async function updateProduct(_id: string, _payload: Partial<CreateProductPayload>): Promise<ApiProduct> {
  // Map frontend fields to backend expected fields
  const backendPayload = {
    ..._payload,
  } as any;
  
  if ((_payload as any).stock_quantity !== undefined) {
    backendPayload.quantity = (_payload as any).stock_quantity;
  }
  if ((_payload as any).selling_price !== undefined) {
    backendPayload.selling_price = (_payload as any).selling_price;
  } else if (_payload.price !== undefined) {
    backendPayload.selling_price = _payload.price;
  }

  const result = await apiRequest<{ data: any }>(`/product/update/${_id}`, {
    method: "PATCH",
    body: JSON.stringify(backendPayload),
  });
  return mapApiProduct(result.data);
}


export async function deleteProduct(_id: string): Promise<void> {
  await apiRequest<void>(`/product/delete/${_id}`, { method: "DELETE" });
}


export async function createInventoryChangeRequest(storeId: string, productId: string, oldValue: number, newValue: number, reason?: string) {
  return apiRequest<{ id: string }>(`/change-requests`, {
    method: "POST",
    body: JSON.stringify({
      entityType: "inventory",
      entityId: `${storeId}:${productId}`,
      fieldName: "quantity",
      oldValue: String(oldValue),
      newValue: String(newValue),
      reason: reason || null,
    }),
  });
}

export async function exportInventoryPdf(storeId?: string): Promise<Blob> {
  const token = getAuthToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${API_BASE}/workflows/exports/inventory/pdf${storeId ? `?storeId=${storeId}` : ""}`;
  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new ApiError(resp.status, text || `Export failed (${resp.status})`);
  }

  return resp.blob();
}

export async function listSales(): Promise<ApiSale[]> {
  const result = await apiRequest<{ rows: any[] }>("/sale/list");
  
  // Since backend listSales only returns IDs, we must fetch details for each.
  // This is a workaround because we cannot edit the backend.
  const sales = await Promise.all(
    result.rows.map(async (row) => {
      try {
        const detail = await fetchSaleByIdRaw(String(row._id || row.id));
        return mapSaleDetailToApiSale(detail);
      } catch (err) {
        console.error(`Failed to fetch details for sale ${row._id || row.id}:`, err);
        // Return a skeleton if detail fetch fails
        return {
          id: String(row._id || row.id),
          customer: null,
          total_amount: "0.00",
          sold_at: new Date().toISOString(),
          notes: "",
          items: []
        } as ApiSale;
      }
    })
  );
  
  return sales;
}

export async function createSale(payload: CreateSalePayload): Promise<ApiSale> {
  const result = await apiRequest<{ sale: any }>("/sale/create", {
    method: "POST",
    body: JSON.stringify({
      storeId: payload.store_ref,
      customerId: payload.customer,
      discountTotal: toNumber(payload.discount_amount),
      exchangeTotal: toNumber(payload.exchange_amount),
      note: payload.notes,
      items: payload.items.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
      })),
      payments: buildPayments(payload),
    }),
  });
  return mapSaleDetailToApiSale(result);
}

export async function updateSale(id: string, payload: Partial<CreateSalePayload>): Promise<ApiSale> {
  const result = await apiRequest<{ sale: any }>(`/sale/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      storeId: payload.store_ref,
      customerId: payload.customer,
      note: payload.notes,
    }),
  });
  return mapSaleDetailToApiSale(result);
}

export async function deleteSale(id: string): Promise<void> {
  await apiRequest<void>(`/sale/delete/${id}`, { method: "DELETE" });
}

export async function listBuybacks(): Promise<ApiBuyback[]> {
  const result = await apiRequest<{ rows: any[] }>("/buyback/list");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id),
    customer: entry.customer_id ? String(entry.customer_id) : null,
    store_ref: entry.store_id ? String(entry.store_id) : null,
  }));
}

export async function createBuyback(payload: CreateBuybackPayload): Promise<ApiBuyback> {
  const result = await apiRequest<{ data: any }>("/buyback/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function updateBuyback(id: string, payload: Partial<CreateBuybackPayload>): Promise<ApiBuyback> {
  const result = await apiRequest<{ data: any }>(`/buyback/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function deleteBuyback(id: string): Promise<void> {
  await apiRequest<void>(`/buyback/delete/${id}`, { method: "DELETE" });
}

export async function listRepairs(): Promise<ApiRepairTicket[]> {
  const result = await apiRequest<{ rows: any[] }>("/repair/list");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id),
    customer: entry.customer_id ? String(entry.customer_id) : null,
    store_ref: entry.store_id ? String(entry.store_id) : null,
  }));
}

export async function createRepair(payload: CreateRepairPayload): Promise<ApiRepairTicket> {
  const result = await apiRequest<{ data: any }>("/repair/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function updateRepair(id: string, payload: Partial<CreateRepairPayload>): Promise<ApiRepairTicket> {
  const result = await apiRequest<{ data: any }>(`/repair/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function deleteRepair(id: string): Promise<void> {
  await apiRequest<void>(`/repair/delete/${id}`, { method: "DELETE" });
}

export async function listExpenses(): Promise<ApiExpense[]> {
  const result = await apiRequest<{ rows: any[] }>("/expense/list");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id),
    store_ref: entry.store_id ? String(entry.store_id) : null,
  }));
}

export async function createExpense(payload: CreateExpensePayload): Promise<ApiExpense> {
  const result = await apiRequest<{ data: any }>("/expense/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function updateExpense(id: string, payload: Partial<CreateExpensePayload>): Promise<ApiExpense> {
  const result = await apiRequest<{ data: any }>(`/expense/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function deleteExpense(id: string): Promise<void> {
  await apiRequest<void>(`/expense/delete/${id}`, { method: "DELETE" });
}

export async function listPaymentEntries(): Promise<ApiPaymentEntry[]> {
  const result = await apiRequest<{ rows: any[] }>("/payment/list");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id),
    store_ref: entry.store_id ? String(entry.store_id) : null,
  }));
}

export async function createPaymentEntry(payload: CreatePaymentEntryPayload): Promise<ApiPaymentEntry> {
  const result = await apiRequest<{ data: any }>("/payment/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function updatePaymentEntry(id: string, payload: Partial<CreatePaymentEntryPayload>): Promise<ApiPaymentEntry> {
  const result = await apiRequest<{ data: any }>(`/payment/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const row = result.data;
  return {
    ...row,
    id: String(row._id),
  };
}

export async function deletePaymentEntry(id: string): Promise<void> {
  await apiRequest<void>(`/payment/delete/${id}`, { method: "DELETE" });
}

export async function listOutstandingBalances(): Promise<ApiOutstandingBalance[]> {
  const result = await apiRequest<{ rows: any[] }>("/payment/outstanding");
  return result.rows.map((entry) => ({
    ...entry,
    id: String(entry._id),
  }));
}

export async function getReportData(params: ReportFilters): Promise<ReportDataResponse> {
  const start = params.from || nowIso().slice(0, 10);
  const end = params.to || nowIso().slice(0, 10);
  const endpoint = `/report/${params.type}`;
  const result = await apiRequest<any>(`${endpoint}?from=${start}&to=${end}${params.store ? `&storeId=${params.store}` : ""}`);
  
  return {
    type: params.type,
    period: params.period,
    from: start,
    to: end,
    store: params.store ? String(params.store) : null,
    rows: result.rows.map((row: any) => {
      if (params.type === "product") {
        return {
          ...row,
          productId: String(row.productId),
        };
      }
      if (params.type === "store") {
        return {
          ...row,
          storeId: String(row.storeId),
        };
      }
      return row;
    }),
  };
}

function csvEscape(value: string | number | null | undefined): string {
  const original = String(value ?? "");
  const trimmedStart = original.trimStart();
  const text = /^[=+\-@]/.test(trimmedStart) || original.startsWith("\t") || original.startsWith("\r")
    ? `'${original}`
    : original;
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>): string {
  const all = [headers, ...rows.map((row) => row.map((cell) => csvEscape(cell)))];
  return all.map((line) => line.join(",")).join("\n");
}

export async function downloadReportFile(params: ReportFilters, format: "csv" | "xlsx"): Promise<Blob> {
  const data = await getReportData(params);
  let headers: string[] = [];
  let rows: Array<Array<string | number>> = [];

  if (data.type === "sales") {
    headers = ["Date", "Transactions", "Units Sold", "Revenue"];
    rows = (data.rows as SalesReportRow[]).map((row) => [row.date, row.transactions, row.unitsSold, toMoney(row.revenue)]);
  } else if (data.type === "product") {
    headers = ["Product ID", "SKU", "Product Name", "Transactions", "Units Sold", "Revenue"];
    rows = (data.rows as ProductReportRow[]).map((row) => [row.productId, row.sku, row.productName, row.transactions, row.unitsSold, toMoney(row.revenue)]);
  } else {
    headers = ["Store ID", "Store Name", "Transactions", "Units Sold", "Revenue"];
    rows = (data.rows as StoreReportRow[]).map((row) => [row.storeId ?? "", row.storeName, row.transactions, row.unitsSold, toMoney(row.revenue)]);
  }

  if (format === "xlsx") {
    const tsv = [headers.join("\t"), ...rows.map((row) => row.join("\t"))].join("\n");
    return new Blob([`\uFEFF${tsv}`], { type: "application/vnd.ms-excel;charset=utf-8;" });
  }

  const csv = toCsv(headers, rows);
  return new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
}

export async function downloadBriefReportCSV(params: BriefReportParams): Promise<Blob> {
  const section = (params.section || "overall").toLowerCase();
  const from = params.from || nowIso().slice(0, 10);
  const to = params.to || nowIso().slice(0, 10);

  const [stores, report] = await Promise.all([
    listStores(),
    getReportData({
      type: "sales",
      period: "custom",
      from,
      to,
      store: params.store,
    }),
  ]);

  const storeId = resolveStoreFilter(params.store, stores);
  const storeNameById = new Map<string, string>();
  stores.forEach((entry) => storeNameById.set(entry.id, entry.name));

  const withinStore = (entryStore: string | null | undefined): boolean => (storeId ? entryStore === storeId : true);
  
  const dateInRange = (dateIso: string, f: string, t: string) => {
    const d = dateIso.slice(0, 10);
    return d >= f && d <= t;
  };

  const withinRange = (dateIso: string): boolean => dateInRange(dateIso, from, to);

  let headers: string[] = [];
  let rows: Array<Array<string | number>> = [];

  if (section === "sales") {
    headers = ["Date", "Transactions", "Units Sold", "Revenue"];
    rows = (report.rows as SalesReportRow[]).map((row) => [row.date, row.transactions, row.unitsSold, toMoney(row.revenue)]);
  } else if (section === "accessories") {
    headers = ["Date", "Product", "Quantity", "Revenue"];
    const [sales, products] = await Promise.all([listSales(), listProducts()]);
    const productMap = new Map<string, ApiProduct>();
    products.forEach((product) => productMap.set(product.id, product));

    rows = sales
      .filter((sale) => withinRange(sale.sold_at) && withinStore(sale.store_ref))
      .flatMap((sale) => sale.items
        .filter((item) => productMap.get(item.product)?.category === "accessories")
        .map((item) => {
          const product = productMap.get(item.product);
          return [
            sale.sold_at.slice(0, 10),
            product?.name || `Product ${item.product}`,
            item.quantity,
            toMoney(item.quantity * toNumber(item.unit_price)),
          ];
        })
      );
  } else if (section === "buybacks") {
    headers = ["Date", "Store", "IMEI", "Device", "Offer", "Status"];
    const buybacks = await listBuybacks();
    rows = buybacks
      .filter((entry) => withinRange(entry.created_at) && withinStore(entry.store_ref))
      .map((entry) => [
        entry.created_at.slice(0, 10),
        entry.store_ref ? (storeNameById.get(entry.store_ref) || `Store ${entry.store_ref}`) : "-",
        entry.imei,
        `${entry.brand} ${entry.model}`.trim(),
        toMoney(entry.negotiated_price),
        entry.status,
      ]);
  } else if (section === "repairs") {
    headers = ["Date", "Ticket", "Customer", "Status", "Total Due", "Paid", "Outstanding"];
    const repairs = await listRepairs();
    rows = repairs
      .filter((entry) => withinRange(entry.created_at) && withinStore(entry.store_ref))
      .map((entry) => {
        const totalDue = toNumber(entry.parts_charge) + toNumber(entry.labor_cost);
        const paid = toNumber(entry.got_amount) + toNumber(entry.in_cash) + toNumber(entry.in_online);
        const outstanding = Math.max(0, totalDue - paid);
        return [
          entry.created_at.slice(0, 10),
          entry.ticket_no,
          entry.customer_name,
          entry.status,
          toMoney(totalDue),
          toMoney(paid),
          toMoney(outstanding),
        ];
      });
  } else if (section === "expenses") {
    headers = ["Date", "Store", "Reason", "Cash Out", "Online Out", "Total"];
    const expenses = await listExpenses();
    rows = expenses
      .filter((entry) => withinRange(entry.expense_date) && withinStore(entry.store_ref))
      .map((entry) => [
        entry.expense_date,
        entry.store_ref ? (storeNameById.get(entry.store_ref) || `Store ${entry.store_ref}`) : "-",
        entry.reason,
        toMoney(entry.out_cash),
        toMoney(entry.out_online),
        toMoney(toNumber(entry.out_cash) + toNumber(entry.out_online)),
      ]);
  } else if (section === "payments") {
    headers = ["Source", "Reference", "Party", "Type/Status", "Paid", "Outstanding", "Date"];
    const [entries, outstanding] = await Promise.all([listPaymentEntries(), listOutstandingBalances()]);

    const entryRows = entries
      .filter((entry) => withinRange(entry.entry_date) && withinStore(entry.store_ref))
      .map((entry) => [
        "Manual Entry",
        entry.source_id ? `${entry.source_type || "manual"}#${entry.source_id}` : "-",
        entry.dealer_name,
        `${entry.entry_type.toUpperCase()} | ${entry.payment_status || "paid"}`,
        toMoney(toNumber(entry.cash_amount) + toNumber(entry.online_amount)),
        toMoney(entry.outstanding_amount || 0),
        entry.entry_date,
      ]);

    const outstandingRows = outstanding
      .filter((entry) => withinRange(entry.created_at) && withinStore(entry.store_ref))
      .map((entry) => [
        entry.source_type.toUpperCase(),
        entry.reference_no,
        entry.party_name,
        entry.payment_status,
        toMoney(entry.paid_amount),
        toMoney(entry.outstanding_amount),
        entry.created_at.slice(0, 10),
      ]);

    rows = [...entryRows, ...outstandingRows];
  } else if (section === "inventory") {
    headers = ["SKU", "Product Name", "Stock", "Price"];
    const products = await listProducts(storeId || undefined);
    rows = products.map((product) => [product.sku, product.name, product.stock_quantity, toMoney(product.price)]);
  } else if (section === "customers") {
    headers = ["Customer Name", "Phone", "Email", "Purchases", "Spent"];
    const [customers, sales] = await Promise.all([listCustomers(), listSales()]);
    rows = customers
      .filter((customer) => withinStore(customer.store_ref))
      .map((customer) => {
        const customerSales = sales.filter((sale) => sale.customer === customer.id && withinRange(sale.sold_at) && withinStore(sale.store_ref));
        const spent = customerSales.reduce((sum, sale) => sum + toNumber(sale.total_amount), 0);
        return [customer.name, customer.phone, customer.email, customerSales.length, toMoney(spent)];
      });
  } else {
    const [buybacks, repairs, expenses, outstanding] = await Promise.all([
      listBuybacks(),
      listRepairs(),
      listExpenses(),
      listOutstandingBalances(),
    ]);

    const salesRows = report.rows as SalesReportRow[];
    const totalRevenue = salesRows.reduce((sum, row) => sum + row.revenue, 0);
    const totalTransactions = salesRows.reduce((sum, row) => sum + row.transactions, 0);
    const buybackCost = buybacks
      .filter((entry) => withinRange(entry.created_at) && withinStore(entry.store_ref))
      .reduce((sum, entry) => sum + toNumber(entry.cash_amount) + toNumber(entry.online_amount), 0);
    const repairRevenue = repairs
      .filter((entry) => withinRange(entry.created_at) && withinStore(entry.store_ref))
      .reduce((sum, entry) => sum + toNumber(entry.in_cash) + toNumber(entry.in_online), 0);
    const expenseTotal = expenses
      .filter((entry) => withinRange(entry.expense_date) && withinStore(entry.store_ref))
      .reduce((sum, entry) => sum + toNumber(entry.out_cash) + toNumber(entry.out_online), 0);
    const outstandingTotal = outstanding
      .filter((entry) => withinRange(entry.created_at) && withinStore(entry.store_ref))
      .reduce((sum, entry) => sum + toNumber(entry.outstanding_amount), 0);

    headers = ["Metric", "Value"];
    rows = [
      ["From Date", from],
      ["To Date", to],
      ["Store Filter", storeId ? (storeNameById.get(storeId) || `Store ${storeId}`) : "All Stores"],
      ["Sales Transactions", totalTransactions],
      ["Sales Revenue", toMoney(totalRevenue)],
      ["Buyback Payout", toMoney(buybackCost)],
      ["Repair Collected", toMoney(repairRevenue)],
      ["Expense Outflow", toMoney(expenseTotal)],
      ["Outstanding Balance", toMoney(outstandingTotal)],
      ["Net Cash Position", toMoney(totalRevenue + repairRevenue - buybackCost - expenseTotal)],
    ];
  }

  const csv = toCsv(headers, rows);
  return new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
}
