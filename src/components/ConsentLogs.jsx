import React, { useState, useEffect } from "react";
import { Button, Select, Input } from "@bsf/force-ui";
import {
  Search,
  Calendar,
  Download,
  ChevronDown,
  Trash2,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ConsentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed filters state as filtering is not working
  // const [filters, setFilters] = useState({
  //   status: "all",
  // });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    type: "single",
    logId: null,
  });
  const logsPerPage = 10;

  // Fetch consent logs from the server
  const fetchConsentLogs = async () => {
    setLoading(true);

    // Use the correct variable name for admin AJAX
    const ajaxConfig = window.sureConsentAjax;
    if (!ajaxConfig) {
      console.error("SureConsent - AJAX configuration not available");
      setLoading(false);
      return;
    }

    try {
      console.log("SureConsent - Fetching consent logs");

      const formData = new FormData();
      formData.append("action", "sure_consent_get_consent_logs");
      formData.append("nonce", ajaxConfig.nonce);
      // Removed status filter as filtering is not working
      // formData.append("status", filters.status);
      formData.append("page", currentPage);
      formData.append("per_page", logsPerPage);

      const response = await fetch(ajaxConfig.ajaxurl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("SureConsent - Consent logs response:", data);

      if (data.success) {
        setLogs(data.data.logs);
        setTotalLogs(data.data.total);
        setTotalPages(data.data.total_pages);
      } else {
        console.error("Failed to fetch consent logs:", data);
        setLogs([]);
      }
    } catch (error) {
      console.error("Error fetching consent logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs when component mounts
  useEffect(() => {
    console.log("SureConsent - Component mounted, fetching initial logs...");
    fetchConsentLogs();
  }, []);

  // Also fetch logs when page changes (for pagination)
  useEffect(() => {
    if (currentPage > 1) {
      // Only fetch if not the initial load
      console.log("SureConsent - Page changed to:", currentPage);
      fetchConsentLogs();
    }
  }, [currentPage]);

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusDisplay = (status) => {
    // Convert status to proper display format
    // Normalize accept_all and accepted to "Accepted"
    if (status === "accept_all" || status === "accepted") {
      return "Accepted";
    }

    switch (status) {
      case "decline_all":
        return "Decline All";
      case "partially_accepted":
        return "Partially Accepted";
      case "declined":
        return "Declined";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    // Return proper color classes based on status
    // Normalize accept_all and accepted to same color
    if (status === "accept_all" || status === "accepted") {
      return "bg-green-100 text-green-800";
    }

    switch (status) {
      case "decline_all":
      case "declined":
        return "bg-red-100 text-red-800";
      case "partially_accepted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadPDF = async (logId) => {
    try {
      // First, fetch the detailed log data from the backend
      const ajaxConfig = window.sureConsentAjax;
      if (!ajaxConfig) {
        // Using popup instead of alert
        setDeleteConfirmDialog({
          open: true,
          type: "error",
          message: "AJAX configuration not available",
          onConfirm: () =>
            setDeleteConfirmDialog({ open: false, type: null, message: "" }),
        });
        return;
      }

      const formData = new FormData();
      formData.append("action", "sure_consent_generate_consent_pdf");
      formData.append("nonce", ajaxConfig.nonce);
      formData.append("log_id", logId);

      const response = await fetch(ajaxConfig.ajaxurl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        // Using popup instead of alert
        setDeleteConfirmDialog({
          open: true,
          type: "error",
          message:
            "Failed to fetch log data: " +
            (data.data?.message || "Unknown error"),
          onConfirm: () =>
            setDeleteConfirmDialog({ open: false, type: null, message: "" }),
        });
        return;
      }

      const log = data.data.log;

      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("PROOF OF CONSENT", 105, 20, null, null, "center");

      // Add legal disclaimer
      doc.setFontSize(12);
      doc.text(
        "This document serves as legal proof of consent given by the user in accordance with GDPR and other applicable privacy regulations.",
        105,
        35,
        { maxWidth: 180, align: "center" }
      );

      // Add consent details
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Consent Details", 20, 50);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      // Create table for consent details using autoTable
      autoTable(doc, {
        startY: 55,
        head: [["Field", "Value"]],
        body: [
          ["Log ID", log.id],
          ["Timestamp", log.timestamp],
          ["IP Address", log.ip_address],
          ["Country", log.country],
          ["Consent Status", getStatusDisplay(log.status)],
          ["Plugin Version", log.version || "N/A"],
        ],
        theme: "grid",
      });

      // Add user agent if available
      let currentY = doc.lastAutoTable.finalY + 10;
      if (log.user_agent) {
        doc.text("User Agent: " + log.user_agent, 20, currentY, {
          maxWidth: 170,
        });
        currentY += 10;
      }

      // Add preferences details
      if (log.preferences && Object.keys(log.preferences).length > 0) {
        currentY += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Cookie Preferences", 20, currentY);

        currentY += 5;

        doc.setFont("helvetica", "normal");

        // Create table for preferences
        const preferencesData = [];
        for (const [category, accepted] of Object.entries(log.preferences)) {
          preferencesData.push([category, accepted ? "Accepted" : "Declined"]);
        }

        autoTable(doc, {
          startY: currentY,
          head: [["Category", "Status"]],
          body: preferencesData,
          theme: "grid",
        });

        currentY = doc.lastAutoTable.finalY + 10;
      }

      // Add more spacing before legal information
      currentY += 20;
      doc.setFont("helvetica", "bold");
      doc.text("Legal Information", 20, currentY);

      doc.setFont("helvetica", "normal");
      doc.text(
        "Date of Generation: " + new Date().toLocaleString(),
        20,
        currentY + 10
      );
      doc.text("Website: " + window.location.origin, 20, currentY + 15);

      doc.text(
        "This document is automatically generated by the SureConsent plugin and serves as proof of user consent for cookie usage and data processing in accordance with GDPR and other applicable privacy regulations.",
        20,
        currentY + 25,
        { maxWidth: 170 }
      );

      doc.text(
        "The information contained in this document is accurate and complete to the best of our knowledge at the time of generation.",
        20,
        currentY + 40,
        { maxWidth: 170 }
      );

      // Add more spacing after legal information
      currentY += 60;
      doc.setFont("helvetica", "bold");
      doc.text("Digital Signature", 20, currentY);

      doc.setFont("helvetica", "normal");
      doc.text(
        "This document is digitally generated and does not require a physical signature to be legally valid.",
        20,
        currentY + 10,
        { maxWidth: 170 }
      );
      doc.text(
        "Document Hash: " +
          btoa(log.id + log.timestamp + log.ip_address + log.status).substring(
            0,
            32
          ),
        20,
        currentY + 20
      );

      doc.text(
        "For any questions regarding this consent record, please contact the website administrator.",
        20,
        currentY + 30,
        { maxWidth: 170 }
      );

      // Save the PDF
      doc.save(`consent-log-${logId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Using popup instead of alert
      setDeleteConfirmDialog({
        open: true,
        type: "error",
        message: "Error generating PDF: " + error.message,
        onConfirm: () =>
          setDeleteConfirmDialog({ open: false, type: null, message: "" }),
      });
    }
  };

  // Toggle selection of a single log
  const toggleLogSelection = (logId) => {
    setSelectedLogs((prev) => {
      if (prev.includes(logId)) {
        return prev.filter((id) => id !== logId);
      } else {
        return [...prev, logId];
      }
    });
  };

  // Select all logs on current page
  const selectAllLogs = () => {
    const currentPageLogIds = logs.map((log) => log.id);
    setSelectedLogs(currentPageLogIds);
  };

  // Deselect all logs
  const deselectAllLogs = () => {
    setSelectedLogs([]);
  };

  // Open delete confirmation dialog for selected logs
  const openBulkDeleteConfirm = () => {
    if (selectedLogs.length === 0) {
      // Using popup instead of alert
      setDeleteConfirmDialog({
        open: true,
        type: "error",
        message: "Please select at least one log to delete",
        onConfirm: () =>
          setDeleteConfirmDialog({ open: false, type: null, message: "" }),
      });
      return;
    }

    setDeleteConfirmDialog({
      open: true,
      type: "bulk",
      count: selectedLogs.length,
      onConfirm: confirmBulkDelete,
      onCancel: () =>
        setDeleteConfirmDialog({ open: false, type: null, count: 0 }),
    });
  };

  // Confirm and delete selected logs
  const confirmBulkDelete = async () => {
    setIsDeletingSelected(true);
    setDeleteConfirmDialog({ open: false, type: null, count: 0 });

    try {
      const ajaxConfig = window.sureConsentAjax;
      if (!ajaxConfig) {
        // Using popup instead of alert
        setDeleteConfirmDialog({
          open: true,
          type: "error",
          message: "AJAX configuration not available",
          onConfirm: () =>
            setDeleteConfirmDialog({ open: false, type: null, message: "" }),
        });
        return;
      }

      // Delete each selected log
      const deletePromises = selectedLogs.map((logId) => {
        const formData = new FormData();
        formData.append("action", "sure_consent_delete_consent_log");
        formData.append("nonce", ajaxConfig.nonce);
        formData.append("log_id", logId);

        return fetch(ajaxConfig.ajaxurl, {
          method: "POST",
          body: formData,
        });
      });

      // Wait for all deletions to complete
      const responses = await Promise.all(deletePromises);

      // Check if all deletions were successful
      let successCount = 0;
      for (const response of responses) {
        const data = await response.json();
        if (data.success) {
          successCount++;
        }
      }

      // Refresh the logs
      fetchConsentLogs();
      setSelectedLogs([]);

      // Using popup instead of alert
      setDeleteConfirmDialog({
        open: true,
        type: "success",
        message: `${successCount} of ${selectedLogs.length} log(s) deleted successfully.`,
        onConfirm: () =>
          setDeleteConfirmDialog({ open: false, type: null, message: "" }),
      });
    } catch (error) {
      console.error("Error deleting logs:", error);
      // Using popup instead of alert
      setDeleteConfirmDialog({
        open: true,
        type: "error",
        message: "Error deleting logs",
        onConfirm: () =>
          setDeleteConfirmDialog({ open: false, type: null, message: "" }),
      });
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setDeleteConfirmDialog({ open: false, type: null, count: 0, message: "" });
  };

  return (
    <div
      className="bg-white border rounded-lg shadow-sm"
      style={{
        "--tw-border-opacity": 1,
        borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
      }}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Consent Logs</h2>
      </div>
      <div className="p-6">
        {/* Bulk Actions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {selectedLogs.length > 0 && (
              <div className="text-sm text-blue-800">
                {selectedLogs.length} log(s) selected
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {selectedLogs.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAllLogs}
                  disabled={isDeletingSelected}
                >
                  Deselect All
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={openBulkDeleteConfirm}
                  disabled={isDeletingSelected}
                >
                  {isDeletingSelected ? "Deleting..." : "Delete Selected"}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={selectAllLogs}
            >
              Select All
            </Button>
          </div>
        </div>

        {/* Removed filter section as filtering is not working */}
        {/* Filters - Simplified to only status filter */}
        {/* <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consent Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <Select.Button placeholder="Select status" />
              <Select.Options>
                <Select.Option value="all">All Statuses</Select.Option>
                <Select.Option value="accepted">Accepted</Select.Option>
                <Select.Option value="decline_all">Decline All</Select.Option>
                <Select.Option value="partially_accepted">
                  Partially Accepted
                </Select.Option>
              </Select.Options>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              icon={<Search className="w-4 h-4" />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div> */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedLogs.length === logs.length && logs.length > 0
                    }
                    onChange={selectAllLogs}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  IP Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Visited Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Consent Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading consent logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No consent logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr
                      className={
                        selectedLogs.includes(log.id) ? "bg-blue-50" : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => toggleLogSelection(log.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ip_address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {getStatusDisplay(log.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Download className="w-4 h-4" />}
                          onClick={() => handleDownloadPDF(log.id)}
                        >
                          PDF
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="px-6 py-2 bg-gray-50">
                        <button
                          onClick={() => toggleExpandRow(log.id)}
                          className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                        >
                          <ChevronDown
                            className={`w-4 h-4 mr-2 transform transition-transform ${
                              expandedRows[log.id] ? "rotate-180" : ""
                            }`}
                          />
                          {expandedRows[log.id]
                            ? "Hide Cookie Details"
                            : "Show Cookie Details"}
                        </button>

                        {expandedRows[log.id] && (
                          <div className="mt-2 ml-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              {log.preferences &&
                                Object.entries(log.preferences).map(
                                  ([category, accepted]) => (
                                    <div
                                      key={category}
                                      className="flex items-center justify-between p-2 bg-white rounded border"
                                    >
                                      <span className="text-sm text-gray-700">
                                        {category}
                                      </span>
                                      <span
                                        className={`px-2 py-1 text-xs rounded ${
                                          accepted
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {accepted ? "Accepted" : "Declined"}
                                      </span>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteConfirmDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {deleteConfirmDialog.type === "error"
                    ? "Error"
                    : deleteConfirmDialog.type === "success"
                    ? "Success"
                    : "Confirm Deletion"}
                </h3>
                <button
                  onClick={closeConfirmDialog}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {deleteConfirmDialog.type === "bulk" ? (
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete {deleteConfirmDialog.count}{" "}
                  selected log(s)? This action cannot be undone.
                </p>
              ) : (
                <p className="text-gray-600 mb-6">
                  {deleteConfirmDialog.message}
                </p>
              )}

              <div className="flex justify-end space-x-3">
                {deleteConfirmDialog.type === "bulk" ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={closeConfirmDialog}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={deleteConfirmDialog.onConfirm}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    onClick={deleteConfirmDialog.onConfirm}
                  >
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstLog + 1} to{" "}
              {Math.min(indexOfLastLog, totalLogs)} of {totalLogs} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              {/* Show a limited number of page buttons */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the start page to show
                let startPage = Math.max(1, currentPage - 2);
                if (startPage + 4 > totalPages) {
                  startPage = Math.max(1, totalPages - 4);
                }

                const pageNum = startPage + i;
                if (pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentLogs;
