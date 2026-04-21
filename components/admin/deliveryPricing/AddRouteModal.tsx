"use client";

import { useState, useEffect, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { CreateDeliveryFeePayload } from "@/api/deliveryFees";
import {
  fetchDeliveryCoveredStates,
  fetchAllStates,
  fetchCitiesByState,
  createState,
  createCity,
  State,
  City,
} from "@/api/states";
import LocationCombobox from "./LocationCombobox";
import { DeliveryRouteDisplay } from "./types";

interface AddRouteModalProps {
  onClose: () => void;
  onAdd: (payload: CreateDeliveryFeePayload) => Promise<void> | void;
  existingRoutes: DeliveryRouteDisplay[];
}

interface FormState {
  pickupStateId: string;
  pickupStateName: string;
  pickupCityId: string;
  pickupCityName: string;
  destStateId: string;
  destStateName: string;
  destCityId: string;
  destCityName: string;
  baseFee: string;
  multiplier: string;
}

interface FormErrors {
  pickupStateId?: string;
  pickupCityId?: string;
  destStateId?: string;
  destCityId?: string;
  baseFee?: string;
  multiplier?: string;
}

const initialForm: FormState = {
  pickupStateId: "",
  pickupStateName: "",
  pickupCityId: "",
  pickupCityName: "",
  destStateId: "",
  destStateName: "",
  destCityId: "",
  destCityName: "",
  baseFee: "",
  multiplier: "",
};

const AddRouteModal: React.FC<AddRouteModalProps> = ({
  onClose,
  onAdd,
  existingRoutes,
}) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statesLoading, setStatesLoading] = useState(true);
  const [pickupCitiesLoading, setPickupCitiesLoading] = useState(false);
  const [destCitiesLoading, setDestCitiesLoading] = useState(false);
  const [allStates, setAllStates] = useState<State[]>([]);
  const [pickupCities, setPickupCities] = useState<City[]>([]);
  const [destCities, setDestCities] = useState<City[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isObjectId = (value: string) => /^[a-fA-F0-9]{24}$/.test(value);

  const findStateByName = (name: string) =>
    allStates.find((s) => s.name.trim().toLowerCase() === name.trim().toLowerCase());

  const findCityByName = (cities: City[], name: string) =>
    cities.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase());

  const isDuplicateError = (err: any) => {
    const message = String(err?.response?.data?.message || err?.message || "").toLowerCase();
    return (
      message.includes("already exists") ||
      err?.response?.data?.code === "BAD_USER_INPUT" ||
      err?.response?.status === 409 ||
      err?.response?.data?.code === "CONFLICT"
    );
  };

  const resolveStateId = useCallback(
    (stateIdOrName: string, stateName?: string) => {
      if (isObjectId(stateIdOrName)) return stateIdOrName;
      const target = (stateName || stateIdOrName || "").trim().toLowerCase();
      const fromName = allStates.find(
        (s) => s.name.trim().toLowerCase() === target
      );
      return fromName?._id || "";
    },
    [allStates]
  );

  // Fetch states on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        setStatesLoading(true);
        let states = await fetchDeliveryCoveredStates();
        if (!states.length) {
          states = await fetchAllStates();
        }
        setAllStates(states);
      } catch {
        try {
          const all = await fetchAllStates();
          setAllStates(all);
        } catch {
          // States unavailable — user can still type freely.
        }
      } finally {
        setStatesLoading(false);
      }
    };
    loadStates();
  }, []);

  // Fetch cities when pickup state changes
  useEffect(() => {
    const resolvedPickupStateId = resolveStateId(
      form.pickupStateId,
      form.pickupStateName
    );

    if (!resolvedPickupStateId) {
      setPickupCities([]);
      return;
    }
    const loadCities = async () => {
      try {
        setPickupCitiesLoading(true);
        const cities = await fetchCitiesByState(resolvedPickupStateId);
        setPickupCities(cities);
      } catch {
        setPickupCities([]);
      } finally {
        setPickupCitiesLoading(false);
      }
    };
    setForm((prev) => ({ ...prev, pickupCityId: "", pickupCityName: "" }));
    loadCities();
  }, [form.pickupStateId, form.pickupStateName, resolveStateId]);

  // Fetch cities when destination state changes
  useEffect(() => {
    const resolvedDestStateId = resolveStateId(form.destStateId, form.destStateName);

    if (!resolvedDestStateId) {
      setDestCities([]);
      return;
    }
    const loadCities = async () => {
      try {
        setDestCitiesLoading(true);
        const cities = await fetchCitiesByState(resolvedDestStateId);
        setDestCities(cities);
      } catch {
        setDestCities([]);
      } finally {
        setDestCitiesLoading(false);
      }
    };
    setForm((prev) => ({ ...prev, destCityId: "", destCityName: "" }));
    loadCities();
  }, [form.destStateId, form.destStateName, resolveStateId]);

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const normalizeText = (value: string) => value.trim().toLowerCase();

  const resolveCityIdFromKnownRoutes = (
    stateId: string,
    stateName: string,
    cityName: string
  ) => {
    const normalizedStateName = normalizeText(stateName);
    const normalizedCityName = normalizeText(cityName);

    for (const route of existingRoutes) {
      const pickupStateMatch =
        route.pickupStateId === stateId ||
        normalizeText(route.pickupState) === normalizedStateName;
      const pickupCityMatch =
        normalizeText(route.pickupCity) === normalizedCityName;

      if (pickupStateMatch && pickupCityMatch) {
        return route.pickupCityId;
      }

      const destStateMatch =
        route.destStateId === stateId ||
        normalizeText(route.destState) === normalizedStateName;
      const destCityMatch = normalizeText(route.destCity) === normalizedCityName;

      if (destStateMatch && destCityMatch) {
        return route.destCityId;
      }
    }

    return "";
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.pickupStateId && !form.pickupStateName) e.pickupStateId = "Required";
    if (!form.pickupCityId && !form.pickupCityName) e.pickupCityId = "Required";
    if (!form.destStateId && !form.destStateName) e.destStateId = "Required";
    if (!form.destCityId && !form.destCityName) e.destCityId = "Required";
    if (!form.baseFee) {
      e.baseFee = "Required";
    } else if (isNaN(Number(form.baseFee)) || Number(form.baseFee) < 0) {
      e.baseFee = "Must be a non-negative number";
    }
    if (form.multiplier === "") {
      e.multiplier = "Required";
    } else if (isNaN(Number(form.multiplier)) || Number(form.multiplier) < 0) {
      e.multiplier = "Must be a non-negative number";
    }
    return e;
  };

  const ensureStateId = async (stateIdOrName: string, stateName?: string) => {
    if (isObjectId(stateIdOrName)) return stateIdOrName;

    const candidateName = (stateName || stateIdOrName || "").trim();
    if (!candidateName) return "";

    const existing = findStateByName(candidateName);
    if (existing) return existing._id;

    // Always re-check backend first so we reuse existing states instead of creating duplicates.
    try {
      const freshStates = await fetchAllStates();
      setAllStates(freshStates);
      const resolved = freshStates.find(
        (s) => s.name.trim().toLowerCase() === candidateName.toLowerCase()
      );
      if (resolved) return resolved._id;
    } catch {
      // Continue to create attempt below.
    }

    try {
      const created = await createState({ name: candidateName });
      setAllStates((prev) => {
        const found = prev.some((s) => s._id === created._id);
        if (found) return prev;
        return [...prev, created];
      });
      return created._id;
    } catch (err: any) {
      if (!isDuplicateError(err)) throw err;

      // If state already exists in backend, fetch and resolve by name.
      const freshStates = await fetchAllStates();
      setAllStates(freshStates);
      const resolved = freshStates.find(
        (s) => s.name.trim().toLowerCase() === candidateName.toLowerCase()
      );
      if (resolved) return resolved._id;
      throw err;
    }
  };

  const ensureCityId = async (
    cityIdOrName: string,
    cityName: string | undefined,
    stateId: string,
    stateName: string,
    existingCities: City[],
    setCities: React.Dispatch<React.SetStateAction<City[]>>
  ) => {
    if (isObjectId(cityIdOrName)) return cityIdOrName;

    const candidateName = (cityName || cityIdOrName || "").trim();
    if (!candidateName) return "";

    const existing = findCityByName(existingCities, candidateName);
    if (existing) return existing._id;

    const fromKnownRoutes = resolveCityIdFromKnownRoutes(
      stateId,
      stateName,
      candidateName
    );
    if (fromKnownRoutes) return fromKnownRoutes;

    // Always re-check backend first so we reuse existing cities in the selected state.
    try {
      const freshCities = await fetchCitiesByState(stateId);
      setCities(freshCities);
      const resolved = freshCities.find(
        (c) => c.name.trim().toLowerCase() === candidateName.toLowerCase()
      );
      if (resolved) return resolved._id;
    } catch {
      // Continue to create attempt below.
    }

    try {
      const created = await createCity(stateId, { name: candidateName });
      setCities((prev) => {
        const found = prev.some((c) => c._id === created._id);
        if (found) return prev;
        return [...prev, created];
      });
      return created._id;
    } catch (err: any) {
      if (!isDuplicateError(err)) throw err;

      // If city already exists in backend, fetch and resolve by name.
      const freshCities = await fetchCitiesByState(stateId);
      setCities(freshCities);
      const resolved = freshCities.find(
        (c) => c.name.trim().toLowerCase() === candidateName.toLowerCase()
      );
      if (resolved) return resolved._id;

      // Last fallback: resolve from already loaded delivery routes.
      const fallbackFromRoutes = resolveCityIdFromKnownRoutes(
        stateId,
        stateName,
        candidateName
      );
      if (fallbackFromRoutes) return fallbackFromRoutes;

      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);

      const pickupStateResolved = await ensureStateId(
        form.pickupStateId,
        form.pickupStateName
      );
      const destStateResolved = await ensureStateId(
        form.destStateId,
        form.destStateName
      );

      if (!pickupStateResolved || !destStateResolved) {
        setSubmitError("Pickup and destination states are required.");
        return;
      }

      let currentPickupCities = pickupCities;
      let currentDestCities = destCities;

      if (!currentPickupCities.length) {
        try {
          currentPickupCities = await fetchCitiesByState(pickupStateResolved);
          setPickupCities(currentPickupCities);
        } catch {
          currentPickupCities = [];
        }
      }

      if (!currentDestCities.length) {
        try {
          currentDestCities = await fetchCitiesByState(destStateResolved);
          setDestCities(currentDestCities);
        } catch {
          currentDestCities = [];
        }
      }

      const pickupCityResolved = await ensureCityId(
        form.pickupCityId,
        form.pickupCityName,
        pickupStateResolved,
        form.pickupStateName || form.pickupStateId,
        currentPickupCities,
        setPickupCities
      );
      const destCityResolved = await ensureCityId(
        form.destCityId,
        form.destCityName,
        destStateResolved,
        form.destStateName || form.destStateId,
        currentDestCities,
        setDestCities
      );

      if (!pickupCityResolved || !destCityResolved) {
        setSubmitError("Pickup and destination cities are required.");
        return;
      }

      const duplicateRoute = existingRoutes.some((route) => {
        if (
          route.pickupStateId === pickupStateResolved &&
          route.pickupCityId === pickupCityResolved &&
          route.destStateId === destStateResolved &&
          route.destCityId === destCityResolved
        ) {
          return true;
        }

        // Fallback by names if IDs are not available in local state for any reason.
        return (
          normalizeText(route.pickupState) ===
            normalizeText(form.pickupStateName || form.pickupStateId) &&
          normalizeText(route.pickupCity) ===
            normalizeText(form.pickupCityName || form.pickupCityId) &&
          normalizeText(route.destState) ===
            normalizeText(form.destStateName || form.destStateId) &&
          normalizeText(route.destCity) ===
            normalizeText(form.destCityName || form.destCityId)
        );
      });

      if (duplicateRoute) {
        setSubmitError(
          "This route already exists. Please edit the existing route instead of creating a duplicate."
        );
        return;
      }

      const payload: CreateDeliveryFeePayload = {
        pickupStateId: pickupStateResolved,
        pickupCityId: pickupCityResolved,
        destinationStateId: destStateResolved,
        destinationCityId: destCityResolved,
        fee: Number(form.baseFee),
        baseFee: Number(form.baseFee),
        multiplier: Number(form.multiplier),
      };

      await onAdd(payload);
      onClose();
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add route. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (error?: string) =>
    `w-full h-[44px] px-3 rounded-[8px] border text-sm bg-[#FAFAFA] outline-none focus:ring-1 focus:ring-[#7A1626] ${
      error ? "border-red-400" : "border-[#E5E7EB]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#111827]">Add New Route</h2>
          <button
            onClick={onClose}
            className="text-[#A0AEC0] hover:text-[#111827] transition-colors shrink-0"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {submitError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {submitError}
            </div>
          )}
          {/* Pickup row */}
          <div className="grid grid-cols-2 gap-3">
            <LocationCombobox
              label="Pickup State"
              items={allStates}
              value={form.pickupStateId}
              onChange={(id, name) => {
                setForm((prev) => ({ ...prev, pickupStateId: id, pickupStateName: name }));
                clearError("pickupStateId");
              }}
              loading={statesLoading}
              placeholder="Search state..."
              error={errors.pickupStateId}
              allowFreeText
            />
            <LocationCombobox
              label="Pickup City"
              items={pickupCities}
              value={form.pickupCityId}
              onChange={(id, name) => {
                setForm((prev) => ({ ...prev, pickupCityId: id, pickupCityName: name }));
                clearError("pickupCityId");
              }}
              loading={pickupCitiesLoading}
              disabled={!form.pickupStateId && !form.pickupStateName}
              placeholder="Search city..."
              error={errors.pickupCityId}
              allowFreeText
            />
          </div>

          {/* Destination row */}
          <div className="grid grid-cols-2 gap-3">
            <LocationCombobox
              label="Dest. State"
              items={allStates}
              value={form.destStateId}
              onChange={(id, name) => {
                setForm((prev) => ({ ...prev, destStateId: id, destStateName: name }));
                clearError("destStateId");
              }}
              loading={statesLoading}
              placeholder="Search state..."
              error={errors.destStateId}
              allowFreeText
            />
            <LocationCombobox
              label="Dest. City"
              items={destCities}
              value={form.destCityId}
              onChange={(id, name) => {
                setForm((prev) => ({ ...prev, destCityId: id, destCityName: name }));
                clearError("destCityId");
              }}
              loading={destCitiesLoading}
              disabled={!form.destStateId && !form.destStateName}
              placeholder="Search city..."
              error={errors.destCityId}
              allowFreeText
            />
          </div>

          {/* Base Fee */}
          <div>
            <label className="block text-sm font-medium text-[#718096] mb-1">
              Base Fee (₦)
            </label>
            <input
              type="number"
              name="baseFee"
              min="0"
              value={form.baseFee}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, baseFee: e.target.value }));
                clearError("baseFee");
              }}
              placeholder="e.g. 3500"
              className={inputClass(errors.baseFee)}
            />
            {errors.baseFee && (
              <p className="text-red-500 text-xs mt-1">{errors.baseFee}</p>
            )}
          </div>

          {/* Multiplier */}
          <div>
            <label className="block text-sm font-medium text-[#718096] mb-1">
              Multiplier (%)
            </label>
            <input
              type="number"
              name="multiplier"
              min="0"
              value={form.multiplier}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, multiplier: e.target.value }));
                clearError("multiplier");
              }}
              placeholder="e.g. 0"
              className={inputClass(errors.multiplier)}
            />
            {errors.multiplier && (
              <p className="text-red-500 text-xs mt-1">{errors.multiplier}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 h-[40px] rounded-[8px] border border-[#E5E7EB] text-[#718096] text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-[40px] rounded-[8px] bg-[#7A1626] text-white text-sm font-semibold hover:bg-[#5e1020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Add Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRouteModal;
