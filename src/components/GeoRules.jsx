import React, { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Globe } from "lucide-react";
import countryData from "../data/countries.json";
import ActionCard from "./ActionCard";

const GeoRules = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  const [geoRuleType, setGeoRuleType] = useState("worldwide");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({
    selected: true,
    eu: true,
    common: true,
    all: false,
  });
  const [validationError, setValidationError] = useState(""); // Added for validation error

  // Group countries by region (imported from JSON)
  const countryGroups = countryData;

  // Initialize component state from settings
  useEffect(() => {
    const ruleType = getCurrentValue("geo_rule_type") || "worldwide";
    const countries = getCurrentValue("geo_selected_countries") || [];

    setGeoRuleType(ruleType);
    setSelectedCountries(Array.isArray(countries) ? countries : []);

    // Combine all countries for the dropdown
    const allCountries = [
      ...countryGroups.eu.countries,
      ...countryGroups.common.countries,
      ...countryGroups.all.countries,
    ];

    // Remove duplicates
    const uniqueCountries = allCountries.filter(
      (country, index, self) =>
        index === self.findIndex((c) => c.code === country.code)
    );

    setAvailableCountries(uniqueCountries);
  }, [getCurrentValue]);

  // Handle geo rule type change
  const handleRuleTypeChange = (value) => {
    setGeoRuleType(value);
    updateSetting("geo_rule_type", value);
    setValidationError(""); // Clear validation error when changing mode

    // Clear selected countries when switching to worldwide or eu_only modes
    if (value === "worldwide" || value === "eu_only") {
      setSelectedCountries([]);
      updateSetting("geo_selected_countries", []);
    }
  };

  // Handle country selection
  const handleCountryChange = (countryCode, isChecked) => {
    let updatedCountries = [...selectedCountries];

    if (isChecked) {
      // Add country if not already selected
      if (!updatedCountries.includes(countryCode)) {
        updatedCountries.push(countryCode);
      }
    } else {
      // Remove country if selected
      updatedCountries = updatedCountries.filter(
        (code) => code !== countryCode
      );
    }

    setSelectedCountries(updatedCountries);
    updateSetting("geo_selected_countries", updatedCountries);
    // Clear validation error when selecting a country
    if (updatedCountries.length > 0) {
      setValidationError("");
    }
  };

  // Handle select all countries
  const handleSelectAll = () => {
    const allCountryCodes = availableCountries.map((country) => country.code);
    setSelectedCountries(allCountryCodes);
    updateSetting("geo_selected_countries", allCountryCodes);
    setValidationError(""); // Clear validation error when selecting all
  };

  // Handle deselect all countries
  const handleDeselectAll = () => {
    setSelectedCountries([]);
    updateSetting("geo_selected_countries", []);
    // Set validation error if in selected mode
    if (geoRuleType === "selected") {
      setValidationError("Please select at least one country");
    }
  };

  // Toggle group expansion
  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Filter countries based on search term
  const filteredCountries = availableCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected country objects
  const getSelectedCountryObjects = () => {
    const allCountries = [
      ...countryGroups.eu.countries,
      ...countryGroups.common.countries,
      ...countryGroups.all.countries,
    ];

    return selectedCountries
      .map((code) => {
        return allCountries.find((country) => country.code === code);
      })
      .filter(Boolean); // Remove any undefined values
  };

  // Get selected country objects for display
  const selectedCountryObjects = getSelectedCountryObjects();

  // Custom validation function for ActionCard to use
  const validateSettings = () => {
    if (geoRuleType === "selected" && selectedCountries.length === 0) {
      setValidationError("Please select at least one country");
      return false;
    }
    setValidationError("");
    return true;
  };

  // Expose validation function to be used by ActionCard
  window.validateGeoRules = validateSettings;

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Geographic Targeting
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Configure where to display the cookie consent banner based on user
          location
        </p>
      </div>
      <div
        className="bg-white border rounded-lg shadow-sm"
        style={{
          "--tw-border-opacity": 1,
          borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
        }}
      >
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Location-based Rules
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose where to display the cookie consent banner
            </p>
            <div className="space-y-4">
              <div className="flex flex-col space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="geoRuleType"
                    value="worldwide"
                    checked={geoRuleType === "worldwide"}
                    onChange={() => handleRuleTypeChange("worldwide")}
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      Worldwide
                    </span>
                    <span className="text-sm text-gray-500">
                      Show banner everywhere
                    </span>
                  </div>
                </label>

                {/* Removed the "Configure Location" button */}

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="geoRuleType"
                    value="eu_only"
                    checked={geoRuleType === "eu_only"}
                    onChange={() => handleRuleTypeChange("eu_only")}
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      EU Countries only
                    </span>
                    <span className="text-sm text-gray-500">
                      Show banner only for EU/EA countries
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="geoRuleType"
                    value="selected"
                    checked={geoRuleType === "selected"}
                    onChange={() => handleRuleTypeChange("selected")}
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      Selected Countries
                    </span>
                    <span className="text-sm text-gray-500">
                      Show banner only for specific countries
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {geoRuleType === "selected" && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select Countries
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Choose which countries should see the cookie consent banner
              </p>

              {/* Validation error message */}
              {validationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{validationError}</p>
                </div>
              )}

              {/* Search box */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Deselect All
                </button>
              </div>

              {/* Country groups */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded p-2">
                {/* Selected Countries Group */}
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded"
                    onClick={() => toggleGroup("selected")}
                  >
                    <h4 className="font-medium text-gray-900">
                      Selected Countries ({selectedCountryObjects.length})
                    </h4>
                    <span>{expandedGroups.selected ? "▼" : "►"}</span>
                  </div>
                  {expandedGroups.selected && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-4">
                      {selectedCountryObjects.length > 0 ? (
                        selectedCountryObjects.map((country) => (
                          <label
                            key={country.code}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country.code)}
                              onChange={(e) =>
                                handleCountryChange(
                                  country.code,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">
                              {country.name} ({country.code})
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No countries selected yet
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* EU Countries Group */}
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded"
                    onClick={() => toggleGroup("eu")}
                  >
                    <h4 className="font-medium text-gray-900">
                      European Union ({countryGroups.eu.countries.length})
                    </h4>
                    <span>{expandedGroups.eu ? "▼" : "►"}</span>
                  </div>
                  {expandedGroups.eu && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-4">
                      {countryGroups.eu.countries
                        .filter(
                          (country) =>
                            country.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            country.code
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((country) => (
                          <label
                            key={country.code}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country.code)}
                              onChange={(e) =>
                                handleCountryChange(
                                  country.code,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">
                              {country.name} ({country.code})
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>

                {/* Common Countries Group */}
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded"
                    onClick={() => toggleGroup("common")}
                  >
                    <h4 className="font-medium text-gray-900">
                      Common Countries ({countryGroups.common.countries.length})
                    </h4>
                    <span>{expandedGroups.common ? "▼" : "►"}</span>
                  </div>
                  {expandedGroups.common && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-4">
                      {countryGroups.common.countries
                        .filter(
                          (country) =>
                            country.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            country.code
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((country) => (
                          <label
                            key={country.code}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country.code)}
                              onChange={(e) =>
                                handleCountryChange(
                                  country.code,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">
                              {country.name} ({country.code})
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>

                {/* All Countries Group */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded"
                    onClick={() => toggleGroup("all")}
                  >
                    <h4 className="font-medium text-gray-900">
                      All Countries ({countryGroups.all.countries.length})
                    </h4>
                    <span>{expandedGroups.all ? "▼" : "►"}</span>
                  </div>
                  {expandedGroups.all && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-4">
                      {countryGroups.all.countries
                        .filter(
                          (country) =>
                            country.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            country.code
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((country) => (
                          <label
                            key={country.code}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country.code)}
                              onChange={(e) =>
                                handleCountryChange(
                                  country.code,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">
                              {country.name} ({country.code})
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                {selectedCountries.length} country(s) selected
              </div>
            </div>
          )}

          <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default GeoRules;
