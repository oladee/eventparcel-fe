"use client";

import { useState, useEffect } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import RoutesTable from "@/components/admin/deliveryPricing/RoutesTable";
import AddRouteModal from "@/components/admin/deliveryPricing/AddRouteModal";
import DeleteRouteModal from "@/components/admin/deliveryPricing/DeleteRouteModal";
import UploadCsvModal from "@/components/admin/deliveryPricing/UploadCsvModal";
//import ChangeHistorySection from "@/components/admin/deliveryPricing/ChangeHistorySection";
import { DeliveryRouteDisplay } from "@/components/admin/deliveryPricing/types";
import { HiOutlineUpload } from "react-icons/hi";
import {
  fetchDeliveryFees,
  createDeliveryFee,
  updateDeliveryFee,
  deleteDeliveryFee,
  CreateDeliveryFeePayload,
} from "@/api/deliveryFees";
import {
  convertApiToDisplay,
  convertDisplayToApiPayload,
} from "@/components/admin/deliveryPricing/mappers";

type Tab = "routes" | "changeHistory";

const DeliveryPricingPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("routes");
  const [displayRoutes, setDisplayRoutes] = useState<DeliveryRouteDisplay[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingOperation, setLoadingOperation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<DeliveryRouteDisplay | null>(null);

  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [editedValues, setEditedValues] = useState<Map<string, DeliveryRouteDisplay>>(new Map());

  const getActionErrorMessage = (err: any, fallback: string) => {
    if (err?.code === "ERR_NETWORK" || !err?.response) {
      return "Delivery pricing API is currently unreachable. Changes were not saved.";
    }

    return err?.response?.data?.message || err?.message || fallback;
  };

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoadingFetch(true);
        setError(null);
        const apiRoutes = await fetchDeliveryFees();
        setDisplayRoutes(apiRoutes.map(convertApiToDisplay));
      } catch (err: any) {
        console.error(err);
        setDisplayRoutes([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load delivery fees"
        );
      } finally {
        setLoadingFetch(false);
      }
    };

    loadRoutes();
  }, []);

  const handleAddRoute = async (payload: CreateDeliveryFeePayload) => {
    try {
      setLoadingOperation(true);
      await createDeliveryFee(payload);
      const apiRoutes = await fetchDeliveryFees();
      setDisplayRoutes(apiRoutes.map(convertApiToDisplay));
      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      setError(getActionErrorMessage(err, "Failed to add route"));
    } finally {
      setLoadingOperation(false);
    }
  };

  const handleDeleteRoute = async (id: string): Promise<boolean> => {
    try {
      setLoadingOperation(true);
      setDeleteError(null);
      await deleteDeliveryFee(id);
      setDisplayRoutes((prev) => prev.filter((r) => r._id !== id));
      setRouteToDelete(null);
      return true;
    } catch (err: any) {
      console.error(err);
      const message = getActionErrorMessage(err, "Failed to delete route");
      setDeleteError(message);
      setError("Unable to delete route");
      return false;
    } finally {
      setLoadingOperation(false);
    }
  };

  const handleToggleEdit = (id: string) => {
    setEditingIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        const route = displayRoutes.find((r) => r._id === id);
        if (route && !editedValues.has(id)) {
          setEditedValues((prevMap) => new Map(prevMap).set(id, { ...route }));
        }
      }
      return newSet;
    });
  };

  const handleEditFieldChange = (
    id: string,
    field: "baseFee" | "multiplier",
    value: number
  ) => {
    setEditedValues((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(id) || displayRoutes.find((r) => r._id === id)!;
      newMap.set(id, { ...current, [field]: value });
      return newMap;
    });
  };

  const handleSaveRow = async (id: string) => {
    try {
      setLoadingOperation(true);
      const editedRoute = editedValues.get(id);
      if (!editedRoute) return;

      const payload = convertDisplayToApiPayload(editedRoute);
      await updateDeliveryFee(id, payload);

      setDisplayRoutes((prev) =>
        prev.map((r) => (r._id === id ? editedRoute : r))
      );

      setEditingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setEditedValues((prev) => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    } catch (err: any) {
      console.error(err);
      setError(getActionErrorMessage(err, "Failed to save route"));
    } finally {
      setLoadingOperation(false);
    }
  };

  const handleCancelRow = (id: string) => {
    setEditingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setEditedValues((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const handleSaveAll = async () => {
    try {
      setLoadingOperation(true);
      for (const id of editingIds) {
        const editedRoute = editedValues.get(id);
        if (editedRoute) {
          const payload = convertDisplayToApiPayload(editedRoute);
          await updateDeliveryFee(id, payload);
        }
      }

      const updatedRoutes = displayRoutes.map((r) => {
        const edited = editedValues.get(r._id);
        return edited ? edited : r;
      });
      setDisplayRoutes(updatedRoutes);

      setEditingIds(new Set());
      setEditedValues(new Map());
    } catch (err: any) {
      console.error(err);
      setError(getActionErrorMessage(err, "Failed to save all routes"));
    } finally {
      setLoadingOperation(false);
    }
  };

  const refreshRoutes = async () => {
    try {
      const apiRoutes = await fetchDeliveryFees();
      setDisplayRoutes(apiRoutes.map(convertApiToDisplay));
    } catch (err: any) {
      console.error(err);
      setError(getActionErrorMessage(err, "Failed to refresh routes"));
    }
  };

  return (
    <AdminContainer>
      <div className="w-full p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="w-full border-b border-[#EEEFF2] sm:w-auto">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab("routes")}
                className={`pb-2 text-sm font-semibold transition-colors ${
                  activeTab === "routes"
                    ? "border-b-2 border-[#7A1626] text-[#111827]"
                    : "text-[#718096] hover:text-[#111827]"
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setActiveTab("changeHistory")}
                className={`pb-2 text-sm font-semibold transition-colors ${
                  activeTab === "changeHistory"
                    ? "border-b-2 border-[#7A1626] text-[#111827]"
                    : "text-[#718096] hover:text-[#111827]"
                }`}
              >
                Change History
              </button>
            </div>
          </div>

          {activeTab === "routes" && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCsvModal(true)}
                disabled={loadingOperation}
                className="flex h-[40px] items-center gap-2 rounded-[8px] border border-[#7A1626] px-4 text-sm font-semibold text-[#7A1626] transition-colors hover:bg-[#fdf4f5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HiOutlineUpload size={16} />
                Upload CSV
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={loadingOperation}
                className="h-[40px] rounded-[8px] bg-[#7A1626] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5e1020] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Route
              </button>
              {editingIds.size > 0 && (
                <button
                  onClick={handleSaveAll}
                  disabled={loadingOperation}
                  className="h-[40px] rounded-[8px] border border-[#16A34A] px-4 text-sm font-semibold text-[#16A34A] transition-colors hover:bg-[#dcfce7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save All ({editingIds.size})
                </button>
              )}
            </div>
          )}
        </div>

        {activeTab === "routes" ? (
          loadingFetch ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#718096]">Loading delivery fees...</p>
            </div>
          ) : (
            <RoutesTable
              routes={displayRoutes}
              editingIds={editingIds}
              editedValues={editedValues}
              onToggleEdit={handleToggleEdit}
              onSaveRow={handleSaveRow}
              onCancelRow={handleCancelRow}
              onDeleteRequest={(route) => {
                setDeleteError(null);
                setRouteToDelete(route);
              }}
              onEditFieldChange={handleEditFieldChange}
            />
          )
        ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#718096]">No change history available.</p>
            </div>

        )}
      </div>

      {showAddModal && (
        <AddRouteModal onClose={() => setShowAddModal(false)} onAdd={handleAddRoute} />
      )}

      {showCsvModal && (
        <UploadCsvModal onClose={() => setShowCsvModal(false)} onApplied={refreshRoutes} />
      )}

      {routeToDelete && (
        <DeleteRouteModal
          route={routeToDelete}
          onClose={() => {
            setRouteToDelete(null);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteRoute}
          loading={loadingOperation}
          error={deleteError}
        />
      )}
    </AdminContainer>
  );
};

export default DeliveryPricingPage;
