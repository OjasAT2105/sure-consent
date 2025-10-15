import React, { useState, useEffect } from "react";
import TopNavigation from "../components/TopNavigation";
import PreviewBanner from "../components/PreviewBanner";
import ActionCard from "../components/ActionCard";
import Dashboard from "../components/Dashboard";
import QuickCookieBanner from "../components/QuickCookieBanner";
import CookieSettings from "../components/CookieSettings";
import BannerContent from "../components/BannerContent";
import BannerLayout from "../components/BannerLayout";
import BannerDesign from "../components/BannerDesign";
import ScannedCookies from "../components/ScannedCookies";
import ConsentLogs from "../components/ConsentLogs";
import GeoRules from "../components/GeoRules";
import Settings from "../components/Settings";
import { SettingsProvider } from "../contexts/SettingsContext";
import { Sidebar } from "@bsf/force-ui";

const AdminApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab") || "dashboard";
    
    const validTabs = ["dashboard", "banner", "settings", "analytics", "advanced"];
    const mainTab = validTabs.includes(tab) ? tab : "dashboard";
    
    setActiveTab(mainTab);
    
    // Set default subtab
    const defaultSubTabs = {
      banner: "quick-setup",
      settings: "categories", 
      analytics: "logs",
      advanced: "geo-rules"
    };
    setActiveSubTab(defaultSubTabs[mainTab] || "");
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    const defaultSubTabs = {
      banner: "quick-setup",
      settings: "categories", 
      analytics: "logs",
      advanced: "geo-rules"
    };
    
    setActiveSubTab(defaultSubTabs[tab] || "");
    
    const url = new URL(window.location);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "banner":
        switch (activeSubTab) {
          case "quick-setup":
            return <QuickCookieBanner />;
          case "content":
            return <BannerContent />;
          case "layout":
            return <BannerLayout />;
          case "design":
            return <BannerDesign />;
          default:
            return <QuickCookieBanner />;
        }
      case "settings":
        switch (activeSubTab) {
          case "categories":
            return <CookieSettings />;
          case "scanned":
            return <ScannedCookies />;
          default:
            return <CookieSettings />;
        }
      case "analytics":
        switch (activeSubTab) {
          case "logs":
            return <ConsentLogs />;
          case "reports":
            return <ConsentLogs />; // Placeholder for now
          default:
            return <ConsentLogs />;
        }
      case "advanced":
        switch (activeSubTab) {
          case "geo-rules":
            return <GeoRules />;
          case "scripts":
            return <Settings />; // Placeholder for now
          default:
            return <GeoRules />;
        }
      default:
        return <Dashboard />;
    }
  };

  const subNavItems = {
    banner: [
      { name: "Quick Setup", path: "quick-setup" },
      { name: "Content", path: "content" },
      { name: "Layout", path: "layout" },
      { name: "Design", path: "design" },
    ],
    settings: [
      { name: "Cookie Categories", path: "categories" },
      { name: "Scanned Cookies", path: "scanned" },
    ],
    analytics: [
      { name: "Consent Logs", path: "logs" },
      { name: "Reports", path: "reports" },
    ],
    advanced: [
      { name: "Geo Rules", path: "geo-rules" },
      { name: "Custom Scripts", path: "scripts" },
    ],
  };

  return (
    <SettingsProvider>
      <div className="sureconsent-styles min-h-screen bg-gray-50">
        <TopNavigation
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
        />
        <div className="flex">
          {subNavItems[activeTab] && (
            <Sidebar className="w-64 bg-white border-r">
              <Sidebar.Body>
                <Sidebar.Item>
                  <div className="p-4">
                    {subNavItems[activeTab].map((item) => (
                      <div
                        key={item.name}
                        onClick={() => handleSubTabChange(item.path)}
                        className={`p-2 mb-1 cursor-pointer rounded text-sm ${
                          activeSubTab === item.path
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </Sidebar.Item>
              </Sidebar.Body>
            </Sidebar>
          )}
          <div className="flex-1 px-8 py-6">
            <ActionCard />
            {renderContent()}
          </div>
        </div>
        <PreviewBanner />
      </div>
    </SettingsProvider>
  );
};

export default AdminApp;
