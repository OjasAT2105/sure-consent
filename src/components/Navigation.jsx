import { useState } from "react";
import { Sidebar } from "@bsf/force-ui";
import { Home, Settings as SettingsIcon, Cookie, BarChart3, Palette, ScanLine, CaseLower, GlobeLock } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar key="expanded" collapsible onCollapseChange={setIsCollapsed} className="bg-white border-r">
      <Sidebar.Header>
        <Sidebar.Item>
          <h1>SureConsent</h1>
        </Sidebar.Item>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Item>
          <div className="flex flex-col gap-2">
            <div>
              <div
                className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-700 ${activeTab === 'dashboard' ? 'bg-slate-100 font-semibold' : ''}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Home size={18} />
                <span className="text-sm">Dashboard</span>
              </div>
            </div>
            <div>
              <div
                className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'quick-cookie-banner' ? 'bg-slate-100 font-semibold' : ''}`}
                onClick={() => setActiveTab("quick-cookie-banner")}
              >
                <Cookie size={18} />
                <span className="text-sm">Quick Cookie Banner</span>
              </div>
            </div>
            <div>
              <div
                className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'cookie-settings' ? 'bg-slate-100 font-semibold' : ''}`}
                onClick={() => setActiveTab("cookie-settings")}
              >
                <SettingsIcon size={18} />
                <span className="text-sm">Cookie Settings</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide px-2 py-1 mb-1">
                Banner Management
              </p>
              <div className="gap-0.5">
                <div className="ml-4 space-y-1">
                  <div
                    className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'banner-content' ? 'bg-slate-100 font-semibold' : ''}`}
                    onClick={() => setActiveTab("banner-content")}
                  >
                    <CaseLower size={16} />
                    <span className="text-sm">Content</span>
                  </div>
                  <div
                    className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'banner-design' ? 'bg-slate-100 font-semibold' : ''}`}
                    onClick={() => setActiveTab("banner-design")}
                  >
                    <Palette size={16} />
                    <span className="text-sm">Design</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide px-2 py-1 mb-1">
                Cookie Manager
              </p>
              <div className="gap-0.5">
                <div className="ml-4 space-y-1">
                  <div
                    className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'scanned-cookies' ? 'bg-slate-100 font-semibold' : ''}`}
                    onClick={() => setActiveTab("scanned-cookies")}
                  >
                    <ScanLine size={16} />
                    <span className="text-sm">Scanned Cookies</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide px-2 py-1 mb-1">
                Analytics
              </p>
              <div className="gap-0.5">
                <div className="ml-4 space-y-1">
                  <div
                    className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'consent-logs' ? 'bg-slate-100 font-semibold' : ''}`}
                    onClick={() => setActiveTab("consent-logs")}
                  >
                    <BarChart3 size={16} />
                    <span className="text-sm">Consent Logs</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide px-2 py-1 mb-1">
                Advanced
              </p>
              <div className="gap-0.5">
                <div className="ml-4 mb-4 space-y-1">
                  <div
                    className={`p-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-slate-100 text-gray-600 ${activeTab === 'geo-rules' ? 'bg-slate-100 font-semibold' : ''}`}
                    onClick={() => setActiveTab("geo-rules")}
                  >
                    <GlobeLock size={16} />
                    <span className="text-sm">Geo Rules</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sidebar.Item>
      </Sidebar.Body>
    </Sidebar>
  );
};

export default Navigation;