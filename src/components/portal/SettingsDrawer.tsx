import { 
  Drawer, 
  Switch, 
  Radio, 
  Divider, 
  Button, 
  Alert, 
  Collapse, 
  Form, 
  Slider,
  Typography,
  Card,
  Popover,
  Input
} from "antd";
import { useThemeStore } from "store/themeStore";
import { 
  BulbOutlined, 
  BorderOutlined, 
  LayoutOutlined, 
  BlockOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  SettingOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  PlusOutlined,
  
} from "@ant-design/icons";
import { useState } from "react";

const { Panel } = Collapse;
const { Text } = Typography;

// Predefined color palette
const COLOR_PRESETS = [
  ['#1677ff', '#722ED1', '#13C2C2', '#52C41A', '#F5222D'],
  ['#FA8C16', '#FAAD14', '#1890ff', '#2f54eb', '#7B61FF'],
  ['#00B96B', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'],
  ['#118AB2', '#EF476F', '#7209B7', '#3A86FF', '#FB5607'],
];

const SettingsDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const {
    mode,
    primaryColor,
    borderRadius,
    compact,
    layout,
    contentWidth,
    navTheme,
    fixedHeader,
    fixSiderbar,
    colorWeak,
    splitMenus,
    multiTab,
    footerRender,
    menuTheme,
    hideSidebar,
    hideHeader,
    autoHideHeader,
    toggleMode,
    setPrimaryColor,
    setBorderRadius,
    toggleCompact,
    setLayout,
    setContentWidth,
    setNavTheme,
    toggleFixedHeader,
    toggleFixedSidebar,
    toggleColorWeak,
    toggleSplitMenus,
    toggleMultiTab,
    toggleFooterRender,
    toggleMenuTheme,
    toggleHideSidebar,
    toggleHideHeader,
    toggleAutoHideHeader,
    resetToDefault
  } = useThemeStore();

  const [activeKey, setActiveKey] = useState<string | string[]>(['1', '2', '3', '4']);
  const [customColor, setCustomColor] = useState(primaryColor);

  const handleLayoutChange = (value: string) => {
    if (layout !== value) {
      toggleSplitMenus();
    }
    setLayout(value as "side" | "top" | "mix");
  };

  const handleColorSelect = (color: string) => {
    setPrimaryColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setPrimaryColor(value);
    }
  };

  const ColorGrid = () => (
    <div style={{ width: 240 }}>
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Preset Colors</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COLOR_PRESETS.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: 8 }}>
              {row.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: color,
                    border: primaryColor === color ? `2px solid ${color}` : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                    position: 'relative',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.transition = 'transform 0.2s';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {primaryColor === color && (
                    <CheckOutlined 
                      style={{ 
                        color: '#fff', 
                        fontSize: 14,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textShadow: '0 0 2px rgba(0,0,0,0.5)'
                      }} 
                    />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Custom Color</Text>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: customColor,
              border: `2px solid ${primaryColor === customColor ? customColor : '#d9d9d9'}`,
              cursor: 'pointer',
            }}
          />
          <Input
            value={customColor}
            onChange={handleCustomColorChange}
            placeholder="#000000"
            size="small"
            style={{ flex: 1 }}
            prefix={<PlusOutlined style={{ color: '#999' }} />}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: primaryColor,
            color: 'white',
            width: 24,
            height: 24,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12
          }}>
            <SettingOutlined />
          </div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Theme Settings</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={300}
      className="settings-drawer"
      closable={true}
      maskClosable={true}
      mask={true}
      footer={null}
      headerStyle={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '16px'
      }}
      bodyStyle={{ 
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Quick Actions Bar */}
      <Card 
        size="small" 
        bordered={false}
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}08, transparent)`,
          borderRadius: 8,
          border: `1px solid ${primaryColor}15`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Quick Actions</Text>
          <Button 
            type="text" 
            size="small" 
            icon={<ReloadOutlined />} 
            onClick={resetToDefault}
            style={{ fontSize: 11, padding: '0 4px', height: 24 }}
          >
            Reset All
          </Button>
        </div>
      </Card>

      <Collapse
        activeKey={activeKey}
        onChange={setActiveKey}
        ghost
        expandIconPosition="end"
        className="settings-collapse"
        bordered={false}
        style={{ background: 'transparent' }}
      >
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: '#1677ff',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}>
                < BgColorsOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 13, display: 'block' }}>Theme</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Color, mode & spacing</Text>
              </div>
            </div>
          }
          key="1"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Theme Mode Toggle */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingBottom: 12,
              borderBottom: '1px solid #f5f5f5'
            }}>
              <div>
                <Text strong style={{ fontSize: 12, display: 'block' }}>Dark Mode</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Light/dark theme</Text>
              </div>
              <Switch
                checked={mode === "dark"}
                onChange={toggleMode}
                size="small"
                style={{ background: mode === "dark" ? primaryColor : '#ccc' }}
              />
            </div>

            {/* Primary Color */}
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Primary Color</Text>
              <Popover
                content={<ColorGrid />}
                title={null}
                trigger="click"
                placement="left"
                overlayStyle={{ padding: 0 }}
                overlayInnerStyle={{ padding: 12, borderRadius: 8 }}
              >
                <Button 
                  size="small" 
                  style={{ 
                    width: '100%',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px',
                    border: `1px solid ${primaryColor}40`,
                    background: `${primaryColor}10`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: primaryColor,
                      border: '1px solid #fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }} />
                    <Text style={{ fontSize: 12 }}>{primaryColor.toUpperCase()}</Text>
                  </div>
                  <BgColorsOutlined style={{ fontSize: 12, color: primaryColor }} />
                </Button>
              </Popover>
            </div>

            {/* Border Radius */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text strong style={{ fontSize: 12 }}>Border Radius</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{borderRadius}px</Text>
              </div>
              <Slider
                min={0}
                max={20}
                value={borderRadius}
                onChange={setBorderRadius}
                tooltip={{ formatter: (value) => `${value}px` }}
                styles={{
                  track: { background: primaryColor },
                  rail: { background: '#f0f0f0' },
                  handle: { borderColor: primaryColor }
                }}
              />
            </div>

            {/* Compact Mode */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: 12,
              borderTop: '1px solid #f5f5f5'
            }}>
              <div>
                <Text strong style={{ fontSize: 12, display: 'block' }}>Compact Mode</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Reduced spacing</Text>
              </div>
              <Switch
                checked={compact}
                onChange={toggleCompact}
                size="small"
                style={{ background: compact ? primaryColor : '#ccc' }}
              />
            </div>
          </div>
        </Panel>

        {/* Layout Settings */}
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: '#722ED1',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}>
                <LayoutOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 13, display: 'block' }}>Layout</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Navigation & structure</Text>
              </div>
            </div>
          }
          key="2"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Navigation Mode */}
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Navigation Mode</Text>
              <Radio.Group
                value={layout}
                onChange={(e) => handleLayoutChange(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="side" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Side</Radio.Button>
                <Radio.Button value="top" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Top</Radio.Button>
                <Radio.Button value="mix" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Mix</Radio.Button>
              </Radio.Group>
            </div>

            {/* Content Width */}
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Content Width</Text>
              <Radio.Group
                value={contentWidth}
                onChange={(e) => setContentWidth(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="Fluid" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Fluid</Radio.Button>
                <Radio.Button value="Fixed" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Fixed</Radio.Button>
              </Radio.Group>
            </div>

            {/* Navigation Theme */}
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Navigation Theme</Text>
              <Radio.Group
                value={navTheme}
                onChange={(e) => setNavTheme(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="light" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Light</Radio.Button>
                <Radio.Button value="realDark" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>Dark</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Panel>

        {/* Page Settings */}
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: '#13C2C2',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}>
                <BlockOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 13, display: 'block' }}>Page</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Header, footer & sidebar</Text>
              </div>
            </div>
          }
          key="3"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Fixed Header', checked: fixedHeader, onChange: toggleFixedHeader, description: 'Sticky header' },
              { label: 'Show Footer', checked: footerRender, onChange: toggleFooterRender, description: 'Page footer' },
              { label: 'Fixed Sidebar', checked: fixSiderbar, onChange: toggleFixedSidebar, description: 'Sticky sidebar' },
              { label: 'Hide Sidebar', checked: hideSidebar, onChange: toggleHideSidebar, description: 'Collapse sidebar', icon: hideSidebar ? <EyeInvisibleOutlined /> : <EyeOutlined /> },
              { label: 'Hide Header', checked: hideHeader, onChange: toggleHideHeader, description: 'Collapse header', icon: hideHeader ? <EyeInvisibleOutlined /> : <EyeOutlined /> },
              ...(layout === 'mix' ? [{ label: 'Split Menus', checked: splitMenus, onChange: toggleSplitMenus, description: 'Split main/sub menus' }] : []),
              { label: 'Multi-Tab Mode', checked: multiTab, onChange: toggleMultiTab, description: 'Tab navigation' },
            ].map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 6 ? '1px solid #f5f5f5' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.icon && <span style={{ fontSize: 12, color: primaryColor }}>{item.icon}</span>}
                  <div>
                    <Text strong style={{ fontSize: 12, display: 'block' }}>{item.label}</Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>{item.description}</Text>
                  </div>
                </div>
                <Switch
                  checked={item.checked}
                  onChange={item.onChange}
                  size="small"
                  style={{ background: item.checked ? primaryColor : '#ccc' }}
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* Accessibility */}
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: '#FAAD14',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}>
                <BorderOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 13, display: 'block' }}>Accessibility</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Visual adjustments</Text>
              </div>
            </div>
          }
          key="4"
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '8px 0' 
          }}>
            <div>
              <Text strong style={{ fontSize: 12, display: 'block' }}>Color Weak Mode</Text>
              <Text type="secondary" style={{ fontSize: 10 }}>For color vision deficiency</Text>
            </div>
            <Switch
              checked={colorWeak}
              onChange={toggleColorWeak}
              size="small"
              style={{ background: colorWeak ? primaryColor : '#ccc' }}
            />
          </div>
        </Panel>
      </Collapse>

      <Divider style={{ margin: '8px 0', borderColor: '#f0f0f0' }} />
      
      <Alert
        message={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <InfoCircleOutlined style={{ fontSize: 12, color: primaryColor }} />
            <Text style={{ fontSize: 11 }}>Settings are saved automatically</Text>
          </div>
        }
        type="info"
        showIcon={false}
        style={{ 
          borderRadius: 6,
          background: `${primaryColor}08`,
          border: `1px solid ${primaryColor}20`,
          padding: '8px 12px'
        }}
      />
    </Drawer>
  );
};

export default SettingsDrawer;