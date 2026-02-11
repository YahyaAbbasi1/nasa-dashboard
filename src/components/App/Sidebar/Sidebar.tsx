import React, { useState, useEffect } from "react";
import { Menu, Layout, Avatar, theme } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import inventoryMenu from "../../Menu/inventoryMenu";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
  setSelectedMenu: (menuKey: string) => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  secretKey: string;
  avatar: string | null; 
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onCollapse,
  setSelectedMenu,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const { token } = theme.useToken(); 

  // Get user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const userData: User = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();

    // Listen for storage changes (if user updates their profile elsewhere)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Error parsing updated user data:", error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for custom events if user data changes within the same tab
  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      setUser(event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    return () => window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get avatar source - use base64 data from backend or fallback to initials
  const getAvatarSrc = () => {
    if (user?.avatar) {
      return `data:image/png;base64,${user.avatar}`;
    }
    return undefined;
  };

  return (
    <Sider
      className="sidebar"
      style={{
        background: '#f0f2f5',
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={180}
    >
      <div
        className="sidebar-header"
        style={{
          padding: "16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          size={50}
          src={getAvatarSrc()}
          icon={!user?.avatar ? <UserOutlined /> : undefined}
          style={{ 
            backgroundColor: !user?.avatar ? token.colorPrimary : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {!user?.avatar && user && getUserInitials()}
        </Avatar>
        
        {!collapsed && user && (
          <div
            style={{
              fontSize: "16px",
              fontWeight: 500,
              textAlign: "center",
              marginBottom: "10px",
              marginTop: "8px"
            }}
          >
            {user.firstName} 
          </div>
        )}
        
        {!collapsed && !user && (
          <div
            style={{
              fontSize: "14px",
              color: "#999",
              textAlign: "center",
              marginBottom: "10px",
              marginTop: "8px"
            }}
          >
            Not logged in
          </div>
        )}
      </div>

      <Menu
        defaultSelectedKeys={[""]}
        onClick={(e) => setSelectedMenu(e.key)}
        style={{
          background: 'transparent',
          borderRight: 'none',
        }}
        theme="light"
      >
        {inventoryMenu.map((item: any) => (
          <Menu.Item 
            key={item.key} 
            icon={item.icon}
            style={{
              margin: '4px 8px',
              borderRadius: '4px',
            }}
          >
            <Link to={item.url} className="nav-text">
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;