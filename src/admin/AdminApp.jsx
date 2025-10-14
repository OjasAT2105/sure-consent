import React, { useState, useEffect, createContext, useContext } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import PreviewBanner from "../components/PreviewBanner";
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

// Global state context for tracking changes
const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

const AdminApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize tab from URL params
  useEffect(() => {
    const getTabFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab");
      const validTabs = [
        "dashboard",
        "quick-cookie-banner",
        "cookie-settings",
        "banner-content",
        "banner-design",
        "scanned-cookies",
        "consent-logs",
        "geo-rules",
        "settings",
      ];
      return validTabs.includes(tab) ? tab : "dashboard";
    };

    setActiveTab(getTabFromUrl());

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
      setHasChanges(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url);
    setHasChanges(false); // Reset changes when switching tabs
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "quick-cookie-banner":
        return <QuickCookieBanner />;
      case "cookie-settings":
        return <CookieSettings />;
      case "banner-content":
        return <BannerContent />;
      case "banner-layout":
        return <BannerLayout />;
      case "banner-design":
        return <BannerDesign />;
      case "scanned-cookies":
        return <ScannedCookies />;
      case "consent-logs":
        return <ConsentLogs />;
      case "geo-rules":
        return <GeoRules />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppStateContext.Provider value={{ hasChanges, setHasChanges }}>
      <div className="sureconsent-styles min-h-screen bg-gray-50">
        <Header />
        <div className="">
          <div className="flex gap-12 mt-6">
            <div className="w-[15%] min-w-48">
              <Navigation
                activeTab={activeTab}
                setActiveTab={handleTabChange}
              />
            </div>
            <div className="flex-1">{renderContent()}</div>
          </div>
        </div>
        <PreviewBanner />
      </div>
    </AppStateContext.Provider>
  );
};

export default AdminApp;
