"use client";

import { Fragment, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineUploadFile } from "react-icons/md";
import { LuArrowUpDown, LuChevronDown, LuDownload } from "react-icons/lu";
import {
  importDeliveryFeesPreview,
  confirmDeliveryFeesImport,
  downloadDeliveryFeesTemplate,
} from "@/api/deliveryFees";

type ImportMode = "merge" | "replace_all";

interface PreviewRow {
  rowNumber?: number;
  pickupStateLabel?: string;
  pickupCityLabel?: string;
  destinationStateLabel?: string;
  destinationCityLabel?: string;
  fee?: number;
  baseFee?: number;
  multiplier?: number;
  rowStatus?: string;
  error?: string;
  errors?: string[];
  validationErrors?: string[];
}

interface PreviewData {
  importId: string;
  totalRows: number;
  newRows: number;
  duplicateRows: number;
  inactiveMatchRows: number;
  rows: PreviewRow[];
  expiresAt: string;
}

interface UploadCsvModalProps {
  onClose: () => void;
  onApplied: () => Promise<void> | void;
}

const validateExcelFile = (file: File): string | null => {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".xlsx")) {
    return "Please upload an Excel template file (.xlsx).";
  }

  return null;
};

const statusBadge = (status?: string) => {
  const normalized = (status || "").toLowerCase();

  if (normalized === "new") {
    return "bg-[#E6F8EE] text-[#22A965]";
  }
  if (normalized === "inactive_match" || normalized === "duplicate") {
    return "bg-[#FFF1E6] text-[#FF8A3D]";
  }
  if (normalized === "error" || normalized === "invalid") {
    return "bg-[#FEE2E2] text-[#991B1B]";
  }
  return "bg-[#EFF6FF] text-[#1D4ED8]";
};

const getStatusLabel = (status?: string) => {
  const normalized = (status || "").toLowerCase();

  if (normalized === "inactive_match" || normalized === "duplicate") {
    return "Update";
  }

  if (normalized === "new") {
    return "New";
  }

  if (normalized === "error" || normalized === "invalid") {
    return "Error";
  }

  return status || "Unknown";
};

const formatLocation = (state?: string, city?: string) => {
  if (!state && !city) {
    return "-";
  }

  if (!state) {
    return city || "-";
  }

  if (!city) {
    return state;
  }

  return `${state}, ${city}`;
};

