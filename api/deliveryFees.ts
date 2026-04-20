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

export type ChangeAction = "create" | "update" | "delete" | "bulk_import";

export interface ChangeLogRouteRef {
  pickupState: string;
  pickupCity: string;
  destinationState: string;
  destinationCity: string;
}

export interface ChangeLogEntry {
  _id: string;
  action: ChangeAction;
  adminId: string;
  adminName?: string;
  adminEmail?: string;
  route?: ChangeLogRouteRef;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  note?: string;           // e.g. "bulk import: 14 rows merged"
  createdAt: string;       // ISO timestamp
}

export interface FetchHistoryParams {
  startDate?: string;   // ISO date string
  endDate?: string;
  route?: string;       // free-text search on pickup/destination
  action?: ChangeAction;
  page?: number;
  limit?: number;
}

export interface ChangeHistoryResponse {
  entries: ChangeLogEntry[];
  total: number;
  page: number;
  pages: number;
}

export async function fetchDeliveryFeeHistory(
  params: FetchHistoryParams = {}
): Promise<ChangeHistoryResponse> {
  try {
    const query = new URLSearchParams();
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.route) query.set("route", params.route);
    if (params.action) query.set("action", params.action);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const response = await axiosInstance.get(
      `/admin/delivery-fees/history?${query.toString()}`
    );

    if (response.data.success) {
      const d = response.data.data;
      return {
        entries: d.entries ?? d.logs ?? d ?? [],
        total: d.total ?? 0,
        page: d.page ?? 1,
        pages: d.pages ?? 1,
      };
    }
    throw new Error(response.data.message || "Failed to fetch change history");
  } catch (error) {
    console.error("Error fetching delivery fee history:", error);
    throw error;
  }
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
