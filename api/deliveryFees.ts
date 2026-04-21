import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";

// API Response Types matching backend schema
export interface StateRef {
  _id: string;
  name: string;
}

export interface CityRef {
  _id: string;
  name: string;
}

export interface DeliveryFeeRecord {
  _id: string;
  pickupState: StateRef;
  pickupCity: CityRef;
  destinationState: StateRef;
  destinationCity: CityRef;
  fee?: number;
  baseFee?: number;
  multiplier?: number;
  status: "active" | "inactive";
}

export interface CreateDeliveryFeePayload {
  pickupStateId: string;
  pickupCityId: string;
  destinationStateId: string;
  destinationCityId: string;
  fee?: number;
  baseFee?: number;
  multiplier?: number;
}

export interface UpdateDeliveryFeePayload {
  pickupStateId?: string;
  pickupCityId?: string;
  destinationStateId?: string;
  destinationCityId?: string;
  fee?: number;
  baseFee?: number;
  multiplier?: number;
}

// Fetch all active delivery fees
export async function fetchDeliveryFees(): Promise<DeliveryFeeRecord[]> {
  try {
    const response = await axiosInstance.get("/admin/delivery-fees");
    if (response.data.success) {
      const data = response.data.data;
      if (Array.isArray(data)) {
        return data;
      }
      return data?.deliveryFees || [];
    }
    throw new Error(response.data.message || "Failed to fetch delivery fees");
  } catch (error: any) {
    throw error;
  }
}

// Create a new delivery fee
export async function createDeliveryFee(
  payload: CreateDeliveryFeePayload
): Promise<DeliveryFeeRecord> {
  const amount = payload.fee ?? payload.baseFee;
  if (typeof amount !== "number") {
    throw new Error("fee is required");
  }

  const combinedPayload = {
    pickupStateId: payload.pickupStateId,
    pickupCityId: payload.pickupCityId,
    destinationStateId: payload.destinationStateId,
    destinationCityId: payload.destinationCityId,
    fee: amount,
    baseFee: amount,
    ...(typeof payload.multiplier === "number"
      ? { multiplier: payload.multiplier }
      : {}),
  };

  try {
    const response = await axiosInstance.post(
      "/admin/delivery-fees",
      combinedPayload
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create delivery fee");
  } catch (error) {
    console.error("Error creating delivery fee:", error);
    throw error;
  }
}

// Update an existing delivery fee
export async function updateDeliveryFee(
  deliveryFeeId: string,
  payload: UpdateDeliveryFeePayload
): Promise<DeliveryFeeRecord> {
  const amount = payload.fee ?? payload.baseFee;
  const combinedPayload: UpdateDeliveryFeePayload = {
    ...payload,
    ...(typeof amount === "number" ? { fee: amount, baseFee: amount } : {}),
    ...(typeof payload.multiplier === "number"
      ? { multiplier: payload.multiplier }
      : {}),
  };

  try {
    const response = await axiosInstance.patch(
      `/admin/delivery-fees/${deliveryFeeId}`,
      combinedPayload
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update delivery fee");
  } catch (error) {
    console.error("Error updating delivery fee:", error);
    throw error;
  }
}

// Delete (soft-delete) a delivery fee
export async function deleteDeliveryFee(deliveryFeeId: string): Promise<void> {
  try {
    const response = await axiosInstance.delete(
      `/admin/delivery-fees/${deliveryFeeId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete delivery fee");
    }
  } catch (error) {
    console.error("Error deleting delivery fee:", error);
    throw error;
  }
}

// Upload CSV for import preview
export async function importDeliveryFeesPreview(
  file: File
): Promise<{
  importId: string;
  totalRows: number;
  newRows: number;
  duplicateRows: number;
  inactiveMatchRows: number;
  rows: any[];
  expiresAt: string;
}> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      "/admin/delivery-fees/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to preview import");
  } catch (error) {
    console.error("Error previewing import:", error);
    throw error;
  }
}

// Confirm an import session
export async function confirmDeliveryFeesImport(
  importId: string,
  mode: "merge" | "replace_all"
): Promise<{ processed: number }> {
  try {
    const response = await axiosInstance.post(
      `/admin/delivery-fees/import/${importId}/confirm`,
      { action: mode }
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to confirm import");
  } catch (error) {
    console.error("Error confirming import:", error);
    throw error;
  }
}

// ─── Audit / Change History ─────────────────────────────────────────────────

export type AuditAction = "create" | "update" | "delete";
export type AuditResource =
  | "state"
  | "city"
  | "delivery_fee"
  | "delivery_fee_import";

export interface AuditActor {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface DeliveryFeeAuditLogEntry {
  _id: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  performedBy?: AuditActor;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface FetchAuditLogParams {
  resource?: AuditResource;
  action?: AuditAction;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface DeliveryFeeAuditLogResponse {
  logs: DeliveryFeeAuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchDeliveryFeeAuditLogs(
  params: FetchAuditLogParams = {}
): Promise<DeliveryFeeAuditLogResponse> {
  const query = new URLSearchParams();
  if (params.resource) query.set("resource", params.resource);
  if (params.action) query.set("action", params.action);
  if (params.from) {
    query.set("from", params.from);
    // Compatibility for legacy history-style endpoints.
    query.set("startDate", params.from);
  }
  if (params.to) {
    query.set("to", params.to);
    query.set("endDate", params.to);
  }
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const endpoints = [
    "/admin/delivery-fee-audit-logs",
    "/admin/delivery-fees/audit-logs",
    "/admin/delivery-fees/history",
  ];

  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(`${endpoint}?${query.toString()}`);

      if (response.data.success) {
        const data = response.data.data ?? {};
        return {
          logs: data.logs ?? data.entries ?? [],
          total: data.total ?? 0,
          page: data.page ?? 1,
          limit: data.limit ?? params.limit ?? 20,
          totalPages: data.totalPages ?? data.pages ?? 1,
        };
      }

      throw new Error(response.data.message || "Failed to fetch audit logs");
    } catch (error: any) {
      lastError = error;
      const message = String(
        error?.response?.data?.message || error?.message || ""
      ).toLowerCase();

      const isRouteMissing =
        error?.response?.status === 404 || message.includes("route not found");

      if (isRouteMissing) {
        continue;
      }

      console.error("Error fetching delivery fee audit logs:", error);
      throw error;
    }
  }

  console.error("Error fetching delivery fee audit logs:", lastError);
  throw lastError || new Error("Failed to fetch audit logs");
}

// Download Excel template for bulk import
export async function downloadDeliveryFeesTemplate(): Promise<Blob> {
  try {
    const response = await axiosInstance.get("/admin/delivery-fees/template", {
      responseType: "blob",
    });

    return response.data as Blob;
  } catch (error) {
    console.error("Error downloading delivery fees template:", error);
    throw error;
  }
}
