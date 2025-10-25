import React, { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Globe } from "lucide-react";

const GeoRules = () => {
  const { getCurrentValue, updateSetting, saveSettings, hasChanges, isSaving } =
    useSettings();

  const [geoRuleType, setGeoRuleType] = useState("worldwide");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({
    eu: true,
    common: true,
    all: false,
  });

  // Group countries by region
  const countryGroups = {
    eu: {
      name: "European Union",
      countries: [
        { code: "AT", name: "Austria" },
        { code: "BE", name: "Belgium" },
        { code: "BG", name: "Bulgaria" },
        { code: "HR", name: "Croatia" },
        { code: "CY", name: "Cyprus" },
        { code: "CZ", name: "Czech Republic" },
        { code: "DK", name: "Denmark" },
        { code: "EE", name: "Estonia" },
        { code: "FI", name: "Finland" },
        { code: "FR", name: "France" },
        { code: "DE", name: "Germany" },
        { code: "GR", name: "Greece" },
        { code: "HU", name: "Hungary" },
        { code: "IE", name: "Ireland" },
        { code: "IT", name: "Italy" },
        { code: "LV", name: "Latvia" },
        { code: "LT", name: "Lithuania" },
        { code: "LU", name: "Luxembourg" },
        { code: "MT", name: "Malta" },
        { code: "NL", name: "Netherlands" },
        { code: "PL", name: "Poland" },
        { code: "PT", name: "Portugal" },
        { code: "RO", name: "Romania" },
        { code: "SK", name: "Slovakia" },
        { code: "SI", name: "Slovenia" },
        { code: "ES", name: "Spain" },
        { code: "SE", name: "Sweden" },
        { code: "GB", name: "United Kingdom" },
      ],
    },
    common: {
      name: "Common Countries",
      countries: [
        { code: "US", name: "United States" },
        { code: "CA", name: "Canada" },
        { code: "AU", name: "Australia" },
        { code: "NZ", name: "New Zealand" },
        { code: "JP", name: "Japan" },
        { code: "CN", name: "China" },
        { code: "IN", name: "India" },
        { code: "BR", name: "Brazil" },
        { code: "MX", name: "Mexico" },
        { code: "AR", name: "Argentina" },
        { code: "CL", name: "Chile" },
        { code: "ZA", name: "South Africa" },
        { code: "RU", name: "Russia" },
      ],
    },
    all: {
      name: "All Countries",
      countries: [
        { code: "AF", name: "Afghanistan" },
        { code: "AL", name: "Albania" },
        { code: "DZ", name: "Algeria" },
        { code: "AD", name: "Andorra" },
        { code: "AO", name: "Angola" },
        { code: "AG", name: "Antigua and Barbuda" },
        { code: "AR", name: "Argentina" },
        { code: "AM", name: "Armenia" },
        { code: "AW", name: "Aruba" },
        { code: "AZ", name: "Azerbaijan" },
        { code: "BS", name: "Bahamas" },
        { code: "BH", name: "Bahrain" },
        { code: "BD", name: "Bangladesh" },
        { code: "BB", name: "Barbados" },
        { code: "BY", name: "Belarus" },
        { code: "BZ", name: "Belize" },
        { code: "BJ", name: "Benin" },
        { code: "BT", name: "Bhutan" },
        { code: "BO", name: "Bolivia" },
        { code: "BA", name: "Bosnia and Herzegovina" },
        { code: "BW", name: "Botswana" },
        { code: "BN", name: "Brunei" },
        { code: "BF", name: "Burkina Faso" },
        { code: "BI", name: "Burundi" },
        { code: "CV", name: "Cabo Verde" },
        { code: "KH", name: "Cambodia" },
        { code: "CM", name: "Cameroon" },
        { code: "CA", name: "Canada" },
        { code: "CF", name: "Central African Republic" },
        { code: "TD", name: "Chad" },
        { code: "CL", name: "Chile" },
        { code: "CO", name: "Colombia" },
        { code: "KM", name: "Comoros" },
        { code: "CG", name: "Congo" },
        { code: "CD", name: "Congo (Democratic Republic)" },
        { code: "CR", name: "Costa Rica" },
        { code: "CI", name: "Côte d'Ivoire" },
        { code: "DJ", name: "Djibouti" },
        { code: "DM", name: "Dominica" },
        { code: "DO", name: "Dominican Republic" },
        { code: "EC", name: "Ecuador" },
        { code: "EG", name: "Egypt" },
        { code: "SV", name: "El Salvador" },
        { code: "GQ", name: "Equatorial Guinea" },
        { code: "ER", name: "Eritrea" },
        { code: "SZ", name: "Eswatini" },
        { code: "ET", name: "Ethiopia" },
        { code: "FJ", name: "Fiji" },
        { code: "GA", name: "Gabon" },
        { code: "GM", name: "Gambia" },
        { code: "GE", name: "Georgia" },
        { code: "GH", name: "Ghana" },
        { code: "GD", name: "Grenada" },
        { code: "GT", name: "Guatemala" },
        { code: "GN", name: "Guinea" },
        { code: "GW", name: "Guinea-Bissau" },
        { code: "GY", name: "Guyana" },
        { code: "HT", name: "Haiti" },
        { code: "HN", name: "Honduras" },
        { code: "HK", name: "Hong Kong" },
        { code: "IS", name: "Iceland" },
        { code: "ID", name: "Indonesia" },
        { code: "IR", name: "Iran" },
        { code: "IQ", name: "Iraq" },
        { code: "IL", name: "Israel" },
        { code: "JM", name: "Jamaica" },
        { code: "JO", name: "Jordan" },
        { code: "KZ", name: "Kazakhstan" },
        { code: "KE", name: "Kenya" },
        { code: "KI", name: "Kiribati" },
        { code: "KP", name: "Korea (North)" },
        { code: "KR", name: "Korea (South)" },
        { code: "KW", name: "Kuwait" },
        { code: "KG", name: "Kyrgyzstan" },
        { code: "LA", name: "Laos" },
        { code: "LB", name: "Lebanon" },
        { code: "LS", name: "Lesotho" },
        { code: "LR", name: "Liberia" },
        { code: "LY", name: "Libya" },
        { code: "LI", name: "Liechtenstein" },
        { code: "MK", name: "Macedonia" },
        { code: "MG", name: "Madagascar" },
        { code: "MW", name: "Malawi" },
        { code: "MY", name: "Malaysia" },
        { code: "MV", name: "Maldives" },
        { code: "ML", name: "Mali" },
        { code: "MH", name: "Marshall Islands" },
        { code: "MR", name: "Mauritania" },
        { code: "MU", name: "Mauritius" },
        { code: "FM", name: "Micronesia" },
        { code: "MD", name: "Moldova" },
        { code: "MC", name: "Monaco" },
        { code: "MN", name: "Mongolia" },
        { code: "ME", name: "Montenegro" },
        { code: "MA", name: "Morocco" },
        { code: "MZ", name: "Mozambique" },
        { code: "MM", name: "Myanmar" },
        { code: "NA", name: "Namibia" },
        { code: "NR", name: "Nauru" },
        { code: "NP", name: "Nepal" },
        { code: "NI", name: "Nicaragua" },
        { code: "NE", name: "Niger" },
        { code: "NG", name: "Nigeria" },
        { code: "NO", name: "Norway" },
        { code: "OM", name: "Oman" },
        { code: "PK", name: "Pakistan" },
        { code: "PW", name: "Palau" },
        { code: "PS", name: "Palestine" },
        { code: "PA", name: "Panama" },
        { code: "PG", name: "Papua New Guinea" },
        { code: "PY", name: "Paraguay" },
        { code: "PE", name: "Peru" },
        { code: "PH", name: "Philippines" },
        { code: "PL", name: "Poland" },
        { code: "QA", name: "Qatar" },
        { code: "RO", name: "Romania" },
        { code: "RW", name: "Rwanda" },
        { code: "KN", name: "Saint Kitts and Nevis" },
        { code: "LC", name: "Saint Lucia" },
        { code: "VC", name: "Saint Vincent and the Grenadines" },
        { code: "WS", name: "Samoa" },
        { code: "SM", name: "San Marino" },
        { code: "ST", name: "Sao Tome and Principe" },
        { code: "SA", name: "Saudi Arabia" },
        { code: "SN", name: "Senegal" },
        { code: "RS", name: "Serbia" },
        { code: "SC", name: "Seychelles" },
        { code: "SL", name: "Sierra Leone" },
        { code: "SG", name: "Singapore" },
        { code: "SK", name: "Slovakia" },
        { code: "SI", name: "Slovenia" },
        { code: "SB", name: "Solomon Islands" },
        { code: "SO", name: "Somalia" },
        { code: "ZA", name: "South Africa" },
        { code: "SS", name: "South Sudan" },
        { code: "LK", name: "Sri Lanka" },
        { code: "SD", name: "Sudan" },
        { code: "SR", name: "Suriname" },
        { code: "SE", name: "Sweden" },
        { code: "CH", name: "Switzerland" },
        { code: "SY", name: "Syria" },
        { code: "TJ", name: "Tajikistan" },
        { code: "TZ", name: "Tanzania" },
        { code: "TH", name: "Thailand" },
        { code: "TL", name: "Timor-Leste" },
        { code: "TG", name: "Togo" },
        { code: "TO", name: "Tonga" },
        { code: "TT", name: "Trinidad and Tobago" },
        { code: "TN", name: "Tunisia" },
        { code: "TR", name: "Turkey" },
        { code: "TM", name: "Turkmenistan" },
        { code: "TV", name: "Tuvalu" },
        { code: "UG", name: "Uganda" },
        { code: "UA", name: "Ukraine" },
        { code: "AE", name: "United Arab Emirates" },
        { code: "UY", name: "Uruguay" },
        { code: "UZ", name: "Uzbekistan" },
        { code: "VU", name: "Vanuatu" },
        { code: "VA", name: "Vatican City" },
        { code: "VE", name: "Venezuela" },
        { code: "VN", name: "Vietnam" },
        { code: "YE", name: "Yemen" },
        { code: "ZM", name: "Zambia" },
        { code: "ZW", name: "Zimbabwe" },
      ],
    },
  };

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
  };

  // Handle select all countries
  const handleSelectAll = () => {
    const allCountryCodes = availableCountries.map((country) => country.code);
    setSelectedCountries(allCountryCodes);
    updateSetting("geo_selected_countries", allCountryCodes);
  };

  // Handle deselect all countries
  const handleDeselectAll = () => {
    setSelectedCountries([]);
    updateSetting("geo_selected_countries", []);
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

  // Handle save settings
  const handleSave = async () => {
    try {
      const result = await saveSettings();
      if (result.success) {
        console.log("Geo rules saved successfully");
      } else {
        console.error("Failed to save geo rules:", result.message);
      }
    } catch (error) {
      console.error("Error saving geo rules:", error);
    }
  };

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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !hasChanges || isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoRules;
