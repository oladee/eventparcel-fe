"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { DeliveryRouteDisplay, SortDir, SortField } from "./types";

interface RoutesTableProps {
  routes: DeliveryRouteDisplay[];
  editingIds: Set<string>;
  editedValues: Map<string, DeliveryRouteDisplay>;
  onToggleEdit: (id: string) => void;
  onSaveRow: (id: string) => void;
  onCancelRow: (id: string) => void;
  onDeleteRequest: (route: DeliveryRouteDisplay) => void;
  onEditFieldChange: (id: string, field: "baseFee" | "multiplier", value: number) => void;
}

const LIMIT_OPTIONS = [6, 10, 20, 30, 50];

const RoutesTable: React.FC<RoutesTableProps> = ({
  routes,
  editingIds,
  editedValues,
  onToggleEdit,
  onSaveRow,
  onCancelRow,
  onDeleteRequest,
  onEditFieldChange,
}) => {
  const [search, setSearch] = useState("");
  const [pickupStateFilter, setPickupStateFilter] = useState("All Pickup States");
  const [destStateFilter, setDestStateFilter] = useState("All Dest. States");
  const [pickupDropdownOpen, setPickupDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("pickupState");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [baseFeeDrafts, setBaseFeeDrafts] = useState<Record<string, string>>({});
  const [multiplierDrafts, setMultiplierDrafts] = useState<Record<string, string>>({});

  const pickupDropRef = useRef<HTMLDivElement | null>(null);
  const destDropRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickupDropRef.current && !pickupDropRef.current.contains(e.target as Node)) {
        setPickupDropdownOpen(false);
      }
      if (destDropRef.current && !destDropRef.current.contains(e.target as Node)) {
        setDestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Unique states for filter dropdowns
  const uniquePickupStates = useMemo(
    () => ["All Pickup States", ...Array.from(new Set(routes.map((r) => r.pickupState))).sort()],
    [routes]
  );
  const uniqueDestStates = useMemo(
    () => ["All Dest. States", ...Array.from(new Set(routes.map((r) => r.destState))).sort()],
    [routes]
  );

  // Filter
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return routes.filter((r) => {
      const matchSearch =
        !term ||
        r.pickupState.toLowerCase().includes(term) ||
        r.pickupCity.toLowerCase().includes(term) ||
        r.destState.toLowerCase().includes(term) ||
        r.destCity.toLowerCase().includes(term);
      const matchPickup =
        pickupStateFilter === "All Pickup States" || r.pickupState === pickupStateFilter;
      const matchDest =
        destStateFilter === "All Dest. States" || r.destState === destStateFilter;
      return matchSearch && matchPickup && matchDest;
    });
  }, [routes, search, pickupStateFilter, destStateFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortField, sortDir]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, pickupStateFilter, destStateFilter, limit]);

  useEffect(() => {
    setBaseFeeDrafts((prev) => {
      const next = { ...prev };
      let changed = false;

      editingIds.forEach((id) => {
        if (next[id] !== undefined) return;
        const editedRoute = editedValues.get(id);
        const route = routes.find((r) => r._id === id);
        const value = editedRoute?.baseFee ?? route?.baseFee ?? 0;
        next[id] = String(value);
        changed = true;
      });

      Object.keys(next).forEach((id) => {
        if (!editingIds.has(id)) {
          delete next[id];
          changed = true;
        }
      });

      return changed ? next : prev;
    });

    setMultiplierDrafts((prev) => {
      const next = { ...prev };
      let changed = false;

      editingIds.forEach((id) => {
        if (next[id] !== undefined) return;
        const editedRoute = editedValues.get(id);
        const route = routes.find((r) => r._id === id);
        const value = editedRoute?.multiplier ?? route?.multiplier ?? 0;
        next[id] = String(value);
        changed = true;
      });

      Object.keys(next).forEach((id) => {
        if (!editingIds.has(id)) {
          delete next[id];
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [editingIds, editedValues, routes]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleMultiplierInputChange = (id: string, rawValue: string) => {
    if (!/^\d*(\.\d{0,2})?$/.test(rawValue)) {
      return;
    }

    setMultiplierDrafts((prev) => ({ ...prev, [id]: rawValue }));

    if (rawValue === "") {
      onEditFieldChange(id, "multiplier", 0);
      return;
    }

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }

    onEditFieldChange(id, "multiplier", parsed);
  };

  const handleBaseFeeInputChange = (id: string, rawValue: string) => {
    if (!/^\d*(\.\d{0,2})?$/.test(rawValue)) {
      return;
    }

    setBaseFeeDrafts((prev) => ({ ...prev, [id]: rawValue }));

    if (rawValue === "") {
      onEditFieldChange(id, "baseFee", 0);
      return;
    }

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }

    onEditFieldChange(id, "baseFee", parsed);
  };

  const handleBaseFeeBlur = (id: string) => {
    const rawValue = baseFeeDrafts[id] ?? "";
    if (rawValue === "") {
      setBaseFeeDrafts((prev) => ({ ...prev, [id]: "0" }));
      onEditFieldChange(id, "baseFee", 0);
      return;
    }

    const normalized = String(Number(rawValue));
    setBaseFeeDrafts((prev) => ({ ...prev, [id]: normalized }));
  };

  const handleMultiplierBlur = (id: string) => {
    const rawValue = multiplierDrafts[id] ?? "";
    if (rawValue === "") {
      setMultiplierDrafts((prev) => ({ ...prev, [id]: "0" }));
      onEditFieldChange(id, "multiplier", 0);
      return;
    }

    const normalized = String(Number(rawValue));
    setMultiplierDrafts((prev) => ({ ...prev, [id]: normalized }));
  };

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <PiArrowsDownUpFill
      onClick={() => handleSort(field)}
      className={`cursor-pointer ml-1 shrink-0 ${
        sortField === field ? "text-[#7A1626]" : "text-[#A0AEC0]"
      }`}
    />
  );

  const StateDropdown = ({
    value,
    options,
    onChange,
    open,
    setOpen,
    dropRef,
  }: {
    value: string;
    options: string[];
    onChange: (v: string) => void;
    open: boolean;
    setOpen: (v: boolean) => void;
    dropRef: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div ref={dropRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-[40px] flex items-center gap-2 bg-white border border-[#EEEFF2] rounded-[12px] px-3 text-sm text-[#718096] font-medium whitespace-nowrap"
      >
        <span>Show:</span>
        <span className="font-semibold text-[#111827]">{value}</span>
        <MdOutlineKeyboardArrowDown className="w-4 h-4 text-[#111827]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-max min-w-full bg-white shadow-lg rounded-xl overflow-hidden text-sm text-[#111827] max-h-60 overflow-y-auto"
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap ${
                  value === opt ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white h-[40px] rounded-[12px] px-3 flex-1 min-w-[200px] border border-[#EEEFF2]">
          <FiSearch className="text-[#718096] w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Search by state or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm text-[#718096] bg-transparent placeholder-[#A0AEC0] w-full"
          />
        </div>

        {/* Pickup State Filter */}
        <StateDropdown
          value={pickupStateFilter}
          options={uniquePickupStates}
          onChange={setPickupStateFilter}
          open={pickupDropdownOpen}
          setOpen={setPickupDropdownOpen}
          dropRef={pickupDropRef as React.RefObject<HTMLDivElement | null>}
        />

        {/* Dest State Filter */}
        <StateDropdown
          value={destStateFilter}
          options={uniqueDestStates}
          onChange={setDestStateFilter}
          open={destDropdownOpen}
          setOpen={setDestDropdownOpen}
          dropRef={destDropRef as React.RefObject<HTMLDivElement | null>}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        {/* Header */}
        <div className="flex items-center px-4 py-3 text-[#718096] text-sm font-medium border-b border-[#EEEFF2] min-w-[900px]">
          <div className="w-[160px] flex items-center gap-1">Pickup State <SortIcon field="pickupState" /></div>
          <div className="w-[160px] flex items-center gap-1">Pickup City <SortIcon field="pickupCity" /></div>
          <div className="w-[160px] flex items-center gap-1">Dest. State <SortIcon field="destState" /></div>
          <div className="w-[160px] flex items-center gap-1">Dest. City <SortIcon field="destCity" /></div>
          <div className="w-[160px] flex items-center gap-1">Base Fee <SortIcon field="baseFee" /></div>
          <div className="flex-1 flex items-center gap-1">Multiplier (%) <SortIcon field="multiplier" /></div>
          <div className="w-[80px] text-right">Action</div>
        </div>

        {/* Empty state */}
        {paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-gray-600 mb-1">No routes found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Rows */}
        {paginated.map((route) => {
          const isEditing = editingIds.has(route._id);
          const editedRoute = editedValues.get(route._id);
          const displayRoute = isEditing && editedRoute ? editedRoute : route;

          return (
            <div
              key={route._id}
              className={`flex items-center px-4 py-4 border-b border-[#EEEFF2] last:border-b-0 text-sm min-w-[900px] ${
                isEditing ? "bg-[#FAFAFA]" : ""
              }`}
            >
              <div className="w-[160px] font-semibold text-[#111827]">{route.pickupState}</div>
              <div className="w-[160px] font-semibold text-[#111827]">{route.pickupCity}</div>
              <div className="w-[160px] font-semibold text-[#111827]">{route.destState}</div>
              <div className="w-[160px] font-semibold text-[#111827]">{route.destCity}</div>

              {/* Base Fee */}
              <div className="w-[160px]">
                {isEditing ? (
                  <div className="relative w-full">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={baseFeeDrafts[route._id] ?? String(displayRoute.baseFee ?? 0)}
                      onChange={(e) => handleBaseFeeInputChange(route._id, e.target.value)}
                      onBlur={() => handleBaseFeeBlur(route._id)}
                      onFocus={(e) => e.currentTarget.select()}
                      className="h-[36px] w-full pr-8 px-3 rounded-[8px] border border-[#EEEFF2] text-sm font-semibold text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#7A1626]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#718096]">
                      ₦
                    </span>
                  </div>
                ) : (
                  <span className="inline-block bg-[#F3F4F6] text-[#111827] font-semibold rounded-[8px] px-3 py-1 text-sm">
                    ₦{(route.baseFee ?? 0).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Multiplier */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="relative w-full">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={multiplierDrafts[route._id] ?? String(displayRoute.multiplier ?? 0)}
                      onChange={(e) => handleMultiplierInputChange(route._id, e.target.value)}
                      onBlur={() => handleMultiplierBlur(route._id)}
                      onFocus={(e) => e.currentTarget.select()}
                      className="h-[36px] w-full pr-8 px-3 rounded-[8px] border border-[#EEEFF2] text-sm font-semibold text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#7A1626]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#718096]">
                      %
                    </span>
                  </div>
                ) : (
                  <span className="inline-block bg-[#F3F4F6] text-[#111827] font-semibold rounded-[8px] px-3 py-1 text-sm">
                    {route.multiplier}%
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="w-[80px] flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => onSaveRow(route._id)}
                      className="text-[#16A34A] hover:text-[#0C7A1B] transition-colors"
                      aria-label="Save"
                    >
                      <MdCheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => onCancelRow(route._id)}
                      className="text-[#D1344A] hover:text-[#A01A2E] transition-colors"
                      aria-label="Cancel"
                    >
                      <IoClose size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onToggleEdit(route._id)}
                      className="text-[#718096] hover:text-[#111827] transition-colors"
                      aria-label="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(route)}
                      className="text-[#D1344A] hover:text-[#A01A2E] transition-colors"
                      aria-label="Delete"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-2">
          <div className="flex items-center gap-2 text-sm text-[#718096]">
            <span>Show result:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-[#EEEFF2] rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#7A1626]"
            >
              {LIMIT_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              className="px-2 py-1 text-[#A0AEC0] hover:text-[#111827]"
            >
              &lt;
            </button>
            {getPageNumbers(page, totalPages).map((num, idx) =>
              num === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-[#A0AEC0]">...</span>
              ) : (
                <button
                  key={num}
                  onClick={() => setPage(Number(num))}
                  className={`w-8 h-8 rounded-[8px] text-sm ${
                    num === page
                      ? "bg-[#DCFCE7] text-[#16A34A] font-semibold"
                      : "text-[#A0AEC0] hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              )
            )}
            <button
              onClick={() => page < totalPages && setPage(page + 1)}
              className="px-2 py-1 text-[#A0AEC0] hover:text-[#111827]"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesTable;
