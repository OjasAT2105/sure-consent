import React, { useState, useEffect, Fragment } from "react";
import { SettingsProvider } from "../contexts/SettingsContext";
import {
  Topbar,
  Sidebar,
  Badge,
  Button,
  HamburgerMenu,
  Dialog,
  Input,
  Select,
  FilePreview,
} from "@bsf/force-ui";
import {
  CircleHelp,
  Megaphone,
  Shield,
  BarChart3,
  Settings as SettingsIcon,
  Palette,
  CaseLower,
  Hourglass,
  LayoutList,
} from "lucide-react";
import Dashboard from "../components/Dashboard";
import QuickCookieBanner from "../components/QuickCookieBanner";
import CookieSettings from "../components/CookieSettings";
import BannerContent from "../components/BannerContent";
import BannerLayout from "../components/BannerLayout";
import CustomCSS from "../components/CustomCSS";
import BannerDesignSelector from "../components/BannerDesignSelector";

import Design from "../components/Design";
import ScannedCookies from "../components/ScannedCookies";
import ConsentLogs from "../components/ConsentLogs";
import GeoRules from "../components/GeoRules";
import Settings from "../components/Settings";
import Laws from "../components/Laws";
import ActionCard from "../components/ActionCard";
import PreviewBanner from "../components/PreviewBanner";
import { useSettings } from "../contexts/SettingsContext";

const PreviewButton = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const previewEnabled = getCurrentValue("preview_enabled");

  const togglePreview = () => {
    console.log("Toggling preview from", previewEnabled, "to", !previewEnabled);
    updateSetting("preview_enabled", !previewEnabled);
  };

  console.log("PreviewButton - previewEnabled:", previewEnabled);

  return (
    <Topbar.Item>
      <Button
        variant="primary"
        size="sm"
        icon={<Megaphone />}
        onClick={togglePreview}
        className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
      >
        {previewEnabled ? "Hide Preview" : "Show Preview"}
      </Button>
    </Topbar.Item>
  );
};

