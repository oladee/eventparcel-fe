"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AuditAction,
  DeliveryFeeAuditLogEntry,
  fetchDeliveryFeeAuditLogs,
} from "@/api/deliveryFees";
import {
  LuArrowUpDown,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuSearch,
} from "react-icons/lu";

type SortField = "createdAt" | "action" | "actor" | "details";
type SortDirection = "asc" | "desc";

const ACTION_LABELS: Record<AuditAction, string> = {
  create: "Create",
  update: "Update",
  delete: "Delete",
};

const ACTION_BADGE_STYLES: Record<AuditAction, string> = {
  create: "bg-[#E6F8EE] text-[#22A965]",
  update: "bg-[#FFF1E6] text-[#FF8A3D]",
  delete: "bg-[#FEE2E2] text-[#D92D20]",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNestedValue(source: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = source;

  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }

  return current;
}

function isObjectIdLike(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value.trim());
}

function normalizeDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (isRecord(value) && typeof value.name === "string") {
    return value.name;
  }

  if (typeof value === "string") {
    return isObjectIdLike(value) ? "" : value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function getFirstValue(source: Record<string, unknown>, paths: string[]): string {
  for (const path of paths) {
    const value = normalizeDisplayValue(getNestedValue(source, path));
    if (value) return value;
  }

  return "";
}

function getNumericValue(
  source: Record<string, unknown>,
  paths: string[]
): number | undefined {
  for (const path of paths) {
    const value = getNestedValue(source, path);
    if (typeof value === "number") return value;
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return undefined;
}

function formatCurrency(value?: number): string {
  if (typeof value !== "number") return "";
  return `N${value.toLocaleString()}`;
}

function formatPercent(value?: number): string {
  if (typeof value !== "number") return "";
  return `${value}%`;
}

function joinPriceParts(fee?: number, multiplier?: number): string {
  const feeLabel = formatCurrency(fee);
  const multiplierLabel = formatPercent(multiplier);

  if (feeLabel && multiplierLabel) {
    return `${feeLabel} / ${multiplierLabel}`;
  }

  return feeLabel || multiplierLabel || "";
}

function getActorName(entry: DeliveryFeeAuditLogEntry): string {
  const actor = entry.performedBy;
  if (!actor) return "Unknown Admin";

  const fullName = [actor.firstName, actor.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || actor.email || actor._id;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function getRouteLabel(details?: Record<string, unknown>): string {
  if (!details) return "";

  const pickupState = getFirstValue(details, [
    "pickupStateName",
    "pickupStateLabel",
    "pickupState.name",
    "pickupState",
    "before.pickupStateName",
    "after.pickupStateName",
  ]);
  const pickupCity = getFirstValue(details, [
    "pickupCityName",
    "pickupCityLabel",
    "pickupCity.name",
    "pickupCity",
    "before.pickupCityName",
    "after.pickupCityName",
  ]);
  const destinationState = getFirstValue(details, [
    "destinationStateName",
    "destinationStateLabel",
    "destinationState.name",
    "destinationState",
    "before.destinationStateName",
    "after.destinationStateName",
  ]);
  const destinationCity = getFirstValue(details, [
    "destinationCityName",
    "destinationCityLabel",
    "destinationCity.name",
    "destinationCity",
    "before.destinationCityName",
    "after.destinationCityName",
  ]);

  const from = [pickupState, pickupCity].filter(Boolean).join(" ");
  const to = [destinationState, destinationCity].filter(Boolean).join(" ");

  if (from && to) {
    return `${from} -> ${to}`;
  }

  return "";
}

function getBeforeSnapshot(details?: Record<string, unknown>) {
  if (!details) return { fee: undefined, multiplier: undefined };

  return {
    fee: getNumericValue(details, [
      "before.baseFee",
      "before.fee",
      "old.baseFee",
      "old.fee",
      "oldValues.baseFee",
      "oldValues.fee",
      "previous.baseFee",
      "previous.fee",
      "from.baseFee",
      "from.fee",
    ]),
    multiplier: getNumericValue(details, [
      "before.multiplier",
      "old.multiplier",
      "oldValues.multiplier",
      "previous.multiplier",
      "from.multiplier",
    ]),
  };
}

function getAfterSnapshot(details?: Record<string, unknown>) {
  if (!details) return { fee: undefined, multiplier: undefined };

  return {
    fee: getNumericValue(details, [
      "after.baseFee",
      "after.fee",
      "new.baseFee",
      "new.fee",
      "newValues.baseFee",
      "newValues.fee",
      "to.baseFee",
      "to.fee",
      "baseFee",
      "fee",
    ]),
    multiplier: getNumericValue(details, [
      "after.multiplier",
      "new.multiplier",
      "newValues.multiplier",
      "to.multiplier",
      "multiplier",
    ]),
  };
}

function getEntryTitle(entry: DeliveryFeeAuditLogEntry): string {
  const details = entry.details;
  const routeLabel = getRouteLabel(details);

  if (entry.resource === "delivery_fee_import") {
    return (
      getFirstValue(details ?? {}, ["summary", "message", "note"]) ||
      "Imported delivery fee changes"
    );
  }

  if (entry.resource === "state" || entry.resource === "city") {
    const name = getFirstValue(details ?? {}, ["name", "stateName", "cityName"]);
    return `${ACTION_LABELS[entry.action]}d: ${name || entry.resource}`;
  }

  if (routeLabel) {
    return `${ACTION_LABELS[entry.action]}d: ${routeLabel}`;
  }

  return `${ACTION_LABELS[entry.action]}d: Delivery fee`;
}

function getDetailLines(
  entry: DeliveryFeeAuditLogEntry
): Array<{ text: string; tone: string }> {
  const details = entry.details;
  const before = getBeforeSnapshot(details);
  const after = getAfterSnapshot(details);
  const lines: Array<{ text: string; tone: string }> = [];

  if (entry.action === "create") {
    const afterText = joinPriceParts(after.fee, after.multiplier);
    if (afterText) {
      lines.push({ text: `After: ${afterText}`, tone: "text-[#22A965]" });
    }
  }

  if (entry.action === "update") {
    const beforeText = joinPriceParts(before.fee, before.multiplier);
    const afterText = joinPriceParts(after.fee, after.multiplier);

    if (beforeText) {
      lines.push({ text: `From: ${beforeText}`, tone: "text-[#FF8A3D]" });
    }
    if (afterText) {
      lines.push({ text: `To: ${afterText}`, tone: "text-[#22A965]" });
    }
  }

  if (entry.action === "delete") {
    const beforeText = joinPriceParts(before.fee, before.multiplier);
    if (beforeText) {
      lines.push({ text: `Removed: ${beforeText}`, tone: "text-[#D92D20]" });
    }
  }

  if (lines.length === 0) {
    const fallback = getFirstValue(details ?? {}, [
      "message",
      "summary",
      "note",
      "name",
    ]);
    if (fallback) {
      lines.push({ text: fallback, tone: "text-[#22A965]" });
    }
  }

  return lines;
}

function getSearchText(entry: DeliveryFeeAuditLogEntry): string {
  const details = entry.details ?? {};
  return [
    getActorName(entry),
    entry.resource,
    getEntryTitle(entry),
    getRouteLabel(details),
    getFirstValue(details, ["name", "message", "summary", "note"]),
  ]
    .join(" ")
    .toLowerCase();
}

function compareValues(
  left: string | number,
  right: string | number,
  direction: SortDirection
): number {
  if (left < right) return direction === "asc" ? -1 : 1;
  if (left > right) return direction === "asc" ? 1 : -1;
  return 0;
}

export default function ChangeHistorySection() {
  const [logs, setLogs] = useState<DeliveryFeeAuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(null);

  const [actionFilter, setActionFilter] = useState<AuditAction | "">("");
  const [actorFilter, setActorFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const loadLogs = useCallback(
    async (
      nextPage: number,
      nextLimit: number,
      nextAction: AuditAction | ""
    ) => {
      setLoading(true);
      setError(null);
      setUnsupportedMessage(null);

      try {
        const response = await fetchDeliveryFeeAuditLogs({
          page: nextPage,
          limit: nextLimit,
          ...(nextAction ? { action: nextAction } : {}),
        });

        setLogs(response.logs);
        setPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const message = String(
          err?.response?.data?.message || err?.message || ""
        ).toLowerCase();

        if (err?.response?.status === 404 || err?.response?.status === 501) {
          setUnsupportedMessage(
            "The audit log endpoint is not available on this server yet."
          );
        } else if (
          err?.response?.status === 500 &&
          message.includes('schema hasn\'t been registered for model "admin"')
        ) {
          setUnsupportedMessage(
            "Audit logs are temporarily unavailable because the backend Admin model is not registered for this endpoint."
          );
        } else if (err?.code === "ERR_NETWORK" || !err?.response) {
          setError("Delivery pricing API is currently unreachable.");
        } else {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load audit logs"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadLogs(1, limit, actionFilter);
  }, [actionFilter, limit, loadLogs]);

  const actorOptions = useMemo(() => {
    return Array.from(
      new Set(logs.map((entry) => getActorName(entry)).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const result = logs.filter((entry) => {
      if (actorFilter && getActorName(entry) !== actorFilter) {
        return false;
      }

      if (normalizedSearch && !getSearchText(entry).includes(normalizedSearch)) {
        return false;
      }

      return true;
    });

    return [...result].sort((left, right) => {
      if (sortField === "createdAt") {
        return compareValues(
          new Date(left.createdAt).getTime(),
          new Date(right.createdAt).getTime(),
          sortDirection
        );
      }

      if (sortField === "action") {
        return compareValues(left.action, right.action, sortDirection);
      }

      if (sortField === "actor") {
        return compareValues(getActorName(left), getActorName(right), sortDirection);
      }

      return compareValues(getEntryTitle(left), getEntryTitle(right), sortDirection);
    });
  }, [actorFilter, logs, searchQuery, sortDirection, sortField]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection(field === "createdAt" ? "desc" : "asc");
  };

  if (unsupportedMessage) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#EAECF0] bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-[#344054]">
          Change history is not available right now.
        </p>
        <p className="mt-2 text-sm text-[#98A2B3]">
          {unsupportedMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
              size={18}
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by state or city..."
              className="h-12 w-full rounded-[14px] border border-[#F2F4F7] bg-[#FCFCFD] pl-12 pr-4 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#D0D5DD]"
            />
          </div>

          <div className="relative min-w-[170px]">
            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value as AuditAction | "")}
              className="h-12 w-full appearance-none rounded-[14px] border border-[#F2F4F7] bg-[#FCFCFD] pl-4 pr-10 text-sm font-medium text-[#344054] outline-none focus:border-[#D0D5DD]"
            >
              <option value="">Show: All Actions</option>
              <option value="create">Show: Create</option>
              <option value="update">Show: Update</option>
              <option value="delete">Show: Delete</option>
            </select>
            <LuChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#344054]"
              size={16}
            />
          </div>

          <div className="relative min-w-[170px]">
            <select
              value={actorFilter}
              onChange={(event) => setActorFilter(event.target.value)}
              className="h-12 w-full appearance-none rounded-[14px] border border-[#F2F4F7] bg-[#FCFCFD] pl-4 pr-10 text-sm font-medium text-[#344054] outline-none focus:border-[#D0D5DD]"
            >
              <option value="">Show: Actors</option>
              {actorOptions.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
            <LuChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#344054]"
              size={16}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B42318]">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] table-fixed">
            <thead>
              <tr className="border-b border-[#EAECF0] text-left text-sm text-[#8A94A6]">
                <th className="px-6 py-5 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("createdAt")}
                    className="inline-flex items-center gap-2"
                  >
                    Date
                    <LuArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-5 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("action")}
                    className="inline-flex items-center gap-2"
                  >
                    Action
                    <LuArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-5 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("actor")}
                    className="inline-flex items-center gap-2"
                  >
                    Performed By
                    <LuArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-5 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("details")}
                    className="inline-flex items-center gap-2"
                  >
                    Details
                    <LuArrowUpDown size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-sm text-[#98A2B3]">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-sm text-[#98A2B3]">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => {
                  const detailLines = getDetailLines(entry);

                  return (
                    <tr key={entry._id} className="border-b border-[#F2F4F7] align-top last:border-b-0">
                      <td className="px-6 py-4 text-sm text-[#98A2B3]">
                        {formatTimestamp(entry.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-[8px] px-3 py-1 text-xs font-semibold ${ACTION_BADGE_STYLES[entry.action]}`}
                        >
                          {ACTION_LABELS[entry.action]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#344054]">
                        {getActorName(entry)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#344054]">
                          {getEntryTitle(entry)}
                        </p>
                        {detailLines.map((line) => (
                          <p key={line.text} className={`mt-1 text-xs font-semibold ${line.tone}`}>
                            {line.text}
                          </p>
                        ))}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-fit">
            <label className="mr-3 text-sm text-[#98A2B3]">Show result:</label>
            <select
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="h-10 appearance-none rounded-[10px] border border-[#EAECF0] bg-white pl-4 pr-10 text-sm font-medium text-[#344054] outline-none"
            >
              {[6, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <LuChevronDown
              className="pointer-events-none absolute right-4 top-1/2 translate-y-[2px] text-[#98A2B3]"
              size={16}
            />
          </div>

          <div className="flex items-center gap-4 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => loadLogs(page - 1, limit, actionFilter)}
              disabled={page <= 1 || loading}
              className="text-[#98A2B3] transition-colors hover:text-[#344054] disabled:opacity-40"
            >
              <LuChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-3 text-sm text-[#98A2B3]">
              {page > 1 && <span>{page - 1}</span>}
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#E7F6EC] font-semibold text-[#22A965]">
                {page}
              </span>
              {page < totalPages && <span>{page + 1}</span>}
              {page + 1 < totalPages && <span>...</span>}
              {page + 1 < totalPages && <span>{totalPages}</span>}
            </div>

            <button
              type="button"
              onClick={() => loadLogs(page + 1, limit, actionFilter)}
              disabled={page >= totalPages || loading}
              className="text-[#98A2B3] transition-colors hover:text-[#344054] disabled:opacity-40"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
