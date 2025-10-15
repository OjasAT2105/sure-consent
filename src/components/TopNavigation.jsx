import React, { useState, useEffect } from "react";
import { Topbar, HamburgerMenu, Badge, Button } from "@bsf/force-ui";
import { CircleHelp, Megaphone, User } from "lucide-react";

const TopNavigation = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
}) => {
  const [activePath, setActivePath] = useState(activeTab);

  // Define main navigation items
  const navItems = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Cookie Banner", path: "banner" },
    { name: "Cookie Settings", path: "settings" },
    { name: "Analytics", path: "analytics" },
    { name: "Advanced", path: "advanced" },
  ];

  // Define sub-navigation items for each main tab
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

  useEffect(() => {
    setActivePath(activeTab);
  }, [activeTab]);

  const handleMainNavClick = (path) => {
    setActiveTab(path);
  };

  const handleSubNavClick = (path) => {
    setActiveSubTab(path);
  };

  return (
    <>
      {/* Main Header Navigation */}
      <Topbar className="relative shadow-sm bg-white h-16 z-[1] p-0 gap-0 border-b">
        {/* Left Section: Logo */}
        <Topbar.Left className="p-5 gap-5">
          <HamburgerMenu className="lg:hidden">
            <HamburgerMenu.Toggle className="size-6" />
            <HamburgerMenu.Options>
              {navItems.map((option) => (
                <HamburgerMenu.Option
                  key={option.name}
                  onClick={() => handleMainNavClick(option.path)}
                  active={activePath === option.path}
                >
                  {option.name}
                </HamburgerMenu.Option>
              ))}
            </HamburgerMenu.Options>
          </HamburgerMenu>
          <Topbar.Item>
            <div
              onClick={() => handleMainNavClick("dashboard")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <svg
                fill="none"
                height="32"
                viewBox="0 0 25 24"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M12.5 24C19.1275 24 24.5 18.6273 24.5 11.9999C24.5 5.37255 19.1275 0 12.5 0C5.87259 0 0.5 5.37255 0.5 11.9999C0.5 18.6273 5.87259 24 12.5 24ZM12.5517 5.99996C11.5882 5.99996 10.2547 6.55101 9.5734 7.23073L7.7229 9.07688H16.9465L20.0307 5.99996H12.5517ZM15.4111 16.7692C14.7298 17.4489 13.3964 17.9999 12.4328 17.9999H4.95388L8.03804 14.923H17.2616L15.4111 16.7692ZM18.4089 10.6153H6.18418L5.60673 11.1923C4.23941 12.423 4.64495 13.3846 6.5598 13.3846H18.8176L19.3952 12.8076C20.7492 11.5841 20.3237 10.6153 18.4089 10.6153Z"
                  fill="#0D7EE8"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </Topbar.Item>
        </Topbar.Left>

        {/* Middle Section: Main Navigation */}
        <Topbar.Middle className="h-full lg:flex hidden" align="left" gap="xs">
          <Topbar.Item className="h-full">
            <nav className="h-full space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMainNavClick(item.path)}
                  className={`inline-block relative h-full content-center px-1 text-sm font-medium no-underline bg-transparent focus:outline-none shadow-none border-0 hover:text-gray-900 transition-colors duration-300 ${
                    activePath === item.path
                      ? 'text-gray-900 border-none after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-px after:bg-blue-600 after:transition-all after:duration-300'
                      : "text-gray-600"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </Topbar.Item>
        </Topbar.Middle>

        {/* Right Section: Version Badge and Icons */}
        <Topbar.Right className="p-5">
          <Topbar.Item>
            <Badge label="V 1.0.0" size="xs" variant="neutral" />
          </Topbar.Item>
          <Topbar.Item className="gap-2">
            <Button
              variant="ghost"
              size="xs"
              icon={<CircleHelp />}
              onClick={() =>
                window.open("https://sureconsent.com/docs", "_blank")
              }
            />
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


    </>
  );
};

export default TopNavigation;
