import { useState, useEffect } from "react";
import {
  Container,
  Label,
  Text,
  Title,
  RadioButton,
  Badge,
} from "@bsf/force-ui";
import { CircleHelp } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

const InfoTooltip = ({ content }) => (
  <div className="inline-flex items-center">
    <CircleHelp
      className="size-4 text-icon-secondary cursor-help"
      title={content}
    />
  </div>
);

const PageHeader = ({ title, description, info_tooltip }) => {
  return (
    <div className="flex items-center justify-between gap-3 flex-1">
      <Container direction="column" className="gap-0.5">
        <Container direction="row" className="gap-2">
          <Title
            className="[&_h2]:text-text-primary [&_h2]:leading-[1.875rem]"
            title={title}
            size="md"
          />
          {info_tooltip && (
            <div className="mt-[7px]">
              <InfoTooltip content={info_tooltip} />
            </div>
          )}
        </Container>
        <Text size={14} weight={400} color="secondary">
          {description}
        </Text>
      </Container>
    </div>
  );
};

const BannerLayout = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [noticeType, setNoticeType] = useState("banner");
  const [noticePosition, setNoticePosition] = useState("top");

  useEffect(() => {
    const type = getCurrentValue("notice_type") || "banner";
    const position = getCurrentValue("notice_position") || "bottom";
    setNoticeType(type);
    setNoticePosition(position);
    console.log('BannerLayout loaded:', { type, position });
  }, [getCurrentValue("notice_type"), getCurrentValue("notice_position")]);

  const handleNoticeTypeChange = (value) => {
    console.log('Notice type changed to:', value);
    setNoticeType(value);
    updateSetting("notice_type", value);

    if (value === "banner") {
      setNoticePosition("bottom");
      updateSetting("notice_position", "bottom");
    } else if (value === "box") {
      setNoticePosition("bottom-right");
      updateSetting("notice_position", "bottom-right");
    } else {
      setNoticePosition("");
      updateSetting("notice_position", "");
    }
  };

  const handlePositionChange = (value) => {
    console.log('Notice position changed to:', value);
    setNoticePosition(value);
    updateSetting("notice_position", value);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Banner Layout</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* ---------- Cookie Notice Type ---------- */}
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">
            Cookie Notice Type
          </Label>

          <RadioButton.Group
            columns={3}
            onChange={handleNoticeTypeChange}
            value={noticeType}
            size="md"
          >
            <RadioButton.Button
              label={{ heading: "Box" }}
              value="box"
              borderOn
              badgeItem={<Badge size="sm" type="rounded" variant="green" />}
            />
            <RadioButton.Button
              label={{ heading: "Banner" }}
              value="banner"
              borderOn
              badgeItem={<Badge size="sm" type="rounded" variant="blue" />}
            />
            <RadioButton.Button
              label={{ heading: "Popup" }}
              value="popup"
              borderOn
              badgeItem={<Badge size="sm" type="rounded" variant="orange" />}
            />
          </RadioButton.Group>
        </div>

        {/* ---------- Notice Position ---------- */}
        {noticeType !== "popup" && (
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Notice Position
            </Label>

            {noticeType === "banner" && (
              <RadioButton.Group
                columns={2}
                onChange={handlePositionChange}
                value={noticePosition}
                size="md"
              >
                <RadioButton.Button
                  label={{ heading: "Top" }}
                  value="top"
                  borderOn
                />
                <RadioButton.Button
                  label={{ heading: "Bottom" }}
                  value="bottom"
                  borderOn
                />
              </RadioButton.Group>
            )}

            {noticeType === "box" && (
              <RadioButton.Group
                columns={2}
                onChange={handlePositionChange}
                value={noticePosition}
                size="md"
              >
                <RadioButton.Button
                  label={{ heading: "Bottom Left" }}
                  value="bottom-left"
                  borderOn
                />
                <RadioButton.Button
                  label={{ heading: "Bottom Right" }}
                  value="bottom-right"
                  borderOn
                />
                <RadioButton.Button
                  label={{ heading: "Top Left" }}
                  value="top-left"
                  borderOn
                />
                <RadioButton.Button
                  label={{ heading: "Top Right" }}
                  value="top-right"
                  borderOn
                />
              </RadioButton.Group>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerLayout;
