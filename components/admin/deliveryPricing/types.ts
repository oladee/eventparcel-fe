// Location reference from API
export interface LocationRef {
  _id: string;
  name: string;
}

// Delivery route as returned from API (with nested objects)
export interface DeliveryRoute {
  _id: string;
  pickupState: LocationRef;
  pickupCity: LocationRef;
  destinationState: LocationRef;
  destinationCity: LocationRef;
  fee?: number;
  baseFee?: number;
  multiplier?: number;
  status?: "active" | "inactive";
}

// UI display model (flattened for easier table rendering)
export interface DeliveryRouteDisplay {
  _id: string;
  pickupStateId: string;
  pickupState: string;
  pickupCityId: string;
  pickupCity: string;
  destStateId: string;
  destState: string;
  destCityId: string;
  destCity: string;
  baseFee: number;
  multiplier: number;
}

export type SortField = "pickupState" | "pickupCity" | "destState" | "destCity" | "baseFee" | "multiplier";
export type SortDir = "asc" | "desc";