const AdminApp = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activePath, setActivePath] = useState("/dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log("AdminApp - activeSection:", activeSection);

  // Navigation configuration similar to SureRank
  const navLinks = [
    {
      section: "Dashboard",
      sectionId: "dashboard",
      links: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: Shield,
        },
      ],
    },
    {
      section: "Cookie Settings",
      sectionId: "settings",
      links: [
        {
          label: "General Settings",
          path: "/settings/general",
          icon: SettingsIcon,
        },
        {
          label: "Laws",
          path: "/settings/laws",
          icon: Shield,
        },
      ],
    },
    {
      section: "Cookie Banner",
      sectionId: "banner",
      links: [
        {
          label: "Content",
          path: "/banner/content",
          icon: CaseLower,
        },
        {
          label: "Layout",
          path: "/banner/layout",
          icon: LayoutList,
        },
        {
          label: "Design",
          path: "/banner/design",
          icon: Palette,
        },
        {
          label: "Customize",
          path: "/banner/customize",
          icon: Palette,
        },
        {
          label: "Custom CSS",
          path: "/banner/custom-css",
          icon: SettingsIcon,
        },
      ],
    },

    {
      section: "Analytics",
      sectionId: "analytics",
      links: [
        {
          label: "Consent Logs",
          path: "/analytics/logs",
          icon: BarChart3,
        },
        {
          label: "Reports",
          path: "/analytics/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      section: "Advanced",
      sectionId: "advanced",
      links: [
        {
          label: "Geo Rules",
          path: "/advanced/geo-rules",
          icon: SettingsIcon,
        },
        {
          label: "Custom Scripts",
          path: "/advanced/scripts",
          icon: SettingsIcon,
        },
      ],
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab") || "dashboard";
    const subtab = urlParams.get("subtab");

    // Find the section and set the appropriate path
    const section = navLinks.find((nav) => nav.sectionId === tab);
    if (section && section.links.length > 0) {
      setActiveSection(tab);

      // If subtab is specified, find the matching path
      if (subtab) {
        const matchingLink = section.links.find(
          (link) =>
            link.path.includes(subtab) || link.path.split("/").pop() === subtab
        );
        if (matchingLink) {
          setActivePath(matchingLink.path);
        } else {
          setActivePath(section.links[0].path);
        }
      } else {
        setActivePath(section.links[0].path);
      }
    } else {
      setActiveSection("dashboard");
      setActivePath("/dashboard");
    }
  }, []);

  const handlePathChange = (path) => {
    setActivePath(path);

    // Find which section this path belongs to
    const section = navLinks.find((nav) =>
      nav.links.some((link) => link.path === path)
    );

    if (section) {
      setActiveSection(section.sectionId);

      // Extract subtab from path
      const pathParts = path.split("/");
      const subtab = pathParts[pathParts.length - 1];

      // Update URL with both tab and subtab
      const url = new URL(window.location);
      url.searchParams.set("tab", section.sectionId);
      if (subtab && subtab !== section.sectionId) {
        url.searchParams.set("subtab", subtab);
      } else {
        url.searchParams.delete("subtab");
      }
      window.history.pushState({}, "", url);
    }
  };

  const handleSectionChange = (sectionId) => {
    const section = navLinks.find((nav) => nav.sectionId === sectionId);
    if (section && section.links.length > 0) {
      setActiveSection(sectionId);
      setActivePath(section.links[0].path);

      // Update URL and clear subtab when changing main section
      const url = new URL(window.location);
      url.searchParams.set("tab", sectionId);
      url.searchParams.delete("subtab"); // Clear subtab when changing main section
      window.history.pushState({}, "", url);
    }
  };

  const renderContent = () => {
    switch (activePath) {
      case "/dashboard":
        return <Dashboard />;
      case "/banner/content":
        return <BannerContent />;
      case "/banner/layout":
        return <BannerLayout />;
      case "/banner/design":
        return <BannerDesignSelector />;
      case "/banner/customize":
        return <Design />;
      case "/banner/custom-css":
        return <CustomCSS />;
      case "/settings/general":
        return <CookieSettings />;
      case "/settings/laws":
        return <Laws />;
      case "/analytics/logs":
        return <ConsentLogs />;
      case "/analytics/reports":
        return <ConsentLogs />; // Placeholder
      case "/advanced/geo-rules":
        return <GeoRules />;
      case "/advanced/scripts":
        return <Settings />; // Placeholder
      default:
        return <Dashboard />;
    }
  };

  // Get active section for sidebar
  const activeNavSection = navLinks.find(
    (nav) => nav.sectionId === activeSection
  );
  const filteredNavLinks = activeNavSection ? [activeNavSection] : [];

  // Top navbar links
  const topNavbarLinks = navLinks.map((nav) => ({
    label: nav.section,
    path: nav.links[0].path,
    active: nav.sectionId === activeSection,
    sectionId: nav.sectionId,
  }));

  const NavLink = ({ path, children, icon: Icon }) => {
    const isActive = activePath === path;

    return (
      <div
        onClick={() => handlePathChange(path)}
        className={`flex items-center justify-start gap-2.5 py-2 pl-2.5 pr-2 [&_svg]:text-icon-secondary hover:bg-background-secondary rounded-md text-base font-normal no-underline cursor-pointer focus:outline-none focus:shadow-none transition ease-in-out duration-150 [&_svg]:size-5 ${
          isActive
            ? "bg-background-secondary text-text-primary [&_svg]:text-brand-800"
            : ""
        }`}
        role="menuitem"
        tabIndex={0}
        style={{ color: "#111827" }}
      >
        {Icon && <Icon className="size-4" />}
        {children}
      </div>
    );
  };

  const SidebarSection = ({ section, links }) => {
    if (!links?.length) {
      return null;
    }

    return (
      <Sidebar.Item
        key={section}
        arrow
        heading={section}
        open={true}
        className="space-y-0.5"
      >
        {links.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} path={path} icon={Icon}>
            {label}
          </NavLink>
        ))}
      </Sidebar.Item>
    );
  };

  const SidebarNavigation = ({ navLinks = [] }) => {
    return (
      <div className="h-full w-full">
        <Sidebar borderOn className="!h-full w-full p-4">
          <Sidebar.Body>
            <Sidebar.Item role="navigation" aria-label="Main Navigation">
              {navLinks.map(({ section, links }) => (
                <SidebarSection key={section} section={section} links={links} />
              ))}
            </Sidebar.Item>
          </Sidebar.Body>
        </Sidebar>
      </div>
    );
  };

  return (
    <SettingsProvider>
      <Fragment>
        <div className="sureconsent-styles grid max-[782px]:grid-rows-[64px_calc(100dvh_-_110px)] grid-rows-[64px_calc(100dvh_-_96px)] min-h-screen bg-background-secondary">
          {/* Header */}
          <Topbar
            className="w-auto min-h-[unset] h-16 border-b border-border-subtle p-0 relative bg-white"
            gap={0}
          >
            <Topbar.Left className="p-5">
              <Topbar.Item className="flex md:hidden">
                <HamburgerMenu className="lg:hidden">
                  <HamburgerMenu.Toggle className="size-6" />
                  <HamburgerMenu.Options>
                    {topNavbarLinks.map((option) => (
                      <HamburgerMenu.Option
                        key={option.label}
                        onClick={() => handleSectionChange(option.sectionId)}
                        active={option.active}
                      >
                        {option.label}
                      </HamburgerMenu.Option>
                    ))}
                  </HamburgerMenu.Options>
                </HamburgerMenu>
              </Topbar.Item>
              <Topbar.Item>
                <div
                  onClick={() => handlePathChange("/dashboard")}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 25 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M12.5 24C19.1275 24 24.5 18.6273 24.5 11.9999C24.5 5.37255 19.1275 0 12.5 0C5.87259 0 0.5 5.37255 0.5 11.9999C0.5 18.6273 5.87259 24 12.5 24ZM12.5517 5.99996C11.5882 5.99996 10.2547 6.55101 9.5734 7.23073L7.7229 9.07688H16.9465L20.0307 5.99996H12.5517ZM15.4111 16.7692C14.7298 17.4489 13.3964 17.9999 12.4328 17.9999H4.95388L8.03804 14.923H17.2616L15.4111 16.7692ZM18.4089 10.6153H6.18418L5.60673 11.1923C4.23941 12.423 4.64495 13.3846 6.5598 13.3846H18.8176L19.3952 12.8076C20.7492 11.5841 20.3237 10.6153 18.4089 10.6153Z"
                      fill="#6B21A8"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </Topbar.Item>
            </Topbar.Left>

            <Topbar.Middle align="left" className="h-full">
              <Topbar.Item className="h-full gap-4 hidden md:flex">
                {topNavbarLinks.map(({ path, label, active, sectionId }) => (
                  <button
                    key={path}
                    onClick={() => handleSectionChange(sectionId)}
                    className={`relative content-center no-underline h-full py-0 px-3 m-0 bg-transparent outline-none shadow-none border-0 focus:outline-none text-sm font-medium cursor-pointer`}
                    style={{
                      color: active ? "#111827" : "#4b5563",
                    }}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-0 w-full h-px bg-brand-800" />
                    )}
                  </button>
                ))}
              </Topbar.Item>
            </Topbar.Middle>

            <Topbar.Right className="p-5">
              {(activeSection === "banner" || activeSection === "settings") && (
                <PreviewButton />
              )}
              <Topbar.Item>
                <Badge label="V 1.0.0" size="xs" variant="neutral" />
              </Topbar.Item>
              <Topbar.Item>
                <Dialog
                  design="simple"
                  exitOnEsc
                  scrollLock
                  open={dialogOpen}
                  setOpen={setDialogOpen}
                  trigger={
                    <Button variant="ghost" size="xs" icon={<CircleHelp />} />
                  }
                >
                  <Dialog.Backdrop />
                  <Dialog.Panel>
                    <Dialog.Header>
                      <div className="flex items-center justify-between">
                        <Dialog.Title>Help & Documentation</Dialog.Title>
                        <Dialog.CloseButton />
                      </div>
                      <Dialog.Description>
                        Get help with SureConsent plugin configuration and
                        usage.
                      </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                      <div className="space-y-4">
                        <Input
                          defaultValue=""
                          placeholder="Search documentation..."
                          size="sm"
                          type="text"
                        />
                        <Select onChange={() => {}} size="sm">
                          <Select.Button placeholder="Select help topic" />
                          <Select.Options>
                            <Select.Option
                              value={{ id: "1", name: "Getting Started" }}
                            >
                              Getting Started
                            </Select.Option>
                            <Select.Option
                              value={{ id: "2", name: "Cookie Configuration" }}
                            >
                              Cookie Configuration
                            </Select.Option>
                            <Select.Option
                              value={{ id: "3", name: "Banner Customization" }}
                            >
                              Banner Customization
                            </Select.Option>
                            <Select.Option
                              value={{ id: "4", name: "Compliance Settings" }}
                            >
                              Compliance Settings
                            </Select.Option>
                          </Select.Options>
                        </Select>
                        <Input onChange={() => {}} size="sm" type="file" />
                      </div>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Button
                        onClick={() =>
                          window.open("https://sureconsent.com/docs", "_blank")
                        }
                        size="sm"
                      >
                        Open Documentation
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Panel>
                </Dialog>
              </Topbar.Item>
              <Topbar.Item>
                <Button
                  variant="ghost"
                  size="xs"
                  icon={<Megaphone />}
                  onClick={() =>
                    window.open("https://sureconsent.com/whats-new", "_blank")
                  }
                />
              </Topbar.Item>
            </Topbar.Right>
          </Topbar>

          {/* Main Content */}
          {activeSection === "dashboard" ? (
            <div className="w-full min-h-[calc(100vh-64px)] bg-background-secondary p-5">
              <main className="w-full">{renderContent()}</main>
            </div>
          ) : (
            <div className="w-full h-[calc(100vh-64px)] grid grid-cols-[290px_1fr]">
              <SidebarNavigation navLinks={filteredNavLinks} />
              <div className="bg-background-secondary overflow-y-auto">
                <div className="p-5">
                  <main className="mx-auto max-w-[768px]">
                    {renderContent()}
                  </main>
                </div>
              </div>
            </div>
          )}
        </div>
        {(activeSection === "banner" || activeSection === "settings") && (
          <PreviewBanner />
        )}
      </Fragment>
    </SettingsProvider>
  );
};

export default AdminApp;
