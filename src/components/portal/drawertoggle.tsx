import React, { useState } from "react";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import SettingsDrawer from "components/portal/SettingsDrawer";

const DrawerToggle: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Button
        icon={<SettingOutlined />}
        onClick={() => setSettingsOpen(true)}
        style={{ marginRight: 16 }}
      />
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default DrawerToggle;
