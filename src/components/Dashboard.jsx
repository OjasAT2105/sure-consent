import { Container, Label, Button, Badge } from "@bsf/force-ui";
import {
  Ticket,
  MessageSquare,
  Star,
  Info,
  Shield,
  Cookie,
  BarChart3,
  Settings,
  Palette,
  ArrowUpRight,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { useEffect, useState } from "react";

const quickLinks = [
  {
    label: "Open Support Ticket",
    icon: <Ticket className="size-4" />,
    link: "https://sureconsent.com/support",
    external: true,
  },
  {
    label: "Help Center",
    icon: <Info className="size-4" />,
    link: "https://sureconsent.com/docs",
    external: true,
  },
  {
    label: "Join our Community",
    icon: <MessageSquare className="size-4" />,
    link: "https://facebook.com/sureconsent",
    external: true,
  },
  {
    label: "Leave Us a Review",
    icon: <Star className="size-4" />,
    link: "https://wordpress.org/plugins/sureconsent",
    external: true,
  },
];

// Custom icons matching SureRank
const AstraLogo = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 20C15.5229 20 20 15.5228 20 10C20 4.47715 15.5229 0 10 0C4.47716 0 0 4.47715 0 10C0 15.5228 4.47716 20 10 20ZM9.87902 4.43553C9.03231 6.22172 8.18559 8.00991 7.33888 9.79805C6.49206 11.5865 5.64519 13.3749 4.79838 15.1613H6.97578C7.6613 13.7783 8.34678 12.3932 9.03225 11.0081C9.71773 9.62302 10.4032 8.23794 11.0887 6.85487L9.87902 4.43553ZM11.0887 11.0483C11.4374 10.3225 11.7862 9.59679 12.137 8.87103C12.649 9.91933 13.1591 10.9677 13.6691 12.016C14.1793 13.0644 14.6894 14.1129 15.2015 15.1613H12.8628C12.7298 14.8509 12.5946 14.5424 12.4596 14.2339C12.3245 13.9255 12.1894 13.617 12.0563 13.3065H10.0402H9.99989L10.0402 13.2258C10.3911 12.5 10.7399 11.7742 11.0887 11.0483Z"
      fill="url(#paint0_linear_10691_20999)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_10691_20999"
        x1="20"
        y1="-5.96046e-07"
        x2="-1.78814e-06"
        y2="20"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B147E1" />
        <stop offset="1" stopColor="#5236DD" />
      </linearGradient>
    </defs>
  </svg>
);

const SpectraLogo = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 20C15.5229 20 20 15.5229 20 10C20 4.47714 15.5229 0 10 0C4.47714 0 0 4.47714 0 10C0 15.5229 4.47714 20 10 20ZM13.0751 12.93C13.6533 12.5645 14 11.9529 14 11.2985C14 10.389 13.336 9.59814 12.3943 9.38589L9.57257 8.68549C9.30657 8.62554 9.24283 8.29757 9.46911 8.15323L11.6675 6.75106C12.6907 6.09837 12.9568 4.79034 12.2617 3.82949C12.1748 3.70937 12.0007 3.67814 11.8728 3.75974L6.90669 7.10954C6.33954 7.47129 6 8.07331 6 8.71709C6 9.61566 6.65603 10.397 7.58654 10.6067L10.4542 11.3175C10.7208 11.3776 10.784 11.7067 10.5566 11.8504L8.34209 13.2504C7.31594 13.8991 7.04411 15.2061 7.73494 16.1696C7.82131 16.2901 7.99529 16.322 8.12357 16.2409L13.0751 12.93Z"
      fill="#5733FF"
    />
  </svg>
);

const SureMailIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M23.25 0H0.75C0.335787 0 0 0.335787 0 0.75V23.25C0 23.6642 0.335787 24 0.75 24H23.25C23.6642 24 24 23.6642 24 23.25V0.75C24 0.335787 23.6642 0 23.25 0Z"
      fill="#0D7EE8"
    />
    <path
      d="M6.40292 11.6635C6.61165 11.8145 6.90801 11.7649 7.04455 11.5618C7.19552 11.3531 7.14591 11.0567 6.94285 10.9202L4.93281 9.48016C4.86137 9.42507 4.8676 9.35611 4.87071 9.32164C4.87386 9.28718 4.90015 9.22703 4.98662 9.19317L18.3609 5.78333C18.4386 5.76953 18.4844 5.80148 18.5157 5.83906C18.547 5.87667 18.5784 5.91424 18.5433 5.99446L13.476 18.8162C13.4409 18.8964 13.3776 13.9045 13.3488 18.9158C13.3143 18.9127 13.2454 18.9065 13.2028 18.8401L11.6711 16.0326C11.6228 15.9518 11.5833 15.8509 11.535 15.7701C10.9355 14.4093 10.7842 13.4051 11.9093 12.416L14.806 9.73531C15.0027 9.55853 15.0221 9.26839 14.8509 9.08611C14.6742 8.88942 14.384 8.87007 14.2017 9.04118L11.1593 11.6635C9.62635 13.0119 9.88161 14.6891 10.8516 16.4865L12.3833 19.294C12.5789 19.6661 12.9769 19.8759 13.4023 19.8589C13.5145 19.8482 13.6354 19.8175 13.7363 19.778C14.0101 19.6707 14.2244 19.4538 14.3471 19.1731L19.4144 6.35138C19.5666 5.97597 19.495 5.53861 19.2242 5.22916C18.9534 4.91967 18.5405 4.79884 18.1432 4.88794L4.7545 8.30341C4.34849 8.41257 4.04151 8.73226 3.95519 9.14836C3.86882 9.56446 4.04691 9.97673 4.39289 10.2235L6.40292 11.6635Z"
      fill="white"
    />
  </svg>
);

const SureFormsIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20 0H0V20H20V0Z" fill="#D54407" />
    <path
      d="M5.71094 4.28125H14.2824V7.13841H7.13952L5.71094 8.56697V7.13841V4.28125Z"
      fill="white"
    />
    <path
      d="M5.71094 8.57031H12.8538V11.4274H7.13952L5.71094 12.856V11.4274V8.57031Z"
      fill="white"
    />
    <path d="M5.71094 12.8516H9.99664V15.7087H5.71094V12.8516Z" fill="white" />
  </svg>
);

const extendWebsiteItems = [
  {
    name: "Astra Theme",
    description: "Fast and customizable theme for your website.",
    icon: AstraLogo,
    status: "install",
  },
  {
    name: "Spectra",
    description: "Free WordPress Page Builder Plugin.",
    icon: SpectraLogo,
    status: "install",
  },
  {
    name: "SureMail",
    description: "Connect and send emails via SMTP connections.",
    icon: SureMailIcon,
    status: "install",
  },
  {
    name: "SureForms",
    description: "Best no code WordPress form builder",
    icon: SureFormsIcon,
    status: "active",
  },
];

const PluginCard = ({ item }) => (
  <Container.Item className="md:w-full lg:w-full flex">
    <Container
      className="flex-1 gap-1 shadow-sm p-2 rounded-md bg-background-primary"
      containerType="flex"
      direction="column"
    >
      <Container.Item>
        <Container className="items-start gap-1.5 p-1">
          <Container.Item className="flex mt-0.5" grow={0} shrink={0}>
            <item.icon className="size-5" />
          </Container.Item>
          <Container.Item className="flex">
            <Label className="text-sm font-medium">{item.name}</Label>
          </Container.Item>
        </Container>
      </Container.Item>
      <Container.Item className="gap-0.5 p-1" grow={1}>
        <Label
          variant="help"
          className="text-sm font-normal text-text-tertiary"
        >
          {item.description}
        </Label>
      </Container.Item>
      <Container.Item className="gap-0.5 px-1 pt-2 pb-1">
        <Button
          className="p-1 focus:[box-shadow:none] hover:no-underline"
          size="sm"
          variant="outline"
          disabled={item.status === "active"}
        >
          {item.status === "active" ? "Activated" : "Install & Activate"}
        </Button>
      </Container.Item>
    </Container>
  </Container.Item>
);