const downloadExcelTemplate = async () => {
  const blob = await downloadDeliveryFeesTemplate();
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "delivery_fees_template.xlsx");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ onClose, onApplied }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [error, setError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [applying, setApplying] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const previewRows = useMemo(
    () => previewData?.rows || [],
    [previewData]
  );

  const summary = useMemo(() => {
    const validCount = previewRows.filter((row) => {
      const hasErrors =
        Boolean(row.error) ||
        (Array.isArray(row.errors) && row.errors.length > 0) ||
        (Array.isArray(row.validationErrors) && row.validationErrors.length > 0);
      return !hasErrors;
    }).length;

    const invalidCount = previewRows.length - validCount;

    return {
      validCount,
      invalidCount,
      updateCount: previewRows.filter((row) => {
        const normalized = (row.rowStatus || "").toLowerCase();
        return normalized === "duplicate" || normalized === "inactive_match";
      }).length,
    };
  }, [previewRows]);

  const handleFileSelect = (file: File | null) => {
    setError(null);
    setSelectedFile(file);
  };

  const handlePreview = async () => {
    if (!selectedFile) {
      setError("Please choose an Excel file first.");
      return;
    }

    try {
      setError(null);
      setLoadingPreview(true);

      const structureError = validateExcelFile(selectedFile);
      if (structureError) {
        setError(structureError);
        return;
      }

      const preview = await importDeliveryFeesPreview(selectedFile);
      setPreviewData(preview as PreviewData);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to preview Excel upload"
      );
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setError(null);
      setDownloadingTemplate(true);
      await downloadExcelTemplate();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to download template"
      );
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleApply = async () => {
    if (!previewData?.importId) return;

    try {
      setApplying(true);
      setError(null);
      await confirmDeliveryFeesImport(previewData.importId, mode);
      await onApplied();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to apply import changes"
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">CSV Upload Preview</h2>
            <p className="text-sm text-[#6B7280] mt-1">Review changes before applying</p>
            {previewData && (
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#9B1C2E] transition-colors hover:text-[#7A1626] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LuDownload size={16} />
                {downloadingTemplate ? "Downloading template..." : "Download Template"}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!previewData ? (
            <>
              {/* Upload Phase */}
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  {/* Icon */}
                  <div className="p-3 rounded-full bg-gray-100">
                    <MdOutlineUploadFile size={36} className="text-[#6B7280]" />
                  </div>

                  {/* Main Text */}
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#111827] mb-1">
                      Select an Excel file to upload
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      or drag and drop it here
                    </p>
                  </div>
                </div>
              </div>

              {/* File Input */}
              <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-8 bg-[#FAFAFA] text-center">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer">
                  <p className="text-sm text-[#6B7280]">
                    Drag Excel file here or{" "}
                    <span className="text-[#7A1626] font-semibold hover:underline">
                      browse
                    </span>
                  </p>
                </label>
              </div>

              {/* Template Section */}
              <div className="text-center">
                <p className="text-sm text-[#4B5563] mb-2">
                  Need the official Excel template?
                </p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  disabled={downloadingTemplate}
                  className="text-[#7A1626] font-semibold hover:underline text-sm"
                >
                  {downloadingTemplate ? "Downloading..." : "Download Template"}
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-6 rounded-lg border border-[#D1D5DB] text-[#6B7280] text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!selectedFile || loadingPreview}
                  className="h-10 px-6 rounded-lg bg-[#7A1626] text-white text-sm font-semibold hover:bg-[#5e1020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPreview ? "Validating..." : "Upload File"}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Preview Phase */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-[10px] bg-[#E6F8EE] px-4 py-2 text-sm font-medium text-[#22A965]">
                    {previewData.newRows} New
                  </span>
                  <span className="inline-flex items-center rounded-[10px] bg-[#FFF1E6] px-4 py-2 text-sm font-medium text-[#FF8A3D]">
                    {summary.updateCount} Update
                  </span>
                  {summary.invalidCount > 0 && (
                    <span className="inline-flex items-center rounded-[10px] bg-[#FEE2E2] px-4 py-2 text-sm font-medium text-[#991B1B]">
                      {summary.invalidCount} Invalid
                    </span>
                  )}
                </div>

                <div className="relative w-full md:max-w-[280px]">
                  <label className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#98A2B3]">
                    Mode:
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as ImportMode)}
                    className="h-12 w-full appearance-none rounded-[14px] border border-[#F1F3F5] bg-[#FCFCFD] pl-[74px] pr-12 text-sm font-semibold text-[#101828] outline-none transition-colors focus:border-[#D0D5DD]"
                  >
                    <option value="merge">Merge (Update +Add New)</option>
                    <option value="replace_all">Replace All</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#101828]">
                    <LuChevronDown size={18} />
                  </span>
                </div>
              </div>

              {/* Preview Table */}
              <div className="overflow-hidden rounded-[18px] border border-[#EAECF0]">
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full min-w-[860px] table-fixed text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-[#EAECF0] text-left text-[#667085]">
                        <th className="px-6 py-5 font-medium">
                          <span className="inline-flex items-center gap-2">
                            Status
                            <LuArrowUpDown size={14} />
                          </span>
                        </th>
                        <th className="px-6 py-5 font-medium">
                          <span className="inline-flex items-center gap-2">
                            Pickup
                            <LuArrowUpDown size={14} />
                          </span>
                        </th>
                        <th className="px-6 py-5 font-medium">
                          <span className="inline-flex items-center gap-2">
                            Destination
                            <LuArrowUpDown size={14} />
                          </span>
                        </th>
                        <th className="px-6 py-5 font-medium">
                          <span className="inline-flex items-center gap-2">
                            Base Fee
                            <LuArrowUpDown size={14} />
                          </span>
                        </th>
                        <th className="px-6 py-5 font-medium">
                          <span className="inline-flex items-center gap-2">
                            Multiplier (%)
                            <LuArrowUpDown size={14} />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, idx) => {
                        const rowErrors = [
                          row.error,
                          ...(row.errors || []),
                          ...(row.validationErrors || []),
                        ]
                          .filter(Boolean)
                          .join("; ");

                        return (
                          <Fragment
                            key={`${row.rowNumber || idx}-${row.pickupStateLabel || "r"}`}
                          >
                            <tr
                              className="border-b border-[#EAECF0] bg-white"
                            >
                              <td className="px-6 py-7 align-middle">
                                <span
                                  className={`inline-flex min-w-[52px] items-center justify-center rounded-[10px] px-3 py-2 text-sm font-medium ${statusBadge(row.rowStatus)}`}
                                >
                                  {getStatusLabel(row.rowStatus)}
                                </span>
                              </td>
                              <td className="px-6 py-7 font-semibold text-[#1D2939] align-middle">
                                {formatLocation(row.pickupStateLabel, row.pickupCityLabel)}
                              </td>
                              <td className="px-6 py-7 font-semibold text-[#1D2939] align-middle">
                                {formatLocation(
                                  row.destinationStateLabel,
                                  row.destinationCityLabel
                                )}
                              </td>
                              <td className="px-6 py-7 font-semibold text-[#1D2939] align-middle">
                                ₦
                                {Number(row.baseFee ?? row.fee ?? 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-7 font-semibold text-[#1D2939] align-middle">
                                {Number(row.multiplier ?? 0).toLocaleString()}
                              </td>
                            </tr>
                            {rowErrors && (
                              <tr className="border-b border-[#EAECF0] bg-[#FFF6F6]">
                                <td colSpan={5} className="px-6 py-3 text-sm text-[#B42318]">
                                  Row {row.rowNumber || idx + 1}: {rowErrors}
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] pt-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-12 rounded-[14px] border border-[#344054] px-8 text-base font-semibold text-[#1D2939] transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying}
                    className="h-12 rounded-[14px] bg-[#8C1823] px-8 text-base font-semibold text-white transition-colors hover:bg-[#71131C] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {applying ? "Applying..." : "Apply Changes"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCsvModal;
