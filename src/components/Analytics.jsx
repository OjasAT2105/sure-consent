import React, { useState, useEffect } from "react";
import { Button } from "@bsf/force-ui";
import { BarChart3, PieChart, Trash2, X } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

const Analytics = () => {
  const { getCurrentValue } = useSettings();
  const [consentLogs, setConsentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stats, setStats] = useState({
    totalLogs: 0,
    accepted: 0,
    declined: 0,
    countries: 0,
  });

  useEffect(() => {
    fetchConsentLogs();
  }, []);

  const fetchConsentLogs = async () => {
    try {
      const response = await fetch(ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_get_consent_logs",
          nonce: sureConsentAjax.nonce,
          page: 1,
          per_page: 1000, // Fetch all logs for stats
        }),
      });

      const data = await response.json();

      if (data.success) {
        const logs = data.data.logs || [];
        setConsentLogs(logs);

        // Calculate stats
        const totalLogs = logs.length;
        const accepted = logs.filter((log) => log.status === "accepted").length;
        const declined = logs.filter((log) => log.status !== "accepted").length;
        const countries = [...new Set(logs.map((log) => log.country))].length;

        setStats({
          totalLogs,
          accepted,
          declined,
          countries,
        });
      }
    } catch (error) {
      console.error("Error fetching consent logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const deleteAllConsentLogs = async () => {
    setDeleteLoading(true);
    try {
      // We'll need to implement a backend function to delete all logs
      // For now, we'll simulate this by calling an endpoint that should handle bulk deletion
      const response = await fetch(ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_delete_all_consent_logs",
          nonce: sureConsentAjax.nonce,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the logs and stats
        fetchConsentLogs();
        closeDeleteDialog();
        alert("All consent logs have been deleted successfully");
      } else {
        alert("Failed to delete consent logs: " + data.data.message);
      }
    } catch (error) {
      console.error("Error deleting consent logs:", error);
      alert("Error deleting consent logs");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-600">
            View consent statistics and user preferences
          </p>
        </div>
        {stats.totalLogs > 0 && (
          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={openDeleteDialog}
          >
            Delete All Logs
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Consents
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalLogs}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.accepted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <PieChart className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.declined}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.countries}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      {stats.totalLogs === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            No consent logs found. Consent logging must be enabled in Cookie
            Settings to collect data.
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={closeDeleteDialog}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete ALL consent logs? This action
              cannot be undone and will permanently remove all consent data.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDeleteDialog}
                disabled={deleteLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteAllConsentLogs}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete All Logs"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