const PieChart = ({
  data,
  dataKey,
  showTooltip,
  tooltipIndicator,
  onHover,
}) => {
  // Calculate total
  const total = data.reduce((sum, item) => sum + item[dataKey], 0);

  // Calculate percentages and positions for pie slices
  let cumulativePercentage = 0;

  const chartData = data.map((item, index) => {
    const percentage = (item[dataKey] / total) * 100;
    const strokeDasharray = `${percentage} ${100 - percentage}`;
    const strokeDashoffset = -cumulativePercentage;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-40 h-40">
        <svg
          width="160"
          height="160"
          viewBox="0 0 42 42"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {/* Data slices */}
          {chartData.map((item, index) => (
            <circle
              key={index}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.fill}
              strokeWidth="3"
              strokeDasharray={item.strokeDasharray}
              strokeDashoffset={item.strokeDashoffset}
              className="transition-all duration-300"
              onMouseEnter={() => onHover && onHover(item)}
              onMouseLeave={() => onHover && onHover(null)}
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-gray-500">Total Consents</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { getCurrentValue, updateSetting, saveSettings } = useSettings();
  const bannerEnabled =
    getCurrentValue("banner_enabled") ||
    getCurrentValue("enable_banner") ||
    false;

  const [consentData, setConsentData] = useState([]);
  const [totalConsents, setTotalConsents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleBanner = async () => {
    const newValue = !bannerEnabled;
    updateSetting("banner_enabled", newValue);
    updateSetting("enable_banner", newValue);
    // Save immediately
    const result = await saveSettings();
    if (result.success) {
      console.log("Banner status updated:", newValue);
    }
  };

  // Fetch consent logs data for the pie chart
  useEffect(() => {
    const fetchConsentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          window.sureConsentAjax?.ajaxurl || "/wp-admin/admin-ajax.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              action: "sure_consent_get_consent_logs",
              nonce: window.sureConsentAjax?.nonce || "",
              page: 1,
              per_page: 1000, // Get all logs for accurate data
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          // Process the data to get counts for each status
          const statusCounts = {
            accepted: 0,
            declined: 0,
            partially_accepted: 0,
          };

          data.data.logs.forEach((log) => {
            // Normalize status values
            let status = log.status;
            if (status === "accept_all") {
              status = "accepted";
            } else if (status === "decline_all") {
              status = "declined";
            }

            if (status in statusCounts) {
              statusCounts[status]++;
            } else {
              // Handle any other status values
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            }
          });

          const chartData = [
            {
              fill: "#10b981",
              name: "Accepted",
              visitors: statusCounts.accepted,
            },
            {
              fill: "#ef4444",
              name: "Declined",
              visitors: statusCounts.declined,
            },
            {
              fill: "#f59e0b",
              name: "Partially Accepted",
              visitors: statusCounts.partially_accepted,
            },
          ];

          setConsentData(chartData);
          setTotalConsents(data.data.total);
        }
      } catch (error) {
        console.error("Error fetching consent data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsentData();
  }, []);

  return (
    <Container
      className="h-full p-5 pb-8 xl:p-8 max-[1920px]:max-w-full mx-auto box-content bg-background-secondary gap-6"
      cols={12}
      containerType="grid"
      gap="2xl"
    >
      <Container.Item className="col-span-8">
        <Container direction="column" className="gap-8 relative">
          {/* Consent Analytics */}
          <Container
            className="w-full h-fit bg-background-primary border-0.5 border-solid rounded-xl border-border-subtle p-4 shadow-sm"
            containerType="flex"
            direction="column"
            gap="md"
          >
            <Container.Item>
              <Label className="text-lg font-semibold text-text-primary">
                Consent Analytics
              </Label>
            </Container.Item>
            <Container.Item>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-gray-200 h-40 w-40 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ) : (
                <Container className="gap-6" align="center">
                  <Container.Item className="w-1/2">
                    <PieChart
                      data={consentData}
                      dataKey="visitors"
                      showTooltip
                      tooltipIndicator="dot"
                      onHover={setHoveredItem}
                    />
                  </Container.Item>
                  <Container.Item className="w-1/2">
                    <Container direction="column" className="gap-4">
                      {consentData.map((item, index) => (
                        <Container.Item key={index}>
                          <Container
                            align="center"
                            className={`gap-3 p-3 rounded-lg transition-all duration-200 ${
                              hoveredItem && hoveredItem.name === item.name
                                ? "bg-blue-50 border border-blue-200 scale-105"
                                : "bg-gray-50"
                            }`}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.fill }}
                            />
                            <Label className="text-sm font-medium flex-1">
                              {item.name}
                            </Label>
                            <Label className="text-sm font-semibold">
                              {item.visitors} (
                              {totalConsents > 0
                                ? Math.round(
                                    (item.visitors / totalConsents) * 100
                                  )
                                : 0}
                              %)
                            </Label>
                          </Container>
                        </Container.Item>
                      ))}
                    </Container>
                  </Container.Item>
                </Container>
              )}
            </Container.Item>
          </Container>

          {/* Banner Status */}
          <Container
            className="w-full h-fit bg-background-primary border-0.5 border-solid rounded-xl border-border-subtle p-4 shadow-sm"
            containerType="flex"
            direction="column"
            gap="md"
          >
            <Container.Item>
              <Container align="center" justify="between">
                <Label className="text-lg font-semibold text-text-primary">
                  Cookie Banner Status
                </Label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerEnabled}
                    onChange={toggleBanner}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      bannerEnabled ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        bannerEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {bannerEnabled ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </Container>
            </Container.Item>
            <Container.Item>
              <Container className="gap-4">
                <Container.Item className="flex-1">
                  <Container direction="column" className="gap-2">
                    <Label className="text-sm text-text-secondary">
                      Frontend Status
                    </Label>
                    <Container align="center" className="gap-2">
                      <Badge
                        label={bannerEnabled ? "Active" : "Inactive"}
                        size="sm"
                        variant={bannerEnabled ? "success" : "neutral"}
                      />
                      <Label className="text-sm">
                        {bannerEnabled
                          ? "Banner is running on your website"
                          : "Banner is disabled"}
                      </Label>
                    </Container>
                  </Container>
                </Container.Item>
                <Container.Item className="flex-1">
                  <Container direction="column" className="gap-2">
                    <Label className="text-sm text-text-secondary">
                      Compliance
                    </Label>
                    <Container align="center" className="gap-2">
                      <Badge label="GDPR" size="sm" variant="neutral" />
                      <Label className="text-sm">EU compliance enabled</Label>
                    </Container>
                  </Container>
                </Container.Item>
              </Container>
            </Container.Item>
          </Container>
        </Container>
      </Container.Item>

      <Container.Item className="col-span-4 flex flex-col gap-6">
        {/* Extend Your Website */}
        <Container
          className="w-full h-fit bg-background-primary border-0.5 border-solid rounded-xl border-border-subtle p-3 shadow-sm"
          containerType="flex"
          direction="column"
          gap="xs"
        >
          <Container.Item className="md:w-full lg:w-full">
            <Container
              align="center"
              className="p-1"
              gap="xs"
              justify="between"
            >
              <Label className="font-semibold text-text-primary">
                Extend Your Website
              </Label>
            </Container>
          </Container.Item>
          <Container.Item className="md:w-full lg:w-full bg-field-primary-background rounded-lg">
            <Container
              containerType="grid"
              className="p-1 gap-1 grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-2 xl:grid-cols-2"
            >
              {extendWebsiteItems.map((item) => (
                <PluginCard key={item.name} item={item} />
              ))}
            </Container>
          </Container.Item>
        </Container>

        {/* Quick Access */}
        <Container
          className="w-full h-fit bg-background-primary border-0.5 border-solid rounded-xl border-border-subtle p-3 shadow-sm"
          containerType="flex"
          direction="column"
          gap="xs"
        >
          <Container.Item className="md:w-full lg:w-full p-1">
            <Label className="font-semibold text-text-primary">
              Quick Access
            </Label>
          </Container.Item>
          <Container.Item className="flex flex-col md:w-full lg:w-full bg-field-primary-background gap-1 p-1 rounded-lg">
            {quickLinks.map((link) => (
              <div
                key={link.label}
                className="p-2 gap-1 items-center bg-background-primary rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  if (link.external) {
                    window.open(link.link, "_blank", "noopener,noreferrer");
                  } else {
                    window.location.href = link.link;
                  }
                }}
              >
                <Container
                  align="center"
                  className="gap-1 p-1"
                  containerType="flex"
                  direction="row"
                >
                  <Container.Item className="flex">{link.icon}</Container.Item>
                  <Container.Item className="flex">
                    <Label className="py-0 px-1 font-normal cursor-pointer hover:text-link-primary">
                      {link.label}
                    </Label>
                  </Container.Item>
                </Container>
              </div>
            ))}
          </Container.Item>
        </Container>
      </Container.Item>
    </Container>
  );
};

export default Dashboard;
