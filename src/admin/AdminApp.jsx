import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import QuickCookieBanner from "../components/QuickCookieBanner";
import CookieSettings from "../components/CookieSettings";
import BannerContent from "../components/BannerContent";
import BannerDesign from "../components/BannerDesign";
import ScannedCookies from "../components/ScannedCookies";
import ConsentLogs from "../components/ConsentLogs";
import GeoRules from "../components/GeoRules";
import Settings from "../components/Settings";

const AdminApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'quick-cookie-banner':
        return <QuickCookieBanner />;
      case 'cookie-settings':
        return <CookieSettings />;
      case 'banner-content':
        return <BannerContent />;
      case 'banner-design':
        return <BannerDesign />;
      case 'scanned-cookies':
        return <ScannedCookies />;
      case 'consent-logs':
        return <ConsentLogs />;
      case 'geo-rules':
        return <GeoRules />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex mt-0">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
