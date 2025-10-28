import React, { useState, useEffect } from "react";
import { Button, Dialog } from "@bsf/force-ui";
import {
  Calendar,
  Download,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Trash2,
  FileText,
  FileJson,
} from "lucide-react";

const ScanHistory = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalPages: 1,
    total: 0,
  });
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportRecordId, setExportRecordId] = useState(null);

  // Fetch scan history
  const fetchScanHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(window.sureConsentAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_get_scan_history",
          nonce: window.sureConsentAjax.nonce || "",
          page: page,
          per_page: pagination.perPage,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setScanHistory(data.data.history || []);
        setPagination({
          page: data.data.page || 1,
          perPage: data.data.per_page || 10,
          totalPages: data.data.total_pages || 1,
          total: data.data.total || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch scan history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch scan history record details
  const fetchScanRecordDetails = async (id) => {
    try {
      const response = await fetch(window.sureConsentAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_get_scan_history_record",
          nonce: window.sureConsentAjax.nonce || "",
          id: id,
        }),
      });

      const data = await response.json();
      if (data.success && data.data && data.data.record) {
        return data.data.record;
      }
    } catch (error) {
      console.error("Failed to fetch scan record details:", error);
    }
    return null;
  };

  // Delete scan history record
  const deleteScanRecord = async (id) => {
    try {
      const response = await fetch(window.sureConsentAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_delete_scan_history_record",
          nonce: window.sureConsentAjax.nonce || "",
          id: id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the history list
        fetchScanHistory(pagination.page);
        return true;
      }
    } catch (error) {
      console.error("Failed to delete scan record:", error);
    }
    return false;
  };

  // Export scan history as CSV
  const exportScanHistoryCSV = async (id) => {
    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = window.sureConsentAjax.ajaxurl;

      const actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      actionInput.value = "sure_consent_export_scan_history_csv";
      form.appendChild(actionInput);

      const nonceInput = document.createElement("input");
      nonceInput.type = "hidden";
      nonceInput.name = "nonce";
      nonceInput.value = window.sureConsentAjax.nonce || "";
      form.appendChild(nonceInput);

      const idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "id";
      idInput.value = id;
      form.appendChild(idInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Failed to export scan history as CSV:", error);
    }
  };

  // Export scan history as JSON
  const exportScanHistoryJSON = async (id) => {
    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = window.sureConsentAjax.ajaxurl;

      const actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      actionInput.value = "sure_consent_export_scan_history_json";
      form.appendChild(actionInput);

      const nonceInput = document.createElement("input");
      nonceInput.type = "hidden";
      nonceInput.name = "nonce";
      nonceInput.value = window.sureConsentAjax.nonce || "";
      form.appendChild(nonceInput);

      const idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "id";
      idInput.value = id;
      form.appendChild(idInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Failed to export scan history as JSON:", error);
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchScanHistory(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Format scan type
  const formatScanType = (type) => {
    switch (type) {
      case "all_pages":
        return "All Pages";
      case "current_page":
        return "Current Page";
      default:
        return type;
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    // Debug log to see what category names we're getting
    console.log("ScanHistory - Category received:", category);

    // Convert to lowercase for case-insensitive comparison
    const lowerCategory = category.toLowerCase();

    // Check for exact matches first (both short and full names)
    switch (lowerCategory) {
      case "essential":
      case "essential cookies":
        console.log("ScanHistory - Matched essential category");
        return "🔒";
      case "functional":
      case "functional cookies":
        console.log("ScanHistory - Matched functional category");
        return "⚙️";
      case "analytics":
      case "analytics cookies":
        console.log("ScanHistory - Matched analytics category");
        return "📊";
      case "marketing":
      case "marketing cookies":
        console.log("ScanHistory - Matched marketing category");
        return "📢";
      case "uncategorized":
      case "uncategorized cookies":
        console.log("ScanHistory - Matched uncategorized category");
        return "📁";
    }

    // Check for partial matches (more flexible)
    if (lowerCategory.includes("essential")) {
      console.log("ScanHistory - Partial match for essential category");
      return "🔒";
    }
    if (lowerCategory.includes("functional")) {
      console.log("ScanHistory - Partial match for functional category");
      return "⚙️";
    }
    if (lowerCategory.includes("analytics")) {
      console.log("ScanHistory - Partial match for analytics category");
      return "📊";
    }
    if (lowerCategory.includes("marketing")) {
      console.log("ScanHistory - Partial match for marketing category");
      return "📢";
    }
    if (lowerCategory.includes("uncategorized")) {
      console.log("ScanHistory - Partial match for uncategorized category");
      return "📁";
    }

    // Default icon
    console.log("ScanHistory - Using default icon for category:", category);
    return "🍪";
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setRecordToDelete(id);
    setShowDeleteDialog(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (recordToDelete) {
      const success = await deleteScanRecord(recordToDelete);
      if (success) {
        setShowDeleteDialog(false);
        setRecordToDelete(null);
      }
    }
  };

  // Show export options
  const showExportOptions = (id) => {
    setExportRecordId(id);
    setShowExportDialog(true);
  };

  // Load scan history on component mount
  useEffect(() => {
    fetchScanHistory();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Scan History
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          View history of all cookie scans performed on your website.
        </p>
      </div>

      {/* Scan History Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-purple-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading scan history...</p>
          </div>
        ) : scanHistory.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Scan Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Scan Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pages Scanned
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Cookies
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Categories
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scanHistory.map((record) => (
                    <React.Fragment key={record.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar
                              size={16}
                              className="mr-2 text-gray-400"
                            />
                            {formatDate(record.scan_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatScanType(record.scan_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.pages_scanned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.total_cookies}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(record.category_counts || {}).map(
                              ([category, count]) => (
                                <span
                                  key={category}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  <span className="mr-1">
                                    {getCategoryIcon(category)}
                                  </span>
                                  {category} ({count})
                                </span>
                              )
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => toggleRowExpansion(record.id)}
                              title="View Details"
                            >
                              {expandedRows[record.id] ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => showExportOptions(record.id)}
                              title="Export"
                            >
                              <Download size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => confirmDelete(record.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows[record.id] && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="rounded-lg border border-gray-200 p-4">
                              <h3 className="font-medium text-gray-900 mb-3">
                                Scan Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Scan Date
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatDate(record.scan_date)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Scan Type
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatScanType(record.scan_type)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Pages Scanned
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {record.pages_scanned}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Total Cookies
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {record.total_cookies}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Cookie Categories
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(
                                    record.category_counts || {}
                                  ).map(([category, count]) => (
                                    <div
                                      key={category}
                                      className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200"
                                    >
                                      <span className="mr-2">
                                        {getCategoryIcon(category)}
                                      </span>
                                      <span className="font-medium">
                                        {category}
                                      </span>
                                      <span className="ml-1 text-gray-500">
                                        ({count})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.perPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.perPage,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="flex items-center justify-between mt-6"
                    aria-label="Pagination"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="rounded-l-md"
                    >
                      Previous
                    </Button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={
                          pagination.page === i + 1 ? "primary" : "secondary"
                        }
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        className={`mx-1 ${
                          pagination.page === i + 1
                            ? "bg-purple-600 text-white"
                            : ""
                        }`}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="rounded-r-md ml-1"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No scan history
            </h3>
            <p className="mt-2 text-gray-500">
              No cookie scans have been performed yet.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() =>
                  (window.location.href =
                    "/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=scan")
                }
              >
                Perform a Scan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} setOpen={setShowDeleteDialog}>
        <Dialog.Backdrop />
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.Title>Confirm Delete</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this scan history record? This
              action cannot be undone.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      {/* Export Options Dialog */}
      <Dialog open={showExportDialog} setOpen={setShowExportDialog}>
        <Dialog.Backdrop />
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.Title>Export Scan Results</Dialog.Title>
            <Dialog.Description>
              Choose the format to export the scan results.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex flex-col gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  exportScanHistoryCSV(exportRecordId);
                  setShowExportDialog(false);
                }}
                className="flex items-center justify-center"
              >
                <FileText size={16} className="mr-2" />
                Export as CSV
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  exportScanHistoryJSON(exportRecordId);
                  setShowExportDialog(false);
                }}
                className="flex items-center justify-center"
              >
                <FileJson size={16} className="mr-2" />
                Export as JSON
              </Button>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ScanHistory;
