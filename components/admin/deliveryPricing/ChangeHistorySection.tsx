"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchDeliveryFeeHistory,
  ChangeLogEntry,
  ChangeAction,
  FetchHistoryParams,
} from "@/api/deliveryFees";
import { LuRefreshCw, LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACTION_LABELS: Record<ChangeAction, string> = {
  create: "Added",
  update: "Edited",
  delete: "Deleted",
  bulk_import: "Bulk Import",
};

const ACTION_COLORS: Record<ChangeAction, string> = {
  create: "bg-[#E6F8EE] text-[#22A965]",
  update: "bg-[#FFF1E6] text-[#FF8A3D]",
  delete: "bg-[#FEF2F2] text-[#B91C1C]",
  bulk_import: "bg-[#EFF6FF] text-[#2563EB]",
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function routeLabel(entry: ChangeLogEntry): string {
  if (entry.route) {
    return `${entry.route.pickupCity}, ${entry.route.pickupState} → ${entry.route.destinationCity}, ${entry.route.destinationState}`;
  }
  if (entry.note) return entry.note;
  return "—";
}

function DiffRow({ label, before, after }: { label: string; before?: unknown; after?: unknown }) {
  const fmt = (v: unknown) => (v === undefined || v === null ? "—" : String(v));
  const changed = before !== undefined && after !== undefined && before !== after;
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-24 shrink-0 font-medium text-[#718096]">{label}</span>
      {changed ? (
        <span>
          <span className="line-through text-[#B91C1C]">{fmt(before)}</span>
          <span className="mx-1 text-[#9CA3AF]">→</span>
          <span className="text-[#16A34A]">{fmt(after)}</span>
        </span>
      ) : (
        <span className="text-[#374151]">{fmt(after ?? before)}</span>
      )}
    </div>
  );
}

function EntryDetail({ entry }: { entry: ChangeLogEntry }) {
  const { before, after, note } = entry;
  const showFields = before || after;
  if (!showFields && !note) return null;

  const fields: Array<{ label: string; key: string }> = [
    { label: "Base Fee", key: "baseFee" },
    { label: "Multiplier", key: "multiplier" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="mt-2 rounded-md border border-[#EEEFF2] bg-[#FAFAFA] px-3 py-2 space-y-1">
      {note && <p className="text-xs text-[#374151] italic">{note}</p>}
      {showFields &&
        fields.map(({ label, key }) => {
          const b = (before as Record<string, unknown>)?.[key];
          const a = (after as Record<string, unknown>)?.[key];
          if (b === undefined && a === undefined) return null;
          return <DiffRow key={key} label={label} before={b} after={a} />;
        })}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function ChangeHistorySection() {
  const [entries, setEntries] = useState<ChangeLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [routeSearch, setRouteSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<ChangeAction | "">("");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const params: FetchHistoryParams = {
          page: p,
          limit: PAGE_SIZE,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(routeSearch && { route: routeSearch }),
          ...(actionFilter && { action: actionFilter }),
        };
        const res = await fetchDeliveryFeeHistory(params);
        setEntries(res.entries);
        setTotal(res.total);
        setPages(res.pages);
        setPage(p);
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.status === 501) {
          setUnsupported(true);
        } else if (err?.code === "ERR_NETWORK" || !err?.response) {
          setError("Delivery pricing API is currently unreachable.");
        } else {
          setError(err?.response?.data?.message || err?.message || "Failed to load history");
        }
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate, routeSearch, actionFilter]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleApplyFilters = () => load(1);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setRouteSearch("");
    setActionFilter("");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (unsupported) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#EEEFF2] py-20 text-center">
        <p className="text-[#718096] text-sm">Change history is not yet available on this server.</p>
        <p className="text-xs text-[#9CA3AF] mt-1">The audit log endpoint has not been deployed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Date range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#718096]">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-[38px] rounded-[8px] border border-[#EEEFF2] px-3 text-sm text-[#374151] focus:outline-none focus:ring-1 focus:ring-[#7A1626]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#718096]">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-[38px] rounded-[8px] border border-[#EEEFF2] px-3 text-sm text-[#374151] focus:outline-none focus:ring-1 focus:ring-[#7A1626]"
          />
        </div>

        {/* Route search */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#718096]">Route</label>
          <div className="relative flex items-center">
            <LuSearch size={14} className="absolute left-3 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="e.g. Lagos → Abuja"
              value={routeSearch}
              onChange={(e) => setRouteSearch(e.target.value)}
              className="h-[38px] w-52 rounded-[8px] border border-[#EEEFF2] pl-8 pr-3 text-sm text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#7A1626]"
            />
          </div>
        </div>

        {/* Action filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#718096]">Action</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as ChangeAction | "")}
            className="h-[38px] rounded-[8px] border border-[#EEEFF2] px-3 text-sm text-[#374151] focus:outline-none focus:ring-1 focus:ring-[#7A1626]"
          >
            <option value="">All actions</option>
            <option value="create">Added</option>
            <option value="update">Edited</option>
            <option value="delete">Deleted</option>
            <option value="bulk_import">Bulk Import</option>
          </select>
        </div>

        <button
          onClick={handleApplyFilters}
          disabled={loading}
          className="h-[38px] rounded-[8px] bg-[#7A1626] px-4 text-sm font-semibold text-white hover:bg-[#5e1020] disabled:opacity-50"
        >
          Apply
        </button>
        <button
          onClick={handleClearFilters}
          disabled={loading}
          className="h-[38px] rounded-[8px] border border-[#EEEFF2] px-4 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-50"
        >
          Clear
        </button>
        <button
          onClick={() => load(page)}
          disabled={loading}
          aria-label="Refresh"
          className="h-[38px] w-[38px] flex items-center justify-center rounded-[8px] border border-[#EEEFF2] hover:bg-[#F9FAFB] disabled:opacity-50"
        >
          <LuRefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm text-[#B91C1C]">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      {loading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-[#718096] text-sm">Loading change history…</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#EEEFF2] py-20">
          <p className="text-[#718096] text-sm">No change history found.</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#9CA3AF]">{total} record{total !== 1 ? "s" : ""}</p>
          <div className="overflow-x-auto rounded-xl border border-[#EEEFF2]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EEEFF2] bg-[#FAFAFA] text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096] whitespace-nowrap">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">Admin</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">Action</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">Route / Detail</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096] sr-only">Expand</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const expanded = expandedId === entry._id;
                  const hasDiff = !!(entry.before || entry.after || entry.note);
                  return (
                    <>
                      <tr
                        key={entry._id}
                        onClick={() => hasDiff && setExpandedId(expanded ? null : entry._id)}
                        className={`border-b border-[#EEEFF2] transition-colors ${
                          hasDiff ? "cursor-pointer hover:bg-[#FAFAFA]" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-xs text-[#374151] whitespace-nowrap">
                          {formatTimestamp(entry.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-[#111827]">
                            {entry.adminName || entry.adminId}
                          </div>
                          {entry.adminEmail && (
                            <div className="text-xs text-[#9CA3AF]">{entry.adminEmail}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                              ACTION_COLORS[entry.action] ?? "bg-[#F3F4F6] text-[#374151]"
                            }`}
                          >
                            {ACTION_LABELS[entry.action] ?? entry.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#374151]">
                          {routeLabel(entry)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {hasDiff && (
                            <span className="text-xs text-[#7A1626] font-semibold">
                              {expanded ? "Hide" : "Details"}
                            </span>
                          )}
                        </td>
                      </tr>
                      {expanded && (
                        <tr key={`${entry._id}-detail`} className="bg-[#FAFAFA]">
                          <td colSpan={5} className="px-4 pb-4">
                            <EntryDetail entry={entry} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {pages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-[#9CA3AF]">
                Page {page} of {pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page <= 1 || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#EEEFF2] hover:bg-[#F9FAFB] disabled:opacity-40"
                >
                  <LuChevronLeft size={14} />
                </button>
                <button
                  onClick={() => load(page + 1)}
                  disabled={page >= pages || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#EEEFF2] hover:bg-[#F9FAFB] disabled:opacity-40"
                >
                  <LuChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
