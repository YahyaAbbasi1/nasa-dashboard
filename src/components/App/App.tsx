import "./App.scss";
import React, { useEffect, useState } from "react";
import { Button, Layout, ConfigProvider, theme as antdTheme } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  PhoneFilled,
  MailFilled,
  GlobalOutlined
} from "@ant-design/icons";
import Sidebar from "./Sidebar/Sidebar";
import NavBar from "./Navbar/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { BASE_PATH, LOGIN_PATH } from "Constants/Constants";
import Portal from "components/portal";
import { useAppDispatch } from "components/redux/hooks";
import Login from "components/Login/Login";
import TrialExpired from "components/Login/trialExpired";
import Draggable from "react-draggable";
import { useThemeStore } from "store/themeStore";
import ProLayout from "@ant-design/pro-layout";
import SettingsDrawer from "components/portal/SettingsDrawer";
import ForgotPassword from "../Login/forgotPassword";

const { Content, Footer } = Layout;

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    mode,
    primaryColor,
    borderRadius,
    compact,
    layout,
    navTheme,
    fixedHeader,
    fixSiderbar,
    splitMenus,
    contentWidth,
    colorWeak,
    hideSidebar,
    hideHeader,
    multiTab,
    footerRender,
  } = useThemeStore();
  const { token } = antdTheme.useToken();
  const [refreshKey, setRefreshKey] = useState(0);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [trialExpired, setTrialExpired] = useState<boolean | null>(null);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  

  const checkTrialStatus = () => {
    const trialStartDate = localStorage.getItem("trial_start_date");
    if (trialStartDate) {
      const trialStart = new Date(trialStartDate);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - trialStart.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTrialExpired(diffDays >= 7);
    } else {
      const newTrialDate = new Date().toISOString();
      localStorage.setItem("trial_start_date", newTrialDate);
      setTrialExpired(false);
    }
  };

  useEffect(() => {
   
    checkTrialStatus();
  }, []);

  const algorithms = [
    mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    ...(compact ? [antdTheme.compactAlgorithm] : [])
  ].filter((a): a is typeof antdTheme.defaultAlgorithm => Boolean(a));

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: algorithms,
        token: {
          colorPrimary: primaryColor,
          borderRadius: borderRadius,
        },
      }}
    >
      {isAuthenticated ? (
       <ProLayout
  key={`pro-layout-${refreshKey}`}
  layout={layout}
  navTheme={navTheme === "realDark" ? "realDark" : undefined}
  contentWidth={contentWidth}
  fixedHeader={fixedHeader}
  fixSiderbar={fixSiderbar}
  splitMenus={layout === 'mix' ? splitMenus : false}
  headerRender={false}
  menuRender={false}
  footerRender={footerRender ? () => (
    <Footer  style={{
    padding: "4px 12px", 
    textAlign: "center",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px", 
    lineHeight: "20px",
    backgroundColor: token.colorBgContainer,
    borderTop: `1px solid ${token.colorBorder}`,
    position: "fixed",
    bottom: 0,
    left: hideSidebar ? 0 : collapsed ? 80 : 200,
    right: 0,
    zIndex: 9,
  }}>
      <span>
        <PhoneFilled style={{ marginRight: 8, color: token.colorTextSecondary }} />
        <a href="tel:+92-323-0409687" style={{ color: token.colorTextSecondary }}>
          +92-323-0409687
        </a>
      </span>
      <a
        href="https://yahyaabbasi1.github.io/"
        style={{ color: token.colorTextSecondary }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Copyright {new Date().getFullYear()} © Yahya Abbasi{' '}
        <GlobalOutlined style={{ marginLeft: 4 }} />
      </a>
      <span>
        <a style={{ color: token.colorTextSecondary, marginRight: 8 }}>
          yahyaabbasi36@gmail.com
        </a>
        <MailFilled style={{ color: token.colorTextSecondary }} />
      </span>
    </Footer>
  ) : false}
  style={{ 
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" 
  }}
  siderWidth={hideSidebar ? 0 : undefined}
>
          {!hideHeader && (
            <Layout.Header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: 0,
                height: 64,
                backgroundColor: token.colorBgContainer,
              }}
            >
              {!hideSidebar && (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={toggleCollapsed}
                  style={{ fontSize: "16px", width: 64, height: 45 }}
                />
              )}
              <NavBar />
            </Layout.Header>
          )}

          <Layout style={{ flex: 1, display: 'flex' }}>
            {!hideSidebar && (
              <Sidebar
                collapsed={collapsed}
                onCollapse={setCollapsed}
                setSelectedMenu={() => {}}
              />
            )}

            <Layout style={{ flex: 1 }}>
              <Content
                style={{
                  padding: 6,
                  margin: 0,
                   display: 'flex',
                  flexDirection: 'column',
                  borderRadius: token.borderRadiusLG,
                }}
              >
                {trialExpired ? (
                  <TrialExpired />
                ) : (
                  <div style={{ flex: 1 }}>
                    <Routes>
                      <Route path={`${BASE_PATH}/*`} element={<Portal />} />
                      <Route path="*" element={<Portal />} />
                    </Routes>
                  </div>
                )}
              </Content>
            </Layout>
          </Layout>

        <Draggable>
        <div
          style={{
            position: "fixed",
            right: 32,
            bottom: 32,
            zIndex: 100,
          }}
        >
          <Button
            icon={<SettingOutlined />}
            onClick={() => setSettingsOpen(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              boxShadow:
                "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
            }}
          />
        </div>
      </Draggable>
          <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </ProLayout>
      ) : (
       <Content>
  <Routes>
    <Route path={LOGIN_PATH} element={<Login setIsAuthenticated={setIsAuthenticated} />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
  </Routes>
</Content>
      )}
    </ConfigProvider>
  );
};

export default App;