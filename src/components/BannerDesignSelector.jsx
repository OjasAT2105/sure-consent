import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const BannerDesignSelector = () => {
  const { getCurrentValue, updateSetting, isLoaded, settings } = useSettings();
  const [selectedDesign, setSelectedDesign] = useState("default");

  useEffect(() => {
    if (isLoaded) {
      const savedDesign =
        getCurrentValue("banner_design_template") || "default";
      setSelectedDesign(savedDesign);
      console.log("BannerDesignSelector - Loaded design:", savedDesign);
    }
  }, [isLoaded, settings]);

  const bannerDesigns = [
    {
      id: "default",
      name: "Default",
      description: "Classic dark banner with blue accent buttons",
      preview: {
        banner_bg_color: "#1f2937",
        bg_opacity: "100",
        text_color: "#ffffff",
        accept_btn_color: "#2563eb",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#000000",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#6b7280",
        border_radius: "8",
      },
    },
    {
      id: "light",
      name: "Light & Clean",
      description: "White background with green accept button",
      preview: {
        banner_bg_color: "#ffffff",
        bg_opacity: "100",
        text_color: "#1f2937",
        accept_btn_color: "#10b981",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#f3f4f6",
        decline_btn_text_color: "#1f2937",
        decline_btn_border_style: "none",
        decline_btn_border_color: "#e5e7eb",
        border_radius: "12",
      },
    },
    {
      id: "modern",
      name: "Modern Dark",
      description: "Sleek black design with purple accents",
      preview: {
        banner_bg_color: "#111827",
        bg_opacity: "95",
        text_color: "#f3f4f6",
        accept_btn_color: "#8b5cf6",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#f3f4f6",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#8b5cf6",
        border_radius: "16",
      },
    },
    {
      id: "vibrant",
      name: "Vibrant",
      description: "Colorful gradient with bold buttons",
      preview: {
        banner_bg_color: "#3730a3",
        bg_opacity: "100",
        text_color: "#ffffff",
        accept_btn_color: "#f59e0b",
        accept_btn_text_color: "#1f2937",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#ffffff",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#f59e0b",
        border_radius: "8",
      },
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple gray banner with subtle styling",
      preview: {
        banner_bg_color: "#f9fafb",
        bg_opacity: "100",
        text_color: "#374151",
        accept_btn_color: "#111827",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#ffffff",
        decline_btn_text_color: "#111827",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#d1d5db",
        border_radius: "4",
      },
    },
    {
      id: "ocean",
      name: "Ocean Blue",
      description: "Fresh cyan theme with wave-like appeal",
      preview: {
        banner_bg_color: "#06b6d4",
        bg_opacity: "100",
        text_color: "#ffffff",
        accept_btn_color: "#0e7490",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#ffffff",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#ffffff",
        border_radius: "10",
      },
    },
    {
      id: "sunset",
      name: "Sunset Glow",
      description: "Warm orange gradient with sunset colors",
      preview: {
        banner_bg_color: "#f97316",
        bg_opacity: "100",
        text_color: "#ffffff",
        accept_btn_color: "#dc2626",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#fed7aa",
        decline_btn_text_color: "#7c2d12",
        decline_btn_border_style: "none",
        decline_btn_border_color: "#fb923c",
        border_radius: "14",
      },
    },
    {
      id: "forest",
      name: "Forest Green",
      description: "Natural green tones for eco-friendly sites",
      preview: {
        banner_bg_color: "#065f46",
        bg_opacity: "100",
        text_color: "#ecfdf5",
        accept_btn_color: "#10b981",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#d1fae5",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#6ee7b7",
        border_radius: "8",
      },
    },
    {
      id: "corporate",
      name: "Corporate Blue",
      description: "Professional navy blue for business sites",
      preview: {
        banner_bg_color: "#1e40af",
        bg_opacity: "100",
        text_color: "#ffffff",
        accept_btn_color: "#3b82f6",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#dbeafe",
        decline_btn_text_color: "#1e3a8a",
        decline_btn_border_style: "none",
        decline_btn_border_color: "#60a5fa",
        border_radius: "6",
      },
    },
    {
      id: "elegant",
      name: "Elegant Rose",
      description: "Sophisticated rose gold with premium feel",
      preview: {
        banner_bg_color: "#9f1239",
        bg_opacity: "100",
        text_color: "#fce7f3",
        accept_btn_color: "#f472b6",
        accept_btn_text_color: "#831843",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#fbcfe8",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#f9a8d4",
        border_radius: "12",
      },
    },
    {
      id: "midnight",
      name: "Midnight Sky",
      description: "Deep blue-black with starry accents",
      preview: {
        banner_bg_color: "#0c4a6e",
        bg_opacity: "100",
        text_color: "#e0f2fe",
        accept_btn_color: "#0ea5e9",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#bae6fd",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#0284c7",
        border_radius: "10",
      },
    },
    {
      id: "berry",
      name: "Berry Burst",
      description: "Vibrant berry purple with energetic feel",
      preview: {
        banner_bg_color: "#6b21a8",
        bg_opacity: "100",
        text_color: "#faf5ff",
        accept_btn_color: "#a855f7",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#e9d5ff",
        decline_btn_text_color: "#581c87",
        decline_btn_border_style: "none",
        decline_btn_border_color: "#c084fc",
        border_radius: "8",
      },
    },
    {
      id: "coffee",
      name: "Coffee Latte",
      description: "Warm brown tones for cozy websites",
      preview: {
        banner_bg_color: "#78350f",
        bg_opacity: "100",
        text_color: "#fef3c7",
        accept_btn_color: "#f59e0b",
        accept_btn_text_color: "#78350f",
        decline_btn_color: "#fde68a",
        decline_btn_text_color: "#78350f",
        decline_btn_border_style: "none",
        decline_btn_border_color: "#fbbf24",
        border_radius: "6",
      },
    },
    {
      id: "slate",
      name: "Slate Professional",
      description: "Modern slate gray for tech companies",
      preview: {
        banner_bg_color: "#334155",
        bg_opacity: "100",
        text_color: "#f1f5f9",
        accept_btn_color: "#0f172a",
        accept_btn_text_color: "#f8fafc",
        decline_btn_color: "#cbd5e1",
        decline_btn_text_color: "#1e293b",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#94a3b8",
        border_radius: "4",
      },
    },
    {
      id: "crimson",
      name: "Crimson Edge",
      description: "Bold red design for high-impact sites",
      preview: {
        banner_bg_color: "#991b1b",
        bg_opacity: "100",
        text_color: "#fef2f2",
        accept_btn_color: "#dc2626",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#fecaca",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#ef4444",
        border_radius: "8",
      },
    },
    {
      id: "mint",
      name: "Mint Fresh",
      description: "Light mint green for health & wellness",
      preview: {
        banner_bg_color: "#d1fae5",
        bg_opacity: "100",
        text_color: "#064e3b",
        accept_btn_color: "#059669",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#ffffff",
        decline_btn_text_color: "#065f46",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#6ee7b7",
        border_radius: "12",
      },
    },
    {
      id: "charcoal",
      name: "Charcoal Premium",
      description: "Sophisticated dark charcoal with gold accents",
      preview: {
        banner_bg_color: "#1c1917",
        bg_opacity: "100",
        text_color: "#fafaf9",
        accept_btn_color: "#eab308",
        accept_btn_text_color: "#1c1917",
        decline_btn_color: "transparent",
        decline_btn_text_color: "#fef3c7",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#facc15",
        border_radius: "6",
      },
    },
    {
      id: "lavender",
      name: "Lavender Dreams",
      description: "Soft purple for creative & artistic sites",
      preview: {
        banner_bg_color: "#e9d5ff",
        bg_opacity: "100",
        text_color: "#581c87",
        accept_btn_color: "#7c3aed",
        accept_btn_text_color: "#ffffff",
        decline_btn_color: "#faf5ff",
        decline_btn_text_color: "#6b21a8",
        decline_btn_border_style: "solid",
        decline_btn_border_color: "#c084fc",
        border_radius: "10",
      },
    },
  ];

  const handleDesignSelect = (designId) => {
    console.log("Design selected:", designId);
    setSelectedDesign(designId);
    updateSetting("banner_design_template", designId);

    // Apply the design settings
    const design = bannerDesigns.find((d) => d.id === designId);
    if (design) {
      Object.entries(design.preview).forEach(([key, value]) => {
        updateSetting(key, value);
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Banner Design Templates
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Choose a pre-designed banner template. Click "Save Changes" to apply
          to frontend.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="p-4">
          {/* All designs - 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerDesigns.map((design) => (
              <label
                key={design.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDesign === design.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleDesignSelect(design.id)}
              >
                <input
                  type="radio"
                  name="banner_design"
                  value={design.id}
                  checked={selectedDesign === design.id}
                  onChange={() => handleDesignSelect(design.id)}
                  className="mt-1 mr-4 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {design.name}
                    </h3>
                    {selectedDesign === design.id && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {design.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Preview:</span>
                    <div
                      className="w-12 h-12 rounded border"
                      style={{
                        backgroundColor: design.preview.banner_bg_color,
                        borderColor: design.preview.accept_btn_color,
                        borderWidth: "2px",
                      }}
                      title="Banner Background"
                    ></div>
                    <div
                      className="w-12 h-12 rounded"
                      style={{
                        backgroundColor: design.preview.accept_btn_color,
                      }}
                      title="Accept Button"
                    ></div>
                    <div
                      className="w-12 h-12 rounded border"
                      style={{
                        backgroundColor: design.preview.decline_btn_color,
                        borderColor: design.preview.decline_btn_border_color,
                        borderWidth: "1px",
                        borderStyle: design.preview.decline_btn_border_style,
                      }}
                      title="Decline Button"
                    ></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <ActionCard />
    </div>
  );
};

export default BannerDesignSelector;
