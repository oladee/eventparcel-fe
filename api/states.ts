import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";

export interface State {
  _id: string;
  name: string;
  normalizedName: string;
  status: "active" | "inactive";
  deliveryCovered?: boolean;
}

export interface City {
  _id: string;
  name: string;
  normalizedName: string;
  stateId: string;
  status: "active" | "inactive";
}

interface CreateStatePayload {
  name: string;
}

interface CreateCityPayload {
  name: string;
}

/**
 * Fetch all delivery-covered states (public endpoint - no auth required)
 */
export async function fetchDeliveryCoveredStates(): Promise<State[]> {
  try {
    const response = await axiosInstance.get("/states/delivery-covered");
    if (response.data.success) {
      return response.data.data.states || [];
    }
    throw new Error(response.data.message || "Failed to fetch states");
  } catch (error) {
    console.error("Error fetching delivery-covered states:", error);
    throw error;
  }
}

/**
 * Fetch all states from admin endpoint (auth required).
 */
export async function fetchAllStates(): Promise<State[]> {
  try {
    const response = await axiosInstance.get("/admin/states");
    if (response.data.success) {
      return response.data.data.states || response.data.data || [];
    }
    throw new Error(response.data.message || "Failed to fetch all states");
  } catch (error) {
    console.error("Error fetching all states:", error);
    throw error;
  }
}

/**
 * Fetch cities for a specific state (admin endpoint)
 */
export async function fetchCitiesByState(stateId: string): Promise<City[]> {
  try {
    const response = await axiosInstance.get(
      `/admin/states/${stateId}/cities?limit=1000`
    );
    if (response.data.success) {
      const payload = response.data.data;
      if (Array.isArray(payload)) {
        return payload;
      }
      if (Array.isArray(payload?.cities)) {
        return payload.cities;
      }
      if (Array.isArray(payload?.items)) {
        return payload.items;
      }
      return [];
    }
    throw new Error(response.data.message || "Failed to fetch cities");
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
}

/**
 * Create a new state (or reactivate inactive one).
 */
export async function createState(payload: CreateStatePayload): Promise<State> {
  try {
    const response = await axiosInstance.post(
      "/admin/states",
      { name: payload.name.trim() },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create state");
  } catch (error) {
    console.error("Error creating state:", error);
    throw error;
  }
}

/**
 * Create a new city under a state (or reactivate inactive one).
 */
export async function createCity(
  stateId: string,
  payload: CreateCityPayload
): Promise<City> {
  try {
    const response = await axiosInstance.post(
      `/admin/states/${stateId}/cities`,
      { name: payload.name.trim() },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create city");
  } catch (error) {
    console.error("Error creating city:", error);
    throw error;
  }
}
