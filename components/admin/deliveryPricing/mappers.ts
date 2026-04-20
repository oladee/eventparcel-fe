import {
  DeliveryRoute,
  DeliveryRouteDisplay,
} from "./types";

/**
 * Convert API response (DeliveryRoute with nested objects) to UI display model (flattened strings)
 */
export function convertApiToDisplay(
  route: DeliveryRoute
): DeliveryRouteDisplay {
  const resolvedBaseFee =
    typeof route.baseFee === "number"
      ? route.baseFee
      : typeof route.fee === "number"
      ? route.fee
      : 0;

  return {
    _id: route._id,
    pickupStateId: route.pickupState._id,
    pickupState: route.pickupState.name,
    pickupCityId: route.pickupCity._id,
    pickupCity: route.pickupCity.name,
    destStateId: route.destinationState._id,
    destState: route.destinationState.name,
    destCityId: route.destinationCity._id,
    destCity: route.destinationCity.name,
    baseFee: resolvedBaseFee,
    multiplier: typeof route.multiplier === "number" ? route.multiplier : 0,
  };
}

/**
 * Convert UI display model back to API payload for updates
 */
export function convertDisplayToApiPayload(route: DeliveryRouteDisplay) {
  return {
    pickupStateId: route.pickupStateId,
    pickupCityId: route.pickupCityId,
    destinationStateId: route.destStateId,
    destinationCityId: route.destCityId,
    fee: route.baseFee,
    baseFee: route.baseFee,
    multiplier: route.multiplier,
  };
}
