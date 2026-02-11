import { useThemeStore } from "store/themeStore";
import { Tooltip } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeStore();

  return (
    <div className="theme-toggle" onClick={toggleMode}>
      <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <div className={`toggle-icon ${mode}`}>
          {mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
        </div>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;
